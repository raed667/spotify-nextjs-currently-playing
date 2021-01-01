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

const getInitialProgress = (
  timestamp: number,
  progress_ms: number,
  isPlaying: boolean
) => {
  if (!isPlaying) return 0
  const time_diff = new Date().getTime() - new Date(timestamp).getTime()
  return time_diff + progress_ms
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

  const getPlayingSong = async (): Promise<
    | {
        error: boolean
        song?: Song
        progressMs?: number
      }
    | undefined
  > => {
    if (isLoading) return undefined
    try {
      const data = await fetch('/api/get-spotify-current')
        .then((res) => res.json())
        .then((data) => {
          return {
            ...data,
            //    expire_at: new Date(data.expire_at),
          } as Song
        })

      if (data.isPlaying) {
        return {
          error: false,
          song: data,
          progressMs: getInitialProgress(
            data.timestamp,
            data.progress_ms,
            data.isPlaying
          ),
        }
      }
    } catch (err) {
      return { error: true }
    }
  }

  useInterval(() => {
    if (!song || !song.isPlaying) return

    // const expireAt = new Date(song.expire_at)
    if (progressMs < song.duration_ms) {
      setProgressMs(progressMs + 1000)
    }
  }, 1000)

  React.useEffect(() => {
    if (song) {
      setProgress(Math.ceil((100 * progressMs) / song.duration_ms))
    }
  }, [song, progressMs])

  React.useEffect(() => {
    if (progress >= 100) {
      setIsError(false)
      setIsLoading(true)
      getPlayingSong().then((data) => {
        if (data) {
          setIsError(data.error)
          data.song && setSong(data.song)
          setProgressMs(data.progressMs || 0)
        }
        setIsLoading(false)
      })
    }
  }, [progress])

  if (isError) return <Error />
  if (!song) return <Loading />

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
          //    expire_at: new Date(data.expire_at),
        } as Song
      })

    return {
      gaCode,
      song,
      progressMs: getInitialProgress(
        song.timestamp,
        song.progress_ms,
        song.isPlaying
      ),
    }
  } catch (err) {
    return { isLoading: false, isError: true }
  }
}

export default Home
