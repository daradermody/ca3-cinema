import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { ApiError } from 'next/dist/server/api-utils'
import { withAdminAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { getSettings, updateSettings } from '../_otherstff/voting'
import { RunoffVote, Settings, SuggestedMovie, Vote } from '../../types/data'
import { fauna, q } from '../_otherstff/faunaClient'
import { DateTime } from 'luxon'

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

  const settings = await getSettings()

  if (!settings.votingEvent) {
    throw new ApiError(400, 'No voting event in progress')
  }
  if (settings.resultsIn) {
    throw new ApiError(400, `Results are already in for ${settings.votingEvent}`)
  }

  if (request.body.movieId) {
    if (typeof request.body.movieId !== 'string' || !request.body.movieId.trim().length) {
      throw new ApiError(400, 'Invalid movie ID')
    }
    if (!settings.runoffMovies.length) {
      throw new ApiError(400, 'System voting can only be done when closing a runoff')
    }
    await submitVote(settings.votingEvent, request.body.movieId)
  }

  await updateSettings({
    ...settings,
    resultsIn: true,
    showingTime: request.body.showingTime,
    downloadLink: request.body.downloadLink
  })
  response.status(200).end()
}

async function submitVote(eventId: Settings['votingEvent'], movieId: SuggestedMovie['id']) {
  const vote: RunoffVote = {
    eventId: `${eventId}-runoff`,
    movie: movieId,
    voter: 'System',
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

export default withAdminAuth(withErrorHandling(handler))
