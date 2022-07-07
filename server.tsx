import * as esbuild from 'https://deno.land/x/esbuild@v0.14.45/mod.js'
import { serve } from 'https://deno.land/std@0.142.0/http/server.ts'
import * as importMap from 'https://esm.sh/esbuild-plugin-import-map'
import handleApiQuery from './src/api.tsx'
import denoConfig from './deno.json' assert { type: "json" }

async function main() {
  if (Deno.env.get('DENO_ENV') !== 'production') {
    await build()
  }
  void serve(handler)
}

async function build() {
  importMap.load(denoConfig.importMap)
  await esbuild.build({
    entryPoints: ['./src/app.jsx'],
    bundle: true,
    format: 'esm',
    outfile: 'dist/bundle.js',
    plugins: [importMap.plugin()],
  })
  esbuild.stop()
}

async function handler(req: Request) {
  const url = new URL(req.url)
  if (url.pathname.startsWith('/api/')) {
    return handleApiQuery(req)
  } else if (req.method === 'GET' && (url.pathname === '/' || req.headers.get('accept').startsWith('text/html'))) {
    return new Response(html, {headers: {'Content-Type': 'text/html'}})
  } else if (req.method === 'GET' && url.pathname === '/dist/bundle.js') {
    return new Response(await Deno.readFile('dist/bundle.js'), {headers: {'Content-Type': 'text/javascript'}})
  } else if (req.method === 'GET' && url.pathname.startsWith('/assets')) {
    return new Response (await Deno.readFile('src' + url.pathname))
  } else {
    return new Response('Not found', {status: 404})
  }
}

const html = `
<html lang="en">
<head>
  <title>Caʒ Cinema</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Courgette&family=Lexend&family=Roboto&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      font-family: 'Roboto', sans-serif;
    }
    * {
      box-sizing: border-box;
    }
</style>
</head>
<body>
  <div id="root">Loading...</div>
  <script type="module" src="dist/bundle.js"></script>
</body>
</html>
`

main()