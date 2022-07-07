import React, { ImgHTMLAttributes } from 'https://esm.sh/react@18'

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