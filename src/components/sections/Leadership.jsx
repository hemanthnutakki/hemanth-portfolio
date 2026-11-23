import { useState } from 'react'
import { Trophy } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { leadership } from '../../data/profile'

// Event-inspired: stage beams, a backdrop word, and a "run of show" list that lights up as you explore it.
function Position({ l, index }) {
  const [on, setOn] = useState(0)
  return (
    <Reveal delay={index * 0.1}>
      <article className="card-surface relative overflow-hidden p-6 md:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-56 overflow-hidden">
          <span className="beam left-[20%] [--r:-14deg]" /><span className="beam left-[50%]" /><span className="beam left-[80%] [--r:14deg]" />
        </div>
        <p aria-hidden="true" className="pointer-events-none absolute right-6 top-4 select-none font-display text-6xl font-bold text-white/[0.06] md:text-9xl">{l.backdrop}</p>
        <div className="relative">
          <p className="eyebrow">Position 0{index + 1} &middot; {l.org}</p>
          <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">{l.role}</h3>
          <p className="mt-4 max-w-2xl text-slate-300">{l.description}</p>
          <h4 className="mt-8 font-mono text-xs uppercase tracking-[.2em] text-cyan2">{l.listTitle}</h4>
          <ol className="mt-4 space-y-2 border-l border-white/10 pl-5">
            {l.points.map((p, i) => (
              <li key={p} className="relative">
                <span aria-hidden="true" className={`absolute -left-[26px] top-4 h-2.5 w-2.5 rounded-full transition ${on === i ? 'bg-cyan2 shadow-[0_0_14px_#22d3ee]' : 'bg-white/20'}`} />
                <button type="button" onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)} aria-current={on === i ? 'step' : undefined}
                  className={`flex w-full gap-4 rounded-xl border px-4 py-3 text-left text-sm transition ${on === i ? 'border-cyan2/50 bg-cyan2/10 text-white' : 'border-transparent text-mute hover:text-white'}`}>
                  <span className="shrink-0 font-mono text-xs text-cyan2">CUE 0{i + 1}</span><span>{p}</span>
                </button>
              </li>
            ))}
          </ol>
          {l.achievement && (
            <div className="mt-8 rounded-2xl bg-grad-brand p-px">
              <div className="flex items-start gap-4 rounded-[15px] bg-navy p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-amber-300"><Trophy size={22} /></span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[.2em] text-cyan2">Achievement</p>
                  <p className="mt-1 text-slate-100">{l.achievement}</p>
                </div>
              </div>
            </div>
          )}
          {l.skills && (
            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-[.2em] text-mute">Key skills demonstrated</p>
              <div className="mt-3 flex flex-wrap gap-2">{l.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div>
            </div>
          )}
        </div>
      </article>
    </Reveal>
  )
}

export default function Leadership() {
  return <div className="space-y-8">{leadership.map((l, i) => <Position key={l.id} l={l} index={i} />)}</div>
}
