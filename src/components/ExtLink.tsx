import * as React from 'react'
import { ReactNode } from 'react'
import { OpenInNew } from '@mui/icons-material'

export default function ExtLink({href, children}: { href: string, children: ReactNode }) {
  return (
    <a
      style={{
        display: 'inline-flex',
        gap: '3px',
        alignItems: 'center',
      }}
      href={href}
      target="_blank"
    >
      {children}
      <OpenInNew fontSize="small"/>
    </a>
  )
}
