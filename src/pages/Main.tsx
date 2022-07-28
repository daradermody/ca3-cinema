import * as React from 'react'
import { Link } from 'wouter'
import useColour from '../useColour'
import Logo from '../components/Logo'
import PageWrapper from '../components/PageWrapper'
import styled from '@emotion/styled'
import { useEffect } from 'react'

export default function Main() {
  const votingOpened = true

  return (
    <PageWrapper hideHeader>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <StyledLogo/>
      </div>

      <StyledCardList>
        <Card href="/movieList" summary="Movie list" description="See suggested movies and suggest your own!"/>
        <Card
          href="/vote"
          disabled={!votingOpened}
          summary="Vote"
          description={votingOpened ? 'Cast your vote for the next Caʒ Cinema showing!' : 'Voting is not open at the moment'}
        />
      </StyledCardList>
    </PageWrapper>
  )
}

interface CardProps {
  summary: string,
  description: string,
  href: string,
  disabled?: boolean
}

function Card({summary, description, href, disabled}: CardProps) {

  return (
    <StyledLink href={href} disabled={disabled}>
      <h1>{summary}</h1>
      <span>{description}</span>
    </StyledLink>
  )
}

const StyledLogo = styled(Logo)`
  text-align: center;
  height: 200px;
  margin: 20px 0;
  width: 500px;
  max-width: 100%;
  object-fit: contain;
 
  @media screen and (min-width: 900px) {
    height: 300px;
    margin: 50px 0;
  }
`

const StyledCardList = styled.div`
  display: grid;
  gap: 50px;
  margin-bottom: 50px;
  grid-template-columns: 1fr;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (min-width: 1536px) {
  }
`

const StyledLink = styled(Link)<{ disabled: boolean }>`
  border: 1px solid black;
  border-radius: 5px;
  color: ${({disabled}) => disabled ? 'grey' : 'black'};
  cursor: ${({disabled}) => disabled && 'not-allowed'};
  text-decoration: none;
  flex-grow: 1;
  padding: 20px 40px 40px;
  font-size: 1.4rem;
  background-color: var(--green1);

  &:hover {
    filter: brightness(1.1);
  };

  @media screen and (min-width: 900px) {
    min-height: 300px;
  }
`