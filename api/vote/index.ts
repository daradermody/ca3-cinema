import { fauna, q } from '../_otherstff/faunaClient'
import { Person, SuggestedMovie, Vote, VoteState } from '../../types/data'
import { getUser, isAdmin, withAuth } from '../_otherstff/authentication'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { ApiError } from 'next/dist/server/api-utils'
import { getSettings, hasVoted, updateSettings, votingOpen } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'GET') {
    response.json(await getVoteInformation({includeAdmin: isAdmin(getUser(request))}))
  } else if (request.method === 'POST') {
    await handleVoteSubmission(request)
    response.status(200).end()
  } else if (request.method === 'DELETE') {
    await finishEvent()
    response.status(200).end()
  } else {
    throw new ApiError(405, 'Method not allowed')
  }
}

async function getVoteInformation(options: { includeAdmin: boolean }): Promise<VoteState> {
  const {votingEvent, resultsIn, runoffMovies, showingTime, downloadLink} = await getSettings()
  const baseState = {
    votingOpen: !!votingEvent && !resultsIn,
    resultsIn,
    isRunoff: !!runoffMovies.length,
    showingTime,
    downloadLink,
  }
  const adminState = {votingEvent, runoffMovies}
  return options.includeAdmin ? {...baseState, ...adminState} : baseState
}

async function handleVoteSubmission(request: NextApiRequest) {
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
}

async function submitVote(username: Person['username'], movieIds: SuggestedMovie['id'][]) {
  const vote: Vote = {
    eventId: (await getSettings()).votingEvent,
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

async function finishEvent() {
  const settings = await getSettings()
  if (!settings.votingEvent) {
    throw new ApiError(400, 'No voting event in progress')
  }
  await updateSettings({downForMaintenance: false, votingEvent: '', runoffMovies: [], resultsIn: false})
}

export default withAuth(withErrorHandling(handler))
