import React, { useEffect, useState, useCallback } from 'https://esm.sh/react@18'
import Please from 'https://esm.sh/pleasejs'

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