import { SuggestedMovie } from '../../types/data'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import * as React from 'react'
import styled from '@emotion/styled'
import { getPoster } from './getPoster'
import { Box, Button, Card, CardActions, CardContent, CardMedia, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import Modal from './Modal'
import { MovieInfo } from './MovieInfo'
import { useCallback, useState } from 'react'

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
              <Button onClick={e => {
                e.stopPropagation()
                setShowMoreInfo(true)
              }}>More info</Button>
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

      <Modal open={showMoreInfo} onClose={() => setShowMoreInfo(false)}>
        <MovieInfo movie={movie} onDelete={onDelete && handleDelete}/>
      </Modal>
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
