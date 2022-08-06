import { Person } from '../../types/data'
import * as cookie from 'cookie'
import { AUTHORIZED_PEOPLE } from './people'
import { NextApiHandler, NextApiRequest } from 'next/dist/shared/lib/utils'

export function withAuth(handler: NextApiHandler): NextApiHandler {
  return (req, res) => {
    const user = getUserOrNull(req)

    if (!user) {
      return res.status(401).json({message: 'Credentials required'})
    } else if (!AUTHORIZED_PEOPLE.find(person => person.username === user.username)) {
      return res.status(401).json({message: `No such user '${user.username}'`})
    } else {
      return handler(req, res)
    }
  }
}

export function getUser(req: NextApiRequest): Person {
  const user = getUserOrNull(req)
  if (!user) {
    throw new Error('No user')
  }
  return user
}

function getUserOrNull(req: NextApiRequest): Person | null {
  const serialisedUser = cookie.parse(req.headers.cookie || '').user
  return serialisedUser ? JSON.parse(serialisedUser) : null
}
