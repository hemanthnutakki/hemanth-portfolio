import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import RoleTicker from '../ui/RoleTicker'
import useReducedMotion from '../../hooks/useReducedMotion'
import useMediaQuery from '../../hooks/useMediaQuery'
import { hasWebGL } from '../../lib/webgl'
import { profile } from '../../data/profile'

// The 3D scene is its own lazy chunk, so the loader and text paint first.
const HeroScene = lazy(() => import('../three/HeroScene'))

const BRAND = ['#60a5fa', '#7c9bff', '#8b8cf8', '#9a7cf6', '#7fa3f2', '#4fc3f5', '#34d3ee', '#22d3ee']
const container = { hide: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.15 } } }
const letter = { hide: { opacity: 0, y: 40, rotateX: -60 }, show: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', damping: 18, stiffness: 140 } } }
const fade = { hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.8 } } }

// Words stay together; every letter lifts and glows on hover.
function Word({ text, colors }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {text.split('').map((ch, i) => (
        <motion.span key={i} variants={letter} aria-hidden="true" style={{ '--c': colors ? colors[i % colors.length] : '#e8ecf6' }}
          className="inline-block cursor-default text-[color:var(--c)] transition-[transform,text-shadow] duration-200 hover:-translate-y-2 hover:scale-110 hover:[text-shadow:0_0_24px_#22d3ee]">{ch}</motion.span>
      ))}
    </span>
  )
}

function OrbFallback() {
  return <div className="absolute right-[10%] top-1/2 h-72 w-72 -translate-y-1/2 animate-pulse rounded-full bg-grad-brand opacity-30 blur-3xl" />
}

export default function Hero({ play }) {
  const reduced = useReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px)')
  const [visible, setVisible] = useState(true)
  const [gl] = useState(hasWebGL)
  const ref = useRef(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const state = play || reduced ? 'show' : 'hide'
  const initial = reduced ? false : 'hide'

  return (
    <section id="hero" ref={ref} className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className={`absolute inset-0 ${mobile ? 'opacity-60' : ''}`}>
        {gl ? <Suspense fallback={<OrbFallback />}><HeroScene play={play || reduced} still={reduced} mobile={mobile} active={visible} /></Suspense> : <OrbFallback />}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(4,6,12,.85),transparent_60%)]" />

      <div className="relative z-10 flex min-h-screen items-center px-[5vw] pt-20">
        <div className="max-w-3xl">
          <motion.h1 aria-label={'HEY, I\u2019M HEMANTH.'} variants={container} initial={initial} animate={state}
            className="font-display text-4xl font-bold leading-[1.02] min-[400px]:text-5xl tracking-tight sm:text-7xl md:text-8xl [perspective:600px]">
            <span className="block"><Word text="HEY," /> <Word text={'I\u2019M'} /></span>
            <span className="block"><Word text="HEMANTH." colors={BRAND} /></span>
          </motion.h1>

          <motion.p variants={fade} initial={initial} animate={state} className="mt-6 max-w-xl text-base text-slate-300 md:text-xl">{profile.heroSub}</motion.p>
          <motion.div variants={fade} initial={initial} animate={state} className="mt-5"><RoleTicker roles={profile.titles} active={play || reduced} /></motion.div>

          <motion.div variants={fade} initial={initial} animate={state} className="mt-8 flex flex-wrap gap-3">
            <MagneticButton as="a" href="#projects" className="btn-primary">Explore My Work <ArrowRight size={16} /></MagneticButton>
            {profile.resume ? (
              <MagneticButton as="a" href={profile.resume} download className="btn"><Download size={16} /> Download Resume</MagneticButton>
            ) : (
              <button type="button" disabled title="Resume PDF has not been added yet" className="btn cursor-not-allowed opacity-50"><Download size={16} /> Resume coming soon</button>
            )}
            <MagneticButton as="a" href="#contact" className="btn"><Mail size={16} /> Let&rsquo;s Connect</MagneticButton>
          </motion.div>
        </div>
      </div>

      <a href="#about" aria-label="Scroll to the About section" className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <span className="block h-9 w-[22px] rounded-full border-2 border-mute p-1"><span className="block h-2 w-[3px] animate-bounce rounded bg-cyan2 mx-auto" /></span>
      </a>
    </section>
  )
}
