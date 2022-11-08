import * as React from 'react';
import { useEffect, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import api from '../components/api';
import { SuggestedMovie, VoteEvent } from '../../types/data';
import PageLoading from '../components/PageLoading';
import { DateTime } from 'luxon';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { MovieCard } from '../components/MovieCard';

export default function PastEvents() {
  const [pastEvents, setPastEvents] = useState<VoteEvent[]>();

  useEffect(() => {
    api.get<VoteEvent[]>('/vote/past').then(({data}) => setPastEvents(data));
  }, [setPastEvents]);

  if (!pastEvents) {
    return <PageWrapper><PageLoading/></PageWrapper>;
  }

  return (
    <PageWrapper>
      <Box display="flex" flexDirection="column" width="fit-content">
        {pastEvents.map(event => <PastEvent key={event.id} time={event.showingTime} winner={event.winner}/>)}
      </Box>
    </PageWrapper>
  );
}

function PastEvent({time, winner}: { time: string, winner: SuggestedMovie }) {
  return (
    <Box display="flex" alignItems="center" gap="30px">
      <DateCircle time={time}/>
      <MovieCard movie={winner} disableMoreInfo/>
    </Box>
  );
}

function DateCircle({time}: { time: string }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <StyledLine/>
      <StyledDate>{DateTime.fromISO(time).toFormat('d LLL yyyy')}</StyledDate>
      <StyledLine/>
    </Box>
  );
}

const StyledLine = styled.div`
  border-left: 1px solid #BE1E2D;
  height: 30px;
`;

const StyledDate = styled.div`
  background-color: #BE1E2D;
  border-radius: 50%;
  height: 110px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;
