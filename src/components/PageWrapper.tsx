import * as React from 'react'
import { ReactNode } from 'react'
import styled from '@emotion/styled'
import Logo from './logo'
import { Link } from 'wouter'
import useColour from '../useColour'

export default function PageWrapper({hideHeader, children}: { hideHeader?: boolean, children?: ReactNode }) {
  const [color, refreshColor] = useColour()
  return (
    <div>
      {!hideHeader && (
        <StyledHeader>
          <Link href="/">
            <HomeLink bgColor={color} onMouseLeave={refreshColor}>
              <Logo/>
            </HomeLink>
          </Link>
        </StyledHeader>
      )}
      <StyledContainer>
        {children}
      </StyledContainer>
    </div>
  )
}

const StyledContainer = styled.div`
  padding: 20px 20px;
  @media screen and (min-width: 900px) {
    padding: 20px 100px;
  }
  @media screen and (min-width: 1400px) {
    padding: 20px 200px;
  }
`

const StyledHeader = styled.div`
  height: 80px;
  display: flex;
  border-bottom: 1px solid black;
  padding: 0;
  @media screen and (min-width: 900px) {
    padding: 0 50px;
  }
  @media screen and (min-width: 1400px) {
    padding: 0 100px;
  }
`

const HomeLink = styled.a`
  padding: 5px 0 0 10px;
  &:hover {
    background-color: ${(props: { bgColor: string }) => props.bgColor}
  }
`
