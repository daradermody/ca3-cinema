import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import SuggestedMovies from './pages/SuggestedMovies'
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/list" element={<SuggestedMovies/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
)

function NotFound() {
  return (
    <h1>Woah, where you tryin' to get to?</h1>
  )
}