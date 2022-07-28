import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Route, Switch } from 'wouter'
import MovieList from './pages/MovieList'
import Vote from './pages/Vote'
import Login from './pages/Login'
import { UserInfoProvider } from './components/UserInfoContext'
import { createTheme, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { useEffect, useState } from 'react'
import PageWrapper from './components/PageWrapper'
import api from './components/api'

const theme = createTheme({
  typography: {
    fontFamily: '"Lato", "Roboto", sans-serif;'
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
})


function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <UserInfoProvider>
          <HelmetProvider>
            <Helmet>
              <title>Caʒ Cinema</title>
            </Helmet>
            <main>
              <Switch>
                <Route path="/">{<VoteFormOrMovieList/>}</Route>
                <Route path="/login"><Login/></Route>
                <Route><strong>404</strong></Route>
              </Switch>
            </main>
          </HelmetProvider>
        </UserInfoProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

function VoteFormOrMovieList() {
  const [votingOpen, setVotingOpen] = useState()

  useEffect(() => {
    api.get('/vote/open').then(({data}) => setVotingOpen(data))
  }, [setVotingOpen])

  if (votingOpen === undefined) {
    return <PageWrapper>Loading...</PageWrapper>
  }

  return votingOpen ? <Vote/> : <MovieList/>
}

createRoot(document.getElementById('root')).render(<App/>)