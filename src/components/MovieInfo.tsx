import { SuggestedMovie } from '../../types/data'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { useIsAdmin } from './UserInfoContext'
import DeleteIcon from '@mui/icons-material/Delete'
import styled from '@emotion/styled'
import api, { extractMessage } from './api'
import LoadingButton from '@mui/lab/LoadingButton'
import { useSnackbar } from 'notistack'
import { getPoster } from './getPoster'
import { Box, Typography } from '@mui/material'

export function MovieInfo({movie, onDelete}: { movie: SuggestedMovie; onDelete?: () => void }) {
  const isAdmin = useIsAdmin()
  const [deleting, setDeleting] = useState(false)
  const {enqueueSnackbar} = useSnackbar()

  const removeSelectedMovie = useCallback(async () => {
    setDeleting(true)
    try {
      await api.delete(`/movies/${movie.id}`)
      await onDelete()
    } catch (e) {
      enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
    }
    setDeleting(false)
  }, [onDelete, setDeleting])

  return (
    <StyledMovieInfo>
      <StyledPoster src={getPoster(movie.poster)} alt={`${movie.title} poster`}/>
      <Box sx={{overflowX: 'hidden'}}>
        <Typography variant="h5">{movie.title}</Typography>
        {movie.year && <Typography variant="subtitle1" color="text.secondary">({movie.year})</Typography>}
        <Box sx={{mt: 1}}>{movie.overview}</Box>
        <UserDescription username={movie.suggester} description={movie.userDescription}/>
        <StyledActions show={isAdmin}>
          {onDelete && (
            <LoadingButton aria-label="delete" onClick={removeSelectedMovie} color="error" variant="contained" loading={deleting}>
              <DeleteIcon/>
            </LoadingButton>
          )}
        </StyledActions>
      </Box>
    </StyledMovieInfo>
  )
}

function UserDescription({username, description}: { username: any; description?: string }) {
  if (description) {
    return (
      <StyledQuote>
        <legend>
          <Typography variant="subtitle1" color="text.secondary">Suggested by {username}</Typography>
        </legend>
        <Typography variant="h6" sx={{lineHeight:'1.5rem'}}>
          <i>{description}</i>
        </Typography>
      </StyledQuote>
    )
  } else {
    return <div style={{marginTop: '10px', fontStyle: 'italic'}}>Suggested by {username}</div>
  }
}

const StyledMovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
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

const StyledActions = styled.div<{ show: boolean }>`
  display: ${({show}) => show ? 'flex' : 'none'};
  margin-top: 20px;
  gap: 10px;
`

const StyledQuote = styled.fieldset`
  background-color: transparent;
  border: 1px solid dimgrey;
  margin: 1em 0;
  border-radius: 5px;
`
