export interface Movie {
  tmdbId: number
  title: string
  overview: string
  poster?: string
  year?: number
}

export interface SuggestedMovie extends Movie {
  id: number
  suggester: string
  userDescription?: string
}

export interface Person {
  username: string;
  firstName: string;
  lastName: string;
  nickname: string;
  photo: string;
}

export interface Vote {
  eventId: string,
  voter: string,
  movies: number[]
}

export type VotingResult = SuggestedMovie & { votes: number }