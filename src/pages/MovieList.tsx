import * as React from 'react'
import styled from '@emotion/styled'
import PageWrapper from '../components/PageWrapper'
import { AddSuggestion } from '../components/AddSuggestion'
import { MovieCard } from '../components/MovieCard'
import { Typography } from '@mui/material'
import useGetMovies from '../components/useGetMovies'

export default function MovieList() {
  const {movies, refetch} = useGetMovies()

  return (
    <PageWrapper>
      <Typography variant="h4" sx={{mt: 4, mb: 2}}>Suggest a movie</Typography>
      <AddSuggestion onAdd={refetch} addedMovies={movies}/>

      <Typography variant="h4" sx={{mt: 4, mb: 2}}>Current suggestions</Typography>
      <StyledMovieListWrapper>
        {
          movies?.map(movie => <MovieCard key={movie.id} movie={movie} onDelete={refetch}/>)
          || <span>Loading movies...</span>
        }
      </StyledMovieListWrapper>
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
