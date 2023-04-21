import {fauna} from '../_otherstff/fauna/client'
import {deleteItem, Movies} from '../_otherstff/fauna/queries'
import {withAdminAuth} from '../_otherstff/authentication'
import {NextApiRequest, NextApiResponse} from 'next/dist/shared/lib/utils'
import {withErrorHandling} from '../_otherstff/errorHandling'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'DELETE') {
    await fauna.query(deleteItem(Movies, request.query.id as string))
    response.status(200).json(null)
  }
}

export default withAdminAuth(withErrorHandling(handler))
