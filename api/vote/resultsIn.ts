import { withAuth } from '../_otherstff/authentication'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { resultsIn } from '../_otherstff/voting'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  response.json(await resultsIn())
}

export default withAuth(withErrorHandling(handler))
