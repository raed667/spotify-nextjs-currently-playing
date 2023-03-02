import React from 'react'
import Link from 'next/link'

type State = {
  loginUrl: string
  loading: boolean
  error: string | null
}

const Login = () => {
  const [state, setState] = React.useState<State>({
    loginUrl: '',
    loading: false,
    error: null,
  })

  const getSpotifyLoginURL = React.useCallback(async () => {
    setState((s) => ({ ...s, error: null, loading: true }))

    const url = await fetch('/api/get-spotify-login-url')
      .then((response) => response.json())
      .then((json) => json.spotify_uri)

    setState((s) => ({ ...s, error: null, loading: false }))

    return url
  }, [])

  React.useEffect(() => {
    getSpotifyLoginURL()
      .then((loginUrl) => {
        setState((s) => ({ ...s, loginUrl }))
      })
      .catch((error) => {
        setState((s) => ({ ...s, error }))
      })
  }, [getSpotifyLoginURL])

  // Error
  if (state.error) {
    return (
      <div>
        <h1>Error:</h1>
        <div>{state.error}</div>
      </div>
    )
  }

  // Main
  return (
    <div className="login">
      {state.loading ? (
        <p>Loading...</p>
      ) : (
        <Link href={state.loginUrl} className="loginLink">
          LOG IN
        </Link>
      )}
    </div>
  )
}

export default Login
