import { Movie } from '../../types/data'
import useColour from '../useColour'
import * as React from 'react'
import { useCallback, useContext, useState } from 'react'
import { UserInfoContext } from './UserInfoContext'
import styled from '@emotion/styled'
import api, { extractMessage } from './api'
import { Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import { getPoster } from './getPoster'

export function SuggestionSubmissionForm({movie, onComplete}: { movie: Movie; onComplete: () => void }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const addMovie = useCallback(async () => {
    setLoading(true)
    try {
      await api.post('/movies', {tmdbId: movie.tmdbId, userDescription: reason})
      enqueueSnackbar('Movie added to the list', {variant: 'success', autoHideDuration: 3000})
      onComplete()
    } catch(e) {
      enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
      setLoading(false)
    }
  }, [onComplete, reason])

  return (
    <StyledDialog>
      <StyledPoster src={getPoster(movie.poster)}/>
      <div>
        <h1 style={{marginTop: 0}}>{movie.title}</h1>
        <div>{movie.overview}</div>
        <StyledForm>
          <h3>Let others know why you suggested it</h3>
          <TextField sx={{ width: '100%', border: '1px solid white' }} multiline rows={3} value={reason} onChange={(e) => setReason(e.target.value)}/>
          <LoadingButton variant="contained" onClick={addMovie} sx={{ marginTop: '10px' }} loading={loading}>Add suggestion</LoadingButton>
        </StyledForm>
      </div>
    </StyledDialog>
  )
}

const StyledDialog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
  @media screen and (min-width: 900px) {
    flex-direction: row;
    align-items: start;
  }
`

const StyledPoster = styled.img`
  max-height: 400px;
  object-fit: contain;
  min-width: 220px;
`

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 20px;
`
