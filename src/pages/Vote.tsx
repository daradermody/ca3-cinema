import React from 'https://esm.sh/react@18'
import Logo from '../components/logo.tsx'

export default function Vote() {
  return (
    <>
      Vote...
    </>
  )
}

function ThanksForVoting() {
  return (
    <div style={{
      fontSize: '4rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <h2>Thanks for the votes!!</h2>
      <h5><a href="https://www.youtube.com/watch?v=aRsWk4JZa5k">Have an egg</a></h5>
      <Logo
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          height: '200px',
          filter: 'opacity(0.2)'
        }}
      />
    </div>
  )
}
