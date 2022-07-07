import * as React from 'react'
import {useEffect} from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Route, Switch } from 'wouter'
import Main from './pages/Main'
import MovieList from './pages/MovieList'
import Vote from './pages/Vote'
import useColour from './useColour'

function App() {
  const [colour] = useColour()

  useEffect(() => {
    document.body.style['background-color'] = colour
  }, [])

  return (
    <HelmetProvider>
      <Helmet>
        <title>Caʒ Cinema</title>
      </Helmet>
      <main>
        <Switch>
          <Route path="/"><Main/></Route>
          <Route path="/movieList"><MovieList/></Route>
          <Route path="/vote"><Vote/></Route>
          <Route><strong>404</strong></Route>
        </Switch>
      </main>
    </HelmetProvider>
  )
}

createRoot(document.getElementById('root')).render(<App/>)