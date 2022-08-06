import * as React from 'react'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Switch } from 'wouter'
import MovieList from './pages/MovieList'
import Vote from './pages/Vote'
import Login from './pages/Login'
import { UserInfoProvider } from './components/UserInfoContext'
import { createTheme, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import api from './components/api'
import PageLoading from './components/PageLoading'
import { Results } from './pages/Results'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#710193',
    },
  },
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
          <main>
            <Switch>
              <Route path="/">{<MainContent/>}</Route>
              <Route path="/login"><Login/></Route>
              <Route><strong>404</strong></Route>
            </Switch>
          </main>
        </UserInfoProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

function MainContent() {
  const [votingOpen, setVotingOpen] = useState()
  const [resultsIn, setResultsIn] = useState()

  useEffect(() => {
    api.get('/vote/open').then(({data}) => setVotingOpen(data))
  }, [setVotingOpen])

  useEffect(() => {
    api.get('/vote/resultsIn').then(({data}) => setResultsIn(data))
  }, [setResultsIn])

  if (votingOpen === undefined || resultsIn === undefined) {
    return <PageLoading/>
  }

  if (resultsIn) {
    return <Results/>
  } else if (votingOpen) {
    return <Vote/>
  } else {
    return <MovieList/>
  }
}

createRoot(document.getElementById('root')).render(<App/>)