import * as React from 'react'
import { useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import api from '../components/api'
import { VotingResult } from '../../types/data'
import styled from '@emotion/styled'
import { MovieCard } from '../components/MovieCard'
import { Typography } from '@mui/material'

export function Results() {
  const [results, setResults] = useState<VotingResult[]>()

  useEffect(() => {
    api.get<VotingResult[]>('/vote/results').then(({data}) => setResults(data))
  }, [setResults])

  if (results === undefined) {
    return <PageWrapper>Loading...</PageWrapper>
  }

  const highestVotes = results[0].votes
  const winners = results.filter(movie => movie.votes === highestVotes)
  const losers = results.filter(movie => movie.votes !== highestVotes)

  return (
    <PageWrapper>
      <Typography variant="h4" sx={{mt: 4, mb: 2}}>
        Winner{winners.length > 1 && 's*'}
      </Typography>
      <StyledResultList>
        {winners.map(movie => (
          <MovieCard key={movie.id} movie={movie} votes={movie.votes}/>
        ))}
      </StyledResultList>
      {winners.length > 1 && (
        <Typography variant="subtitle1" color="text.secondary" sx={{mt: 2}}>
          * Since multiple movies have tied, they'll compete in a runoff (coming soon!)
        </Typography>
      )}

      <Typography variant="h4" sx={{mt: 8, mb: 2}}>Runners up</Typography>
      <StyledResultList>
        {losers.map(movie => (
          <MovieCard key={movie.id} movie={movie} votes={movie.votes}/>
        ))}
      </StyledResultList>
    </PageWrapper>
  )
}


const StyledResultList = styled.div`
  justify-content: center;
  display: grid;
  gap: 20px;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (min-width: 1536px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`
