import {hasAdminAuth, withAuth} from '../_otherstff/authentication'
import {ApiError, withErrorHandling} from '../_otherstff/errorHandling'
import {NextApiRequest, NextApiResponse} from 'next'
import {SuggestedMovie, VoteEvent, VotingResult} from '../../types/data'
import {getActiveEvent, votesByCurrentEvent} from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const voteEvent = await getActiveEvent()
  if (!voteEvent) {
    throw new ApiError(400, 'No vote event underway')
  }

  if (!hasAdminAuth(request) && !voteEvent.winner) {
    throw new ApiError(403, 'Voting not closed yet')
  }
  response.json(await getResults(voteEvent))
}

export async function getResults(voteEvent: VoteEvent) {
  const votes = await votesByCurrentEvent()

  const movieVotes: Record<SuggestedMovie['id'], VotingResult> = {}
  for (const movie of voteEvent.votingOptions) {
    movieVotes[movie.id] = {
      ...movie,
      votes: 0,
    }
  }

  for (const vote of votes) {
    for (const movie of vote.movies) {
      if (movie.id in movieVotes) {
        movieVotes[movie.id].votes += 1
      }
    }
  }

  return Object.values(movieVotes).sort((a, b) => a.votes > b.votes ? -1 : 1)
}

export default withAuth(withErrorHandling(handler))
