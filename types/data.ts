import { Expr } from 'faunadb'
import { ExprVal } from 'faunadb/src/types/query'

type Ref = string

export interface Settings {
  downForMaintenance: boolean
  votingEvent?: VoteEvent
}

export interface SettingsCreation {
  downForMaintenance: Settings['downForMaintenance']
  votingEvent: Expr | null
}

export interface Movie {
  tmdbId: number
  title: string
  overview: string
  poster?: string
  year?: number
}

export interface SuggestedMovie extends Movie {
  id: Ref
  suggester: string
  userDescription?: string
}

export type SuggestedMovieCreation = Omit<SuggestedMovie, 'id'>

export interface Person {
  username: string;
  firstName: string;
  lastName: string;
  nickname: string;
  photo: string;
}

export interface Vote {
  event: VoteEvent
  voter: string
  movies: SuggestedMovie[]
}

export interface VoteCreation {
  event: ExprVal
  voter: string
  movies: ExprVal[]
}

export type VotingResult = SuggestedMovie & { votes: number }

export interface VoteEvent {
  id: Ref
  name: string
  votingOptions: SuggestedMovie[]
  showingTime?: string
  downloadLink?: string
  runoffOf?: VoteEvent
  winner?: SuggestedMovie
}

export interface VoteEventCreation {
  name: string
  votingOptions: ExprVal[]
  showingTime?: string
  downloadLink?: string
  runoffOf?: ExprVal
  winner?: ExprVal
}
