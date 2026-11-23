import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

// Branded loading screen: NH monogram inside a ring that fills as the intro progresses.
export default function Loader({ onDone }) {
  const reduced = useReducedMotion()
  const [pct, setPct] = useState(0)
  const [show, setShow] = useState(true)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const c = animate(0, 100, { duration: reduced ? 0.3 : 1.8, ease: 'easeInOut', onUpdate: (v) => setPct(Math.round(v)), onComplete: () => setShow(false) })
    return () => { c.stop(); document.body.style.overflow = '' }
  }, [reduced])
  const R = 54, C = 2 * Math.PI * R
  return (
    <AnimatePresence onExitComplete={() => { document.body.style.overflow = ''; onDone() }}>
      {show && (
        <motion.div key="loader" role="status" aria-label="Loading portfolio" className="fixed inset-0 z-[60] grid place-items-center bg-ink"
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.7, ease: 'easeInOut' } }}>
          <div className="text-center">
            <div className="relative mx-auto h-36 w-36">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b82f6" /><stop offset=".5" stopColor="#8b5cf6" /><stop offset="1" stopColor="#22d3ee" /></linearGradient></defs>
                <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2" />
                <circle cx="60" cy="60" r={R} fill="none" stroke="url(#lg)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-display text-4xl font-bold tracking-widest text-grad">NH</span>
            </div>
            <p className="mt-6 font-mono text-xs tracking-[.3em] text-mute">INITIALIZING {pct}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
