import React from 'react'
import { NextPageContext } from 'next'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import ReactGA from 'react-ga'

import Footer from './components/Footer'
import Error from './components/Error'
import Loading from './components/Loading'
import Progress from './components/Progress'

import { useInterval } from '../util/hooks'
import { hexToRgba, idToColor } from '../util/helpers'

type Props = {
  song: any // @TODO
  isError: boolean
  progressMs: number
}

const Home = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(props.isError)

  const [song, setSong] = React.useState(props.song)
  const [progressMs, setProgressMs] = React.useState(props.progressMs)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    try {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_CODE || '')
    } catch (err) {
      // @TODO
    }
  }, [])

  const getPlayingSong = async () => {
    if (isLoading) return null
    try {
      const res = await fetch('/api/get-spotify-current')
      const data = await res.json()

      if (data.isPlaying) {
        const time_diff =
          new Date().getTime() - new Date(data.timestamp).getTime()
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

  useInterval(() => {
    if (song && song.isPlaying && progressMs < song.duration_ms) {
      setProgressMs(progressMs + 100)
    }
  }, 100)

  React.useEffect(() => {
    if (song) {
      setProgress((100 * progressMs) / song.duration_ms)
    }
  }, [song, progressMs])

  React.useEffect(() => {
    if (progress >= 100) {
      setIsError(false)
      setIsLoading(true)
      getPlayingSong().then((data) => {
        if (data) {
          setIsError(data.error)
          setSong(data.song)
          setProgressMs(data.progressMs)
        }
        setIsLoading(false)
      })
    }
  }, [progress])

  if (isError) {
    return <Error />
  }

  if (!song) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>What is Raed playing</title>
      </Head>
      <div className="container">
        <h1 className="heading">I'm listening to</h1>
        <div className="title">
          {song.isPlaying && <div className="live" />}
          I'm listening to
        </div>
        <div className="image-container">
          <a href={song.url} target="_blank" rel="noopener">
            <img className="image" src={song.image} alt="cover" />
          </a>
          <div className="info">
            <div className="name">{song.name}</div>
            <div className="artist">{song.artist}</div>
            {song.isPlaying && (
              <Progress
                progress={progress}
                progressMs={progressMs}
                durationMs={song.duration_ms}
              />
            )}
          </div>
        </div>
        <Footer />
      </div>
      <div
        className="background"
        style={{
          backgroundColor:
            hexToRgba(song.backgroundColor) || idToColor(song.id),
        }}
      ></div>
    </>
  )
}

Home.getInitialProps = async ({ req }: NextPageContext) => {
  try {
    const protocol = req ? req.headers['x-forwarded-proto'] || 'http' : 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
    const res = await fetch(baseUrl + '/api/get-spotify-current')
    const data = await res.json()

    if (data.isPlaying) {
      const time_diff =
        new Date().getTime() - new Date(data.timestamp).getTime()
      return {
        song: data,
        progressMs: time_diff + data.progress_ms,
      }
    }

    return {
      song: data,
      progressMs: 0,
    }
  } catch (err) {
    return { isLoading: false, isError: true }
  }
}

export default Home
