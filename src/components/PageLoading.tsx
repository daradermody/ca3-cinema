import * as React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

export default function PageLoading() {
  return (
    <StyledLoadingWrapper>
      <StyledSpinnerGrow/>
      <StyledSpinnerGrow delay={100}/>
      <StyledSpinnerGrow delay={200}/>
      <StyledSpinnerGrow delay={300}/>
      <StyledSpinnerGrow delay={400}/>
    </StyledLoadingWrapper>
  )
}

const StyledLoadingWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 130px);
  display: flex;
  justify-content: center;
  align-items: center;
`

const grow = keyframes`
  0% { transform: scale(0); }
  50% { opacity: 1; }
`

const StyledSpinnerGrow = styled.div<{ delay?: number }>`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  background-color: currentColor;
  border-radius: 50%;
  opacity: 0;
  animation: ${grow} .75s linear infinite;
  animation-delay: ${({ delay }) => delay || 0}ms;
`
