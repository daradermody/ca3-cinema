import useMutation from '../../utils/useMutation'
import { CreateMovieMutationVariables } from '../../../API'
import { createMovie as createMovieMutation } from '../../../graphql/mutations'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { throttle } from 'throttle-debounce'
import axios from 'axios'

export default function MovieInput(props: { onAdd: () => void }) {
  const {mutation: createMovie} = useMutation<CreateMovieMutationVariables>(createMovieMutation)
  const [inputText, setInputText] = useState<string>('')
  const [movieSearchResults, setMovieSearchResults] = useState<any[] | undefined>()

  const searchMovie = useCallback(throttle(500, async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=39ddef1da9fcaa6207e6421b04dbd9ec&query=${inputText}`)
    setMovieSearchResults(response.data.results)
  }), [setMovieSearchResults])

  useEffect(() => {
    if (inputText.length > 2) {
      void searchMovie()
    } else {
      setMovieSearchResults(undefined)
    }
  }, [inputText])

  async function addMovie(movie: { id: string, title: string }) {
    try {
      await createMovie({
        input: {
          name: movie.title,
          tmdb_id: movie.id
        }
      })
      await props.onAdd()
    } catch (e) {
      alert(`Could not add movie: ${e.message}`)
    }
  }

  return (
    <>
      <h3>Add Movie Suggestion</h3>
      <input value={inputText} onChange={e => setInputText(e.target.value)}/>
      {movieSearchResults && (
        <div>
          {movieSearchResults.map(movie => (
            <li key={movie.id}>
              {movie.title}
              <button onClick={() => addMovie({id: movie.id, title: movie.title})}>+</button>
            </li>
          ))}
        </div>
      )}
    </>
  )
}