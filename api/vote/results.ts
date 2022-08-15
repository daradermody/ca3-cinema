import { getUser, isAdmin, withAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { isRunoffVote, RunoffVote, Settings, SuggestedMovie, Vote, VotingResult } from '../../types/data'
import { getMovies } from '../_otherstff/movies'
import { ApiError } from 'next/dist/server/api-utils'
import { getSettings, votesByCurrentEvent } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const settings = await getSettings()
  if (!isAdmin(getUser(request)) && !settings.resultsIn) {
    throw new ApiError(403, 'Voting not closed yet')
  }
  response.json(await getResults(settings))
}

export async function getResults(settings: Settings) {
  const [votes, movies] = await Promise.all([votesByCurrentEvent(), getMovies()])

  const moviesUnderVote = settings.runoffMovies.length ? movies.filter(({id}) => settings.runoffMovies.includes(id)) : movies

  const movieVotes: Record<SuggestedMovie['id'], VotingResult> = {}
  for (const movie of moviesUnderVote) {
    movieVotes[movie.id] = {
      ...movie,
      votes: 0,
    }
  }

  for (const vote of votes) {
    const votedMovies = isRunoffVote(vote) ? [vote.movie] : vote.movies
    for (const id of votedMovies) {
      if (id in movieVotes) {
        movieVotes[id].votes += 1
      }
    }
  }

  return Object.values(movieVotes).sort((a, b) => a.votes > b.votes ? -1 : 1)
}

export default withAuth(withErrorHandling(handler))
