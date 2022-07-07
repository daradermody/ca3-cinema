import Koa from 'koa'
import * as koaStatic from 'koa-static'
import * as history from 'koa2-history-api-fallback'

async function main() {
  const app = new Koa()
  app.use(history());
  app.use(koaStatic('build'))
  app.use(async ctx => {
    ctx.body = 'Hello World'
  })

  app.listen(8000)
  console.log('Serving at http://localhost:8000')
}

void main()