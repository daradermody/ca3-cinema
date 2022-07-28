import { SuggestedMovie } from '../../types/types'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import * as React from 'react'
import styled from '@emotion/styled'
import { getPoster } from './getPoster'
import { Box, Button, Card, CardActions, CardContent, CardMedia, IconButton, Tooltip, Typography } from '@mui/material'
import Modal from './Modal'
import { MovieInfo } from './MovieInfo'
import { useCallback, useState } from 'react'

interface MovieCardProps {
  movie: SuggestedMovie
  onClick?: () => void
  onDelete?: () => void
  checked?: boolean
}

export function MovieCard({movie, onClick, onDelete, checked}: MovieCardProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const handleDelete = useCallback(() => {
    setShowMoreInfo(false)
    onDelete()
  }, [setShowMoreInfo, onDelete])

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          cursor: onClick ? 'pointer' : null,
          userSelect: 'none',
          border: checked ? '2px solid var(--green1)' : 'none',
          margin: checked ? 0 : '2px'
        }}
        onClick={onClick}
      >
        <CardMedia
          sx={{width: 100}}
          component="img"
          image={getPoster(movie.poster)}
          alt={`Poster for ${movie.title}`}
        />
        <Box sx={{overflow: 'hidden'}}>
          <CardContent sx={{flex: '1 0 auto'}}>
            <Box sx={{display: 'flex', gap: 1}}>
              <Tooltip title={movie.title} placement="top" enterDelay={500}>
                <Typography variant="h5" sx={{overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  {movie.title}
                </Typography>
              </Tooltip>
              {movie.year && <Typography variant="h5" color="text.secondary">({movie.year})</Typography>}
            </Box>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Suggested by {movie.suggester}
            </Typography>
          </CardContent>
          <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1}}>
            <CardActions>
              <Button onClick={e => {
                e.stopPropagation()
                setShowMoreInfo(true)
              }}>More info</Button>
            </CardActions>
          </Box>
        </Box>
      </Card>

      <Modal open={showMoreInfo} onClose={() => setShowMoreInfo(false)}>
        <MovieInfo movie={movie} onDelete={onDelete && handleDelete}/>
      </Modal>
    </>
  )
}

const StyledMovieCard = styled.button<{ selected: boolean }>`
  display: flex;
  border: ${({selected}) => selected ? '2px solid var(--green1)' : 'none'};
  box-shadow: rgb(0 0 0 / 20%) 0 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;
  height: 100%;
  padding: 0.05px;
  background-color: #f1f1f1;
  color: black;
  cursor: pointer;
  text-align: left;
`

const StyledPoster = styled.div<{ src: string }>`
  background-image: url(${({src}) => src});
  background-size: cover;
  aspect-ratio: 2 / 3;
  height: 100%;
  min-height: 150px;
  width: 100px;
`

const StyledMovieDescription = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
`
