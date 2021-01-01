import { NextApiRequest, NextApiResponse } from 'next'
import SpotifyWebApi from 'spotify-web-api-node'
import redis from 'redis'
import { promisify } from 'util'
import fetch from 'node-fetch'
import Vibrant from 'node-vibrant'

import { RawSong, Song } from '../../typings/song'
import { idToColor } from '../../util/helpers'

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_HOST,
} = process.env

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
})

const redisClient = redis.createClient({
  port: Number(REDIS_PORT),
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
})
const getAsync = promisify(redisClient.get).bind(redisClient)

const extract = (raw: RawSong): Song => {
  if (raw.currently_playing_type !== 'track') {
    throw new Error('Not playing')
  }
  return { ...extractSong(raw), isPlaying: true }
}

const extractSong = (raw: RawSong): Song => {
  const timestamp = Date.now()
  const expire_at = new Date(timestamp + raw.item.duration_ms - raw.progress_ms)

  return {
    id: raw.item.id,
    name: raw.item.name,
    progress_ms: raw.progress_ms,
    duration_ms: raw.item.duration_ms,
    url: raw.item.external_urls.spotify,
    preview_url: raw.item.preview_url,
    artist: raw.item.artists[0].name,
    image: raw.item.album.images[0].url,
    expire_at,
    timestamp,
    backgroundColor: idToColor(raw.item.id),
    isPlaying: false,
  }
}

const getData = async (access_token: string): Promise<Song | null> => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
  }

  const response = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    fetchOptions
  )

  if (response.status >= 400) {
    throw new Error('Something went wrong status=' + response.status)
  }
  if (response.status === 200) {
    const data = await response.json()
    const song = extract(data)

    try {
      const palette = await Vibrant.from(song.image).getPalette()
      song.backgroundColor = palette?.Vibrant?.getHex() || idToColor(song.id)
    } catch (err) {
      song.backgroundColor = idToColor(song.id)
    }

    redisClient.set('last_song', JSON.stringify(song), redis.print)
    return song
  }

  return null
}

const refreshToken = async () => {
  try {
    const data = await spotifyApi.refreshAccessToken()
    const access_token = data.body['access_token']
    spotifyApi.setAccessToken(access_token)
    redisClient.set('access_token', access_token, redis.print)
    return access_token
  } catch (err) {
    throw new Error('refreshToken: error setting refresh token')
  }
}

const getSpotifyTokens = async () => {
  const access_token = await getAsync('access_token')
  const refresh_token = await getAsync('refresh_token')
  if (!access_token || !refresh_token) {
    throw new Error(
      `Spotify tokens not set access_token=${access_token}, refresh_token=${refresh_token}`
    )
  }
  return {
    access_token,
    refresh_token,
  }
}

const getRedisSong = async (): Promise<Song | null> => {
  const redis_song_str = await getAsync('last_song')
  if (!redis_song_str) return null

  const redis_song = JSON.parse(redis_song_str)

  const isPlaying =
    redis_song.expire_at && new Date(redis_song.expire_at) > new Date()

  return {
    ...redis_song,
    isPlaying,
  }
}

export const getCurrentSong = async () => {
  const { access_token, refresh_token } = await getSpotifyTokens()

  const redis_song = await getRedisSong()
  if (redis_song?.isPlaying) {
    return redis_song
  }

  try {
    spotifyApi.setAccessToken(access_token)
    spotifyApi.setRefreshToken(refresh_token)

    const data = await getData(access_token)

    if (data != null) {
      return data
    }
    if (redis_song) {
      return redis_song
    }
    throw new Error('Cached song not found')
  } catch (e) {
    const access_token_new = await refreshToken()
    const data = await getData(access_token_new)

    if (data != null) {
      return data
    }
    return redis_song
  }
}

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    const song = await getCurrentSong()
    if (!song) {
      throw new Error('Cached song not found')
    }
    return res.status(200).json(song)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
