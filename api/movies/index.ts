import { fauna, q } from '../_otherstff/faunaClient'
import getToken from '../_otherstff/getToken'
import axios from 'axios'
import { getUser, withAuth } from '../_otherstff/authentication'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { withErrorHandling } from '../_otherstff/errorHandling'
import { ApiError } from 'next/dist/server/api-utils'
import { getMovies } from '../_otherstff/movies'

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
  const movies = await getMovies()
  if (movies.find(m => m.tmdbId === tmdbId)) {
    throw new ApiError(409, 'Movie already added')
  }
  const {data: movie} = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${getToken('TMDB_TOKEN')}`)
  await fauna.query(
    q.Create(
      q.Collection('Movies'),
      {
        data: {
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster: movie.poster_path,
          year: Number(movie.release_date?.split('-')?.[0]) || null,
          suggester: username,
          userDescription
        }
      }
    )
  )
}

export default withAuth(withErrorHandling(handler))
