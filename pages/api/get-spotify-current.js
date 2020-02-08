const SpotifyWebApi = require('spotify-web-api-node')
const redis = require('redis')
const { promisify } = require('util')
const fetch = require('node-fetch')

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  AUTHORIZED_USER_ID,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_HOST,
} = process.env

const credentials = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
}
const spotifyApi = new SpotifyWebApi(credentials)

const redisClient = redis.createClient({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
})
const getAsync = promisify(redisClient.get).bind(redisClient)

redisClient.on('error', function(err) {
  console.log('Redis Error ' + err)
})

const topThree = {
  items: [
    {
      album: {
        album_type: 'ALBUM',
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/1mAZuRxncE9DLiAghJ4ieu',
            },
            href: 'https://api.spotify.com/v1/artists/1mAZuRxncE9DLiAghJ4ieu',
            id: '1mAZuRxncE9DLiAghJ4ieu',
            name: 'The Jane Austen Argument',
            type: 'artist',
            uri: 'spotify:artist:1mAZuRxncE9DLiAghJ4ieu',
          },
        ],
        available_markets: [
          'AD',
          'AE',
          'AR',
          'AT',
          'AU',
          'BE',
          'BG',
          'BH',
          'BO',
          'BR',
          'CA',
          'CH',
          'CL',
          'CO',
          'CR',
          'CY',
          'CZ',
          'DE',
          'DK',
          'DO',
          'DZ',
          'EC',
          'EE',
          'EG',
          'ES',
          'FI',
          'FR',
          'GB',
          'GR',
          'GT',
          'HK',
          'HN',
          'HU',
          'ID',
          'IE',
          'IL',
          'IN',
          'IS',
          'IT',
          'JO',
          'JP',
          'KW',
          'LB',
          'LI',
          'LT',
          'LU',
          'LV',
          'MA',
          'MC',
          'MT',
          'MX',
          'MY',
          'NI',
          'NL',
          'NO',
          'NZ',
          'OM',
          'PA',
          'PE',
          'PH',
          'PL',
          'PS',
          'PT',
          'PY',
          'QA',
          'RO',
          'SA',
          'SE',
          'SG',
          'SK',
          'SV',
          'TH',
          'TN',
          'TR',
          'TW',
          'US',
          'UY',
          'VN',
          'ZA',
        ],
        external_urls: {
          spotify: 'https://open.spotify.com/album/6B43AoUZ11MOFDdskHg4fn',
        },
        href: 'https://api.spotify.com/v1/albums/6B43AoUZ11MOFDdskHg4fn',
        id: '6B43AoUZ11MOFDdskHg4fn',
        images: [
          {
            height: 640,
            url:
              'https://i.scdn.co/image/ab67616d0000b2736a8214ce32da2632121239d7',
            width: 640,
          },
          {
            height: 300,
            url:
              'https://i.scdn.co/image/ab67616d00001e026a8214ce32da2632121239d7',
            width: 300,
          },
          {
            height: 64,
            url:
              'https://i.scdn.co/image/ab67616d000048516a8214ce32da2632121239d7',
            width: 64,
          },
        ],
        name: 'Somewhere Under the Rainbow',
        release_date: '2012-03-02',
        release_date_precision: 'day',
        total_tracks: 13,
        type: 'album',
        uri: 'spotify:album:6B43AoUZ11MOFDdskHg4fn',
      },
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/1mAZuRxncE9DLiAghJ4ieu',
          },
          href: 'https://api.spotify.com/v1/artists/1mAZuRxncE9DLiAghJ4ieu',
          id: '1mAZuRxncE9DLiAghJ4ieu',
          name: 'The Jane Austen Argument',
          type: 'artist',
          uri: 'spotify:artist:1mAZuRxncE9DLiAghJ4ieu',
        },
      ],
      available_markets: [
        'AD',
        'AE',
        'AR',
        'AT',
        'AU',
        'BE',
        'BG',
        'BH',
        'BO',
        'BR',
        'CA',
        'CH',
        'CL',
        'CO',
        'CR',
        'CY',
        'CZ',
        'DE',
        'DK',
        'DO',
        'DZ',
        'EC',
        'EE',
        'EG',
        'ES',
        'FI',
        'FR',
        'GB',
        'GR',
        'GT',
        'HK',
        'HN',
        'HU',
        'ID',
        'IE',
        'IL',
        'IN',
        'IS',
        'IT',
        'JO',
        'JP',
        'KW',
        'LB',
        'LI',
        'LT',
        'LU',
        'LV',
        'MA',
        'MC',
        'MT',
        'MX',
        'MY',
        'NI',
        'NL',
        'NO',
        'NZ',
        'OM',
        'PA',
        'PE',
        'PH',
        'PL',
        'PS',
        'PT',
        'PY',
        'QA',
        'RO',
        'SA',
        'SE',
        'SG',
        'SK',
        'SV',
        'TH',
        'TN',
        'TR',
        'TW',
        'US',
        'UY',
        'VN',
        'ZA',
      ],
      disc_number: 1,
      duration_ms: 243000,
      explicit: true,
      external_ids: {
        isrc: 'USQY51269097',
      },
      external_urls: {
        spotify: 'https://open.spotify.com/track/64PO3Y28NRwBWynS1dyFJk',
      },
      href: 'https://api.spotify.com/v1/tracks/64PO3Y28NRwBWynS1dyFJk',
      id: '64PO3Y28NRwBWynS1dyFJk',
      is_local: false,
      name: 'Maintain the Madness',
      popularity: 34,
      preview_url:
        'https://p.scdn.co/mp3-preview/e129a3ded27d71bed15f025ff5ceeab15a596f1e?cid=774b29d4f13844c495f206cafdad9c86',
      track_number: 3,
      type: 'track',
      uri: 'spotify:track:64PO3Y28NRwBWynS1dyFJk',
    },
    {
      album: {
        album_type: 'ALBUM',
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/292sg99iIOc93zcd30r4Oz',
            },
            href: 'https://api.spotify.com/v1/artists/292sg99iIOc93zcd30r4Oz',
            id: '292sg99iIOc93zcd30r4Oz',
            name: 'Jonathan Coulton',
            type: 'artist',
            uri: 'spotify:artist:292sg99iIOc93zcd30r4Oz',
          },
        ],
        available_markets: [
          'AD',
          'AE',
          'AR',
          'AT',
          'AU',
          'BE',
          'BG',
          'BH',
          'BO',
          'BR',
          'CA',
          'CH',
          'CL',
          'CO',
          'CR',
          'CY',
          'CZ',
          'DE',
          'DK',
          'DO',
          'DZ',
          'EC',
          'EE',
          'EG',
          'ES',
          'FI',
          'FR',
          'GB',
          'GR',
          'GT',
          'HK',
          'HN',
          'HU',
          'ID',
          'IE',
          'IL',
          'IN',
          'IS',
          'IT',
          'JO',
          'JP',
          'KW',
          'LB',
          'LI',
          'LT',
          'LU',
          'LV',
          'MA',
          'MC',
          'MT',
          'MX',
          'MY',
          'NI',
          'NL',
          'NO',
          'NZ',
          'OM',
          'PA',
          'PE',
          'PH',
          'PL',
          'PS',
          'PT',
          'PY',
          'QA',
          'RO',
          'SA',
          'SE',
          'SG',
          'SK',
          'SV',
          'TH',
          'TN',
          'TR',
          'TW',
          'US',
          'UY',
          'VN',
          'ZA',
        ],
        external_urls: {
          spotify: 'https://open.spotify.com/album/0eW4vkDVxqS4U60ExzsKhR',
        },
        href: 'https://api.spotify.com/v1/albums/0eW4vkDVxqS4U60ExzsKhR',
        id: '0eW4vkDVxqS4U60ExzsKhR',
        images: [
          {
            height: 640,
            url:
              'https://i.scdn.co/image/ab67616d0000b273a422d871dbfd354dede7e0e4',
            width: 640,
          },
          {
            height: 300,
            url:
              'https://i.scdn.co/image/ab67616d00001e02a422d871dbfd354dede7e0e4',
            width: 300,
          },
          {
            height: 64,
            url:
              'https://i.scdn.co/image/ab67616d00004851a422d871dbfd354dede7e0e4',
            width: 64,
          },
        ],
        name: 'JoCo Looks Back',
        release_date: '2008-01-01',
        release_date_precision: 'day',
        total_tracks: 20,
        type: 'album',
        uri: 'spotify:album:0eW4vkDVxqS4U60ExzsKhR',
      },
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/292sg99iIOc93zcd30r4Oz',
          },
          href: 'https://api.spotify.com/v1/artists/292sg99iIOc93zcd30r4Oz',
          id: '292sg99iIOc93zcd30r4Oz',
          name: 'Jonathan Coulton',
          type: 'artist',
          uri: 'spotify:artist:292sg99iIOc93zcd30r4Oz',
        },
      ],
      available_markets: [
        'AD',
        'AE',
        'AR',
        'AT',
        'AU',
        'BE',
        'BG',
        'BH',
        'BO',
        'BR',
        'CA',
        'CH',
        'CL',
        'CO',
        'CR',
        'CY',
        'CZ',
        'DE',
        'DK',
        'DO',
        'DZ',
        'EC',
        'EE',
        'EG',
        'ES',
        'FI',
        'FR',
        'GB',
        'GR',
        'GT',
        'HK',
        'HN',
        'HU',
        'ID',
        'IE',
        'IL',
        'IN',
        'IS',
        'IT',
        'JO',
        'JP',
        'KW',
        'LB',
        'LI',
        'LT',
        'LU',
        'LV',
        'MA',
        'MC',
        'MT',
        'MX',
        'MY',
        'NI',
        'NL',
        'NO',
        'NZ',
        'OM',
        'PA',
        'PE',
        'PH',
        'PL',
        'PS',
        'PT',
        'PY',
        'QA',
        'RO',
        'SA',
        'SE',
        'SG',
        'SK',
        'SV',
        'TH',
        'TN',
        'TR',
        'TW',
        'US',
        'UY',
        'VN',
        'ZA',
      ],
      disc_number: 1,
      duration_ms: 190560,
      explicit: false,
      external_ids: {
        isrc: 'usx9p0643176',
      },
      external_urls: {
        spotify: 'https://open.spotify.com/track/1rIFZk9tTUtHP3vULR5wXe',
      },
      href: 'https://api.spotify.com/v1/tracks/1rIFZk9tTUtHP3vULR5wXe',
      id: '1rIFZk9tTUtHP3vULR5wXe',
      is_local: false,
      name: 'Code Monkey',
      popularity: 37,
      preview_url:
        'https://p.scdn.co/mp3-preview/0baf7370e3adda243fa1162ec2b21f8f8baeab34?cid=774b29d4f13844c495f206cafdad9c86',
      track_number: 1,
      type: 'track',
      uri: 'spotify:track:1rIFZk9tTUtHP3vULR5wXe',
    },
    {
      album: {
        album_type: 'ALBUM',
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/2ttC18RelZhUEjhJhJXSbJ',
            },
            href: 'https://api.spotify.com/v1/artists/2ttC18RelZhUEjhJhJXSbJ',
            id: '2ttC18RelZhUEjhJhJXSbJ',
            name: 'Dem Atlas',
            type: 'artist',
            uri: 'spotify:artist:2ttC18RelZhUEjhJhJXSbJ',
          },
        ],
        available_markets: [
          'AD',
          'AE',
          'AR',
          'AT',
          'AU',
          'BE',
          'BG',
          'BH',
          'BO',
          'BR',
          'CA',
          'CH',
          'CL',
          'CO',
          'CR',
          'CY',
          'CZ',
          'DE',
          'DK',
          'DO',
          'DZ',
          'EC',
          'EE',
          'EG',
          'ES',
          'FI',
          'FR',
          'GB',
          'GR',
          'GT',
          'HK',
          'HN',
          'HU',
          'ID',
          'IE',
          'IL',
          'IS',
          'IT',
          'JO',
          'JP',
          'KW',
          'LB',
          'LI',
          'LT',
          'LU',
          'LV',
          'MA',
          'MC',
          'MT',
          'MX',
          'MY',
          'NI',
          'NL',
          'NO',
          'NZ',
          'OM',
          'PA',
          'PE',
          'PH',
          'PL',
          'PS',
          'PT',
          'PY',
          'QA',
          'RO',
          'SA',
          'SE',
          'SG',
          'SK',
          'SV',
          'TH',
          'TN',
          'TR',
          'TW',
          'US',
          'UY',
          'VN',
          'ZA',
        ],
        external_urls: {
          spotify: 'https://open.spotify.com/album/3wwUbKjbG59wZ3qXYr4e8z',
        },
        href: 'https://api.spotify.com/v1/albums/3wwUbKjbG59wZ3qXYr4e8z',
        id: '3wwUbKjbG59wZ3qXYr4e8z',
        images: [
          {
            height: 640,
            url:
              'https://i.scdn.co/image/ab67616d0000b27384207b2fc4912b23b1318e16',
            width: 640,
          },
          {
            height: 300,
            url:
              'https://i.scdn.co/image/ab67616d00001e0284207b2fc4912b23b1318e16',
            width: 300,
          },
          {
            height: 64,
            url:
              'https://i.scdn.co/image/ab67616d0000485184207b2fc4912b23b1318e16',
            width: 64,
          },
        ],
        name: 'DWNR',
        release_date: '2014-10-31',
        release_date_precision: 'day',
        total_tracks: 9,
        type: 'album',
        uri: 'spotify:album:3wwUbKjbG59wZ3qXYr4e8z',
      },
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/2ttC18RelZhUEjhJhJXSbJ',
          },
          href: 'https://api.spotify.com/v1/artists/2ttC18RelZhUEjhJhJXSbJ',
          id: '2ttC18RelZhUEjhJhJXSbJ',
          name: 'Dem Atlas',
          type: 'artist',
          uri: 'spotify:artist:2ttC18RelZhUEjhJhJXSbJ',
        },
      ],
      available_markets: [
        'AD',
        'AE',
        'AR',
        'AT',
        'AU',
        'BE',
        'BG',
        'BH',
        'BO',
        'BR',
        'CA',
        'CH',
        'CL',
        'CO',
        'CR',
        'CY',
        'CZ',
        'DE',
        'DK',
        'DO',
        'DZ',
        'EC',
        'EE',
        'EG',
        'ES',
        'FI',
        'FR',
        'GB',
        'GR',
        'GT',
        'HK',
        'HN',
        'HU',
        'ID',
        'IE',
        'IL',
        'IS',
        'IT',
        'JO',
        'JP',
        'KW',
        'LB',
        'LI',
        'LT',
        'LU',
        'LV',
        'MA',
        'MC',
        'MT',
        'MX',
        'MY',
        'NI',
        'NL',
        'NO',
        'NZ',
        'OM',
        'PA',
        'PE',
        'PH',
        'PL',
        'PS',
        'PT',
        'PY',
        'QA',
        'RO',
        'SA',
        'SE',
        'SG',
        'SK',
        'SV',
        'TH',
        'TN',
        'TR',
        'TW',
        'US',
        'UY',
        'VN',
        'ZA',
      ],
      disc_number: 1,
      duration_ms: 247751,
      explicit: true,
      external_ids: {
        isrc: 'USBWK1400236',
      },
      external_urls: {
        spotify: 'https://open.spotify.com/track/2oRQd12MpkUQ3DhHOaQU5Z',
      },
      href: 'https://api.spotify.com/v1/tracks/2oRQd12MpkUQ3DhHOaQU5Z',
      id: '2oRQd12MpkUQ3DhHOaQU5Z',
      is_local: false,
      name: 'Drive North',
      popularity: 40,
      preview_url:
        'https://p.scdn.co/mp3-preview/16e166ee004cd15764316e34af3dfeadf4ef6afb?cid=774b29d4f13844c495f206cafdad9c86',
      track_number: 5,
      type: 'track',
      uri: 'spotify:track:2oRQd12MpkUQ3DhHOaQU5Z',
    },
  ],
  total: 50,
  limit: 3,
  offset: 0,
  previous: null,
  href: 'https://api.spotify.com/v1/me/top/tracks?limit=3&offset=0',
  next: 'https://api.spotify.com/v1/me/top/tracks?limit=3&offset=3',
}

const extract = raw => {
  const topSongs = extractTopSongs(topThree)
  if (raw.currently_playing_type === 'track') {
    return { ...extractSong(raw), topSongs, isPlaying: true }
  }

  return { topSongs, isPlaying: false }
}

const extractSong = raw => {
  try {
    const timestamp = Date.now()
    const expire_at = new Date(
      timestamp + raw.item.duration_ms - raw.progress_ms
    )

    return {
      id: raw.item.id,
      name: raw.item.name,
      progress_ms: raw.progress_ms,
      duration_ms: raw.item.duration_ms,
      url: raw.item.external_urls.spotify,
      preview_url: raw.item.preview_url,
      artist: raw.item.artists[0].name,
      image: raw.item.album.images[0].url,
      expire_at,
      timestamp,
    }
  } catch (err) {
    return null
  }
}

const extractTopSongs = raw => {
  return raw.items.map(item => extractSong({ item }))
}

const getData = async access_token => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
  }

  const response = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    fetchOptions
  )

  if (response.status >= 400) {
    throw new Error('Something went wrong status=' + response.status)
  }
  if (response.status === 200) {
    const data = await response.json()
    const song = extract(data)

    redisClient.set('last_song', JSON.stringify(song), redis.print)
    return song
  }

  return null
}

export default async (req, res) => {
  let access_token = await getAsync('access_token')
  const refresh_token = await getAsync('refresh_token')

  const redis_song_str = await getAsync('last_song')
  const redis_song = JSON.parse(redis_song_str)

  if (
    redis_song &&
    redis_song.expire_at &&
    new Date(redis_song.expire_at) > new Date()
  ) {
    return res.status(200).json(redis_song)
  }

  spotifyApi.setAccessToken(access_token)
  spotifyApi.setRefreshToken(refresh_token)

  const refreshToken = async () => {
    try {
      const data = await spotifyApi.refreshAccessToken()
      access_token = data.body['access_token']
      spotifyApi.setAccessToken(access_token)
      redisClient.set('access_token', access_token, redis.print)
    } catch (err) {
      throw new Error('refreshToken: error setting refresh token')
    }
  }

  try {
    res.setHeader('Content-Type', 'application/json')
    const data = await getData(access_token)
    res.status(200).json(data)
  } catch (err) {
    try {
      await refreshToken()
      const data = await getData(access_token)
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
