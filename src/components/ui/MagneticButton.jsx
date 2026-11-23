import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

// Polymorphic button/link that leans toward the cursor. Disabled for touch and reduced motion.
export default function MagneticButton({ as = 'button', strength = 0.3, children, ...rest }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  const Tag = motion[as]
  const move = (e) => {
    if (reduced || e.pointerType === 'touch' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }
  return <Tag ref={ref} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={leave} {...rest}>{children}</Tag>
}
