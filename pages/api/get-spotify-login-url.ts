import { NextApiRequest, NextApiResponse } from 'next'
import querystring from 'querystring'

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

export default (_: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ spotify_uri })
}
