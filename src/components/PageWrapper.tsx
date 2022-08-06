import * as React from 'react'
import { ReactNode, useContext } from 'react'
import styled from '@emotion/styled'
import Logo from './Logo'
import { Link } from 'wouter'
import { UserInfoContext } from './UserInfoContext'
import { Tooltip } from '@mui/material'

export default function PageWrapper({hideHeader, children}: { hideHeader?: boolean, children?: ReactNode }) {
  const {user} = useContext(UserInfoContext)

  return (
    <div>
      {!hideHeader && (
        <>
          <StyledHeader>
            <Link href="/">
              <StyledHomeLink>
                <Logo/>
              </StyledHomeLink>
            </Link>
            <Tooltip title={`Logged in as ${user.username}`} placement="left">
              <StyledProfilePhoto src={user.photo} alt="user photo"/>
            </Tooltip>
          </StyledHeader>
          <hr style={{borderTop: '1px solid #cbcbcb'}}></hr>
        </>
      )}
      <StyledContainer>
        {children}
      </StyledContainer>
    </div>
  )
}

const StyledContainer = styled.div`
  padding: 20px 5px;
  max-width: 600px;
  margin: 0 auto;
  @media screen and (min-width: 900px) {
    max-width: 850px;
  }
  @media screen and (min-width: 1536px) {
    max-width: 1500px;
  }
`

const StyledHeader = styled.div`
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin: 0 auto;
  @media screen and (min-width: 900px) {
    max-width: 900px;
  }
  @media screen and (min-width: 1536px) {
    max-width: 1600px;
  }
`

const StyledHomeLink = styled.a`
  padding: 5px 0 0 10px;

  &:hover {
    filter: brightness(1.1);
  }
`

const StyledProfilePhoto = styled.img`
  border-radius: 50%;
  background-color: white;
  margin: 15px;
`