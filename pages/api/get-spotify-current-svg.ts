import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

import { Song } from '../../typings/song'
import { getCurrentSong } from './get-spotify-current'

const formatResponse = async (song: Song) => {
  const barCount = 84

  const contentBar = new Array(barCount)
    .fill(`<div class='bar'></div>`)
    .join('')

  const barGen = () => {
    const randomInt = (min: number, max: number) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    let barCSS = ''
    let left = 1
    for (let index = 1; index < barCount + 1; index++) {
      const anim = randomInt(1000, 1350)
      barCSS += `.bar:nth-child(${index})  { left: ${left}px; animation-duration: ${anim}ms; }`
      left += 4
    }
    return barCSS
  }

  const barCSS = barGen()

  const imageB64 = await fetch(song.image)
    .then((r) => r.buffer())
    .then((r) => r.toString('base64'))

  return `<svg width="480" height="195" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <foreignObject width="480" height="195">
        <div xmlns="http://www.w3.org/1999/xhtml" class="container">
            <style>
                .main {
                    padding-top: 16px;
                    padding-bottom: 16px;
                    background: #273849;
                    display: flex;
                    border-radius: 6px;
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
                    color: #41b883;
                    overflow:hidden;
                    margin-top: 3px;
                    font-size: 24px;
                    text-align: center;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                }
                .artist {
                    color: #E4E2E2;
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
                    bottom: 80px;
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
            <div class="main">
                <a class="art" href="${song.url}" target="_blank">
                    <center>
                        <img src="data:image/jpeg;base64, ${imageB64}" class="cover" />
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
}

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const song = await getCurrentSong()
    if (!song) {
      throw new Error('Cached song not found')
    }
    const svg = await formatResponse(song)
    res.setHeader('Content-Type', 'image/svg+xml')
    return res.status(200).send(svg)
  } catch (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    res.status(500).json({ error: error.message })
  }
}
