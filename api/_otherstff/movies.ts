import { SuggestedMovie } from '../../types/data'
import { fauna, MapOf, q } from './faunaClient'

export async function getMovies(): Promise<SuggestedMovie[]> {
  const results = await fauna.query<MapOf<SuggestedMovie>>(
    q.Map(
      q.Paginate(
        q.Documents(
          q.Collection('Movies')
        )
      ),
      (ref) => q.Get(ref)
    )
  )
  return results.data
    .map(item => ({
      ...item.data,
      id: item.ref.value.id,
    }))
    .reverse()
}
