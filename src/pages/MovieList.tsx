import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'https://esm.sh/react@18'
import styled from 'https://esm.sh/styled-components?deps=react@18'
import { Popover } from 'https://esm.sh/react-tiny-popover'
import { throttle } from 'https://esm.sh/throttle-debounce'
import DeleteIcon from 'https://esm.sh/@mui/icons-material/Delete'
import PageWrapper from '../components/PageWrapper.tsx'
import useColour from '../useColour.tsx'
import Modal from '../components/Modal.tsx'
import { Movie, SuggestedMovie } from '../types.ts'
import Button from '../components/Button.tsx'

export default function MovieList() {
  const [movies, setMovies] = useState<null | SuggestedMovie[]>(null)
  const [selectedMovie, setSelectedMovie] = useState<null | SuggestedMovie>(null)

  const getMovies = useCallback(async () => {
    const response = await fetch('/api/movies')
    setMovies(await response.json())
  }, [setMovies])

  const removeSelectedMovie = useCallback(async () => {
    await fetch(`/api/movies/${selectedMovie.id}`, {method: 'DELETE'})
    setSelectedMovie(null)
    getMovies()
  }, [selectedMovie, setSelectedMovie, getMovies])

  useEffect(() => {
    void getMovies()
  }, [getMovies])

  if (!movies) {
    return <div>Loading movies...</div>
  }

  return (
    <PageWrapper>
      <h1>Suggest a movie!</h1>
      <AddSuggestion onAdd={getMovies}/>

      <h1>Current suggestions</h1>
      <MovieListWrapper>
        {movies.map(movie => <MovieCard movie={movie} onClick={() => setSelectedMovie(movie)}/>)}
      </MovieListWrapper>

      {selectedMovie && (
        <Modal onClose={() => setSelectedMovie(null)}>
          <MovieInfo movie={selectedMovie} onDelete={removeSelectedMovie}/>
        </Modal>
      )}
    </PageWrapper>
  )
}

function MovieCard({movie, onClick}: { movie: SuggestedMovie, onClick: () => void }) {
  return (
    <StyledMovieCard key={movie.tmdb_id} onClick={onClick}>
      <img
        src={`https://www.themoviedb.org/t/p/w220_and_h330_face/${movie.poster}`}
        alt={`${movie.title} poster`}
        style={{
          minHeight: '150px',
          width: '100px',
          objectFit: 'cover'
        }}
      />
      <div style={{margin: '20px'}}>
        <h3>{movie.title}</h3>
        <StyledMovieDescription>{movie.overview}</StyledMovieDescription>
      </div>
    </StyledMovieCard>
  )
}

function AddSuggestion({onAdd}: { onAdd: () => void }) {
  const [query, setQuery] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [movies, setMovies] = useState<Movie[]>([])
  const searchInputRef = useRef<HTMLInputElement>()

  const searchForMovie = useCallback(throttle(400, async (value) => {
    const result = await fetch(`/api/movies/search/${value}`)
    setMovies(await result.json())
  }))

  const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.length >= 3) {
      setIsPopoverOpen(true)
      searchForMovie(value)
    } else {
      setIsPopoverOpen(false)
      setMovies([])
    }
  }, [])

  async function addMovie(movie: Movie) {
    await fetch(`/api/movies/${movie.tmdb_id}`, {method: 'POST'})
    setQuery('')
    setMovies([])
    setIsPopoverOpen(false)
    onAdd()
  }

  return (
    <div ref={searchInputRef}>
      <Popover
        isOpen={movies.length && isPopoverOpen}
        positions={['bottom', 'top']}
        onClickOutside={() => setIsPopoverOpen(false)} // handle click events outside of the popover/target here!
        containerStyle={{width: `${searchInputRef.current?.offsetWidth}px`}}
        content={
          <div style={{backgroundColor: 'white', border: '1px solid black', width: '100%'}}>
            {movies.map(movie => (
              <MovieSearchResult movie={movie} onClick={() => addMovie(movie)}/>
            ))}
          </div>
        }
      >
        <input
          style={{
            padding: '10px',
            marginBottom: '20px',
            width: '100%',
            borderRadius: '5px',
            border: '1px solid lightgrey'
          }}
          value={query}
          onChange={changeHandler}
          onFocus={() => setIsPopoverOpen(true)}
        />
      </Popover>
    </div>
  )
}

function MovieSearchResult({movie, onClick}: { movie: Movie, onClick: () => void }) {
  return (
    <StyledMovieSearchResult
      key={movie.tmdb_id}
      onClick={onClick}
    >
      <img
        src={`https://www.themoviedb.org/t/p/w220_and_h330_face/${movie.poster}`}
        alt={`${movie.title} poster`}
        style={{minHeight: '100px', width: '70px'}}
      />
      <div style={{margin: '20px'}}>
        <h3>{movie.title}</h3>
      </div>
    </StyledMovieSearchResult>
  )
}

function MovieInfo({movie, onDelete}: { movie: SuggestedMovie; onDelete: () => void }) {
  const [color] = useColour()
  return (
    <StyledMovieInfo bgColor={color}>
      <img
        src={`https://www.themoviedb.org/t/p/w220_and_h330_face/${movie.poster}`}
        alt={`${movie.title} poster`}
        style={{
          maxHeight: '400px',
          objectFit: 'contain',
          minWidth: '220px',
        }}
      />
      <div>
        <h1 style={{marginTop: 0}}>{movie.title}</h1>
        <div>{movie.overview}</div>
        <StyledActions>
          <Button style={{backgroundColor: '#bf7290'}} onClick={onDelete}>
            <DeleteIcon/>
          </Button>
        </StyledActions>
      </div>
    </StyledMovieInfo>
  )
}

const MovieListWrapper = styled.div`
  display: grid;
  gap: 10px;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (min-width: 1400px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const StyledMovieCard = styled.button`
  display: flex;
  border: 1px solid black;
  border-radius: 5px;
  height: 100%;
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  text-align: left;

  &:hover {
    background-color: lightgoldenrodyellow;
  }

  &:focus {
    background-color: lightgoldenrodyellow;
  }
`

const StyledMovieDescription = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const StyledMovieSearchResult = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid grey;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: lightgoldenrodyellow;
  }
`

const StyledMovieInfo = styled.div<{ bgColor: string }>`
  display: flex;
  padding: 20px;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
  background-color: ${({bgColor}) => bgColor};
  @media screen and (min-width: 900px) {
    padding: 50px 100px;
    flex-direction: row;
    align-items: start;
  }
`

const StyledActions = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 10px;
`
