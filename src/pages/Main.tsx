import React from 'https://esm.sh/react@18'
import { Link } from 'https://esm.sh/wouter?deps=react@18'
import useColour from '../useColour.tsx'
import Logo from '../components/logo.tsx'
import PageWrapper from '../components/PageWrapper.tsx'
import styled from 'https://esm.sh/styled-components?deps=react@18'

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
  const [colour, refreshColour] = useColour()

  return (
    <StyledLink
      href={href}
      disabled={disabled}
      bgColor={colour}
      onMouseLeave={refreshColour}
    >
      <h1>{summary}</h1>
      <span>{description}</span>
    </StyledLink>
  )
}

const StyledLogo = styled(Logo)`
  text-align: center;
  height: 300px;
  margin: 50px 0;
  width: 500px;
  max-width: 100%;
  object-fit: contain;
`

const StyledCardList = styled.div`
  display: grid;
  gap: 50px;
  margin-bottom: 50px;
  grid-template-columns: 1fr;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (min-width: 1400px) {
  }
`

const StyledLink = styled<{ disabled: boolean; bgColor: string }>(Link)`
  min-height: 300px;
  border: 1px solid black;
  border-radius: 5px;
  color: ${({disabled}) => disabled ? 'grey' : 'black'};
  cursor: ${({disabled}) => disabled && 'not-allowed'};
  text-decoration: none;
  flex-grow: 1;
  padding: 20px 40px 40px;
  font-size: 1.4rem;

  &:hover {
    background-color: ${({bgColor}) => bgColor};
`