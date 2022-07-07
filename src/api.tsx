import faunadb from 'https://esm.sh/faunadb'
import { Movie, SuggestedMovie } from './types.ts'
const q = faunadb.query
const client = new faunadb.Client({
  secret: getToken('FAUNADB_SECRET'),
  domain: 'db.eu.fauna.com',
  port: 443,
  scheme: 'https',
})

export default async function handleApiQuery(req: Request) {
  try {
    return new Response(JSON.stringify(await routeQuery(req)), {headers: {'Content-Type': 'application/json'}})
  } catch (e) {
    const body = e instanceof ApiError ? { status: e.status, message: e.message } : { status: 500, message: 'Internal server error' }
    console.error(e)
    return new Response(JSON.stringify(body), {status: body.status, headers: {'Content-Type': 'application/json'}})
  }
}

function routeQuery(req: Request): unknown {
  const {pathname} = new URL(req.url)
  if (req.method === 'GET' && pathname === '/api/movies') {
    return getMovies()
  } if (req.method === 'GET' && pathname.startsWith('/api/movies/search/')) {
    const query = pathname?.match(/\/api\/movies\/search\/(.*)/)?.[1]
    return query ? searchMovies(query) : undefined
  } if (req.method === 'POST' && pathname.startsWith('/api/movies/')) {
    const tmdbId = pathname?.match(/\/api\/movies\/(\w*)/)?.[1]
    return tmdbId ? addMovie(Number(tmdbId)) : undefined
  } if (req.method === 'DELETE' && pathname.startsWith('/api/movies/')) {
    const id = pathname?.match(/\/api\/movies\/(\w*)/)?.[1]
    return id ? removeMovie(id) : undefined
  } else {
    throw new ApiError('Not found', 404)
  }
}

async function getMovies(): Promise<SuggestedMovie[]> {
  const results = await client.query(
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
      suggester: Number(item.data.suggester?.value?.id)
    }))
}

async function searchMovies(query: string): Promise<Movie[]> {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${getToken('TMDB_TOKEN')}`)
  return (await response.json()).results
    .slice(0, 5)
    .map(movie => ({
      tmdb_id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path,
    }))
}

async function addMovie(tmdbId: number) {
  if (isNaN(tmdbId)) {
    throw new ApiError('Invalid movie ID', 400)
  }
  const movies = await getMovies()
  if (movies.find(m => m.tmdb_id === tmdbId)) {
    throw new ApiError('Movie already added', 409)
  }
  const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${getToken('TMDB_TOKEN')}`)
  const movie = await response.json()
  await client.query(
    q.Create(
      q.Collection('Movies'),
      {
        data: {
          tmdb_id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster: movie.poster_path,
        }
      }
    )
  )
}

async function removeMovie(id: string) {
  await client.query(
    q.Delete(q.Ref(q.Collection('Movies'), id))
  )
}

class ApiError extends Error {
  public status: number

  constructor(msg: string, status: number) {
    super(msg)
    this.status = status
  }
}

function getToken(envName: string): string {
  const secret = Deno.env.get(envName)
  if (!secret) {
    throw new Error(`The ${envName} environment variable is not set, exiting.`)
  }
  return secret
}