import React, {useEffect} from 'https://esm.sh/react@18'
import { render } from 'https://esm.sh/react-dom@18'
import { Helmet, HelmetProvider } from 'https://esm.sh/react-helmet-async?deps=react@18'
import { Route, Switch } from 'https://esm.sh/wouter?deps=react@18'
import Main from './pages/Main.tsx'
import MovieList from './pages/MovieList.tsx'
import Vote from './pages/Vote.tsx'
import useColour from './useColour.tsx'

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

render(<App/>, document.getElementById('root'))