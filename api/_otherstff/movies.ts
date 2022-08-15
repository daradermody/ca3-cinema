import { SuggestedMovie } from '../../types/data'
import { fauna, MapOf, q } from './faunaClient'
import { getSettings } from './voting'

export async function getMovies(): Promise<SuggestedMovie[]> {
  const [moviesResult, settings] = await Promise.all([
    fauna.query<MapOf<SuggestedMovie>>(
      q.Map(
        q.Paginate(
          q.Documents(
            q.Collection('Movies')
          )
        ),
        (ref) => q.Get(ref)
      )
    ),
    getSettings(),
  ])

  return moviesResult.data
    .map(item => ({
      ...item.data,
      id: item.ref.value.id,
    }))
    .filter(movie => !settings.runoffMovies.length || settings.runoffMovies.includes(movie.id))
    .reverse()
}
