import { SuggestedMovie } from '../../types/data';
import { fauna } from './fauna/client';
import { unwatchedMovies } from './fauna/queries';

export async function getMovies(): Promise<SuggestedMovie[]> {
  return fauna.query(unwatchedMovies);
}
