import Reveal from '../ui/Reveal'
import TiltCard from '../ui/TiltCard'
import CountUp from '../ui/CountUp'
import { education, profile } from '../../data/profile'

function ProfileCard() {
  const z = (n) => ({ transform: `translateZ(${n}px)` })
  return (
    <TiltCard className="card-surface mx-auto max-w-sm p-8 text-center">
      <div style={z(55)} className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-grad-brand font-display text-4xl font-bold text-white shadow-[0_0_40px_rgba(59,130,246,.45)]">NH</div>
      <h3 style={z(40)} className="mt-5 font-display text-2xl font-bold">{profile.name}</h3>
      <p style={z(30)} className="mt-1 text-sm text-slate-300">{education.degree}</p>
      <p style={z(25)} className="mt-1 text-sm text-mute">{education.school}</p>
      <div style={z(30)} className="mt-4 flex flex-wrap justify-center gap-2">{profile.titles.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      <p style={z(20)} className="mt-4 font-mono text-xs text-cyan2">{education.detail}</p>
    </TiltCard>
  )
}

export default function About() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
      <div className="space-y-5 text-lg leading-relaxed text-slate-300">
        {profile.about.map((p, i) => <Reveal key={i} delay={i * 0.1}><p>{p}</p></Reveal>)}
      </div>
      <Reveal delay={0.15}><ProfileCard /></Reveal>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:col-span-2">
        {profile.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className="card-surface h-full p-5 text-center">
              <div className="font-display text-4xl font-bold text-grad"><CountUp value={s.value} decimals={s.decimals || 0} suffix={s.suffix || ''} /></div>
              <p className="mt-1 text-xs text-mute">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
