const querystring = require('querystring')
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env

const scopes = [
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-read-currently-playing',
]

const spotify_uri =
  'https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    show_dialog: true,
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scopes.join(' '),
    redirect_uri: REDIRECT_URI,
  })

export default (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ spotify_uri })
}
