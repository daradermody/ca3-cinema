import { fauna, FaunaDoc, MapOf, q, SETTINGS_REF } from './faunaClient'
import { Person, RunoffVote, Settings, SuggestedMovie, Vote } from '../../types/data'

export async function hasVoted(username: Person['username']): Promise<boolean> {
  const votes = await votesByCurrentEvent()
  return !!votes.find(vote => vote.voter === username)
}

export async function votesByCurrentEvent(): Promise<(Vote | RunoffVote)[]> {
  const settings = await getSettings()
  let eventId = settings.votingEvent
  if (settings.runoffMovies.length) {
    eventId += '-runoff'
  }

  const results = await fauna.query<MapOf<Vote>>(
    q.Map(
      q.Paginate(
        q.Match(
          q.Index('votes_by_event'),
          eventId
        )
      ),
      (ref) => q.Get(ref)
    )
  )
  return results.data.map(item => item.data)
}

export async function getSettings(): Promise<Settings> {
  const results = await fauna.query<FaunaDoc<Settings>>(
    q.Get(SETTINGS_REF)
  )
  return results.data
}

export async function updateSettings(settings: Settings): Promise<void> {
  await fauna.query(q.Update(SETTINGS_REF, {data: settings}))
}

export async function votingOpen(): Promise<boolean> {
  const {votingEvent, resultsIn} = await getSettings()
  return !!votingEvent && !resultsIn
}

export async function runoffMovies(): Promise<SuggestedMovie['id'][]> {
  return (await getSettings()).runoffMovies
}
