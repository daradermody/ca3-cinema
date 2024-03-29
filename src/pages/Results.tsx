import * as React from 'react'
import { useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import api from '../components/api'
import { SuggestedMovie, VotingResult } from '../../types/data'
import styled from '@emotion/styled'
import { MovieCard } from '../components/MovieCard'
import { Typography } from '@mui/material'
import { DateTime } from 'luxon'
import ExtLink from '../components/ExtLink'

interface ResultsProps {
  winnerId: SuggestedMovie['id']
  showingTime: string
  downloadLink: string
}

export function Results({winnerId, showingTime, downloadLink}: ResultsProps) {
  const [winner, setWinner] = useState<VotingResult>()
  const [losers, setLosers] = useState<VotingResult[]>()

  useEffect(() => {
    api.get<VotingResult[]>('/vote/results')
      .then(({data}) => {
        setWinner(data.find(m => m.id === winnerId))
        setLosers(data.filter(m => m.id !== winnerId))
      })
  }, [setLosers])

  if (losers === undefined) {
    return <PageWrapper>Loading...</PageWrapper>
  }

  return (
    <PageWrapper>
      <Typography variant="h4" sx={{mt: 4, mb: 2}}>Winner</Typography>
      <StyledResultList>
        <MovieCard key={winner.id} movie={winner} votes={winner.votes}/>
        <div>
          <Typography variant="h6">Details</Typography>
          <ul>
            <li>Showing: {DateTime.fromISO(showingTime).toFormat('t, ccc d LLL')}</li>
            <li>Download link: <ExtLink href={downloadLink}>torrent</ExtLink></li>
            <li>How to join: <ExtLink href="/joiningInstructions">SyncPlay instructions</ExtLink></li>
          </ul>
        </div>
      </StyledResultList>

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
  align-items: center;
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
