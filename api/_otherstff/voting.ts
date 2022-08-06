import { fauna, FaunaDoc, MapOf, q, Settings } from './faunaClient'
import { Person, Vote } from '../../types/data'

export async function hasVoted(username: Person['username']): Promise<boolean> {
  const votes = await votesByCurrentEvent()
  return !!votes.find(vote => vote.voter === username)
}

export async function votesByCurrentEvent(): Promise<Vote[]> {
  const results = await fauna.query<MapOf<Vote>>(
    q.Map(
      q.Paginate(
        q.Match(
          q.Index('votes_by_event'),
          q.Select(['data', 'votingEvent'], q.Get(q.Documents(q.Collection('Settings'))))
        )
      ),
      (ref) => q.Get(ref)
    )
  )
  return results.data.map(item => item.data)
}

export async function currentVotingEvent(): Promise<string | null> {
  const results = await fauna.query<FaunaDoc<Settings>>(
    q.Get(q.Documents(q.Collection('Settings')))
  )
  return results.data.votingEvent
}

export async function resultsIn(): Promise<boolean> {
  const results = await fauna.query<FaunaDoc<Settings>>(
    q.Get(q.Documents(q.Collection('Settings')))
  )
  return results.data.resultsIn
}

export async function votingOpen(): Promise<boolean> {
  const [votingEvent, resultsAlreadyIn] = await Promise.all([currentVotingEvent(), resultsIn()])
  return !!votingEvent && !resultsAlreadyIn
}