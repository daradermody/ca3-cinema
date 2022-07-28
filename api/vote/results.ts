import { withAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { fauna, MapOf, q } from '../_otherstff/faunaClient'
import { SuggestedMovie, Vote, VotingResult } from '../../types/types'
import { getMovies } from '../_otherstff/movies'
import { ApiError } from 'next/dist/server/api-utils'
import { resultsIn } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!resultsIn()) {
    throw new ApiError(403, 'Voting not closed yed')
  }

  const results = await fauna.query<MapOf<Vote>>(
    q.Map(
      q.Paginate(
        q.Documents(
          q.Collection('Votes')
        )
      ),
      (ref) => q.Get(ref)
    )
  )
  const votes: Vote[] = results.data.map(item => item.data)
  const movies = await getMovies()
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
