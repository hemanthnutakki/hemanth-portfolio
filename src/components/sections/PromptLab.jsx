import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import NarrationControls from '../ui/NarrationControls'
import useNarration from '../../hooks/useNarration'
import useReducedMotion from '../../hooks/useReducedMotion'
import { emit, on } from '../../lib/kannaBus'
import { PARTS, SCENARIOS } from '../../data/promptLab'

const stagger = { hide: {}, show: { transition: { staggerChildren: 0.07 } } }
const card = { hide: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }

function Output({ title, text, accent }) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink/60 p-4" style={accent ? { borderColor: accent + '66' } : undefined}>
      <p className="font-mono text-[11px] uppercase tracking-[.2em] text-mute">{title}</p>
      <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200 sm:text-[13px]">{text}</pre>
    </div>
  )
}
function Basic({ sc }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 bg-slate2 p-4"><p className="font-mono text-[11px] uppercase tracking-[.2em] text-mute">Input &middot; basic request</p><p className="mt-2 font-mono text-sm text-slate-100">{sc.basic}</p></div>
      <Output title="Output · vague, unfocused" text={sc.basicOut} />
    </div>
  )
}
function Structured({ sc, hl, onHover, onLeave, reduced }) {
  return (
    <div className="space-y-3">
      <motion.div key={sc.id} variants={stagger} initial={reduced ? false : 'hide'} animate="show" className="grid gap-2">
        {PARTS.map((p) => {
          const on_ = hl === p.key
          return (
            <motion.div key={p.key} variants={card}>
              <div data-part={p.key} tabIndex={0} onMouseEnter={() => onHover(p.key)} onFocus={() => onHover(p.key)} onMouseLeave={onLeave} onBlur={onLeave}
                className="rounded-xl border bg-slate2 p-3 transition" style={{ borderColor: on_ ? p.color : 'rgba(255,255,255,.1)', boxShadow: on_ ? `0 0 24px ${p.color}55` : 'none', opacity: hl && !on_ ? 0.5 : 1 }}>
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white" style={{ background: p.color + '55' }}>{p.label}</span>
                <p className="mt-2 text-sm text-slate-200">{sc.parts[p.key]}</p>
                {on_ && <p className="mt-1.5 text-xs italic text-mute">{p.why}</p>}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
      <Output title="Output · structured and usable (illustrative)" text={sc.structuredOut} accent="#22d3ee" />
    </div>
  )
}

export default function PromptLab() {
  const reduced = useReducedMotion()
  const nar = useNarration('prompt')
  const [si, setSi] = useState(0)
  const [mode, setMode] = useState('structured')
  const [hl, setHl] = useState(null)
  const [copied, setCopied] = useState(false)
  const sc = SCENARIOS[si]
  const narrating = nar.status === 'playing' || nar.status === 'paused'
  useEffect(() => on('kanna:step', (e) => { const d = e.detail; if (d.script !== 'prompt') return; if (d.mode) setMode(d.mode); if ('part' in d) setHl(d.part || null) }), [])
  useEffect(() => { if (nar.status === 'idle' || nar.status === 'done') setHl(null) }, [nar.status])

  const structured = PARTS.map((p) => `${p.label}: ${sc.parts[p.key]}`).join('\n')
  const hover = (k) => { setHl(k); emit('kanna:focus', { script: 'prompt', part: k }) }
  const leave = () => { if (!narrating) setHl(null) }
  const copy = async () => {
    const text = mode === 'simple' ? sc.basic : structured
    try { await navigator.clipboard.writeText(text) } catch {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select(); try { document.execCommand('copy') } catch { /* ignore */ } ta.remove()
    }
    setCopied(true); setTimeout(() => setCopied(false), 1800)
  }
  const seg = (active) => `rounded-full border px-4 py-2 text-sm transition ${active ? 'border-transparent bg-electric/30 text-white ring-1 ring-electric' : 'border-white/10 text-mute hover:text-white'}`

  return (
    <div className="mt-14">
      <p data-gaze className="eyebrow">Interactive demonstration</p>
      <h3 data-gaze className="mt-2 font-display text-2xl font-bold md:text-3xl">Prompt laboratory</h3>
      <p className="mt-2 max-w-2xl text-sm text-mute">Input &rarr; prompt engineering &rarr; output. Pick a scenario, then compare a basic request with a structured prompt. Hover a prompt part to see why it matters.</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Scenario" className="flex flex-wrap gap-2">
          {SCENARIOS.map((s, i) => <button key={s.id} type="button" aria-pressed={si === i} onClick={() => setSi(i)} className={seg(si === i)}>{s.name}</button>)}
        </div>
        <div role="group" aria-label="Prompt style" className="flex flex-wrap gap-2">
          {[['simple', 'Simple'], ['structured', 'Structured'], ['compare', 'Compare']].map(([k, l]) => <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} className={seg(mode === k)}>{l}</button>)}
          <button type="button" data-lab="copy" onClick={copy} className="btn !px-4 !py-2 text-sm">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy prompt'}</button>
        </div>
      </div>
      <NarrationControls script="prompt" label="Explain prompt engineering" nextLabel="Next" className="mt-4" />

      <div data-lab="stage" className="card-surface mt-6 p-4 md:p-6">
        {mode === 'simple' && <Basic sc={sc} />}
        {mode === 'structured' && <Structured sc={sc} hl={hl} onHover={hover} onLeave={leave} reduced={reduced} />}
        {mode === 'compare' && (
          <div data-lab="compare" className="grid gap-6 md:grid-cols-2">
            <div><p className="mb-3 font-mono text-xs uppercase tracking-[.2em] text-red-300">Before &middot; simple prompt</p><Basic sc={sc} /></div>
            <div><p className="mb-3 font-mono text-xs uppercase tracking-[.2em] text-emerald-300">After &middot; structured prompt</p><Structured sc={sc} hl={hl} onHover={hover} onLeave={leave} reduced={reduced} /></div>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-mute">The outputs above are illustrative examples of structure, not real model responses.</p>
    </div>
  )
}
