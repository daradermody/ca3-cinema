import { fauna } from './fauna/client'
import { Person, Settings, SettingsCreation, Vote, VoteEvent } from '../../types/data'
import { resolvedActiveVotingEvent, settings, settingsRef, updateItem, votesForActiveEvent, votingIsOpen } from './fauna/queries'

export async function hasVoted(username: Person['username']): Promise<boolean> {
  const votes = await votesByCurrentEvent()
  return !!votes.find(vote => vote.voter === username)
}

export async function getActiveEvent(): Promise<VoteEvent | null> {
  return fauna.query(resolvedActiveVotingEvent)
}

export async function votesByCurrentEvent(): Promise<Vote[]> {
  return fauna.query(votesForActiveEvent)
}

export async function getSettings(): Promise<Settings> {
  return fauna.query(settings)
}

export async function updateSettings(settings: SettingsCreation): Promise<void> {
  await fauna.query(updateItem(settingsRef, settings))
}

export async function votingOpen(): Promise<boolean> {
  return fauna.query(votingIsOpen)
}
