import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import Logo from '../components/Logo'
import PageWrapper from '../components/PageWrapper'
import { MovieCard } from '../components/MovieCard'
import styled from '@emotion/styled'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import useGetMovies from '../components/useGetMovies'
import api, { extractMessage } from '../components/api'
import { SuggestedMovie } from '../../types/data'
import { useSnackbar } from 'notistack'
import { LoadingButton } from '@mui/lab'

export default function Vote() {
  const [voted, setVoted] = useState<boolean>()

  useEffect(() => {
    api.get('/vote/voted').then(({data}) => setVoted(data))
  }, [setVoted])

  if (voted === undefined) {
    return <PageWrapper>Loading...</PageWrapper>
  }

  return voted ? <ThanksForVoting/> : <VotingForm onSubmit={() => setVoted(true)}/>
}

function VotingForm({onSubmit}: { onSubmit: () => void }) {
  const theme = useTheme()
  const mdDisplay = useMediaQuery(theme.breakpoints.up('md'))
  const {enqueueSnackbar} = useSnackbar()
  const {movies} = useGetMovies()
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
    <LoadingButton
      loading={loading}
      fullWidth={!mdDisplay}
      sx={{mt: mdDisplay ? 0 : 2}}
      size="large"
      onClick={handleSubmit}
      variant="contained"
      disabled={!selectedMovies.length}
    >
      Vote ({selectedMovies.length})
    </LoadingButton>
  )

  return (
    <PageWrapper>
      <Typography variant="h1" sx={{mt: 4, mb: 10, textAlign: 'center'}}>Voting is open</Typography>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2}}>
        <Typography variant="h4">Select all the movies you'd like to see</Typography>
        {mdDisplay && button}
      </Box>

      <StyledMovieListWrapper>
        {
          movies?.map(movie => <MovieCard checked={selectedMovies.includes(movie.id)} key={movie.id} movie={movie} onClick={() => handleClick(movie.id)}/>)
          || <span>Loading movies...</span>
        }
      </StyledMovieListWrapper>

      {!mdDisplay && button}
    </PageWrapper>
  )
}

function ThanksForVoting() {
  return (
    <StyledThanksWrapper>
      <h2>Thanks for voting!</h2>
      <h5><a href="https://www.youtube.com/watch?v=aRsWk4JZa5k">Have an egg</a></h5>
      <StyledLogo/>
    </StyledThanksWrapper>
  )
}

const StyledMovieListWrapper = styled.div`
  display: grid;
  gap: 20px;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (min-width: 1536px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const StyledThanksWrapper = styled.div`
  font-size: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const StyledLogo = styled(Logo)`
  position: absolute;
  right: 0;
  bottom: 0;
  height: 200px;
  filter: opacity(0.2);
`