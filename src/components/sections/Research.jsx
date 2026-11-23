import { BadgeCheck, ExternalLink, FlaskConical } from 'lucide-react'
import Reveal from '../ui/Reveal'
import TiltCard from '../ui/TiltCard'
import { research } from '../../data/profile'

export default function Research() {
  const { publication: pub, interests, reviewer } = research
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Reveal className="lg:col-span-3">
        <TiltCard max={5} className="card-surface relative h-full overflow-hidden p-6 md:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(34,211,238,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.25)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(135deg,black,transparent_70%)]" />
          <div className="relative">
            <p className="eyebrow">Selected publication &middot; {pub.publisher} &middot; {pub.date}</p>
            <h3 className="mt-3 font-display text-xl font-bold leading-snug md:text-2xl">{pub.title}</h3>
            <p className="mt-3 text-sm text-slate-300">
              {pub.authors.map((a, i) => (
                <span key={a}>{a === 'N. Hemanth' ? <strong className="text-white">{a}</strong> : a}{i < pub.authors.length - 1 ? ', ' : ''}</span>
              ))}
            </p>
            <p className="mt-2 text-sm italic text-mute">{pub.conference}. {pub.publisher}, pp. {pub.pages}.</p>
            <h4 className="mt-6 font-mono text-xs uppercase tracking-[.2em] text-cyan2">Abstract</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{pub.abstract}</p>
            {pub.url && <a href={pub.url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6"><ExternalLink size={15} /> Read on IEEE Xplore</a>}
          </div>
        </TiltCard>
      </Reveal>

      <div className="space-y-6 lg:col-span-2">
        <Reveal delay={0.1}>
          <div className="card-surface p-6">
            <h3 className="inline-flex items-center gap-2 font-display text-lg font-bold"><FlaskConical size={18} className="text-cyan2" /> Research interests</h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-300">
              {interests.map((t, i) => (
                <li key={t} className="flex gap-3"><span className="font-mono text-xs text-cyan2">0{i + 1}</span>{t}</li>
              ))}
            </ol>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="rounded-2xl bg-grad-brand p-px">
            <div className="rounded-[15px] bg-navy p-6">
              <h3 className="inline-flex items-center gap-2 font-display text-lg font-bold"><BadgeCheck size={18} className="text-cyan2" /> IEEE Reviewer</h3>
              <p className="mt-2 text-sm text-slate-300">Worked as an IEEE reviewer for:</p>
              <div className="mt-3 flex flex-wrap gap-2">{reviewer.map((r) => <span key={r} className="tag">{r}</span>)}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
