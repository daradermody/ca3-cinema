import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Movie } from '../../../API'
import { CardMedia, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'

interface MovieListProps {
  movies?: Pick<Movie, 'name' | 'id' | 'tmdb_id'>[]
}

export default function MovieList({movies}: MovieListProps) {
  const deleteMovie = useCallback((id: string) => {
    alert('Not implemented')
  }, [])

  return (
    <div style={{ paddingTop: 30}}>
      <h3>Movie Suggestions</h3>
      <List dense>
        {movies.map((movie) => (
          <MovieItem movie={movie} onDelete={() => deleteMovie(movie.id)}/>
        ))}
      </List>
    </div>
  )
}

interface MovieItemProps {
  movie: Pick<Movie, 'name' | 'id' | 'tmdb_id'>
  onDelete(): void
}

function MovieItem({movie, onDelete}: MovieItemProps) {
  const [tmdbInfo, setTmdbInfo] = useState<undefined | TmdbMovieInfo>()
  
  useEffect(() => {
    async function getTmdbInfo() {
      const {data} = await axios.get(`https://api.themoviedb.org/3/movie/${movie.tmdb_id}?api_key=39ddef1da9fcaa6207e6421b04dbd9ec`)
      setTmdbInfo(data)
    }
    void getTmdbInfo()
  }, [setTmdbInfo])
  
  return (
    <ListItem
      key={movie.id}
      secondaryAction={
        <IconButton
          edge="end"
          onClick={() => onDelete()}
          aria-label="delete"
        >
          <DeleteIcon/>
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton>
        <CardMedia
          component="img"
          image={getPosterUrl(tmdbInfo?.poster_path)}
          alt={movie.name}
          sx={{ width: 50 }}
        />
        <ListItemText
          primary={movie.name}
          secondary={tmdbInfo?.release_date?.split('-')?.[0]}
          sx={{ ml: 2 }}
        />
      </ListItemButton>
    </ListItem>
  )
}

function getPosterUrl(posterPath?: string) {
  return `https://image.tmdb.org/t/p/w200/${posterPath || '/eqGh2p5Rr10Y48xHUfB1dVc95vL.jpg'}`
}

export interface TmdbMovieInfo {
  poster_path: string | null
  release_date: string | null
}