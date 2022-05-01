import { getAssetFromKV, NotFoundError, serveSinglePageApp } from '@cloudflare/kv-asset-handler'
// @ts-ignore
import manifest from '__STATIC_CONTENT_MANIFEST'
export { Database } from './database'

let globalEnv: Env;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    console.log('manifest', manifest)
    console.log('ctx', JSON.stringify(ctx, null, 2))
    try {
      if (request.headers.get('accept').includes('application/json')) {
        globalEnv = env
        return await handleRequest(request)
      } else {
        return await serveAsset(request, env, ctx)
      }
    } catch (e) {
      console.error(e.message)
      return new Response(`${e}`, { status: e.status || 500 })
    }
  },
}

function serveAsset(request: Request, env: Env, ctx: ExecutionContext) {
  console.log(request.url, serveSinglePageApp(request).url)
  const event = {
    request,
    waitUntil: (promise: Promise<any>) => ctx.waitUntil(promise),
  }
  console.log('global', JSON.stringify(Object.keys(global)))
  console.log('env.keys', JSON.stringify(Object.keys(env)))
  console.log('__STATIC_CONTENT', JSON.stringify(env.__STATIC_CONTENT, null, 2))
  const options = {
    // ASSET_MANIFEST: {},
    ASSET_NAMESPACE: env.__STATIC_CONTENT,
    // mapRequestToAsset: serveSinglePageApp,
  }
  return getAssetFromKV(event, options)
}

async function handleRequest(request: Request) {
  const data = await callAction(new URL(request.url).pathname, getBody(request))
  return new Response(
    JSON.stringify(data),
    { headers: { 'content-type': 'application/json'} }
  )
}

function callAction(pathname: string, data: object) {
  if (pathname === '/getVotes') {
    return getVotes()
  } else if (pathname === '/increment') {
    return callDb('increment')
  } else if (pathname === '/decrement') {
    return callDb('decrement')
  } else {
    throw new NotFoundError('Endpoint does not exist', 404)
  }
}


async function getVotes() {
  return callDb('getVotes')
}

async function callDb<D, R>(action: string, data?: D): Promise<R> {
  const id = globalEnv.DB.idFromName('A')
  const db = globalEnv.DB.get(id)
  const response = await db.fetch('https:///' + action, { body: JSON.stringify(data) })
  if (!response.ok) {
    throw new Error(await response.text())
  }
  return await getBody<R>(response)
}

async function getBody<T>(thing: Request | Response): Promise<T | undefined> {
  const body = await thing.text()
  return body ? JSON.parse(body) as T : undefined

}

interface Env {
  DB: DurableObjectNamespace,
  __STATIC_CONTENT: string,
}
