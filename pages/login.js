import React from 'react'
import Link from 'next/link'

const getSpotifyLoginURL = () => {
  return fetch('/api/get-spotify-login-url')
    .then(response => response.json())
    .then(json => json.spotify_uri)
}

const Login = () => {
  const [state, setState] = React.useState({
    loginUrl: '',
    loading: true,
    error: null,
  })

  React.useEffect(() => {
    getSpotifyLoginURL()
      .then(loginUrl => {
        setState({ ...state, loginUrl })
      })
      .catch(err => {
        setState({ ...state, error: err })
      })
  }, [])

  // Error
  if (state.error) {
    return (
      <div>
        <h1>Error:</h1>
        <div>{state.error}</div>
      </div>
    )
  }

  // Loading
  if (state.isLoading) {
    return <p>Loading...</p>
  }

  // Main
  return (
    <Link href={state.loginUrl}>
      <a>LOG IN</a>
    </Link>
  )
}

export default Login
