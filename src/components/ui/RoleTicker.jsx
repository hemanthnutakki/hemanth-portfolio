import { useEffect, useState } from 'react'
import useReducedMotion from '../../hooks/useReducedMotion'

// Typewriter that cycles through professional titles. Screen readers get the full list once.
export default function RoleTicker({ roles, active = true }) {
  const reduced = useReducedMotion()
  const [text, setText] = useState('')
  useEffect(() => {
    if (reduced || !active) return
    let i = 0, n = 0, del = false, id
    const tick = () => {
      const w = roles[i]
      n += del ? -1 : 1
      setText(w.slice(0, n))
      let ms = del ? 35 : 70
      if (!del && n === w.length) { del = true; ms = 1500 }
      else if (del && n === 0) { del = false; i = (i + 1) % roles.length; ms = 300 }
      id = setTimeout(tick, ms)
    }
    id = setTimeout(tick, 400)
    return () => clearTimeout(id)
  }, [roles, reduced, active])
  return (
    <p className="h-8 font-mono text-base text-cyan2 md:text-lg">
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden="true">{reduced ? roles.join(' \u00B7 ') : text}{!reduced && <span className="ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[2px] animate-pulse bg-cyan2" />}</span>
    </p>
  )
}
