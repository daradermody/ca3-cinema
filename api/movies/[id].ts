import { fauna, q } from '../_otherstff/faunaClient'
import { withAuth } from '../_otherstff/authentication'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { withErrorHandling } from '../_otherstff/errorHandling'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'DELETE') {
    await fauna.query(
      q.Delete(q.Ref(q.Collection('Movies'), request.query.id))
    )
    response.status(200).json(null)
  }
}

export default withAuth(withErrorHandling(handler))
