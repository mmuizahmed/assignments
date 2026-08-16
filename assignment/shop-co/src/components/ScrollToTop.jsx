import React from 'react'
import {useLocation} from 'react-router-dom'

export default function ScrollToTop() {
  const {pathname} = useLocation()

  React.useLayoutEffect(() => {
    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior

    root.style.scrollBehavior = 'auto'
    window.scrollTo({top: 0, left: 0})
    root.style.scrollBehavior = previousScrollBehavior
  }, [pathname])

  return null
}
