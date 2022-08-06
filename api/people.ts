import { AUTHORIZED_PEOPLE } from './_otherstff/people'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { withErrorHandling } from './_otherstff/errorHandling'

function handler(request: NextApiRequest, response: NextApiResponse) {
  response.json(AUTHORIZED_PEOPLE)
}

export default withErrorHandling(handler)
