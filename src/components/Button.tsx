import * as React from 'react'
import { ImgHTMLAttributes } from 'react'
import styled from '@emotion/styled'

export default function Button(props: ImgHTMLAttributes<HTMLButtonElement>) {
  return (
    <StyledButton {...props}/>
  )
}

const StyledButton = styled.button`
  height: 50px;
  width: 50px;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px -5px;
  &:hover {
    filter: brightness(1.1);
  }
`