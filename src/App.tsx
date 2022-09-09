import * as React from 'react'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Switch } from 'wouter'
import MovieList from './pages/MovieList'
import Vote from './pages/Vote'
import Login from './pages/Login'
import { UserInfoProvider } from './components/UserInfoContext'
import { Box, createTheme, ThemeProvider, Typography } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import api from './components/api'
import PageLoading from './components/PageLoading'
import { Results } from './pages/Results'
import ThanksForVoting from './pages/ThanksForVoting'
import Admin from './pages/Admin'
import JoiningInstructions from './pages/JoiningInstructions'
import Logo from './components/Logo'
import { VoteEvent } from '../types/data'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {default: '#ededed'},
    primary: {main: '#710193'},
    action: {selected: '#7101931f'}
  },
  typography: {
    fontFamily: '"Lato", "Roboto", sans-serif',
    h4: {fontSize: '1.7rem'},
    h5: {fontSize: '1.3rem'},
    h6: {fontSize: '1.1rem'}
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
              <Route path="/joiningInstructions"><JoiningInstructions/></Route>
              <Route path="/secretAdminPage"><Admin/></Route>
              <Route><strong>404</strong></Route>
            </Switch>
          </main>
        </UserInfoProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

function MainContent() {
  const [downForMaintenance, setDownForMaintenance] = useState<boolean>()
  const [activeEvent, setActiveEvent] = useState<VoteEvent>()
  const [voted, setVoted] = useState<boolean>()

  useEffect(() => {
    api.get<boolean>('/maintenance').then(({data}) => setDownForMaintenance(data))
  }, [setDownForMaintenance])

  useEffect(() => {
    api.get<VoteEvent>('/vote').then(({data}) => setActiveEvent(data))
  }, [setActiveEvent])

  useEffect(() => {
    api.get('/vote/voted').then(({data}) => setVoted(data))
  }, [setVoted])

  if (downForMaintenance) {
    return <DownForMaintenance/>
  }

  if (downForMaintenance === undefined || voted === undefined || activeEvent === undefined) {
    return <PageLoading/>
  }

  if (!activeEvent) {
    return <MovieList/>
  } else if (activeEvent.winner) {
    return <Results winnerId={activeEvent.winner.id} showingTime={activeEvent.showingTime} downloadLink={activeEvent.downloadLink}/>
  } else if (voted) {
    return <ThanksForVoting/>
  } else {
    return <Vote options={activeEvent.votingOptions} isRunoff={!!activeEvent.runoffOf} onVote={() => setVoted(true)}/>
  }
}

function DownForMaintenance() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Logo height="300px"/>
      <Typography variant="h1" sx={{mt: 4, mb: 10, textAlign: 'center'}}>Down for maintenance!</Typography>
    </Box>
  )
}

createRoot(document.getElementById('root')).render(<App/>)
