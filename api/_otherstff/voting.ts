import { fauna, MapOf, q } from './faunaClient'
import { Person, Vote } from '../../types/types'

const VOTING_EVENT: null | `${number}-${number}-${number}` = null//'2022-07-28'

const RESULTS_IN = false

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

export function currentVotingEvent(): string | null {
  return VOTING_EVENT
}

export function resultsIn(): boolean {
  return RESULTS_IN
}

// TODO: fix plurals in results