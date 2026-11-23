import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'
import Reveal from '../ui/Reveal'
import NarrationControls from '../ui/NarrationControls'
import useReducedMotion from '../../hooks/useReducedMotion'
import useMediaQuery from '../../hooks/useMediaQuery'
import { hasWebGL } from '../../lib/webgl'
import { emit, on } from '../../lib/kannaBus'
import { skills } from '../../data/profile'
import { CAT_COLORS, techInfo } from '../../data/toolkit'

// Lazy: the 3D scene (and three.js) only loads when this section nears the viewport.
const ToolkitUniverse = lazy(() => import('../three/ToolkitUniverse'))
const cats = Object.keys(skills)
const catOf = Object.fromEntries(cats.flatMap((c) => skills[c].map((n) => [n, c])))

export default function Skills() {
  const [active, setActive] = useState(cats[0])
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [run, setRun] = useState(false)
  const [seen, setSeen] = useState(false)
  const [gl] = useState(hasWebGL)
  const reduced = useReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px)')
  const ref = useRef(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { setRun(e.isIntersecting); if (e.isIntersecting) setSeen(true) }, { rootMargin: '150px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => on('kanna:step', (e) => { const d = e.detail; if (d.script === 'toolkit' && d.category) { setActive(d.category); setSelected(null) } }), [])
  useEffect(() => { document.body.style.cursor = hovered ? 'pointer' : ''; return () => { document.body.style.cursor = '' } }, [hovered])

  const select = (name) => { setSelected(name); setActive(catOf[name]); emit('kanna:tech', { name, category: catOf[name], click: true }) }
  const hover = (name) => { setHovered(name); if (name) emit('kanna:tech', { name, category: catOf[name] }) }
  const focus = selected || hovered, info = focus ? techInfo[focus] : null
  const ci = cats.indexOf(active)

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-2 lg:items-start">
      {gl && (
        <Reveal>
          <div data-gaze="toolkit-canvas" className="card-surface relative h-[380px] overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,.10),transparent_65%)] md:h-[520px]">
            <div aria-hidden="true" className="absolute inset-0">
              {seen && <Suspense fallback={null}><ToolkitUniverse data={skills} active={active} selected={selected} hovered={hovered} onHover={hover} onSelect={select} still={reduced} mobile={mobile} run={run} zoom={zoom} /></Suspense>}
            </div>
            <div className="pointer-events-none absolute left-4 top-4">
              <p className="font-mono text-[10px] tracking-[.25em] text-mute">ACTIVE RING</p>
              <p className="mt-0.5 text-sm font-medium" style={{ color: CAT_COLORS[ci % CAT_COLORS.length] }}>{active}</p>
            </div>
            <div className="absolute right-3 top-3 flex flex-col gap-2">
              <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(1)))} className="btn !p-2"><ZoomIn size={16} /></button>
              <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.2).toFixed(1)))} className="btn !p-2"><ZoomOut size={16} /></button>
              <button type="button" aria-label="Reset view" onClick={() => { setZoom(1); setSelected(null) }} className="btn !p-2"><RotateCcw size={16} /></button>
            </div>
            <p className="pointer-events-none absolute bottom-3 left-4 right-4 font-mono text-xs text-slate-300">
              {hovered ? <><span className="text-cyan-200">{hovered}</span> &middot; {techInfo[hovered]?.use}</> : 'Hover a node to see how it was used. Click to open details.'}
            </p>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.1} className={gl ? '' : 'lg:col-span-2'}>
        <NarrationControls script="toolkit" label="Give me a tour" nextLabel="Next category" className="mb-5" />
        <div role="group" aria-label="Skill categories" className="flex flex-wrap gap-2">
          {cats.map((c, i) => (
            <button key={c} type="button" aria-pressed={active === c} onClick={() => { setActive(c); setSelected(null) }}
              className={`rounded-full border px-4 py-2 text-sm transition ${active === c ? 'border-transparent text-white' : 'border-white/10 text-mute hover:text-white'}`}
              style={active === c ? { background: CAT_COLORS[i % CAT_COLORS.length] + '55', boxShadow: `0 0 0 1px ${CAT_COLORS[i % CAT_COLORS.length]}` } : undefined}>{c}</button>
          ))}
        </div>
        <ul data-gaze="toolkit-list" className="mt-6 flex flex-wrap gap-3" aria-label={`${active} technologies`}>
          {skills[active].map((s) => (
            <li key={s}>
              <button type="button" aria-pressed={selected === s} onClick={() => select(s)} onMouseEnter={() => hover(s)} onMouseLeave={() => hover(null)} onFocus={() => hover(s)} onBlur={() => hover(null)}
                className={`rounded-xl border px-4 py-2 text-sm transition ${selected === s ? 'border-cyan2 bg-cyan2/10 text-white' : 'border-white/10 bg-slate2 text-slate-200 hover:border-cyan2/60 hover:text-white'}`}>{s}</button>
            </li>
          ))}
        </ul>

        <div aria-live="polite" className="mt-6">
          {selected && info ? (
            <div className="card-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold">{selected}</h3>
                  <span className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs" style={{ background: CAT_COLORS[ci % CAT_COLORS.length] + '33' }}>{catOf[selected]}</span>
                </div>
                <button type="button" aria-label="Close details" onClick={() => setSelected(null)} className="btn !p-2"><X size={14} /></button>
              </div>
              <p className="mt-3 text-sm text-slate-300">{info.use}</p>
              {info.projects && <div className="mt-3"><p className="font-mono text-xs uppercase tracking-[.2em] text-mute">Used in</p><div className="mt-2 flex flex-wrap gap-2">{info.projects.map((p) => <span key={p} className="tag">{p}</span>)}</div></div>}
            </div>
          ) : (
            <p className="text-sm text-mute">Pick a category, then a technology, to see where it was used. Links in the universe connect technologies that work together.</p>
          )}
        </div>
      </Reveal>
    </div>
  )
}
