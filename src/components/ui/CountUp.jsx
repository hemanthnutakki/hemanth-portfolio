import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'
export default function CountUp({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [v, setV] = useState(reduced ? value : 0)
  useEffect(() => {
    if (reduced) { setV(value); return }
    if (!inView) return
    const c = animate(0, value, { duration: 1.6, ease: 'easeOut', onUpdate: setV })
    return () => c.stop()
  }, [inView, value, reduced])
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>
}
