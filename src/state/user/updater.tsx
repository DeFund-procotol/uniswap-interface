import { useEffect } from 'react'
import { useAppDispatch } from 'state/hooks'

import { parsedQueryString } from '../../hooks/useParsedQueryString'
import { updateMatchesDarkMode } from './reducer'

export default function Updater(): null {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const mode = parsedQueryString().mode
    if (mode) dispatch(updateMatchesDarkMode({ matchesDarkMode: mode === 'dark' }))
  })

  // keep dark mode in sync with the system
  /*
  useEffect(() => {
    const darkHandler = (match: MediaQueryListEvent) => {
      dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))
    }

    const match = window?.matchMedia('(prefers-color-scheme: dark)')
    dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))

    const mode = parsedQueryString().mode
    if (mode) dispatch(updateMatchesDarkMode({ matchesDarkMode: mode === 'dark' }))

    if (match?.addListener) {
      match?.addListener(darkHandler)
    } else if (match?.addEventListener) {
      match?.addEventListener('change', darkHandler)
    }

    return () => {
      if (match?.removeListener) {
        match?.removeListener(darkHandler)
      } else if (match?.removeEventListener) {
        match?.removeEventListener('change', darkHandler)
      }
    }
  }, [dispatch])
  */

  return null
}
