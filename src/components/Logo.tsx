import * as React from 'react'
import { ImgHTMLAttributes } from 'react'

export default function Logo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="assets/logo.png"
      alt="logo"
      {...props}
      style={{
        maxHeight: '100%',
        ...props.style
      }}
    />
  )
}