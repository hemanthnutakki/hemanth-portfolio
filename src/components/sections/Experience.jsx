import { CalendarDays, GraduationCap, MapPin } from 'lucide-react'
import Reveal from '../ui/Reveal'
import Pipeline from './Pipeline'
import { education, experience as e } from '../../data/profile'

const Dot = () => <span aria-hidden="true" className="absolute -left-[39px] top-8 h-3.5 w-3.5 rounded-full bg-cyan2 shadow-[0_0_16px_#22d3ee] md:-left-[55px]" />

export default function Experience() {
  return (
    <div className="ml-2 space-y-10 border-l border-white/10 pl-8 md:ml-4 md:pl-12">
      <Reveal className="relative">
        <Dot />
        <article className="card-surface p-6 md:p-8">
          <h3 className="font-display text-2xl font-bold">{e.role} <span className="text-mute">&middot;</span> <span className="text-grad">{e.company}</span></h3>
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute">
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {e.period}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {e.location}</span>
          </p>
          <h4 className="mt-6 font-semibold">{e.project}</h4>
          <p className="mt-1 text-slate-300">{e.summary}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {e.points.map((p) => <li key={p} className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />{p}</li>)}
          </ul>
          <Pipeline steps={e.flow} states={e.states} />
        </article>
      </Reveal>
      <Reveal className="relative" delay={0.1}>
        <Dot />
        <article className="card-surface p-6 md:p-8">
          <h3 className="inline-flex items-center gap-2 font-display text-xl font-bold"><GraduationCap size={20} className="text-cyan2" /> Education</h3>
          <ol className="mt-5 space-y-5">
            {education.history.map((h) => (
              <li key={h.title} className="flex flex-col gap-1 border-l border-cyan2/40 pl-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div>
                  <p className="font-semibold text-slate-100">{h.title}</p>
                  <p className="text-sm text-slate-300">{h.school}</p>
                </div>
                <p className="shrink-0 font-mono text-xs text-cyan2">{h.year} &middot; {h.score}</p>
              </li>
            ))}
          </ol>
        </article>
      </Reveal>
    </div>
  )
}
