import { fauna, q } from '../_otherstff/faunaClient'
import { Person, SuggestedMovie, Vote } from '../../types/data'
import { getUser, withAuth } from '../_otherstff/authentication'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { ApiError } from 'next/dist/server/api-utils'
import { currentVotingEvent, hasVoted, votingOpen } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed')
  }
  if (!request.body.movieIds || request.body.movieIds.some((id: any) => typeof id !== 'string')) {
    throw new ApiError(400, 'Invalid movie ID')
  }
  const {username} = getUser(request)
  const [userHasVoted, votingIsOpen] = await Promise.all([hasVoted(username), votingOpen()])
  if (userHasVoted) {
    throw new ApiError(409, `${username} already voted`)
  }
  if (!votingIsOpen) {
    throw new ApiError(403, `No voting event is underway`)
  }

  await submitVote(username, request.body.movieIds)
  response.status(200).end()
}

async function submitVote(username: Person['username'], movieIds: SuggestedMovie['id'][]) {
  const vote: Vote = {
    eventId: await currentVotingEvent() as string,
    movies: Array.from(new Set(movieIds)),
    voter: username,
  }
  await fauna.query(
    q.Create(
      q.Collection('Votes'),
      {
        data: vote
      }
    )
  )
}

export default withAuth(withErrorHandling(handler))
