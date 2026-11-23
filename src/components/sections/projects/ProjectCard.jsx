import { ExternalLink, Github } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import TiltCard from '../../ui/TiltCard'
import ProjectArt from './ProjectArt'

// data-project is what Kanna listens for (hover = excited + speech, click = reaction).
export default function ProjectCard({ p, index, onOpen }) {
  const shown = p.tech.slice(0, 5)
  const warm = p.accent === 'orange'
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <TiltCard data-project={p.id} onClick={() => onOpen(index)} className={`card-surface group flex h-full cursor-pointer flex-col transition-colors ${warm ? 'hover:border-orange-400/60' : 'hover:border-cyan2/50'}`}>
        <div style={{ transform: 'translateZ(0)' }} className="overflow-hidden rounded-t-2xl"><ProjectArt id={p.id} /></div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs tracking-[.2em] text-mute">PROJECT 0{index + 1}</span>
            {p.status && <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs text-orange-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />{p.status}</span>}
          </div>
          <h3 style={{ transform: 'translateZ(30px)' }} className="mt-2 font-display text-xl font-bold">{p.title}</h3>
          <p className="mt-1 text-sm text-mute">{[p.role, p.type].filter(Boolean).join(' \u00B7 ')}</p>
          <p className="mt-3 line-clamp-3 text-sm text-slate-300">{p.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {shown.map((t) => <span key={t} className="tag">{t}</span>)}
            {p.tech.length > shown.length && <span className="tag">+{p.tech.length - shown.length}</span>}
          </div>
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <button type="button" onClick={(e) => { e.stopPropagation(); onOpen(index) }} className="btn-primary !px-5 !py-2">View details</button>
            {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn !px-5 !py-2"><ExternalLink size={14} /> Live demo</a>}
            {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn !px-5 !py-2"><Github size={14} /> GitHub</a>}
          </div>
        </div>
      </TiltCard>
    </Reveal>
  )
}
