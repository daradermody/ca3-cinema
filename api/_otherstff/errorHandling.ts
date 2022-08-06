import { NextApiHandler } from 'next/dist/shared/lib/utils'
import { ApiError } from 'next/dist/server/api-utils'

export function withErrorHandling(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (e) {
      if (e instanceof ApiError) {
        return res.status(e.statusCode).json({message: e.message})
      } else {
        throw e
      }
    }
  }
}
