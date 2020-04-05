import React from 'react'

const saveSpotifyCode = (code: string) => {
  return fetch('/api/save-spotify-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  })
}

type State = {
  loading: boolean
  error: string | null
}

const Callback = () => {
  const [state, setState] = React.useState<State>({
    loading: true,
    error: null,
  })

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (!code) {
      setState({ loading: false, error: 'Can not find code in response' })
    } else {
      saveSpotifyCode(code)
        .then(() => setState({ loading: false, error: null }))
        .catch(err => setState({ loading: false, error: err }))
    }
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
  return <p>Loading...</p>
}

export default Callback
