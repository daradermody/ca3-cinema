import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { ApiError } from 'next/dist/server/api-utils'
import { getUser, withAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { getSettings, hasVoted, runoffMovies, votingOpen } from '../_otherstff/voting'
import { Person, RunoffVote, SuggestedMovie, Vote } from '../../types/data'
import { fauna, q } from '../_otherstff/faunaClient'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed')
  }
  await handleVoteSubmission(request)
  response.status(200).end()
}

async function handleVoteSubmission(request: NextApiRequest) {
  if (!request.body.id || typeof request.body.id !== 'string') {
    throw new ApiError(400, 'Invalid movie ID')
  }
  const {username} = getUser(request)
  const [userHasVoted, votingIsOpen, acceptedMovieIds] = await Promise.all([hasVoted(username), votingOpen(), runoffMovies()])
  if (userHasVoted) {
    throw new ApiError(409, `${username} already voted`)
  }
  if (!votingIsOpen) {
    throw new ApiError(403, `No voting event is underway`)
  }
  if (!acceptedMovieIds.includes(request.body.id)) {
    throw new ApiError(400, 'Invalid movie ID')
  }

  await submitVote(username, request.body.id)
}

async function submitVote(username: Person['username'], movieId: SuggestedMovie['id']) {
  const vote: RunoffVote = {
    eventId: `${(await getSettings()).votingEvent}-runoff`,
    movie: movieId,
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
