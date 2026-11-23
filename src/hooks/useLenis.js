import { useEffect } from 'react'
import Lenis from 'lenis'
import useReducedMotion from './useReducedMotion'
export default function useLenis() {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.09 })
    let id
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [reduced])
}
