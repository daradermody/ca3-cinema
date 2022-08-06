import { withAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { votingOpen } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  response.json(await votingOpen())
}

export default withAuth(withErrorHandling(handler))
