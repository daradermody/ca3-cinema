import * as React from 'react'
import PageWrapper from '../components/PageWrapper'
import { Typography } from '@mui/material'
import ExtLink from '../components/ExtLink'

export default function JoiningInstructions() {
  return (
    <PageWrapper>
      <Typography variant="h4" sx={{mt: 4, mb: 2}}>How to join</Typography>
      <ol>
        <li>Download <ExtLink href="https://syncplay.pl/">SyncPlay</ExtLink></li>
        <li>Download the movie from the link provided when the movie is decided</li>
        <li>
          Start SyncPlay and input these settings (copy and paste: Caʒ Cinema):
          <img
            style={{display: 'block', marginTop: '10px', maxWidth: '100%'}}
            src="assets/syncplayConfig.png" alt="Syncplay configuration"
          />
        </li>
      </ol>
    </PageWrapper>
  )
}
