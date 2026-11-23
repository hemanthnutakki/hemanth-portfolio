import Reveal from '../ui/Reveal'
import PromptLab from './PromptLab'
import { aiPrompt as ai } from '../../data/profile'

// Deliberately concise: how I work with AI tools, three real applications, and one small interactive demo.
export default function PromptEngineering() {
  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 text-slate-300 lg:col-span-3">
          {ai.description.map((t, i) => <Reveal key={i} delay={0.08 * i}><p data-gaze className={i === 0 ? 'text-lg text-slate-100' : ''}>{t}</p></Reveal>)}
        </div>
        <ul className="grid gap-3 lg:col-span-2">
          {ai.applications.map(([name, text], i) => (
            <Reveal as="li" key={name} delay={0.1 + i * 0.08}>
              <div className="card-surface h-full p-4 transition-colors hover:border-cyan2/50"><h4 className="font-display text-sm font-bold text-white">{name}</h4><p className="mt-1 text-xs text-mute">{text}</p></div>
            </Reveal>
          ))}
        </ul>
      </div>
      <PromptLab />
    </div>
  )
}
