import { useEffect, useState } from 'react'
import NarrationControls from '../ui/NarrationControls'
import { emit, on } from '../../lib/kannaBus'

// Interactive architecture diagram. Only ONE stage is active at a time; Kanna's narration (or your click) moves it.
export default function Pipeline({ steps, states }) {
  const [stage, setStage] = useState(0)
  const [sub, setSub] = useState(null)
  useEffect(() => on('kanna:step', (e) => {
    const d = e.detail
    if (d.script !== 'incedo' || !d.stage) return
    setStage(d.stage - 1); setSub(d.sub || null)
  }), [])
  const choose = (k) => { setStage(k); setSub(null); emit('kanna:focus', { script: 'incedo', stage: k + 1 }) }
  const lanes = [...new Set(steps.map((s) => s.lane))]
  const tone = { red: 'bg-red-500/20 text-red-300', amber: 'bg-amber-500/20 text-amber-300', green: 'bg-emerald-500/20 text-emerald-300' }
  const subInfo = sub && states.find(([k]) => k === sub)

  return (
    <div className="mt-8" data-gaze="pipeline">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">Detection &amp; prediction workflow</p>
        <NarrationControls script="incedo" label="Start explanation" nextLabel="Next stage" />
      </div>

      {lanes.map((lane, li) => {
        const items = steps.map((s, k) => ({ s, k })).filter((x) => x.s.lane === lane)
        return (
          <div key={lane} className="mt-5">
            <p className="font-mono text-[11px] uppercase tracking-[.25em] text-mute">{lane}</p>
            <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {items.map(({ s, k }, idx) => (
                <li key={s.title} data-stage={k + 1} className={`relative rounded-xl border transition ${stage === k ? 'border-cyan2 bg-cyan2/10 shadow-[0_0_24px_rgba(34,211,238,.18)]' : 'border-white/10 bg-slate2'}`}>
                  <button type="button" aria-current={stage === k ? 'step' : undefined} onClick={() => choose(k)} className={`w-full p-3 text-left text-sm ${stage === k ? 'text-white' : 'text-mute hover:text-white'}`}>
                    <span className="font-mono text-xs text-cyan2">0{k + 1}</span>
                    <span className="mt-1 block font-medium">{s.title}</span>
                  </button>
                  {k === 3 && (
                    <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                      {states.map(([key, label]) => (
                        <button key={key} type="button" data-sub={key} aria-pressed={sub === key} onClick={() => { setStage(3); setSub(key); emit('kanna:focus', { script: 'incedo', stage: 4 }) }}
                          className={`rounded-full px-2.5 py-0.5 text-xs transition ${tone[key]} ${sub === key ? 'ring-1 ring-current' : 'opacity-80 hover:opacity-100'}`}>{label}</button>
                      ))}
                    </div>
                  )}
                  {idx < items.length - 1 && <span aria-hidden="true" className={`hidden lg:block ${stage === k ? 'flow-link' : 'flow-link-idle'}`} />}
                </li>
              ))}
            </ol>
            {li < lanes.length - 1 && <div aria-hidden="true" className={`mx-auto mt-3 h-6 w-[2px] ${stage === 3 ? 'flow-vlink' : 'bg-white/10'}`} />}
          </div>
        )
      })}

      <div aria-live="polite" className="mt-5 rounded-xl border border-white/10 bg-ink/50 p-4 text-sm text-slate-300">
        {subInfo ? <p><span className={`mr-2 rounded-full px-2.5 py-0.5 text-xs ${tone[subInfo[0]]}`}>{subInfo[1]}</span>{subInfo[2]}</p> : <p><strong className="text-white">{steps[stage].title}.</strong> {steps[stage].text}</p>}
      </div>
    </div>
  )
}
