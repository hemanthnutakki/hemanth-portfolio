import { useEffect, useState } from 'react'
import { normalizePath } from './route'

// Minimal History-API router (real URLs such as /privacy, no extra dependency). The host must serve index.html for unknown paths (see netlify.toml).
const listeners = new Set()
export const getPath = () => normalizePath(window.location.pathname)
export function navigate(to) {
  if (normalizePath(to) !== getPath() || to.includes('#')) window.history.pushState({}, '', to)
  listeners.forEach((f) => f())
  window.scrollTo(0, 0)
}
export function useRoute() {
  const [p, setP] = useState(getPath)
  useEffect(() => {
    const f = () => setP(getPath())
    listeners.add(f); window.addEventListener('popstate', f)
    return () => { listeners.delete(f); window.removeEventListener('popstate', f) }
  }, [])
  return p
}
export function Link({ to, children, onClick, ...rest }) {
  const click = (e) => {
    if (onClick) onClick(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault(); navigate(to)
  }
  return <a href={to} onClick={click} {...rest}>{children}</a>
}
