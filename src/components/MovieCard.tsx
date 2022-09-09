import { SuggestedMovie } from '../../types/data'
import * as React from 'react'
import { useCallback } from 'react'
import styled from '@emotion/styled'
import { getPoster } from './getPoster'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import Modal from './Modal'
import { MovieInfo } from './MovieInfo'
import { Link, Route, useLocation } from 'wouter'

interface MovieCardProps {
  movie: SuggestedMovie
  onClick?: () => void
  onDelete?: () => void
  checked?: boolean
  votes?: number
}

export function MovieCard({movie, onClick, onDelete, checked, votes}: MovieCardProps) {
  const theme = useTheme()
  theme.palette.augmentColor
  const mdDisplay = useMediaQuery(theme.breakpoints.up('md'))
  const [_, setLocation] = useLocation()

  const handleDelete = useCallback(() => {
    onDelete()
    setLocation('/', {replace: true})
  }, [setLocation, onDelete])

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          cursor: onClick ? 'pointer' : null,
          userSelect: 'none',
          border: checked ? `2px solid ${theme.palette.primary.main}` : 'none',
          margin: checked ? 0 : '2px',
          alignSelf: 'stretch',
          position: 'relative',
        }}
        onClick={onClick}
      >
        <CardMedia
          draggable="false"
          sx={{width: 100}}
          component="img"
          src={getPoster(movie.poster)}
          alt={`Poster for ${movie.title}`}
        />
        {checked && <StyledCheckmark/>}
        <Box sx={{overflow: 'hidden', flexGrow: 1, backgroundColor: checked ? theme.palette.action.selected : 'transparent'}}>
          <CardContent sx={{flex: '1 0 auto'}}>
            <Box sx={{display: 'flex', gap: 1}}>
              <Tooltip title={movie.title} placement="top" enterDelay={500}>
                <Typography variant="h6" sx={{overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  {movie.title}
                </Typography>
              </Tooltip>
              {mdDisplay && movie.year && <Typography variant="h6" color="text.secondary">({movie.year})</Typography>}
            </Box>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Suggested by {movie.suggester}
            </Typography>
          </CardContent>
          <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1}}>
            <CardActions>
              <Link href={`/info/${movie.id}`}>
                <Button component="a">More info</Button>
              </Link>
            </CardActions>
          </Box>
        </Box>
        {votes !== undefined && (
          <StyledVotes>
            <Box sx={{fontSize: '2rem'}}>{votes}</Box>
            <div>Vote{votes !== 1 && 's'}</div>
          </StyledVotes>
        )}
      </Card>

      <Route path="/info/:id">
        <Modal open onClose={() => setLocation('/', {replace: true})}>
          <MovieInfo movie={movie} onDelete={onDelete && handleDelete}/>
        </Modal>
      </Route>
    </>
  )
}

const StyledVotes = styled.div`
  width: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-left: 1px solid lightgrey;
`

const StyledCheckmark = styled.div`
  position: absolute;
  height: 100%;
  width: 100px;
`
