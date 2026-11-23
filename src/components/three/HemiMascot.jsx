import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { Pause, Play, SkipForward, X } from 'lucide-react'
import KannaModel from './KannaModel'
import useReducedMotion from '../../hooks/useReducedMotion'
import { Brain, clamp } from '../../lib/kannaAnim'
import { aimAngles, createTracker } from '../../lib/gazeTracker'
import { Narrator } from '../../lib/narrator'
import { autoStartStep } from '../../lib/autoStart'
import { emit, getTechPoint, on } from '../../lib/kannaBus'
import { PROJECT_SAY, SCRIPTS, SECTION_SCRIPT } from '../../data/mascotScript'
import { techInfo } from '../../data/toolkit'
import { sections } from '../../data/profile'

const ORDER = ['top', ...sections.map(([id]) => id)]
const sideOf = (id) => (ORDER.indexOf(id) % 2 === 0 ? 'right' : 'left')
const CHAT = ['Hi! Scroll on, I\u2019ll fly along.', 'Beep boop. Try hovering a project!', 'I run on a cyan energy core.', 'Hemanth built this whole site.']
const CLICK_GESTURES = ['wave', 'greet', 'thumbs', 'shrug', 'nod', 'fistPump']
const dims = () => { const w = window.innerWidth < 640 ? 120 : 176; return { w, h: Math.round(w * 1.25) } }

export default function HemiMascot() {
  const reduced = useReducedMotion()
  const [size, setSize] = useState(dims)
  const [side, setSide] = useState('right')
  const [bubble, setBubble] = useState(null)
  const [narr, setNarr] = useState(null)
  const wrap = useRef(null)
  const api = useRef({})
  const brain = useMemo(() => new Brain(), [])
  const x = useMotionValue(-400), y = useMotionValue(0), o = useMotionValue(0)
  const vel = useRef(() => ({ vx: x.getVelocity(), vy: y.getVelocity() })).current

  useEffect(() => {
    let sz = dims(), busy = true, pending = null, cur = 'top', wanted = null, hov = null
    let lastBye = -1e9, lastFlightEnd = -1e9, lastFocus = -1e9, chat = 0, hideT, wantT, ctl, recent = [], clicks = [], activeKey = null
    let visible = 'top'
    const played = {}, autoRun = {}, anchorSince = {}
    const timers = [], narrators = {}
    const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id) }
    const dockX = (s) => (s === 'right' ? window.innerWidth - sz.w - 10 : 10)
    const say = (text, ms = 4200, opts = {}) => {
      setBubble({ text, k: Math.random(), long: text.length > 110, action: opts.action })
      clearTimeout(hideT)
      hideT = setTimeout(() => setBubble(null), ms)
    }

    // ---- gaze: DOM positions -> head angles (see lib/gazeTracker.js) and autonomous content tracking
    const aim = (px, py) => aimAngles(px, py, wrap.current.getBoundingClientRect())
    const tracker = createTracker((id) => SECTION_SCRIPT[id] && SECTION_SCRIPT[id].targets, aim)
    const aimEl = (el) => { if (!el || !el.isConnected) return null; const p = tracker.point(el); return aim(p.x, p.y) }
    brain.autoFn = () => tracker.angles()
    brain.onGlance = () => tracker.glance()
    const refresher = setInterval(() => tracker.refresh(), 300)
    brain.face('right'); brain.setPose('confident'); brain.mood('friendly')

    // ---- section arrival: distinct short narration, mood, pose and one gesture per section
    const arrive = (id) => {
      const cfg = SECTION_SCRIPT[id] || SECTION_SCRIPT.top
      setSide(sideOf(id)); brain.face(sideOf(id))
      brain.setPose(cfg.pose); brain.mood(cfg.mood); brain.play(cfg.gesture)
      say(cfg.short, clamp(cfg.short.length * 60 + 1800, 4500, 10000), cfg.script && !cfg.auto ? { action: { label: cfg.action, script: cfg.script } } : {})
    }

    // ---- narration: each step moves the diagram/lab (via events), her gaze, a gesture, her face and the speech bubble
    const applyStep = (key, s, i, total, dur) => {
      emit('kanna:step', { script: key, index: i, total, ...(s.sync || {}) })
      if (s.mood) brain.flash(s.mood, dur / 1000)
      later(() => {
        const el = s.target ? document.querySelector(s.target) : null
        if (el) {
          const r = el.getBoundingClientRect()
          if (!autoRun[key] && (r.bottom < 0 || r.top > window.innerHeight)) el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
          brain.lookAt(() => aimEl(el), dur / 1000 + 0.3)
        }
        if (s.gesture && !busy) brain.play(s.gesture, { force: true })
      }, 140)
      say(s.text, dur + 500)
    }
    const onNarr = (key, st) => {
      emit('kanna:state', { script: key, status: st.status, index: st.index, total: st.total })
      if (st.status === 'paused') clearTimeout(hideT)
      if (st.status === 'playing' && st.text) say(st.text, st.remaining + 600)
      if (st.status === 'idle' || st.status === 'done') {
        if (activeKey === key) activeKey = null
        setNarr(null)
        if (st.status === 'idle') setBubble(null)
        if (st.status === 'done') later(() => setBubble(null), 2500)
      } else { activeKey = key; setNarr({ script: key, ...st }) }
    }
    const getNarrator = (key) => {
      if (!narrators[key]) narrators[key] = new Narrator({ steps: SCRIPTS[key].steps, onStep: (s, i, n, d) => applyStep(key, s, i, n, d), onState: (st) => onNarr(key, st) })
      return narrators[key]
    }
    const offCmd = on('kanna:cmd', (e) => {
      const { cmd, script } = e.detail || {}
      if (!SCRIPTS[script]) return
      const n = getNarrator(script)
      if (cmd === 'start' || cmd === 'replay') { if (activeKey && activeKey !== script) narrators[activeKey].stop(); autoRun[script] = false; played[script] = true; n.start() }
      else if (cmd === 'pause') n.pause()
      else if (cmd === 'resume') n.resume()
      else if (cmd === 'toggle') (n.status === 'paused' ? n.resume() : n.pause())
      else if (cmd === 'next') n.next()
      else if (cmd === 'stop') n.stop()
    })
    // clicking a diagram stage / prompt part: jump the narration there, or explain just that item
    const offFocus = on('kanna:focus', (e) => {
      const d = e.detail || {}, sc = SCRIPTS[d.script]
      if (!sc) return
      const idx = sc.steps.findIndex((s) => (d.stage !== undefined ? s.sync && s.sync.stage === d.stage && !s.sync.sub : s.sync && s.sync.part === d.part))
      if (idx < 0) return
      const n = getNarrator(d.script)
      if (n.status === 'playing' || n.status === 'paused') { n.goto(idx); return }
      const now = performance.now()
      if (now - lastFocus < 1200 || busy) return
      lastFocus = now
      const s = sc.steps[idx], el = document.querySelector(s.target)
      if (el) brain.lookAt(() => aimEl(el), 2.5)
      brain.flash(s.mood || 'curious', 2.5); brain.play('point'); say(s.text, 5200)
    })
    // hovering / selecting a technology in the 3D toolkit
    const offTech = on('kanna:tech', (e) => {
      const d = e.detail || {}
      if (activeKey) return
      brain.lookAt(() => { const p = getTechPoint(); return p ? aim(p.x, p.y) : null }, d.click ? 3 : 1.8)
      brain.flash(d.click ? 'happy' : 'curious', 1.6)
      if (d.click) { const i = techInfo[d.name]; brain.play('present'); say(`${d.name}: ${i ? i.use : ''}`, 6500) }
    })

    // ---- flight: anticipation (look toward destination, crouch), curved eased path, landing. Dwell + cooldown prevent spam while scrolling.
    const flight = (id) => {
      cur = id; wanted = null
      if (activeKey && SCRIPTS[activeKey].section !== id) narrators[activeKey].stop()
      const tx = dockX(sideOf(id)), x0 = x.get(), dx = tx - x0, dist = Math.abs(dx)
      if (reduced) { x.set(tx); arrive(id); return }
      busy = true; setBubble(null)
      const dir = Math.sign(dx) || (sideOf(id) === 'right' ? 1 : -1)
      brain.setLoco('takeoff', dir)
      brain.lookAt({ x: dir * 0.35, y: -0.05 }, 0.9)
      later(() => {
        brain.setLoco('fly', dir)
        const dur = dist < 5 ? 0.8 : clamp(0.8 + dist / 1300, 0.9, 1.6)
        const H = dist < 5 ? 60 : Math.min(95, 55 + dist * 0.035)
        ctl = animate(0, 1, {
          duration: dur, ease: [0.45, 0, 0.2, 1],
          onUpdate: (p) => { x.set(x0 + dx * p); y.set(-H * 4 * p * (1 - p)) },
          onComplete: () => {
            x.set(tx); y.set(0); brain.setLoco('land', 0)
            later(() => {
              brain.setLoco('ground', 0); busy = false; lastFlightEnd = performance.now(); arrive(id)
              if (pending && pending !== cur) { const n = pending; pending = null; request(n) }
            }, 700)
          }
        })
      }, 280)
    }
    const execute = (id) => {
      if (busy) { pending = id; return }
      const wait = lastFlightEnd + 1200 - performance.now()
      if (wait > 0) { later(() => { if (wanted === id) execute(id) }, wait); return }
      flight(id)
    }
    const request = (id) => {
      clearTimeout(wantT)
      if (id === cur) { wanted = null; pending = null; return }
      wanted = id
      wantT = setTimeout(() => { if (wanted === id) execute(id) }, 450)
    }
    const enter = () => {
      if (reduced) { x.set(dockX('right')); o.set(1); busy = false; later(() => arrive('top'), 600); return }
      x.set(dockX('left')); y.set(-window.innerHeight * 0.7); brain.setLoco('fly', 1)
      animate(o, 1, { duration: 0.5 })
      animate(x, dockX('right'), { duration: 1.9, ease: [0.22, 1, 0.36, 1] })
      animate(y, 0, { duration: 1.9, ease: [0.22, 1, 0.36, 1], onComplete: () => { brain.setLoco('land', 0); later(() => { brain.setLoco('ground', 0); busy = false; arrive('top') }, 700) } })
    }
    later(enter, 500)

    // Automatic explanations: start once per visit when the diagram/lab is mostly on screen and the visitor has settled in the section.
    const checkAuto = () => {
      const cfg = SECTION_SCRIPT[cur], sc = cfg && cfg.script ? SCRIPTS[cfg.script] : null
      const el = sc && sc.anchor ? document.querySelector(sc.anchor) : null
      let vis = 0
      if (el) { const r = el.getBoundingClientRect(), vh = window.innerHeight; vis = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / Math.min(r.height || 1, vh * 0.8) }
      const d = autoStartStep({ reduced, busy, pending, activeKey, hidden: document.hidden, cfg, played, visible, cur, vis, since: cfg ? anchorSince[cfg.script] : 0, now: performance.now() })
      if (cfg && cfg.script) anchorSince[cfg.script] = d.since
      if (d.start) { played[cfg.script] = true; autoRun[cfg.script] = true; getNarrator(cfg.script).start() }
    }
    const autoWatch = setInterval(checkAuto, 600)

    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { visible = e.target.id; tracker.setSection(e.target.id); request(e.target.id) } }), { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    const onScroll = () => { if (window.scrollY < 120) { visible = 'top'; tracker.setSection('top'); request('top') } }

    // ---- cursor and interaction handlers
    const onMove = (e) => {
      if (!wrap.current) return
      if (e.pointerType === 'touch') { brain.pointer(0, 0, 999, false); return }
      const a = aim(e.clientX, e.clientY)
      brain.pointer(a.x, a.y, a.dist, true)
    }
    const over = (e) => {
      const el = e.target.closest && e.target.closest('[data-project]')
      if (!el || el === hov) return
      hov = el
      if (busy || activeKey) return
      brain.flash('happy', 2.4); brain.play('excited'); brain.lookAt(() => aimEl(el), 2.2)
      later(() => { if (hov === el) brain.play('point') }, 1100)
      const t = PROJECT_SAY[el.dataset.project] || 'Ooh, this one is good!'
      say(t, clamp(t.length * 55 + 2000, 5000, 9000))
    }
    const out = (e) => { const el = e.target.closest && e.target.closest('[data-project]'); if (el && !el.contains(e.relatedTarget)) hov = null }
    const pick = (e) => {
      const el = e.target.closest && e.target.closest('[data-project]')
      if (!el || busy || activeKey) return
      brain.play('nod', { force: true }); brain.flash('happy', 2); brain.lookAt(() => aimEl(el), 1.6)
      say('Great pick! Hemanth will be happy you looked.', 3500)
    }
    const bye = (e) => {
      const now = performance.now()
      if (e.relatedTarget || e.clientY > 0 || now - lastBye < 30000 || busy) return
      lastBye = now; brain.play('bye', { force: true }); brain.flash('friendly', 2.6); say('Leaving already? See you soon!', 3200)
      brain.pointer(0, 0, 999, false)
    }
    const onResize = () => { sz = dims(); setSize(sz); if (!busy) x.set(dockX(sideOf(cur))) }

    // Clicking Kanna: a random gesture that avoids the last two; three quick clicks = surprise + little dance.
    api.current.hi = () => {
      if (busy) return
      const now = performance.now()
      clicks = clicks.filter((t) => now - t < 2200); clicks.push(now)
      if (clicks.length >= 3) {
        clicks = []; brain.play('surprise', { force: true }); say('Whoa! You found my secret dance!', 3600)
        later(() => brain.play('dance', { force: true }), 1500); return
      }
      const g = CLICK_GESTURES.filter((n) => !recent.includes(n)), name = g[Math.floor(Math.random() * g.length)]
      recent = [name, ...recent].slice(0, 2)
      brain.play(name, { force: true }); say(CHAT[chat++ % CHAT.length], 3200)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)
    document.addEventListener('focusin', over)
    document.addEventListener('focusout', out)
    document.addEventListener('click', pick)
    document.addEventListener('mouseout', bye)
    return () => {
      window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize)
      document.removeEventListener('pointerover', over); document.removeEventListener('pointerout', out)
      document.removeEventListener('focusin', over); document.removeEventListener('focusout', out)
      document.removeEventListener('click', pick); document.removeEventListener('mouseout', bye)
      offCmd(); offFocus(); offTech()
      io.disconnect(); clearInterval(refresher); clearInterval(autoWatch); timers.forEach(clearTimeout); clearTimeout(hideT); clearTimeout(wantT)
      Object.values(narrators).forEach((n) => n.stop()); ctl && ctl.stop()
      brain.autoFn = null; brain.onGlance = null
    }
  }, [reduced, brain, x, y, o])

  const right = side === 'right'
  const playing = narr && (narr.status === 'playing' || narr.status === 'paused')
  const cmd = (c, script) => emit('kanna:cmd', { cmd: c, script })
  return (
    <motion.div ref={wrap} className="pointer-events-none fixed left-0 z-50"
      style={{ x, y, opacity: o, width: size.w, height: size.h, bottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}>
      <AnimatePresence>
        {bubble && (
          <motion.div key={bubble.k} role="status" initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
            className={`absolute bottom-full mb-1 w-max rounded-2xl border border-cyan2/30 bg-navy/90 px-3 py-2 text-xs leading-snug text-slate-100 shadow-lg backdrop-blur ${bubble.long ? 'max-w-[250px] sm:max-w-[320px]' : 'max-w-[170px] sm:max-w-[220px]'} ${right ? 'right-1' : 'left-1'}`}>
            <p>{bubble.text}</p>
            {bubble.action && !playing && (
              <button type="button" onClick={() => cmd('start', bubble.action.script)} className="pointer-events-auto mt-2 rounded-full bg-grad-brand px-3 py-1 text-[11px] font-medium text-white">{bubble.action.label}</button>
            )}
            {playing && (
              <div className="pointer-events-auto mt-2 flex items-center gap-1.5">
                <button type="button" aria-label={narr.status === 'paused' ? 'Resume explanation' : 'Pause explanation'} onClick={() => cmd('toggle', narr.script)} className="rounded-full bg-white/10 p-1.5 hover:bg-white/20">{narr.status === 'paused' ? <Play size={12} /> : <Pause size={12} />}</button>
                <button type="button" aria-label="Next step" onClick={() => cmd('next', narr.script)} className="rounded-full bg-white/10 p-1.5 hover:bg-white/20"><SkipForward size={12} /></button>
                <button type="button" aria-label="Stop explanation" onClick={() => cmd('stop', narr.script)} className="rounded-full bg-white/10 p-1.5 hover:bg-white/20"><X size={12} /></button>
                <span className="font-mono text-[10px] text-mute">{narr.index + 1}/{narr.total}</span>
              </div>
            )}
            <span aria-hidden className={`absolute -bottom-1.5 h-3 w-3 rotate-45 border-b border-r border-cyan2/30 bg-navy/90 ${right ? 'right-8' : 'left-8'}`} />
          </motion.div>
        )}
      </AnimatePresence>
      <Canvas aria-hidden dpr={[1, 1.5]} camera={{ position: [0, 0.1, 5.2], fov: 32 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        frameloop={reduced ? 'demand' : 'always'} style={{ pointerEvents: 'none' }}>
        <KannaModel brain={brain} reduced={reduced} vel={vel} />
      </Canvas>
      <button type="button" aria-label="Kanna, the portfolio guide. Activate to say hi" onClick={() => api.current.hi && api.current.hi()}
        className="pointer-events-auto absolute inset-x-5 bottom-1 top-3 rounded-3xl" />
    </motion.div>
  )
}
