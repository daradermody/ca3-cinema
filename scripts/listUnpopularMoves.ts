require('@dotenvx/dotenvx').config({path: '.env.local', override: true})

import {fauna} from '../api/_otherstff/fauna/client'
import {
  olderUnwatchedMoves,
  ref,
  resolvedVotingEvents,
  VoteEvents,
  votesForEvent,
} from '../api/_otherstff/fauna/queries'

import {SuggestedMovie, Vote, VoteEvent} from '../types/data'
import {DurationLike} from 'luxon'

const NUMBER_OF_RECENT_EVENTS = 5

async function main(): Promise<void> {
  if (process.env.VERCEL_ENV !== 'production') {
    console.warn(`Running against dev environment. To run against production, run 'vercel env pull --environment production' first`)
  }

  const movies = await getUnwatchedMovies({weeks: 2 * NUMBER_OF_RECENT_EVENTS})
  const recentEvents = await getRecentEvents(NUMBER_OF_RECENT_EVENTS)
  const rankedMovies = await rankMoviesByVotes(movies, recentEvents)

  console.log('Most voted films:')
  for (const movie of rankedMovies.slice(0, 3)) {
    console.log(`  [${movie.votes}] ${movie.title} (avg ${movie.votes / NUMBER_OF_RECENT_EVENTS} per event)`)
  }

  const unpopularMovies = rankedMovies.filter(m => m.votes <= NUMBER_OF_RECENT_EVENTS)
  if (unpopularMovies.length) {
    console.log(`\nMoves that never got more than a single vote per event:`)
    for (const movie of unpopularMovies) {
      console.log(`  [${movie.votes}] ${movie.title} (avg ${movie.votes / NUMBER_OF_RECENT_EVENTS} per event)`)
    }
  }
}

async function getUnwatchedMovies(before: DurationLike): Promise<SuggestedMovie[]> {
  return await fauna.query<SuggestedMovie[]>(olderUnwatchedMoves(before))
}

async function getRecentEvents(n: number): Promise<VoteEvent[]> {
  const events = await fauna.query<VoteEvent[]>(resolvedVotingEvents)
  return events
    .filter(e => e.showingTime)
    .sort((a, b) => a.showingTime! > b.showingTime! ? -1 : 1)
    .slice(0, n)
    .map(e => e.runoffOf || e)
}

async function rankMoviesByVotes(movies: SuggestedMovie[], events: VoteEvent[]): Promise<{title: string, votes: number}[]> {
  const moviePopularity: Record<string, {title: string, votes: number}> = {}
  for (const movie of movies) {
    moviePopularity[movie.id] = {title: movie.title, votes: 0}
  }

  const votes = (await Promise.all(events.map(e => fauna.query<Vote>(votesForEvent(ref(VoteEvents, e.id)))))).flat()
  for (const vote of votes) {
    for (const movieVote of vote.movies) {
      if (movieVote?.id in moviePopularity) {
        moviePopularity[movieVote.id].votes += 1
      }
    }
  }

  return Object.values(moviePopularity).sort((a, b) => b.votes - a.votes)
}

main().catch(console.error)
