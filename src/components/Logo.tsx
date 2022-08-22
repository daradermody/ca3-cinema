import * as React from 'react'
import { ImgHTMLAttributes, useCallback, useRef, useState } from 'react'

export default function Logo(props: ImgHTMLAttributes<HTMLImageElement>) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [showOldLogo, setShowOldLogo] = useState(false)

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => setShowOldLogo(true), 5000)
    return () => clearTimeout(timeoutRef.current)
  }, [setShowOldLogo])

  const handleMouseLeave = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setShowOldLogo(false)
  }, [setShowOldLogo])

  return (
    <img
      src={showOldLogo ? 'assets/drawn_logo.png' : 'assets/logo.svg'}
      draggable="false"
      alt="logo"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
      style={{
        maxHeight: '100%',
        ...props.style
      }}
    />
  )
}
