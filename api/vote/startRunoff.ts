import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { ApiError } from 'next/dist/server/api-utils'
import { withAdminAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { getActiveEvent, getSettings, updateSettings } from '../_otherstff/voting'
import { getResults } from './results'
import { fauna } from '../_otherstff/fauna/client'
import { createItem, Movies, ref, VoteEvents } from '../_otherstff/fauna/queries'
import { VoteEventCreation } from '../../types/data'
import { Expr } from 'faunadb'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed')
  }

  const [activeEvent, settings] = await Promise.all([getActiveEvent(), getSettings()])

  if (!activeEvent) {
    throw new ApiError(400, 'No voting event in progress')
  }
  if (activeEvent.runoffOf) {
    throw new ApiError(409, `Runoff already underway for ${activeEvent.name}`)
  }
  if (activeEvent.winner) {
    throw new ApiError(400, `Results are already in for ${activeEvent.name}`)
  }

  const results = await getResults(activeEvent)
  const highestVotes = results[0]?.votes || 0
  const tiedMovies = results
    .filter(movie => movie.votes === highestVotes)
    .map(movie => movie.id)

  const runoffEvent: VoteEventCreation = {
    name: `${activeEvent.name} runoff`,
    votingOptions: tiedMovies.map(id => ref(Movies, id)),
    runoffOf: ref(VoteEvents, activeEvent.id),
  }
  const {ref: eventRef} = await fauna.query<{ ref: Expr }>(createItem(VoteEvents, runoffEvent))
  await updateSettings({downForMaintenance: settings.downForMaintenance, votingEvent: eventRef})
  response.status(200).end()
}

export default withAdminAuth(withErrorHandling(handler))
