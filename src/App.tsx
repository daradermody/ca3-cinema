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
import { VoteState } from '../types/data'
import ThanksForVoting from './pages/ThanksForVoting'
import Admin from './pages/Admin'
import JoiningInstructions from './pages/JoiningInstructions'

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
  const [voteState, setVoteState] = useState<VoteState>()
  const [voted, setVoted] = useState<boolean>()

  useEffect(() => {
    api.get<VoteState>('/vote').then(({data}) => setVoteState(data))
  }, [setVoteState])

  useEffect(() => {
    api.get('/vote/voted').then(({data}) => setVoted(data))
  }, [setVoted])

  if (voted === undefined || voteState === undefined) {
    return <PageLoading/>
  }

  if (voteState.resultsIn) {
    return <Results showingTime={voteState.showingTime} downloadLink={voteState.downloadLink}/>
  } else if (voted) {
    return <ThanksForVoting/>
  }
  if (voteState.votingOpen) {
    return <Vote isRunoff={voteState.isRunoff} onVote={() => setVoted(true)}/>
  } else {
    return <MovieList/>
  }
}

createRoot(document.getElementById('root')).render(<App/>)
