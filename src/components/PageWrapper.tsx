import * as React from 'react'
import {ReactNode, useContext} from 'react'
import styled from '@emotion/styled'
import Logo from './Logo'
import {UserInfoContext} from './UserInfoContext'
import {Box, Button, Menu, MenuItem} from '@mui/material'
import {Link} from 'wouter'

export default function PageWrapper({hideHeader, children}: { hideHeader?: boolean, children?: ReactNode }) {
  const {user, setUser} = useContext(UserInfoContext)
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null)

  return (
    <div>
      {!hideHeader && (
        <>
          <StyledHeader>
            <Box m="10px">
              <Link href="/">
                <a><Logo/></a>
              </Link>
            </Box>
            <Box display="flex" gap="10px">
              <Link href="/pastEvents">
                <Button color="inherit">Past events</Button>
              </Link>
              <Button>
                <StyledProfilePhoto draggable="false" src={user.photo} alt="user photo"
                                    onClick={e => setProfileAnchorEl(e.currentTarget)}/>
              </Button>
              <Menu
                anchorEl={profileAnchorEl}
                open={!!profileAnchorEl}
                onClose={() => setProfileAnchorEl(null)}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              >
                <MenuItem onClick={() => setUser(null)}>Logout</MenuItem>
              </Menu>
            </Box>
          </StyledHeader>
          <hr style={{borderTop: '1px solid #cbcbcb', marginTop: 0}}></hr>
        </>
      )}
      <StyledContainer>
        {children}
      </StyledContainer>
    </div>
  )
}

const StyledContainer = styled.div`
  padding: 20px 10px;
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

const StyledProfilePhoto = styled.img`
  border-radius: 50%;
  background-color: white;
  margin: 15px;
  height: 100%;
  cursor: pointer;
`
