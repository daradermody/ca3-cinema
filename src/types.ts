export interface Movie {
  tmdb_id: number
  title: string
  overview: string
  poster: string
}

export interface SuggestedMovie extends Movie {
  suggester: number
  user_description: string
}

