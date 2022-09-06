import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { getSettings } from './_otherstff/voting'
import { withAuth } from './_otherstff/authentication'
import { withErrorHandling } from './_otherstff/errorHandling'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const settings = await getSettings()
  response.json(settings.downForMaintenance)
}


export default withErrorHandling(handler)
