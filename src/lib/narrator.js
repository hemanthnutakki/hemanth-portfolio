// Plays a script step by step with pause / resume / next / replay / goto. No audio: captions only.
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

export class Narrator {
  constructor({ steps, onStep, onState }) {
    this.steps = steps; this.onStep = onStep; this.onState = onState
    this.i = -1; this.status = 'idle'; this.timer = null; this.deadline = 0; this.remaining = 0
  }
  static duration(s) { return s.dur ?? clamp(s.text.length * 40 + 600, 2000, 6000) }
  state(extra) { this.onState({ status: this.status, index: this.i, total: this.steps.length, ...extra }) }
  start() { clearTimeout(this.timer); this.i = -1; this.status = 'playing'; this._advance() }
  _advance() {
    this.i++
    if (this.i >= this.steps.length) { this.status = 'done'; this.timer = null; this.state(); return }
    const s = this.steps[this.i], dur = Narrator.duration(s)
    this.onStep(s, this.i, this.steps.length, dur)
    this.deadline = Date.now() + dur
    this.timer = setTimeout(() => this._advance(), dur)
    this.state()
  }
  pause() { if (this.status !== 'playing') return; clearTimeout(this.timer); this.remaining = Math.max(300, this.deadline - Date.now()); this.status = 'paused'; this.state() }
  resume() {
    if (this.status !== 'paused') return
    this.status = 'playing'; this.deadline = Date.now() + this.remaining
    this.timer = setTimeout(() => this._advance(), this.remaining)
    this.state({ text: this.steps[this.i].text, remaining: this.remaining })
  }
  next() { if (this.status === 'idle' || this.status === 'done') return; clearTimeout(this.timer); this.status = 'playing'; this._advance() }
  goto(idx) { clearTimeout(this.timer); this.i = idx - 1; this.status = 'playing'; this._advance() }
  replay() { this.start() }
  stop() { clearTimeout(this.timer); this.timer = null; this.i = -1; this.status = 'idle'; this.state() }
}
