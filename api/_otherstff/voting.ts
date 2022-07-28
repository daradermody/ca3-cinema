import { fauna, MapOf, q } from './faunaClient'
import { Person, Vote } from '../../types/types'

const VOTING_EVENT = '2022-07-30'

export async function hasVoted(username: Person['username']): Promise<boolean> {
  const results = await fauna.query<MapOf<Vote>>(
    q.Map(
      q.Paginate(
        q.Documents(
          q.Collection('Votes')
        )
      ),
      (ref) => q.Get(ref)
    )
  )

  return !!results.data.find(item => item.data.voter === username)
}

export function currentVotingEvent() {
  return VOTING_EVENT
}