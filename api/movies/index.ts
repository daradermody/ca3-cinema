import { fauna } from '../_otherstff/fauna/client'
import getToken from '../_otherstff/getToken'
import axios from 'axios'
import { getUser, withAuth } from '../_otherstff/authentication'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { ApiError } from 'next/dist/server/api-utils'
import { getMovies } from '../_otherstff/movies'
import { SuggestedMovieCreation } from '../../types/data'
import { createItem, Movies } from '../_otherstff/fauna/queries'

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'GET') {
    response.json(await getMovies())
  } else if (request.method === 'POST') {
    await addMovie(request.body.tmdbId, request.body.userDescription, getUser(request).username)
    response.status(201).end()
  }
}


async function addMovie(tmdbId: number, userDescription: string, username: string) {
  if (isNaN(tmdbId)) {
    throw new ApiError(400, 'Invalid movie ID')
  }

  const [movies, tmdbResponse] = await Promise.all([
    getMovies(),
    axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${getToken('TMDB_TOKEN')}`)
  ])

  if (movies.find(m => m.tmdbId === tmdbId)) {
    throw new ApiError(409, 'Movie already added')
  }

  const movie: SuggestedMovieCreation = {
    tmdbId: tmdbResponse.data.id,
    title: tmdbResponse.data.title,
    overview: tmdbResponse.data.overview,
    poster: tmdbResponse.data.poster_path,
    year: Number(tmdbResponse.data.release_date?.split('-')?.[0]) || undefined,
    suggester: username,
    userDescription
  }

  await fauna.query(createItem(Movies, movie))
}

export default withAuth(withErrorHandling(handler))
