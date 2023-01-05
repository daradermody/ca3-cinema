import * as React from 'react'
import styled from '@emotion/styled'
import PageWrapper from '../components/PageWrapper'

export default function ThanksForVoting() {
  return (
    <PageWrapper>
      <StyledThanksWrapper>
        <h2>Thanks for voting!</h2>
        <h5>
          <a href="https://youtu.be/kMQ3jwqH_lU?t=86" target="_blank">
            DO YOU EVEN KNOW THESE GET UPDATED NOW!?
          </a>
        </h5>
      </StyledThanksWrapper>
    </PageWrapper>
  )
}

const StyledThanksWrapper = styled.div`
  font-size: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`
