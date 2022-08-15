import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { useIsAdmin } from '../components/UserInfoContext'
import { useLocation } from 'wouter'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { AdminVoteState, isRunoffVote, RunoffVote, SuggestedMovie, Vote, VotingResult } from '../../types/data'
import api, { extractMessage } from '../components/api'
import PageLoading from '../components/PageLoading'
import useGetMovies from '../components/useGetMovies'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import { DateTime } from 'luxon'

export default function Admin() {
  const isAdmin = useIsAdmin()
  const [_, setLocation] = useLocation()
  const {movies} = useGetMovies()
  const [voteState, setVoteState] = useState<AdminVoteState>()
  const [votes, setVotes] = useState<(Vote | RunoffVote)[]>()
  const [results, setResults] = useState<VotingResult[]>()

  useEffect(() => {
    api.get<AdminVoteState>('/vote').then(({data}) => setVoteState(data))
  }, [setVoteState])

  useEffect(() => {
    api.get<(Vote | RunoffVote)[]>('/vote/all').then(({data}) => setVotes(data))
  }, [setVotes])

  useEffect(() => {
    api.get<VotingResult[]>('/vote/results').then(({data}) => setResults(data))
  }, [setVotes])

  useEffect(() => {
    if (!isAdmin) {
      setLocation(`/`)
    }
  })

  const getMovieTitle = useCallback(id => movies.find(m => m.id === id).title, [movies])

  if (!movies || !votes || !voteState || !results) {
    return <PageLoading/>
  }

  return (
    <PageWrapper>
      <Typography variant="h4" sx={{mt: 4, mb: 2}}>Voting state</Typography>
      <ul>
        <li>Voting event: {voteState.votingEvent || <i>[none]</i>}</li>
        <li>Results in: {`${voteState.resultsIn}`}</li>
        <li>Runoff movies: {voteState.runoffMovies.map(getMovieTitle).join(', ') || <i>[none]</i>}</li>
      </ul>

      <Typography variant="h6" sx={{mt: 4, mb: 2}}>Voters {!!voteState.runoffMovies.length && ' (in runoff)'}</Typography>
      <ul>
        {votes.map(vote => {
          const movies = isRunoffVote(vote) ? [vote.movie] : vote.movies
          return <li key={vote.voter}>{vote.voter} | {movies.map(getMovieTitle).join(', ')}</li>
        })}
      </ul>

      <Typography variant="h6" sx={{mt: 4, mb: 2}}>Leaderboard {!!voteState.runoffMovies.length && ' (in runoff)'}</Typography>
      <ul>
        {results.map(movie => <li key={movie.id}>{movie.votes} | {movie.title}</li>)}
      </ul>

      <AdminActions voteState={voteState} results={results}/>
    </PageWrapper>
  )
}

function AdminActions({voteState, results}: { voteState: AdminVoteState, results: VotingResult[] }) {
  const reload = useCallback(() => location.reload(), [])
  return (
    <>
      <Typography variant="h4" sx={{mt: 4, mb: 2}}>Actions</Typography>
      {!voteState.votingEvent && <StartVotingEvent onSubmit={reload}/>}
      {voteState.votingEvent && !voteState.resultsIn && <StopVoting results={results} isRunoff={!!voteState.runoffMovies.length} onSubmit={reload}/>}
      {voteState.votingEvent && voteState.resultsIn && <FinishEvent onSubmit={reload}/>}
    </>
  )
}

function StartVotingEvent({onSubmit}: { onSubmit: () => void }) {
  const [voteEventModalOpen, setVoteEventModalOpen] = useState(false)
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(false)
  const {enqueueSnackbar,} = useSnackbar()

  async function startVotingEvent() {
    try {
      setLoading(true)
      await api.post('/vote/start', {name: eventName})
      setVoteEventModalOpen(false)
      onSubmit()
    } catch (e) {
      enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setVoteEventModalOpen(false)
    setEventName('')
  }

  return (
    <>
      <Button variant="contained" onClick={() => setVoteEventModalOpen(true)}>
        Start voting event
      </Button>

      <Dialog open={voteEventModalOpen} onClose={close}>
        <DialogTitle>Start voting event</DialogTitle>
        <DialogContent dividers>
          <TextField required value={eventName} onChange={e => setEventName(e.target.value)} label="Name of event" variant="outlined"/>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={close}>Cancel</Button>
          <LoadingButton variant="contained" disabled={!eventName} loading={loading} onClick={startVotingEvent}>Start</LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

function StopVoting({results, isRunoff, onSubmit}: { results: VotingResult[], isRunoff: boolean, onSubmit: () => void }) {
  const {enqueueSnackbar} = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const highestVotes = results[0].votes
  const winningMovies = results.filter(movie => movie.votes === highestVotes)
  const isDraw = winningMovies.length > 1
  const nextSaturday = DateTime.now().endOf('week').minus({days: 1}).set({hour: 22}).startOf('hour').toUTC().toISO()
  const [showingTime, setShowingTime] = useState(nextSaturday)
  const [downloadLink, setDownloadLink] = useState('')
  const [chosenWinner, setChosenWinner] = useState<SuggestedMovie['id']>(null)

  async function handleClick() {
    if (!isRunoff && isDraw) {
      try {
        setLoading(true)
        await api.post('/vote/startRunoff')
        onSubmit()
      } catch (e) {
        enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
      } finally {
        setLoading(false)
      }
    } else {
      setShowWinnerModal(true)
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true)
      await api.post('/vote/close', {movieId: chosenWinner, downloadLink, showingTime})
      onSubmit()
    } catch (e) {
      enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
    } finally {
      setLoading(false)
    }
  }

  let buttonText = 'Close voting'
  if (isDraw) {
    buttonText = isRunoff ? 'Choose winner' : 'Start runoff'
  }

  return (
    <>
      <LoadingButton loading={loading} variant="contained" onClick={handleClick}>
        {buttonText}
      </LoadingButton>

      <Dialog open={showWinnerModal} onClose={() => setShowWinnerModal(false)}>
        <DialogTitle>Confirm winner</DialogTitle>
        <DialogContent dividers>
          {winningMovies.length > 1 && (
            <ul>
              {winningMovies.map(movie => (
                <li key={movie.id} onClick={() => setChosenWinner(movie.id)} style={{ cursor: 'pointer', fontWeight: chosenWinner === movie.id ? 'bold' : 'normal'}}>
                  {movie.title} {chosenWinner === movie.id && '☑'}
                </li>
              ))}
            </ul>
          )}
          {winningMovies.length === 1 && <div>Winner: {winningMovies[0].title}</div>}

          <TextField
            label="Showing time (UTC)"
            fullWidth
            value={showingTime}
            required
            onChange={e => setShowingTime(e.target.value)}
            variant="outlined"
            helperText={DateTime.fromISO(showingTime).toFormat('t, ccc d LLL')}
          />
          <TextField sx={{mt: 1}} fullWidth value={downloadLink} required onChange={e => setDownloadLink(e.target.value)} label="Download link" variant="outlined"/>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setShowWinnerModal(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            disabled={!DateTime.fromISO(showingTime).isValid || !downloadLink || (winningMovies.length > 1 && !chosenWinner)}
            loading={loading}
            onClick={handleSubmit}
          >
            End voting
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

function FinishEvent({onSubmit}: { onSubmit: () => void }) {
  const {enqueueSnackbar} = useSnackbar()
  const [loading, setLoading] = useState(false)

  async function finishEvent() {
    try {
      setLoading(true)
      await api.delete('/vote')
      onSubmit()
    } catch (e) {
      enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton loading={loading} variant="contained" onClick={finishEvent}>
      Finish event
    </LoadingButton>
  )
}
