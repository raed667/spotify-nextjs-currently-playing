import { NextApiRequest, NextApiResponse } from 'next'
import SpotifyWebApi from 'spotify-web-api-node'
import redis from 'redis'
import { promisify } from 'util'
import fetch from 'node-fetch'
import Vibrant from 'node-vibrant'

import { RawSong } from '../../typings/song'

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

const extract = (raw: RawSong) => {
  if (raw.currently_playing_type !== 'track') {
    throw new Error('Not playing')
  }
  return { ...extractSong(raw), isPlaying: true }
}

const extractSong = (raw: RawSong) => {
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
    backgroundColor: '#FFF',
  }
}

const getData = async (access_token: string) => {
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
      song.backgroundColor =
        (palette.Vibrant && palette.Vibrant.getHex()) || '#FFF'
    } catch (err) {
      song.backgroundColor = '#FFF'
    }

    redisClient.set('last_song', JSON.stringify(song), redis.print)
    return song
  }

  return null
}

const formatResponse = (res: NextApiResponse, song: any) => {
  const barCount = 84

  const contentBar = new Array(barCount)
    .fill(`<div class='bar'></div>`)
    .join('')

  const barGen = () => {
    function randint(min: number, max: number) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    let barCSS = ''
    let left = 1
    for (let index = 1; index < barCount + 1; index++) {
      const anim = randint(1000, 1350)
      barCSS += `.bar:nth-child(${index})  { left: ${left}px; animation-duration: ${anim}ms; }`
      left += 4
    }
    return barCSS
  }

  const barCSS = barGen()

  res.setHeader('Content-Type', 'image/svg+xml')
  return res.status(200).send(
    `<svg width="480" height="133" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <foreignObject width="480" height="133">
        <div xmlns="http://www.w3.org/1999/xhtml" class="container">
            <style>
                .main {
                    /*margin-top: 40px;*/
                    display: flex;
                }
                .currentStatus {
                    float: left;
                    font-size: 24px;
                    position: static;
                    margin-top: -5px;
                    margin-left: 10px;
                }
                .container {
                    border-radius: 5px;
                    padding: 10px 10px 10px 0px;
                }
                .art {
                    width: 27%;
                    float: left;
                    margin-left: -5px;
                }
                .content {
                    width: 71%;
                }
                .song {
                    color: #666;
                    overflow:hidden;
                    margin-top: 3px;
                    font-size: 24px;
                    text-align: center;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                }
                .artist {
                    color: #b3b3b3;
                    font-size: 20px;
                    margin-top: 4px;
                    text-align: center;
                    margin-bottom: 5px;
                }
                .cover {
                    width: 100px;
                    height: 100px;
                    border-radius: 5px;
                }
                #bars {
                    width: 40px;
                    height: 30px;
                    bottom: 23px;
                    position: absolute;
                    margin: -20px 0 0 0px;
                }
                .bar {
                    width: 3px;
                    bottom: 1px;
                    height: 3px;
                    position: absolute;
                    background: #1DB954cc;
                    animation: sound 0ms -800ms linear infinite alternate;
                }
                div {
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
                }
                @keyframes sound {
                    0% {
                        height: 3px;
                        opacity: .35;
                    }
                    100% {
                        height: 15px;
                        opacity: 0.95;
                    }
                }
                ${barCSS}
            </style>
            <!-- <div class="currentStatus">{{status}}</div> -->
            <div class="main">
                <a class="art" href="${song.url}" target="_blank">
                    <center>
                        <img src="${song.image}" class="cover" />
                    </center>
                </a>
                <div class="content">
                    <div class="song">${song.name}</div>
                    <div class="artist">${song.artist}</div>
                    <div id="bars">${contentBar}</div>
                </div>
            </div>
        </div>
    </foreignObject>
</svg>`
  )
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let access_token = (await getAsync('access_token')) || ''
  const refresh_token = (await getAsync('refresh_token')) || ''
  const redis_song_str = (await getAsync('last_song')) || ''

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
    const data = await getData(access_token)
    if (data === null) {
      redis_song.isPlaying = false
      return formatResponse(res, redis_song)
    }
    return formatResponse(res, data)
  } catch (err) {
    try {
      await refreshToken()
      const data = await getData(access_token)
      if (data === null) {
        redis_song.isPlaying = false
        return formatResponse(res, redis_song)
      }
      return formatResponse(res, data)
    } catch (err) {
      res.setHeader('Content-Type', 'application/json')
      res.status(500).json({ error: err.message })
    }
  }
}
