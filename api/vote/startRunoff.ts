import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { ApiError } from 'next/dist/server/api-utils'
import { withAdminAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { getSettings, updateSettings } from '../_otherstff/voting'
import { getResults } from './results'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed')
  }

  const settings = await getSettings()

  if (!settings.votingEvent) {
    throw new ApiError(400, 'No voting event in progress')
  }
  if (settings.runoffMovies.length) {
    throw new ApiError(409, `Runoff already underway for ${settings.votingEvent}`)
  }
  if (settings.resultsIn) {
    throw new ApiError(400, `Results are already in for ${settings.votingEvent}`)
  }

  const results = await getResults(settings)
  const highestVotes = results[0].votes
  const tiedMovies = results
    .filter(movie => movie.votes === highestVotes)
    .map(movie => movie.id)

  await updateSettings({ ...settings, runoffMovies: tiedMovies })
  response.status(200).end()
}

export default withAdminAuth(withErrorHandling(handler))
