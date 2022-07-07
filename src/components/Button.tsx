import React, { ImgHTMLAttributes } from 'react'
import styled from 'https://esm.sh/styled-components?deps=react@18'

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
  cursor: pointer;
  &:hover {
    filter: brightness(90%);
  }
`