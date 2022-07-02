/** @jsx React.createElement */
import React, { useState } from 'react'
import { SWRConfig } from 'swr'
import { Helmet } from 'react-helmet'
import { Route, Switch } from 'wouter'
import ultraCache from 'ultra/cache'
import { Cache } from 'https://deno.land/x/ultra/src/types.ts'

const options = (cache: Cache) => ({
  provider: () => ultraCache(cache),
  suspense: true,
})

const Ultra = ({cache}: { cache: Cache }) => {
  const [count, setCount] = useState(0)
  return (
    <SWRConfig value={options(cache)}>
      <Helmet>
        <title>Ultra</title>
      </Helmet>
      <main>
        <Switch>
          <Route path="/">
            <button onClick={() => setCount(count + 1)}>Click</button>{count}
          </Route>
          <Route>
            <strong>404</strong>
          </Route>
        </Switch>
      </main>
    </SWRConfig>
  )
}

export default Ultra
