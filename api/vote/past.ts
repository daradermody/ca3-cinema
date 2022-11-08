import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils';
import { withAuth } from '../_otherstff/authentication';
import { withErrorHandling } from '../_otherstff/errorHandling';
import { getAllEvents } from '../_otherstff/voting';

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const events = await getAllEvents()
  const concludedEvents = events
    .filter(event => !!event.winner)
    .map(event => ({
      id: event.id,
      name: event.name,
      votingOptions: event.votingOptions,
      showingTime: event.showingTime!,
      winner: event.winner!,
    }))
    .sort((a, b) => a?.showingTime > b.showingTime ? -1 : 1)

  response.json(concludedEvents)
}

export default withAuth(withErrorHandling(handler))
