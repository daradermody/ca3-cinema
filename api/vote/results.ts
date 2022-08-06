import { withAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { SuggestedMovie, VotingResult } from '../../types/data'
import { getMovies } from '../_otherstff/movies'
import { ApiError } from 'next/dist/server/api-utils'
import { resultsIn, votesByCurrentEvent } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const [resultsAlreadyIn, votes, movies] = await Promise.all([resultsIn(), votesByCurrentEvent(), getMovies()])

  if (!resultsAlreadyIn) {
    throw new ApiError(403, 'Voting not closed yet')
  }

  const movieVotes: Record<SuggestedMovie['id'], VotingResult> = {}
  for (const movie of movies) {
    movieVotes[movie.id] = {
      ...movie,
      votes: 0,
    }
  }

  for (const vote of votes) {
    for (const id of vote.movies) {
      if (id in movieVotes) {
        movieVotes[id].votes += 1
      }
    }
  }

  response.json(Object.values(movieVotes).sort((a, b) => a.votes > b.votes ? -1 : 1))
}

export default withAuth(withErrorHandling(handler))
