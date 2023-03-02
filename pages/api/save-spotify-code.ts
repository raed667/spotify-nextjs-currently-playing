import { NextApiRequest, NextApiResponse } from 'next'
import SpotifyWebApi from 'spotify-web-api-node'
import { createClient } from 'redis'

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  AUTHORIZED_USER_ID,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_URL,
} = process.env

const credentials = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
}
const spotifyApi = new SpotifyWebApi(credentials)

const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  password: REDIS_PASSWORD,
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') {
    return res.status(404).json({ success: false })
  }

  const code = req.body ? req.body.code : undefined
  if (!code) {
    return res.status(400).json({ success: false })
  }

  if (!redisClient.isOpen) {
    await redisClient.connect()
  }

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(
    (data) => {
      // Set the access token on the API object to use it in later calls
      const access_token = data.body['access_token']
      const refresh_token = data.body['refresh_token']
      spotifyApi.setAccessToken(access_token)
      spotifyApi.setRefreshToken(refresh_token)

      spotifyApi.getMe().then(
        (data) => {
          if (`${data.body.id}` !== AUTHORIZED_USER_ID) {
            return res
              .status(401)
              .json({ success: false, error: 'Its me not you' })
          }

          redisClient.set('access_token', access_token)
          redisClient.set('refresh_token', refresh_token)

          return res.status(200).json({ success: true })
        },
        (err) => {
          return res.status(500).json({ success: false, error: err.message })
        }
      )
    },
    (err) => {
      console.log('Something went wrong!', err)
      return res.status(500).json({ success: false })
    }
  )
}
