import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Movie } from '../../types/data'
import api, { extractMessage } from './api'
import styled from '@emotion/styled'
import { throttle } from 'throttle-debounce'
import { SuggestionSubmissionForm } from './SuggestionSubmissionForm'
import { useSnackbar } from 'notistack'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { getPoster } from './getPoster'
import Modal from './Modal'


export function AddSuggestion({onAdd, addedMovies}: { onAdd: () => void, addedMovies: Movie[] }) {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie>(null)
  const [open, setOpen] = useState(false)
  const {enqueueSnackbar} = useSnackbar()

  const searchForMovies = useCallback(throttle(1000, async (query) => {
    try {
      setLoading(true)
      const {data} = await api.get<Movie[]>(`/movies/search/${query}`)
      setOptions(data)
    } catch (e) {
      console.error(e)
      enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
    } finally {
      setLoading(false)
    }
  }), [setLoading, setOptions])

  const reset = useCallback(() => {
    setQuery('')
    setSelectedMovie(null)
    setOptions([])
  }, [setQuery, setSelectedMovie, setOptions])

  const handleSubmission = useCallback(() => {
    reset()
    onAdd()
  }, [onAdd, reset])

  useEffect(() => {
    if (query.length >= 3) {
      searchForMovies(query)
    }
  }, [query])

  return (
    <>
      <Autocomplete
        id="asynchronous-demo"
        clearOnBlur={false}
        sx={{
          width: 500,
          maxWidth: '100%',
          backgroundColor: 'white',
        }}
        ListboxProps={{style: {maxHeight: 'calc(100vh - 250px)'}}}
        open={open && !!query && !!options.length && !selectedMovie}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        getOptionDisabled={(option) => loading || !!addedMovies.find(movie => movie.tmdbId === option.tmdbId)}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option: Movie) => option.title}
        filterOptions={(x) => x}
        options={options}
        value={selectedMovie}
        onChange={(option, movie: Movie) => setSelectedMovie(movie)}
        onInputChange={(e, value) => setQuery(value)}
        inputValue={query}
        loading={loading}
        renderOption={(props, option) => (
          <li {...props} key={option.tmdbId} style={{padding: 0}}>
            <MovieSearchResult movie={option}/>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20}/> : null}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <Modal open={!!selectedMovie} onClose={reset}>
        <SuggestionSubmissionForm movie={selectedMovie} onComplete={handleSubmission}/>
      </Modal>
    </>
  )
}

function MovieSearchResult({movie, onClick}: { movie: Movie, onClick?: () => void }) {
  return (
    <StyledMovieSearchResult
      key={movie.tmdbId}
      onClick={onClick}
    >
      <img
        src={getPoster(movie.poster)}
        alt={`${movie.title} poster`}
        style={{minHeight: '100px', width: '70px'}}
      />
      <StyledMovieDescription>
        <h3 style={{margin: '5px 0'}}>
          {movie.title}
          {movie.year && <span style={{color: 'grey', marginLeft: '5px'}}>({movie.year})</span>}
        </h3>
        <i>{movie.overview}</i>
      </StyledMovieDescription>
    </StyledMovieSearchResult>
  )
}

const StyledMovieSearchResult = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid lightgrey;
  user-select: none;
  cursor: pointer;
  color: black;
  width: 100%;

  &:hover {
    background-color: ${({theme}) => theme.palette.action.hover};
  }
`

const StyledMovieDescription = styled.div`
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  margin: 0 10px;
`