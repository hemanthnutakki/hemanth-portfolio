import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { sections } from '../../data/profile'
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    sections.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [open])
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink/70 backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top,0px)' }}>
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-[5vw] py-3">
        <a href="#top" className="font-display text-sm font-bold tracking-[.18em]">N.HEMANTH</a>
        <button className="xl:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        <ul className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 bg-ink px-[5vw] py-3 xl:static xl:flex xl:flex-row xl:bg-transparent xl:p-0`}>
          {sections.map(([id, label]) => (
            <li key={id}><a href={`#${id}`} onClick={() => setOpen(false)} aria-current={active === id ? 'true' : undefined} className={`block rounded-full px-3 py-1.5 text-sm transition ${active === id ? 'bg-electric/20 text-white' : 'text-mute hover:text-white'}`}>{label}</a></li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
