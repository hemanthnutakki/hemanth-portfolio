import { Github, Linkedin, Mail, Phone } from 'lucide-react'
import Reveal from '../ui/Reveal'
import ContactForm from './ContactForm'
import { profile } from '../../data/profile'

// Only links that were actually supplied are rendered.
const LINKS = [
  { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
  profile.linkedin && { icon: Linkedin, label: 'LinkedIn', href: profile.linkedin, ext: true },
  profile.github && { icon: Github, label: 'GitHub', href: profile.github, ext: true }
].filter(Boolean)

export default function Contact() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 [perspective:800px] lg:block">
        <div className="absolute inset-0 rounded-full bg-grad-brand opacity-20 blur-3xl" />
        {[0, 1, 2].map((i) => <div key={i} className="orbit absolute rounded-full border border-cyan2/30" style={{ inset: i * 50, animationDuration: `${24 + i * 10}s` }} />)}
      </div>
      <div className="relative grid gap-8 lg:grid-cols-5">
        <Reveal className="lg:col-span-2 lg:pl-24">
          <p className="max-w-sm text-slate-300">Open to engineering roles, research collaboration and ambitious product ideas. Write to me and I&rsquo;ll reply.</p>
          <ul className="mt-8 space-y-3">
            {LINKS.map(({ icon: Icon, label, href, ext }) => (
              <li key={href}>
                <a href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="card-surface flex items-center gap-4 p-4 transition hover:border-cyan2/50">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-cyan2"><Icon size={18} /></span>
                  <span className="text-sm">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-3"><ContactForm /></Reveal>
      </div>
    </div>
  )
}
