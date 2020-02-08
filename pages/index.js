import React from 'react'
import Head from 'next/head'
import './index.scss'
import { useInterval } from '../util/hooks'
import fetch from 'isomorphic-unfetch'

const { GOOGLE_ANALYTICS_CODE } = process.env

const idToColor = id => {
  var hash = 0
  if (id.length === 0) return hash
  for (var i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  var rgb = [0, 0, 0]
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 255
    rgb[i] = value
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.2)`
}

const formatTime = ms => {
  var minutes = Math.floor(ms / 60000)
  var seconds = ((ms % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

const Home = props => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(props.isError)

  const [song, setSong] = React.useState(props.song)
  const [progressMs, setProgressMs] = React.useState(props.progressMs)
  const [progress, setProgress] = React.useState(0)

  const getPlayingSong = async () => {
    if (isLoading) return
    try {
      const res = await fetch('/api/get-spotify-current')
      const data = await res.json()

      if (data.isPlaying) {
        const time_diff = new Date() - new Date(data.timestamp)
        return {
          error: false,
          song: data,
          progressMs: time_diff + data.progress_ms,
        }
      }
    } catch (err) {
      return { error: true }
    }
  }

  React.useEffect(() => {
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', GOOGLE_ANALYTICS_CODE, {
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_title: window.document.title,
    })
  }, [])

  useInterval(() => {
    if (song && progressMs < song.duration_ms) setProgressMs(progressMs + 100)
  }, 100)

  React.useEffect(() => {
    if (song) setProgress((100 * progressMs) / song.duration_ms)
  }, [song, progressMs])
  React.useEffect(() => {
    async function update() {
      setIsError(false)
      setIsLoading(true)
      const data = await getPlayingSong()
      setIsError(data.error)
      setSong(data.song)
      setProgressMs(data.progressMs)
      setIsLoading(false)
    }

    if (progress >= 100) {
      update()
    }
  }, [progress])

  if (isError) {
    return (
      <div>
        <div className="container">
          <div className="laoding">
            <h1>Sorry</h1>
            I'm not currently listening to music, come back a bit later or visit
            my <a href="https://github.com/RaedsLab">Github</a>.
          </div>
        </div>
      </div>
    )
  }
  if (!song) {
    return (
      <div>
        <div className="container">
          <div className="laoding">Loading</div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <Head>
        <title>What is Raed currently playing</title>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_CODE}`}
        ></script>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="container">
        <h1 className="heading">I'm currently listening to</h1>
        <div className="title">
          I'm currently listening to
          <div className="live" />
        </div>
        <div className="image-container">
          <a href={song.url} target="_blank" rel="noopener">
            <img className="image" src={song.image} alt="cover" />
          </a>
          <div className="info">
            <div className="name">{song.name}</div>
            <div className="artist">{song.artist}</div>

            <div className="progress-container">
              <div style={{ width: `${progress}%` }} className="progress"></div>
              <div className="timer">
                <div>{formatTime(progressMs)}</div>
                <div>{formatTime(song.duration_ms)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="background"
        style={{ backgroundColor: idToColor(song.id) }}
      ></div>
    </div>
  )
}

Home.getInitialProps = async ({ req }) => {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
    const res = await fetch(baseUrl + '/api/get-spotify-current')
    const data = await res.json()

    if (data.isPlaying) {
      const time_diff = new Date() - new Date(data.timestamp)
      return {
        song: data,
        progressMs: time_diff + data.progress_ms,
      }
    }
  } catch (err) {
    return { isLoading: false, isError: true }
  }
}

export default Home
