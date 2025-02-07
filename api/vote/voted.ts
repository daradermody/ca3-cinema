import { getUser, withAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { NextApiRequest, NextApiResponse } from 'next'
import { hasVoted } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  response.json(await hasVoted(getUser(request).username))
}

export default withAuth(withErrorHandling(handler))
