import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-react'
import ProjectArt from './ProjectArt'

// Full detail view for one project: focus-trapped dialog, Esc to close, arrow keys to browse.
export default function ProjectDetail({ project: p, onClose, onNav }) {
  const panel = useRef(null), closeBtn = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onNav(1)
      else if (e.key === 'ArrowLeft') onNav(-1)
      else if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll('a[href],button:not([disabled])')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.() }
  }, [onClose, onNav])

  return createPortal(
    <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-ink/80 p-4 backdrop-blur-md" onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby="pd-title" data-lenis-prevent onClick={(e) => e.stopPropagation()}
        className="card-surface max-h-[88vh] w-full max-w-3xl overflow-y-auto"
        initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 26, stiffness: 260 }}>
        <div className="relative">
          <ProjectArt id={p.id} className="h-48 md:h-56" />
          <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close project details" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ink/70 backdrop-blur hover:bg-ink"><X size={18} /></button>
        </div>
        <div className="p-6 md:p-8">
          <p className="eyebrow">{p.type}</p>
          <h3 id="pd-title" className="mt-1 font-display text-3xl font-bold">{p.title}</h3>
          {p.role && <p className="mt-1 text-sm text-mute">{p.role}</p>}
          {p.status && <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 px-3 py-1 text-xs text-orange-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />{p.status} project</span>}
          <p className="mt-5 text-slate-300">{p.description}</p>
          {p.features && (
            <>
              <h4 className="mt-6 font-semibold">Key features</h4>
              <div className="mt-3 space-y-2">
                {p.features.map(([name, text], i) => (
                  <details key={name} className="group rounded-xl border border-white/10 bg-ink/40 px-4 py-3 open:border-orange-400/40">
                    <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-medium text-slate-100">
                      <span className="font-mono text-xs text-orange-300">0{i + 1}</span>{name}
                      <span aria-hidden="true" className="ml-auto text-mute transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2 text-sm text-slate-300">{text}</p>
                  </details>
                ))}
              </div>
            </>
          )}
          <h4 className="mt-6 font-semibold">{p.pointsTitle || 'Highlights'}</h4>
          <ul className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
            {p.points.map((x) => <li key={x} className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan2" />{x}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">{p.tech.map((t) => <span key={t} className="tag">{t}</span>)}</div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn-primary"><ExternalLink size={15} /> Live demo</a>}
              {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn"><Github size={15} /> GitHub</a>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => onNav(-1)} aria-label="Previous project" className="btn !p-3"><ChevronLeft size={16} /></button>
              <button type="button" onClick={() => onNav(1)} aria-label="Next project" className="btn !p-3"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}
