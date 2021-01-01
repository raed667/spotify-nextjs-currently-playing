# 🎧 Currently Listening on Spotify

## Check it out [spotify.raed.dev](https://spotify.raed.dev/)

![screenshot](https://i.imgur.com/eYCFVr1.png)

> A small Next.js application to show the world what you're currently playing on Spotify 🎶

It also exposes an SVG image to be embedded in your Github [README](https://github.com/RaedsLab) like this:

<b>🎧 I'm currently listening to</b>

<p>
<a href="https://spotify.raed.dev/" target="_blank"><img height="180em" src="https://spotify.raed.dev/api/get-spotify-current-svg?v2" /></a>
</p>

## Build Setup

```bash
# install dependencies / run in devellopment mode
$ yarn && yarn dev

# build for production and launch server
$ yarn && yarn build && yarn start
```

## You can deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FRaedsLab%2Fspotify-nextjs-currently-playing&env=AUTHORIZED_USER_ID,CLIENT_ID,CLIENT_SECRET,REDIRECT_URI,REDIS_PORT,REDIS_HOST,REDIS_PASSWORD,NEXT_PUBLIC_GOOGLE_ANALYTICS_CODE&envDescription=Example%20of%20required%20env%20variables&envLink=https%3A%2F%2Fgithub.com%2FRaedsLab%2Fspotify-nextjs-currently-playing%2Fblob%2Fmaster%2F.example.env&demo-url=https%3A%2F%2Fspotify.raed.dev%2F)

Project uses [Next.js](https://nextjs.org/), [Spotify Web API ](https://developer.spotify.com/documentation/web-api/)and [Redis](https://redislabs.com).

Inspired by [cherscarlett/cherislistening](https://github.com/cherscarlett/cherislistening)

# License

MIT License
