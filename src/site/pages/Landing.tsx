import * as React from 'react'
import { useEffect, useState } from 'react'
// @ts-ignore
import * as Please from 'pleasejs'
import { API, graphqlOperation } from 'aws-amplify';
import { listTodos } from './graphql/queries';
import logo from '../assets/logo.png'


export default function Landing() {
  const [colour, setColour] = useState(Please.make_color())
  useEffect(() => {
    const interval = setInterval(() => setColour(Please.make_color()), 2000)
    return () => clearInterval(interval)
  }, [setColour])

  useEffect(() => {
    async function getMovies() {
      const movies = await API.graphql(graphqlOperation(listTodos));
      console.log(movies)
    }
    void getMovies()
  })

  return (
    <div style={{
      fontFamily: 'Lexend',
      fontSize: '4rem',
      display: 'flex',
      height: '100vh',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colour
    }}>
      <h2>Thanks for the votes!!</h2>
      <h5><a href="https://www.youtube.com/watch?v=aRsWk4JZa5k">Have an egg</a></h5>
      <img
        src={logo}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          height: '200px',
          filter: 'opacity(0.2)'
        }}
        alt="logo"/>
    </div>
  )
}
