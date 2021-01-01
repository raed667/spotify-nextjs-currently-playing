export type RawSong = {
  currently_playing_type: string
  progress_ms: number
  item: {
    id: string
    name: string
    duration_ms: number
    external_urls: {
      spotify: string
    }
    preview_url: string
    artists: {
      name: string
    }[]
    album: {
      images: {
        url: string
      }[]
    }
  }
}

export type Song = {
  id: string
  name: string
  progress_ms: number
  duration_ms: number
  url: string
  preview_url: string
  artist: string
  image: string
  expire_at: Date | string
  timestamp: number
  backgroundColor: string
  isPlaying: boolean
}
