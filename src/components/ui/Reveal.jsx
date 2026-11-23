import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'
export default function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const reduced = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag className={className} initial={reduced ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</Tag>
  )
}
