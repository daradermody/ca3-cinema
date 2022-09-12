import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { ApiError } from 'next/dist/server/api-utils'
import { withAdminAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { getActiveEvent } from '../_otherstff/voting'
import { VoteEventCreation } from '../../types/data'
import { fauna } from '../_otherstff/fauna/client'
import { DateTime } from 'luxon'
import { Movies, ref, updateItem, VoteEvents } from '../_otherstff/fauna/queries'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed')
  }

  if (typeof request.body.downloadLink !== 'string' || !request.body.downloadLink.startsWith('https://')) {
    throw new ApiError(400, 'Invalid download link')
  }

  const showingTime = DateTime.fromISO(request.body.showingTime)
  if (!showingTime.isValid || showingTime < DateTime.now()) {
    throw new ApiError(400, 'Invalid showing time')
  }

  const activeEvent = await getActiveEvent()
  if (!activeEvent) {
    throw new ApiError(400, 'No voting event in progress')
  }
  if (activeEvent.winner) {
    throw new ApiError(400, `Results are already in for ${activeEvent.name}`)
  }

  const movieId = request.body.movieId
  if (movieId && (typeof movieId !== 'string' || !movieId || !activeEvent.votingOptions.find(m => m.id !== movieId))) {
    throw new ApiError(400, 'Invalid movie ID')
  }

  const updatedEvent: VoteEventCreation = {
    name: activeEvent.name,
    votingOptions: activeEvent.votingOptions.map(option => ref(Movies, option.id)),
    showingTime: showingTime.toISOTime(),
    downloadLink: request.body.downloadLink,
    runoffOf: activeEvent.runoffOf?.id ? ref(VoteEvents, activeEvent.runoffOf.id) : undefined,
    winner: ref(Movies, movieId),
  }
  await fauna.query(updateItem(ref(VoteEvents, activeEvent.id), updatedEvent))
  response.status(200).end()
}

export default withAdminAuth(withErrorHandling(handler))
