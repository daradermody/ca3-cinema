import axios from 'axios'
import getToken from '../../_otherstff/getToken'
import { withAuth } from '../../_otherstff/authentication'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { withErrorHandling } from '../../_otherstff/errorHandling'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const result = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${request.query.query}&api_key=${getToken('TMDB_TOKEN')}`)
  const movies = result.data.results
    .slice(0, 5)
    .map((movie: any) => ({
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path,
      year: Number(movie.release_date?.split('-')?.[0]) || null
    }))

  response.json(movies)
}

export default withAuth(withErrorHandling(handler))
