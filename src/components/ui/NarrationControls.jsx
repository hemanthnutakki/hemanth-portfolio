import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import useNarration from '../../hooks/useNarration'
import { emit } from '../../lib/kannaBus'

// Start / pause / resume / next / replay for one of Kanna's explanations. No long narration ever starts by itself.
export default function NarrationControls({ script, label = 'Start explanation', nextLabel = 'Next', className = '' }) {
  const s = useNarration(script)
  const send = (cmd) => emit('kanna:cmd', { cmd, script })
  const active = s.status === 'playing' || s.status === 'paused'
  const b = 'btn !px-4 !py-2 text-xs'
  return (
    <div role="group" aria-label="Kanna explanation controls" className={`flex flex-wrap items-center gap-2 ${className}`}>
      {!active && (
        <button type="button" onClick={() => send('start')} className="btn-primary !px-4 !py-2 text-xs">
          {s.status === 'done' ? <RotateCcw size={14} /> : <Play size={14} />}{s.status === 'done' ? 'Replay explanation' : label}
        </button>
      )}
      {active && (
        <>
          <button type="button" onClick={() => send(s.status === 'paused' ? 'resume' : 'pause')} className={b}>
            {s.status === 'paused' ? <Play size={14} /> : <Pause size={14} />}{s.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button type="button" onClick={() => send('next')} className={b}><SkipForward size={14} />{nextLabel}</button>
          <button type="button" onClick={() => send('replay')} className={b}><RotateCcw size={14} />Replay</button>
        </>
      )}
      <span aria-live="polite" className="font-mono text-xs text-mute">
        {active ? `Step ${s.index + 1} of ${s.total}${s.status === 'paused' ? ' (paused)' : ''}` : s.status === 'done' ? 'Finished' : ''}
      </span>
    </div>
  )
}
