import React, { ReactNode } from 'https://esm.sh/react@18'
import styled from 'https://esm.sh/styled-components?deps=react@18'
import Logo from './logo.tsx'
import { Link } from 'https://esm.sh/wouter?deps=react@18'
import useColour from '../useColour.tsx'

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
