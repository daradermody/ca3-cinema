import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import PageLoading from '../src/components/PageLoading'

console.log(ReactDOMServer.renderToString(<PageLoading/>))
