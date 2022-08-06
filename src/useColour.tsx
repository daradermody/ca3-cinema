import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import Please from 'pleasejs'

export default function useColour(millis?: number) {
  const [colour, setColour] = useState(Please.make_color())

  const refreshColour = useCallback(() => {
    setColour(Please.make_color())
  }, [setColour])

  useEffect(() => {
    if (millis) {
      const interval = setInterval(refreshColour, millis)
      return () => clearInterval(interval)
    }
  }, [refreshColour])

  return [colour, refreshColour]
}