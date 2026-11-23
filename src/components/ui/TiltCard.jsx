import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

// 3D hover tilt with a moving glare. Children may use translateZ() for depth layers.
export default function TiltCard({ children, className = '', max = 10, ...rest }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const rx = useMotionValue(0), ry = useMotionValue(0), gx = useMotionValue(50), gy = useMotionValue(50)
  const srx = useSpring(rx, { stiffness: 160, damping: 18 }), sry = useSpring(ry, { stiffness: 160, damping: 18 })
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.12), transparent 55%)`
  const move = (e) => {
    if (reduced || e.pointerType === 'touch' || !ref.current) return
    const r = ref.current.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2); rx.set(-(py - 0.5) * max * 2); gx.set(px * 100); gy.set(py * 100)
  }
  const leave = () => { rx.set(0); ry.set(0) }
  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`relative ${className}`}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', transformPerspective: 900 }} {...rest}>
      {children}
      {!reduced && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />}
    </motion.div>
  )
}
