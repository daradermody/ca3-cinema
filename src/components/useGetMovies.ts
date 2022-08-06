import { useCallback, useEffect, useState } from 'react'
import { SuggestedMovie } from '../../types/data'
import { useSnackbar } from 'notistack'
import api, { extractMessage } from './api'

interface ReturnValue {
  movies: undefined | SuggestedMovie[]
  refetch: () => void
}

export default function useGetMovies(): ReturnValue {
  const [movies, setMovies] = useState<null | SuggestedMovie[]>(null)
  const {enqueueSnackbar} = useSnackbar()

  const getMovies = useCallback(async () => {
    try {
      const {data} = await api.get<SuggestedMovie[]>('/movies')
      setMovies(data)
    } catch (e) {
      enqueueSnackbar(`Something went wrong: ${extractMessage(e)}`, {variant: 'error'})
    }
  }, [setMovies])

  useEffect(() => {
    void getMovies()
  }, [getMovies])

  return {movies, refetch: getMovies}
}