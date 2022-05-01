import { getAssetFromKV, NotFoundError, serveSinglePageApp } from '@cloudflare/kv-asset-handler'

addEventListener('fetch',  (event: FetchEvent) => {
  try {
    if (event.request.headers.get('accept').includes('application/json')) {
      event.respondWith(handleRequest(event.request))
    } else {
      event.respondWith(getAssetFromKV(event, {mapRequestToAsset: serveSinglePageApp}))
    }
  } catch (e) {
    console.error(e.message)
    return new Response(`${e}`, { status: e.status || 500 })
  }
})

async function handleRequest(request: Request): Promise<Response> {
  const data = await callAction(request.method, new URL(request.url).pathname, await getBody(request))
  return new Response(
    JSON.stringify(data),
    { headers: { 'content-type': 'application/json'} }
  )
}

async function callAction(method: string, pathname: string, data: object): Promise<any> {
  console.log('Running action:', method, pathname, data)
  if (method === 'GET' && pathname === '/movieList') {
    return await DATA.get<string[]>('movies', 'json') || []
  } else if (method === 'POST' && pathname === '/addMovie') {
    const movies = await DATA.get<string[]>('movies', 'json') || []
    const movie = (data as {name: string}).name
    if (!movie) {
      throw new BadRequest('No movie name provided')
    }
    movies.push(movie)
    await DATA.put('movies', JSON.stringify(movies))
  } else {
    throw new NotFoundError('Endpoint does not exist', 404)
  }
}



async function getBody<T>(thing: Request | Response): Promise<T | undefined> {
  const body = await thing.text()
  console.log('body', body)
  return body ? JSON.parse(body) as T : undefined

}

class BadRequest extends Error {
  static status = 401
}


declare global {
  export const DATA: KVNamespace
}