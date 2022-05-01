import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

export default function MovieList() {
  const {movies, loading, error, refetch} = useMovieList()
  const [movieSuggestion, setMovieSuggestion] = useState<string>('')

  async function addMovie() {
    try {
      await axios.post('/addMovie', {name: movieSuggestion})
      refetch()
    } catch (e) {
      alert(`Could not add movie: ${e.message}`)
    }

  }

  if (loading) {
    return (
      <div>Loading!</div>
    )
  }

  if (error) {
    return <h1>Something went wrong :(</h1>
  }

  return (
    <div>
      <h3>Movie Suggestions</h3>
      <ul>
        {movies.map(movie => (
          <li>{movie}</li>
        ))}
      </ul>

      <h3>Add Movie Suggestion</h3>
      <input value={movieSuggestion} onChange={e => setMovieSuggestion(e.target.value)}/>
      <button onClick={addMovie}>Add</button>
    </div>
  )
}

function useMovieList() {
  const {data: movies, loading, error, refetch} = useGetRequest('/movieList')
  return {movies, loading, error, refetch}
}

function useGetRequest(pathname: string) {
  const [data, setData] = useState<string[] | undefined>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | undefined>()

  const sendRequest = useCallback(async () => {
    try {
      const {data} = await axios.get<string[]>(pathname)
      setData(data)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [setData, setError, setLoading])

  useEffect(() => {
    void sendRequest()
  }, [sendRequest])

  return {data, loading, error, refetch: sendRequest}
}

