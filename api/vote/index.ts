import { fauna } from '../_otherstff/fauna/client'
import { Person, SuggestedMovie, VoteCreation, VoteEvent } from '../../types/data'
import {getUser, hasAdminAuth, withAuth} from '../_otherstff/authentication'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { ApiError } from 'next/dist/server/api-utils'
import { getActiveEvent, getSettings, hasVoted, updateSettings } from '../_otherstff/voting'
import { activeVotingEvent, createItem, Movies, ref, VoteEvents, Votes } from '../_otherstff/fauna/queries'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'GET') {
    response.json(await getActiveEvent())
  } else if (request.method === 'POST') {
    await handleVoteSubmission(request)
    response.status(200).end()
  } else if (request.method === 'DELETE') {
    if (!hasAdminAuth(request)) {
      return response.status(401).end()
    }
    await finishEvent()
    response.status(200).end()
  } else {
    throw new ApiError(405, 'Method not allowed')
  }
}

async function handleVoteSubmission(request: NextApiRequest) {
  const {username} = getUser(request)

  const [activeEvent, userHasVoted] = await Promise.all([
    fauna.query<VoteEvent>(activeVotingEvent),
    hasVoted(username)
  ])

  if (!activeEvent || activeEvent.winner) {
    throw new ApiError(403, `No voting event is underway`)
  }
  if (userHasVoted) {
    throw new ApiError(409, `${username} already voted`)
  }

  const movieIds = request.body.movieIds
  if (activeEvent.runoffOf && movieIds.length > 1) {
    throw new ApiError(400, 'Runoff votes can only specify one movie ID')
  }

  const acceptedMovieIds = activeEvent.votingOptions.map(option => option.id)
  if (!movieIds || movieIds.some((id: any) => !acceptedMovieIds.includes(id))) {
    throw new ApiError(400, 'Invalid movie ID')
  }

  await submitVote(activeEvent, username, request.body.movieIds)
}

async function submitVote(event: VoteEvent, username: Person['username'], movieIds: SuggestedMovie['id'][]) {
  const vote: VoteCreation = {
    event: ref(VoteEvents, event.id),
    movies: Array.from(new Set(movieIds)).map(id => ref(Movies, id)),
    voter: username,
  }
  await fauna.query(createItem(Votes, vote))
}

async function finishEvent() {
  const settings = await getSettings()
  if (!settings.votingEvent) {
    throw new ApiError(400, 'No voting event in progress')
  }
  await updateSettings({downForMaintenance: settings.downForMaintenance, votingEvent: null})
}

export default withAuth(withErrorHandling(handler))
