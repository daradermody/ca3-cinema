import * as React from 'react'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton, Modal as MuiModal } from '@mui/material'
import { ModalProps } from '@mui/material/Modal/Modal'

export default function Modal({open, onClose, children}: ModalProps) {
  return (
    <MuiModal open={open} onClose={onClose}>
      <StyledModalBody>
        <StyledCloseButton aria-label="close" onClick={e => onClose(e, 'backdropClick')} sx={{boxShadow: 24}}>
          <CloseIcon/>
        </StyledCloseButton>
        {children}
      </StyledModalBody>
    </MuiModal>
  )
}

const StyledModalBody = styled.div`
  position: absolute;
  inset: 20px;
  padding: 20px;
  overflow-y: auto;
  max-width: 90vw;
  background-color: ${({theme}) => theme.palette.background.default};

  @media screen and (min-width: 900px) {
    transform: translate(-50%, -50%);
    max-height: 90vh;
    padding: 50px;
    inset: auto;
    top: 50%;
    left: 50%;
  }
`

const StyledCloseButton = styled(IconButton)`
  background-color: inherit;
  position: fixed;
  right: 10vw;
  top: 40px;

  @media screen and (min-width: 900px) {
    right: 40px;
  }
`
