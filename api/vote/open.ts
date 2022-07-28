import { withAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { currentVotingEvent } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  response.json(!!currentVotingEvent())
}

export default withAuth(withErrorHandling(handler))
