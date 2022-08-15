import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { ApiError } from 'next/dist/server/api-utils'
import { withAdminAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { getSettings, updateSettings } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed')
  }
  if (!request.body.name || typeof request.body.name !== 'string' || !request.body.name.trim().length) {
    throw new ApiError(400, 'Invalid event name')
  }

  const settings = await getSettings()
  if (settings.votingEvent) {
    throw new ApiError(409, `Voting event already underway: ${settings.votingEvent}`)
  }
  if (settings.resultsIn) {
    throw new ApiError(400, `Results are already in for ${settings.votingEvent}. Close the event first.`)
  }

  await updateSettings({ ...settings, votingEvent: request.body.name.trim() })
  response.status(200).end()
}

export default withAdminAuth(withErrorHandling(handler))
