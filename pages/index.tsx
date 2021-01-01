import React from 'react'
import { NextPageContext } from 'next'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import ReactGA from 'react-ga'
import GithubCorner from 'react-github-corner'

import Footer from './components/Footer'
import Error from './components/Error'
import Loading from './components/Loading'
import Progress from './components/Progress'

import { useInterval } from '../util/hooks'
import { Song } from '../typings/song'

type Props = {
  song: Song
  isError: boolean
  progressMs: number
  gaCode: string
}

const Home = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(props.isError)
  const [song, setSong] = React.useState(props.song)
  const [progressMs, setProgressMs] = React.useState(props.progressMs)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    ReactGA.initialize(props.gaCode)
  }, [props.gaCode])

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
    if (song?.isPlaying && progressMs < song.duration_ms) {
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
        <title>🎧 Playing on Spotify</title>
      </Head>
      <GithubCorner
        className="github-corner"
        size={120}
        href="https://github.com/RaedsLab/spotify-nextjs-currently-playing"
      />
      <div className="container">
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
          backgroundColor: song.backgroundColor,
        }}
      />
    </>
  )
}

Home.getInitialProps = async ({ req }: NextPageContext) => {
  try {
    const gaCode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_CODE

    const protocol = req?.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
    const song = await fetch(baseUrl + '/api/get-spotify-current')
      .then((res) => res.json())
      .then((data) => {
        return {
          ...data,
          expire_at: new Date(data.expire_at),
        } as Song
      })
    const time_diff = new Date().getTime() - new Date(song.timestamp).getTime()

    return {
      gaCode,
      song,
      progressMs: song.isPlaying ? time_diff + song.progress_ms : 0,
    }
  } catch (err) {
    return { isLoading: false, isError: true }
  }
}

export default Home
