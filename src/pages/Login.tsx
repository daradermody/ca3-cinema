import * as React from 'react'
import { useCallback, useContext, useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { UserInfoContext } from '../components/UserInfoContext'
import styled from '@emotion/styled'
import api from '../components/api'
import { Person } from '../../types/data'
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'

export default function Login() {
  const {setUser} = useContext(UserInfoContext)
  const [users, setUsers] = useState<Person[] | null>()

  useEffect(() => {
    api.get<Person[]>('/people')
      .then(({data}) => setUsers(data))
  }, [setUsers])

  if (!users) {
    return <PageWrapper hideHeader>Loading...</PageWrapper>
  }

  return (
    <PageWrapper hideHeader>
      <Typography variant="h4" sx={{textAlign: 'center'}}>Click your face, please and thank you!</Typography>
      <StyledUserList>
        {users.map(user => <UserCard key={user.username} user={user} onClick={() => setUser(user)}/>)}
      </StyledUserList>
      <CookiePrompt/>
    </PageWrapper>
  )
}

function UserCard({user, onClick}: { user: Person, onClick: () => void }) {
  return (
    <Card sx={{display: 'flex', width: 400, maxWidth: '100%'}} onClick={onClick}>
      <CardActionArea sx={{display: 'flex'}}>
        <CardMedia
          component="img"
          sx={{width: 100}}
          image={user.photo}
          alt={`Avatar for ${user.username}`}
        />
        <CardContent sx={{flex: '1 0 auto'}}>
          <Typography variant="h5">
            {user.username}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.nickname}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

function CookiePrompt() {
  const {user} = useContext(UserInfoContext)
  const [showCookiePrompt, setShowCookiePrompt] = useState(!user && !localStorage.getItem('hideCookiePrompt'))

  const handleClick = useCallback(() => {
    localStorage.setItem('hideCookiePrompt', 'true')
    setShowCookiePrompt(false)
  }, [setShowCookiePrompt])

  if (!showCookiePrompt) {
    return null
  }

  return (
    <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
      <StyledCookiePrompt>
        <Typography>We use a single cookie to remember who you are. It will only ever be used on this site. You can delete this cookie by logging out.</Typography>
        <Button onClick={handleClick}>OK</Button>
      </StyledCookiePrompt>
    </Box>
  )
}

const StyledUserList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 8px 120px;
  gap: 10px;
`

const StyledCookiePrompt = styled.div`
  background-color: ${({theme}) => theme.palette.background.default};
  position: fixed;
  max-width: 100%;
  box-shadow: 0 0 35px 0 rgb(0 0 0 / 25%);
  border-radius: 5px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-content: center;
  gap: 10px;
  bottom: 0;
  width: 100%;
  
  @media screen and (min-width: 900px) {
    bottom: 10px;
    width: initial;
  }
`
