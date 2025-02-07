import {SuggestedMovie} from '../../types/data'
import * as React from 'react'
import {useCallback} from 'react'
import styled from '@emotion/styled'
import {getPoster} from './getPoster'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import Modal from './Modal'
import {MovieInfo} from './MovieInfo'
import {Link, Route, useLocation} from 'wouter'

interface MovieCardProps {
  movie: SuggestedMovie
  onClick?: () => void
  onDelete?: () => void
  checked?: boolean
  votes?: number
  disableMoreInfo?: boolean
}

export function MovieCard({movie, onClick, onDelete, checked, votes, disableMoreInfo}: MovieCardProps) {
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
      <StyledCard selected={checked} onClick={onClick}>
        <CardMedia
          draggable="false"
          sx={{width: 100}}
          component="img"
          src={getPoster(movie.poster)}
          alt={`Poster for ${movie.title}`}
        />
        {checked && <StyledCheckmark/>}
        <StyledCardText selected={checked}>
          <CardContent sx={{display: 'flex', flexDirection: 'column'}}>
            <Box sx={{display: 'flex', gap: 1}}>
              <Tooltip title={movie.title} placement="top" enterDelay={500}>
                <Typography variant="h6" sx={{overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  {movie.title}
                </Typography>
              </Tooltip>
              {mdDisplay && movie.year && <Typography variant="h6" sx={{color: 'text.secondary'}}>({movie.year})</Typography>}
            </Box>
            <Typography variant="subtitle1" sx={{color: 'text.secondary'}} component="div">
              Suggested by {movie.suggester}
            </Typography>
          </CardContent>
          <Box sx={{display: disableMoreInfo ? 'none' : 'flex', alignItems: 'center', pl: 1, pb: 1}}>
            <CardActions>
              <Link href={`/info/${movie.id}`} onClick={e => e.stopPropagation()} asChild>
                <Button component="a">More info</Button>
              </Link>
            </CardActions>
          </Box>
        </StyledCardText>
        {votes !== undefined && (
          <StyledVotes>
            <Box sx={{fontSize: '2rem'}}>{votes}</Box>
            <div>Vote{votes !== 1 && 's'}</div>
          </StyledVotes>
        )}
      </StyledCard>

      <Route path={`/info/${movie.id}`}>
        <Modal open onClose={() => setLocation('/', {replace: true})}>
          <MovieInfo movie={movie} onDelete={onDelete && handleDelete}/>
        </Modal>
      </Route>
    </>
  )
}

const StyledCard = styled(Card)<{ selected?: boolean }>`
  display: flex;
  cursor: ${({onClick}) => onClick ? 'pointer' : null};
  user-select: none;
  border: ${({selected, theme}) => selected ? `2px solid ${theme.palette.primary.main}` : 'none'};
  margin: ${({selected}) => selected ? '0' : '2px'};
  flex-grow: 1;
  position: relative;
  max-width: 100%;
`

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

const StyledCardText = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  flex-grow: 1;
  background-color: ${({theme, selected}) => selected ? theme.palette.action.selected : 'transparent'};
`
