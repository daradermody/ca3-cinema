import * as React from 'react'
import { ReactNode, useEffect } from 'react'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close';
import useColour from '../useColour'
import Button from './Button'
import { PropsOf } from '@emotion/react'

export default function Modal({children, onClose}: { children: ReactNode, onClose: () => void }) {
  const [color] = useColour()

  useEffect(() => {
    document.body.style['padding-right'] = '15px'
    document.body.style['overflow'] = 'hidden'
    document.addEventListener('click', onClose)
    return () => {
      document.removeEventListener('click', onClose)
      document.body.style['padding-right'] = ''
      document.body.style['overflow'] = ''
    }
  }, [])
  return (
    <StyledModal onClick={e => e.stopPropagation()} onScroll={e => e.stopPropagation()}>
      <StyledCloseButton bgColor={color} tab-index={1} onClick={onClose}>
        <CloseIcon/>
      </StyledCloseButton>
      {children}
    </StyledModal>
  )
}

const StyledModal = styled.div`
  position: fixed;
  top: 10px;
  bottom: 10px;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  overflow: auto;
  box-shadow: rgb(0 0 0 / 20%) 0 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px;

  left: 200px;
  right: 200px;
  @media screen and (max-width: 1400px) {
    left: 100px;
    right: 100px;
  }
  @media screen and (max-width: 900px) {
    left: 20px;
    right: 20px;
  }
`

const StyledCloseButton = styled(Button)`
  position: absolute;
  right: 20px;
  top: 20px;
  background-color: ${({ bgColor}) => bgColor};
`