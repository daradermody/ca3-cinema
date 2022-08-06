import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { UserInfoContext } from '../components/UserInfoContext'
import styled from '@emotion/styled'
import api from '../components/api'
import { Person } from '../../types/data'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'

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

const StyledUserList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 8px 0;
  gap: 10px;
`
