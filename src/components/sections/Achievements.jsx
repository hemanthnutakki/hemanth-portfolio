import { Code2, FileText, Presentation, Sigma, Trophy } from 'lucide-react'
import Reveal from '../ui/Reveal'
import TiltCard from '../ui/TiltCard'
import Certifications from './Certifications'
import { achievements } from '../../data/profile'

const ICONS = [Trophy, Code2, Sigma, Presentation, FileText]

export default function Achievements() {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a, i) => {
          const Icon = ICONS[i % ICONS.length]
          return (
            <Reveal key={a} delay={i * 0.07} className="h-full">
              <TiltCard className="card-surface group h-full p-6 transition-colors hover:border-cyan2/50">
                <span style={{ transform: 'translateZ(35px)' }} className="grid h-12 w-12 place-items-center rounded-xl bg-grad-brand text-white shadow-[0_0_24px_rgba(59,130,246,.35)] transition group-hover:scale-110"><Icon size={22} /></span>
                <p style={{ transform: 'translateZ(20px)' }} className="mt-5 text-slate-200">{a}</p>
              </TiltCard>
            </Reveal>
          )
        })}
      </div>
      <Certifications />
    </>
  )
}
