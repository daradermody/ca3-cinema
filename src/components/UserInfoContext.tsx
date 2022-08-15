import * as React from 'react'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import * as queryString from 'query-string'
import * as cookie from 'cookie'
import { Person } from '../../types/data'
import PageLoading from './PageLoading'

export const UserInfoContext = createContext<{ user: Person, setUser: (user: Person) => void }>(null)

export function UserInfoProvider({children}: { children: ReactNode }) {
  const [user, setUser] = useState<Person>()
  const [location, setLocation] = useLocation()

  useEffect(() => {
    const userInfo = JSON.parse(cookie.parse(document.cookie).user || null)
    if (userInfo) {
      setUser(userInfo)
    } else {
      setLocation(`/login?andWeWillGetYouTo=${location}`)
    }
  }, [setUser])

  const handleSetUser = useCallback((newUser: Person) => {
    if (newUser) {
      document.cookie = cookie.serialize('user', JSON.stringify(newUser), {sameSite: 'strict'})
      setUser(newUser)
      let returnPath = queryString.parse(window.location.search).andWeWillGetYouTo as string
      returnPath = !returnPath || returnPath === '/login' ? '/' : returnPath
      setLocation(returnPath)
    } else {
      document.cookie = cookie.serialize('user', null, {maxAge: 0})
      setUser(null)
      setLocation('/login')
    }
  }, [setUser, setLocation])

  if (!!user || location === '/login') {
    return (
      <UserInfoContext.Provider value={{user, setUser: handleSetUser}}>
        {children}
      </UserInfoContext.Provider>
    )
  } else {
    return <PageLoading/>
  }
}

export function useIsAdmin() {
  const {user} = useContext(UserInfoContext)
  return user.username === 'Dara'
}
