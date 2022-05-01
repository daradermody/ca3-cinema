export class Database {
  state: DurableObjectState

  constructor(state: DurableObjectState) {
    this.state = state
  }

  async fetch(request: Request) {
    const {pathname} = new URL(request.url)

    if (pathname === ACTIONS.fetch) {
      const value = await this.state.storage?.get('data') || 0
      return new Response(JSON.stringify(value))
    } else if (pathname === ACTIONS.store) {
      await this.state.storage?.put('value', request.json())
    } else {
      return new Response(`Incorrect DB action: ${pathname}`, {status: 400})
    }
  }
}

export const ACTIONS = {
  fetch: '/fetch',
  store: '/store',
}
