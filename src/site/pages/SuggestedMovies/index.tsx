import * as React from 'react'
import { listMovies } from '../../../graphql/queries'
import { ListMoviesQuery } from '../../../API'
import useQuery from '../../utils/useQuery'
import MovieList from './MovieList'
import MovieInput from './MovieInput'
import { Container } from '@mui/material'
// @ts-ignore
import * as Please from 'pleasejs'

const color = Please.make_color()

export default function SuggestedMovies() {
  const {data, loading, error, refetch} = useQuery<ListMoviesQuery>(listMovies)

  if (!data || loading) {
    return <div>Loading!</div>
  }

  if (error) {
    return <div>Something went wrong :(</div>
  }

  return (
    <div style={{ backgroundColor: color, minHeight: '100vh' }}>
      <Container>
        <MovieList movies={data?.listMovies?.items}/>
        <MovieInput onAdd={refetch}/>
      </Container>
    </div>
  )
}


