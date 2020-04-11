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
