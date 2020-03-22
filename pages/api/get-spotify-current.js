const SpotifyWebApi = require('spotify-web-api-node')
const redis = require('redis')
const { promisify } = require('util')
const fetch = require('node-fetch')

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  AUTHORIZED_USER_ID,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_HOST,
} = process.env

const credentials = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
}
const spotifyApi = new SpotifyWebApi(credentials)

const redisClient = redis.createClient({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
})
const getAsync = promisify(redisClient.get).bind(redisClient)

redisClient.on('error', function(err) {
  console.log('Redis Error ' + err)
})

const extract = raw => {
  if (raw.currently_playing_type === 'track') {
    return { ...extractSong(raw), isPlaying: true }
  }

  return { isPlaying: false }
}

const extractSong = raw => {
  try {
    const timestamp = Date.now()
    const expire_at = new Date(
      timestamp + raw.item.duration_ms - raw.progress_ms
    )

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
    }
  } catch (err) {
    return null
  }
}

const getData = async access_token => {
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

    redisClient.set('last_song', JSON.stringify(song), redis.print)
    return song
  }

  return null
}

export default async (req, res) => {
  let access_token = await getAsync('access_token')
  const refresh_token = await getAsync('refresh_token')

  const redis_song_str = await getAsync('last_song')
  const redis_song = JSON.parse(redis_song_str)

  if (
    redis_song &&
    redis_song.expire_at &&
    new Date(redis_song.expire_at) > new Date()
  ) {
    return res.status(200).json(redis_song)
  }

  spotifyApi.setAccessToken(access_token)
  spotifyApi.setRefreshToken(refresh_token)

  const refreshToken = async () => {
    try {
      const data = await spotifyApi.refreshAccessToken()
      access_token = data.body['access_token']
      spotifyApi.setAccessToken(access_token)
      redisClient.set('access_token', access_token, redis.print)
    } catch (err) {
      throw new Error('refreshToken: error setting refresh token')
    }
  }

  try {
    res.setHeader('Content-Type', 'application/json')
    const data = await getData(access_token)
    if (data === null) {
      redis_song.isPlaying = false
      res.status(200).json(redis_song)
      return
    }

    res.status(200).json(data)
  } catch (err) {
    try {
      await refreshToken()
      const data = await getData(access_token)
      console.log('DATA 2')
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
