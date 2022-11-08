import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { useIsAdmin } from '../components/UserInfoContext'
import { useLocation } from 'wouter'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import { SuggestedMovie, Vote, VoteEvent, VotingResult } from '../../types/data'
import api, { extractMessage } from '../components/api'
import PageLoading from '../components/PageLoading'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import { DateTime } from 'luxon'

export default function Admin() {
  const isAdmin = useIsAdmin()
  const [_, setLocation] = useLocation()
  const [activeVoteEvent, setActiveVoteEvent] = useState<VoteEvent | null>()
  const [votes, setVotes] = useState<Vote[]>()
  const [results, setResults] = useState<VotingResult[]>()

  useEffect(() => {
    api.get<VoteEvent>('/vote').then(({data}) => setActiveVoteEvent(data))
  }, [setActiveVoteEvent])

  useEffect(() => {
    api.get<Vote[]>('/vote/all').then(({data}) => setVotes(data))
  }, [setVotes])

  useEffect(() => {
    if (activeVoteEvent) {
      api.get<VotingResult[]>('/vote/results').then(({data}) => setResults(data))
    } else if (activeVoteEvent === null) {
      setResults([])
    }
  }, [activeVoteEvent, setVotes])

  useEffect(() => {
    if (!isAdmin) {
      setLocation(`/`)
    }
  })

  if (!votes || activeVoteEvent === undefined || !results) {
    return <PageWrapper><PageLoading/></PageWrapper>;
  }

  if (!activeVoteEvent) {
    return (
      <PageWrapper>
        <Typography variant="h4" sx={{mt: 4, mb: 2}}>Voting state</Typography>
        <div>No active vote event</div>
        <AdminActions voteEvent={activeVoteEvent} results={results}/>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Typography variant="h4" sx={{mt: 4, mb: 2}}>Vote info</Typography>
      <ul>
        <li>Voting event: {activeVoteEvent.name || <i>[none]</i>}</li>
        <li>Results in: {`${!!activeVoteEvent.winner}`}</li>
      </ul>

      <Typography variant="h6" sx={{mt: 4, mb: 2}}>Voters {!!activeVoteEvent.runoffOf && ' (in runoff)'}</Typography>
      <ul>
        {votes.map(vote => <li key={vote.voter}>{vote.voter} | {vote.movies.map(m => m.title).join(', ')}</li>)}
      </ul>

      <Typography variant="h6" sx={{mt: 4, mb: 2}}>Leaderboard {!!activeVoteEvent.runoffOf && ' (in runoff)'}</Typography>
      <ul>
        {results.map(movie => <li key={movie.id}>{movie.votes} | {movie.title}</li>)}
      </ul>

      <AdminActions voteEvent={activeVoteEvent} results={results}/>
    </PageWrapper>
  )
}

function AdminActions({voteEvent, results}: { voteEvent?: VoteEvent, results: VotingResult[] }) {
  const reload = useCallback(() => location.reload(), [])
  return (
    <>
      <Typography variant="h4" sx={{mt: 4, mb: 2}}>Actions</Typography>
      <Box display="flex" gap="10px">
        {!voteEvent && <StartVotingEvent onSubmit={reload}/>}
        {voteEvent && !voteEvent?.winner && <StopVoting results={results} isRunoff={!!voteEvent.runoffOf} onSubmit={reload}/>}
        {voteEvent && <FinishEvent onSubmit={reload} cancelled={!voteEvent.winner}/>}
      </Box>
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
  const highestVotes = results[0]?.votes || 0
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
      await api.post('/vote/close', {movieId: chosenWinner || winningMovies[0].id, downloadLink, showingTime})
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
            <FormControl sx={{ mb: 4 }}>
              <FormLabel>Winner</FormLabel>
              <RadioGroup defaultValue={winningMovies[0].id} value={chosenWinner} onChange={e => setChosenWinner(e.target.value)}>
                {winningMovies.map(movie => <FormControlLabel key={movie.id} value={movie.id} control={<Radio/>} label={movie.title}/>)}
              </RadioGroup>
            </FormControl>
          )}
          {winningMovies.length === 1 && <Typography variant="h6" sx={{mb: 2}}>Winner: {winningMovies[0].title}</Typography>}

          <TextField
            label="Showing time (UTC)"
            fullWidth
            value={showingTime}
            required
            onChange={e => setShowingTime(e.target.value)}
            variant="outlined"
            helperText={DateTime.fromISO(showingTime).toFormat('t, ccc d LLL')}
            sx={{mb: 1}}
          />
          <TextField fullWidth value={downloadLink} required onChange={e => setDownloadLink(e.target.value)} label="Download link" variant="outlined"/>
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

function FinishEvent({onSubmit, cancelled}: { onSubmit: () => void, cancelled?: boolean }) {
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
    <LoadingButton loading={loading} variant="contained" color={cancelled ? 'error' : 'primary'} onClick={finishEvent}>
      {cancelled ? 'Cancel event' : 'Finish event'}
    </LoadingButton>
  )
}
