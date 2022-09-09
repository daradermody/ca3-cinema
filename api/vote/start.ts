import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { ApiError } from 'next/dist/server/api-utils'
import { withAdminAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { getSettings, updateSettings } from '../_otherstff/voting'
import { fauna } from '../_otherstff/fauna/client'
import { Expr } from 'faunadb'
import { collectionRefs, createItem, Movies, VoteEvents } from '../_otherstff/fauna/queries'
import { VoteEventCreation } from '../../types/data'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed')
  }
  if (!request.body.name || typeof request.body.name !== 'string' || !request.body.name.trim().length) {
    throw new ApiError(400, 'Invalid event name')
  }

  const settings = await getSettings()
  if (!!settings.votingEvent) {
    throw new ApiError(409, `Voting event already underway`)
  }

  const voteEvent: VoteEventCreation = {
    name: request.body.name.trim(),
    votingOptions: await fauna.query(collectionRefs(Movies)),
  }
  const {ref} = await fauna.query<{ ref: Expr }>(createItem(VoteEvents, voteEvent))

  await updateSettings({downForMaintenance: settings.downForMaintenance, votingEvent: ref})
  response.status(200).end()
}

export default withAdminAuth(withErrorHandling(handler))
