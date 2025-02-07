import { NextApiHandler } from 'next'

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

export class ApiError extends Error {
  readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}
