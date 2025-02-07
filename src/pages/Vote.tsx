import * as React from 'react'
import { useCallback, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { MovieCard } from '../components/MovieCard'
import styled from '@emotion/styled'
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import api, { extractMessage } from '../components/api'
import { SuggestedMovie, VoteEvent } from '../../types/data'
import { useSnackbar } from 'notistack'

interface VoteProps {
  options: VoteEvent['votingOptions']
  isRunoff: boolean
  onVote: () => void
}

export default function Vote({options, isRunoff, onVote}: VoteProps) {
  return isRunoff ? <SingleVote options={options} onSubmit={onVote}/> : <MultiVote options={options} onSubmit={onVote}/>
}

function SingleVote({options, onSubmit}: { options: VoteEvent['votingOptions'], onSubmit: () => void }) {
  const theme = useTheme()
  const mdDisplay = useMediaQuery(theme.breakpoints.up('md'))
  const {enqueueSnackbar} = useSnackbar()
  const [selectedMovie, setSelectedMovie] = useState<SuggestedMovie | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true)
      await api.post<null, null, { movieIds: SuggestedMovie['id'][] }>('/vote', {movieIds: [selectedMovie.id]})
      onSubmit()
    } catch (e) {
      setLoading(false)
      setSelectedMovie(null)
      enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
    }
  }, [setLoading, onSubmit, enqueueSnackbar, selectedMovie])

  const button = (
    <Button
      loading={loading}
      fullWidth={!mdDisplay}
      sx={{mt: mdDisplay ? 0 : 2}}
      size="large"
      onClick={handleSubmit}
      variant="contained"
      disabled={!selectedMovie}
    >
      Vote
    </Button>
  )

  return (
    <PageWrapper>
      <Typography variant="h1" sx={{mt: 4, mb: 10, textAlign: 'center'}}>Runoff Vote!</Typography>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2}}>
        <Typography variant="h4">You may only select <b>one</b></Typography>
        {mdDisplay && button}
      </Box>

      <StyledMovieListWrapper>
        {
          options.map(movie => (
            <MovieCard
              key={movie.id}
              checked={movie.id === selectedMovie?.id}
              movie={movie}
              onClick={() => selectedMovie?.id === movie.id ? setSelectedMovie(null) : setSelectedMovie(movie)}
            />
          ))
          || <span>Loading movies...</span>
        }
      </StyledMovieListWrapper>

      {!mdDisplay && button}
    </PageWrapper>
  )
}

function MultiVote({options, onSubmit}: { options: VoteEvent['votingOptions'], onSubmit: () => void }) {
  const theme = useTheme()
  const mdDisplay = useMediaQuery(theme.breakpoints.up('md'))
  const {enqueueSnackbar} = useSnackbar()
  const [selectedMovies, setSelectedMovies] = useState<SuggestedMovie['id'][]>([])
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(((id) => {
    setSelectedMovies(selectedMovies.includes(id) ? selectedMovies.filter(_id => _id !== id) : [...selectedMovies, id])
  }), [selectedMovies, setSelectedMovies])

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true)
      await api.post<null, null, { movieIds: SuggestedMovie['id'][] }>('/vote', {movieIds: selectedMovies})
      onSubmit()
    } catch (e) {
      setLoading(false)
      enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
    }
  }, [setLoading, onSubmit, enqueueSnackbar, selectedMovies])

  const button = (
    <Button
      loading={loading}
      fullWidth={!mdDisplay}
      sx={{mt: mdDisplay ? 0 : 2}}
      size="large"
      onClick={handleSubmit}
      variant="contained"
      disabled={!selectedMovies.length}
    >
      Vote ({selectedMovies.length})
    </Button>
  )

  return (
    <PageWrapper>
      <Typography variant="h1" sx={{mt: 4, mb: 10, textAlign: 'center'}}>Voting is open!</Typography>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2}}>
        <Typography variant="h4">Select all the movies you'd like to see</Typography>
        {mdDisplay && button}
      </Box>

      <StyledMovieListWrapper>
        {
          options.map(movie => <MovieCard checked={selectedMovies.includes(movie.id)} key={movie.id} movie={movie} onClick={() => handleClick(movie.id)}/>)
          || <span>Loading movies...</span>
        }
      </StyledMovieListWrapper>

      {!mdDisplay && button}
    </PageWrapper>
  )
}

const StyledMovieListWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (min-width: 1536px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`
