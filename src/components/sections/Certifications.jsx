import { Award, ExternalLink } from 'lucide-react'
import Reveal from '../ui/Reveal'
import TiltCard from '../ui/TiltCard'
import { certifications } from '../../data/profile'

export default function Certifications() {
  return (
    <div className="mt-20">
      <Reveal><h3 className="font-display text-2xl font-bold md:text-3xl">Certifications</h3></Reveal>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {certifications.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08} className="h-full">
            <TiltCard className="h-full rounded-2xl bg-grad-brand p-px">
              <div className="flex h-full flex-col rounded-[15px] bg-navy p-6">
                <span style={{ transform: 'translateZ(30px)' }} className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-cyan2"><Award size={24} /></span>
                <h4 style={{ transform: 'translateZ(20px)' }} className="mt-4 font-display text-lg font-bold leading-snug">{c.title}</h4>
                {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn mt-auto !px-4 !py-2 text-xs self-start"><ExternalLink size={13} /> Verify</a>}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
