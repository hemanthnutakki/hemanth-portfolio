import { useEffect, useState } from 'react'
import { on } from '../lib/kannaBus'
// Mirrors the state of one of Kanna's narrations (idle | playing | paused | done).
export default function useNarration(script) {
  const [s, setS] = useState({ status: 'idle', index: -1, total: 0 })
  useEffect(() => on('kanna:state', (e) => { if (e.detail.script === script) setS(e.detail) }), [script])
  return s
}
