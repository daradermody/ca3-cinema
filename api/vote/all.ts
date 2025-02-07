import { withAdminAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { NextApiRequest, NextApiResponse } from 'next'
import { votesByCurrentEvent } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  response.json(await votesByCurrentEvent())
}

export default withAdminAuth(withErrorHandling(handler))
