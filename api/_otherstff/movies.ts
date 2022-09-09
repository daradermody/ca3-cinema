import { SuggestedMovie } from '../../types/data'
import { fauna } from './fauna/client'
import { collectionItems, Movies } from './fauna/queries'

export async function getMovies(): Promise<SuggestedMovie[]> {
  return fauna.query(collectionItems(Movies))
}
