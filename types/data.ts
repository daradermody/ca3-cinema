export interface Settings {
  votingEvent: '' | `${number}-${number}-${number}`
  resultsIn: boolean
  runoffMovies: SuggestedMovie['id'][]
  showingTime?: string
  downloadLink?: string
}

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
  movies: SuggestedMovie['id'][]
}

export interface RunoffVote {
  eventId: `${string}-runoff`,
  voter: string,
  movie: SuggestedMovie['id']
}

export interface VoteState {
  votingOpen: boolean
  resultsIn: boolean
  isRunoff: boolean
  showingTime?: string
  downloadLink?: string
}

export function isRunoffVote(vote: Vote | RunoffVote): vote is RunoffVote {
  return 'movie' in vote
}

export type AdminVoteState = VoteState & Settings

export type VotingResult = SuggestedMovie & { votes: number }
