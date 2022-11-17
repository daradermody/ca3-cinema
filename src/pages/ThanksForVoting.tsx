import * as React from 'react'
import styled from '@emotion/styled'
import PageWrapper from '../components/PageWrapper'

export default function ThanksForVoting() {
  return (
    <PageWrapper>
      <StyledThanksWrapper>
        <h2>Thanks for voting!</h2>
        <h5>
          <a href="https://www.wikihow.com/Stop-an-Adult-Disposable-Diaper-Addiction" target="_blank">
            It's a serious problem
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
