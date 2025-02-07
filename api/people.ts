import { AUTHORIZED_PEOPLE } from './_otherstff/people'
import { NextApiRequest, NextApiResponse } from 'next'
import { withErrorHandling } from './_otherstff/errorHandling'
import getToken from './_otherstff/getToken'

function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'GET') {
    response.json(AUTHORIZED_PEOPLE)
  } else if (request.method === 'POST') {
    if (request.body.password === getToken('ADMIN_PASSWORD')) {
      response.status(200).end()
    } else {
      response.status(401).end()
    }
  }
}

export default withErrorHandling(handler)
