import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import MovieList from './pages/MovieList'

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/list" element={<MovieList/>}/>
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