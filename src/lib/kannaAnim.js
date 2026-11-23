// Kanna's "brain": pure JS (no React/Three) so it can be tested headlessly.
// Layers, blended every frame: locomotion > gesture > expression > gaze > idle life (breath, float, saccades, idle events).
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
export const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt))
const sm = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x) }
const lerp = (a, b, t) => a + (b - a) * t
const rnd = (a, b) => a + Math.random() * (b - a)
const pick = (arr, not) => { const o = arr.filter((a) => a !== not); return o[Math.floor(Math.random() * o.length)] }

// Slightly under-damped spring: gives the head natural follow-through when the cursor moves fast.
class Spring {
  constructor(k, c) { this.k = k; this.c = c; this.x = 0; this.v = 0 }
  step(target, dt) {
    const n = Math.max(1, Math.ceil(dt * 120)), h = dt / n
    for (let i = 0; i < n; i++) { this.v += (this.k * (target - this.x) - this.c * this.v) * h; this.x += this.v * h }
    return this.x
  }
}

// ex/ey eye size, bl/br brow lift (left/right), ba brow tilt, sw/sc smile width/curve, mo open mouth, bo brow opacity, tk "thinking" gaze bias
const E = (o) => ({ ex: 1, ey: 1, bl: 0, br: 0, ba: 0, sw: 0.9, sc: 0.8, mo: 0, bo: 0.55, tk: 0, ...o })
export const EXPR = {
  relaxed: E({}),
  happy: E({ ex: 1.08, ey: 0.82, bl: 0.035, br: 0.035, ba: 0.12, sw: 1.4, sc: 1.4, bo: 0.9 }),
  friendly: E({ ex: 1.02, ey: 0.96, bl: 0.018, br: 0.018, ba: 0.05, sw: 1.2, sc: 1.15, bo: 0.75 }),
  curious: E({ ex: 1.08, ey: 1.14, bl: 0.05, br: 0.005, ba: -0.12, sw: 0.65, sc: 0.5, bo: 0.95 }),
  thinking: E({ ex: 0.98, ey: 0.78, bl: -0.012, br: 0.04, ba: 0.18, sw: 0.6, sc: 0.2, bo: 0.95, tk: 1 }),
  surprised: E({ ex: 1.3, ey: 1.45, bl: 0.07, br: 0.07, sw: 0.001, sc: 0.12, mo: 1, bo: 1 })
}

// Idle standing poses (arm rest angles, chest lean, head roll). Arm angles come from the forward-kinematics check.
const POSES = {
  neutral: { ax: 0, az: 0.15, ae: 0.12, lean: 0, roll: 0 },
  confident: { ax: 0, az: 0.3, ae: 0.2, lean: -0.03, roll: 0 },
  relaxed: { ax: -0.1, az: 0.12, ae: 0.25, lean: 0.02, roll: 0.02 },
  lean: { ax: -0.15, az: 0.18, ae: 0.2, lean: 0.07, roll: 0 }
}

// Gestures. fn(t, u, ctx) returns target values (P = primary/inner arm, S = secondary); an in/out envelope blends them with the idle pose.
// All arm angles were checked against head/body collision. Clapping and a true hand-to-chin pose are out of reach for this rig, so they are not included.
export const G = {
  wave: { dur: 2.6, pri: 2, cool: 3, expr: 'friendly', fn: (t, u, c) => ({ pAx: 0, pAz: 2.45, pAe: 0.55 + 0.4 * Math.sin(t * 11), crouch: t < 0.15 ? 0.03 : 0, roll: 0.06 * Math.sin(t * 2.2), yaw: c.dir * 0.1 }) },
  bye: { dur: 2.6, pri: 3, cool: 4, expr: 'friendly', fn: (t, u) => ({ pAz: 2.45, pAe: 0.5 + 0.35 * Math.sin(t * 8) * (1 - 0.5 * u), roll: 0.07 * Math.sin(t * 2), nod: u > 0.75 ? 0.1 * Math.sin((u - 0.75) * 20) : 0 }) },
  greet: { dur: 2.2, pri: 2, cool: 5, expr: 'happy', fn: (t) => { const az = 0.55 + 0.25 * Math.sin(t * 3); return { pAx: -1.9, pAz: az, pAe: 0.8, sAx: -1.9, sAz: az, sAe: 0.8, lean: 0.04, nod: 0.05 * Math.sin(t * 3) } } },
  thumbs: { dur: 1.9, pri: 2, cool: 5, expr: 'happy', fn: (t) => ({ pAx: -1.75, pAz: 0.1, pAe: 0.5 + 0.06 * Math.sin(t * 6), nod: 0.08 * Math.max(0, Math.sin(t * 5)) }) },
  think: { dur: 3.4, pri: 1, cool: 8, expr: 'thinking', fn: (t, u) => ({ pAx: -1.7, pAz: 0, pAe: 0.95, roll: 0.14 * Math.sin(u * Math.PI), yaw: 0.1 * Math.sin(t * 0.9) }) },
  tilt: { dur: 1.8, pri: 1, cool: 6, expr: 'thinking', fn: (t, u) => ({ roll: 0.2 * Math.sin(u * Math.PI), nod: 0.03 }) },
  nod: { dur: 1.1, pri: 1, cool: 1.5, expr: 'friendly', fn: (t, u) => ({ nod: 0.16 * Math.abs(Math.sin(t * 6.5)) * (1 - u) }) },
  point: { dur: 2.4, pri: 2, cool: 1.5, expr: 'curious', fn: (t, u, c) => ({ pAx: -0.2, pAz: 1.45, pAe: 0, lean: 0.03, yaw: c.dir * 0.25, nod: 0.02 * Math.sin(t * 7) }) },
  present: { dur: 2.6, pri: 2, cool: 6, expr: 'happy', fn: (t, u, c) => ({ pAx: -1.45, pAz: 0.8 + 0.25 * Math.sin(t * 2.2), pAe: 0.4, yaw: c.dir * 0.2, roll: 0.04 * Math.sin(t * 2.2) }) },
  excited: { dur: 1.4, pri: 3, cool: 1.2, expr: 'happy', fn: (t) => ({ crouch: t < 0.14 ? 0.05 * (t / 0.14) : 0, hop: t < 0.14 ? 0 : Math.abs(Math.sin((t - 0.14) * 7)) * 0.14, pAz: 2.4 + 0.25 * Math.sin(t * 13), pAe: 0.2, sAz: 2.4 + 0.25 * Math.sin(t * 13 + 1.6), sAe: 0.2, nod: 0.06 * Math.sin(t * 8) }) },
  fistPump: { dur: 2.1, pri: 2, cool: 5, expr: 'happy', fn: (t) => { const on = sm((t - 0.25) / 0.2) * sm((1.7 - t) / 0.2); return { crouch: t < 0.15 ? 0.04 : 0, pAx: 0.1, pAz: 2.8, pAe: 0.9 + 0.5 * Math.sin(t * 9) * on, hop: 0.07 * Math.abs(Math.sin(t * 6)) * on, lean: 0.05 * on } } },
  shrug: { dur: 1.7, pri: 1, cool: 8, expr: 'curious', fn: (t, u) => { const s = Math.sin(u * Math.PI); return { pAx: -0.8, pAz: 0.75, pAe: 1.25, sAx: -0.8, sAz: 0.75, sAe: 1.25, hop: 0.025 * s, roll: 0.1 * Math.sin(u * Math.PI * 2), nod: -0.04 * s } } },
  dance: { dur: 3.4, pri: 4, cool: 10, expr: 'happy', fn: (t) => ({ crouch: t < 0.15 ? 0.05 : 0, hop: 0.1 * Math.abs(Math.sin(t * 6)), pAz: 2.2 + 0.4 * Math.sin(t * 6), pAe: 0.3, sAz: 2.2 + 0.4 * Math.sin(t * 6 + Math.PI), sAe: 0.3, roll: 0.14 * Math.sin(t * 3), yaw: 0.35 * Math.sin(t * 3), sway: 0.05 * Math.sin(t * 3) }) },
  surprise: { dur: 1.5, pri: 4, cool: 6, expr: 'surprised', fn: (t) => ({ crouch: t < 0.12 ? 0.06 : 0, hop: t > 0.12 && t < 0.5 ? 0.14 * Math.sin(((t - 0.12) / 0.38) * Math.PI) : 0, pAz: 0.9, pAe: 0.3, sAz: 0.9, sAe: 0.3, lean: -0.06 }) }
}
const IDLE = ['lookAround', 'lookDown', 'thinkTilt', 'shift', 'glance', 'microSmile', 'browPop', 'hum']

export class Brain {
  constructor() {
    this.t = 0; this.dock = 'right'; this.reduced = false; this.invalidate = null; this.onGlance = null
    this.pose = { ...POSES.confident }; this.poseName = 'confident'; this.poseWant = 'confident'
    this.moodName = 'friendly'; this.flashName = null; this.flashUntil = 0
    this.ex = { ...EXPR.relaxed }
    this.cur = { x: 0, y: 0, dist: 999, active: false, t: -99 }
    this.eye = { x: 0, y: 0 }; this.hd = { x: 0, y: 0 }; this.sy = new Spring(34, 7.5); this.sp = new Spring(34, 7.5)
    this.sac = { x: 0, y: 0, next: 1 }; this.scan = { x: 0, y: 0, next: 2 }
    this.focus = null; this.away = null; this.nextAway = 8; this.seq = null
    this.autoFn = null; this.autoAng = null; this.focusAng = null; this.tick = 0.1 // gaze inputs are angles in radians; autoFn() = content target, focus.target may be a function
    this.near = false; this.nearUntil = 0
    this.gest = null; this.cool = {}; this.lastStart = -9
    this.lastIdle = ''; this.nextIdle = 5; this.nextPose = 14
    this.shift = { x: 0, v: 0, until: 0 }; this.browPop = 0
    this.loco = 'ground'; this.locoT = 0; this.dir = 1
    this.blink = { next: 2, start: -9 }; this.breathPh = 0; this.yaw = 0
    this.P = {
      root: { x: 0, y: 0, rx: 0, ry: 0, rz: 0, sq: 0 }, head: { yaw: 0, pitch: 0, roll: 0 }, eye: { x: 0, y: 0, blink: 1 },
      face: { ...EXPR.relaxed }, A: { ax: 0, az: 0.15, ae: 0.12 }, B: { ax: 0, az: 0.15, ae: 0.12 },
      legA: 0, legB: 0, legRoll: 0, thr: 0, breath: 0
    }
  }
  innerSide() { return this.dock === 'right' ? -1 : 1 }
  get busy() { return !!(this.gest && this.gest.def.pri >= 2) || this.loco !== 'ground' }
  ping() { if (this.invalidate) this.invalidate() }
  mood(n) { this.moodName = n; this.ping() }
  flash(n, d) { this.flashName = n; this.flashUntil = this.t + d; this.ping() }
  setPose(n) { if (POSES[n]) { this.poseWant = n; this.poseName = n; this.ping() } }
  face(side) { this.dock = side }
  pointer(x, y, dist, active) { this.cur.x = x; this.cur.y = y; this.cur.dist = dist; this.cur.active = active; if (active) this.cur.t = this.t }
  lookAt(target, d) { this.focus = { target, until: this.t + d } }
  sample() { // dynamic gaze targets are sampled at ~15 Hz (they read DOM rects)
    const f = this.focus
    this.focusAng = f ? (typeof f.target === 'function' ? f.target() : f.target) || null : null
    this.autoAng = this.autoFn ? this.autoFn() : null
  }
  loco_(m, dir) { this.loco = m; this.locoT = this.t; if (dir) this.dir = dir }
  setLoco(m, dir) { this.loco_(m, dir) }

  // Interruption rules: a gesture only starts if it outranks the current one, is off cooldown, and isn't too close to the last one.
  play(name, ctx = {}) {
    const def = G[name]
    if (!def || this.reduced) return false
    const t = this.t
    if (!ctx.force) {
      if (this.gest && def.pri <= this.gest.def.pri) return false
      if (t < (this.cool[name] || 0)) return false
      if (t - this.lastStart < 0.4 && def.pri < 4) return false
    }
    this.gest = { name, def, t0: t, ctx: { side: ctx.side ?? this.innerSide(), dir: ctx.dir ?? (this.dock === 'right' ? -1 : 1) } }
    this.lastStart = t; this.cool[name] = t + def.dur + def.cool
    return true
  }

  idle() {
    const t = this.t, p = pick(IDLE, this.lastIdle)
    this.lastIdle = p
    if (p === 'lookAround') this.seq = { i: -1, until: 0, steps: [[-0.4, 0, 0.7], [0.4, -0.03, 0.8], [0, 0, 0.5]] }
    else if (p === 'lookDown') this.focus = { target: { x: rnd(-0.1, 0.1), y: 0.3 }, until: t + rnd(0.9, 1.4) }
    else if (p === 'thinkTilt') this.play('tilt')
    else if (p === 'shift') this.shift.until = t + rnd(2, 3.2), this.shift.x = (Math.random() < 0.5 ? -1 : 1) * 0.05
    else if (p === 'glance') { const g = this.onGlance && this.onGlance(); this.focus = { target: g || { x: rnd(-0.3, 0.3), y: 0.08 }, until: t + rnd(1, 1.6) } }
    else if (p === 'microSmile') this.flash('friendly', 1.2)
    else if (p === 'browPop') this.browPop = 1
    else this.play('nod')
  }

  update(dt, inp = {}) {
    const R = !!inp.reduced
    this.reduced = R
    dt = R ? 1 : Math.min(Math.max(dt, 0), 0.05)
    if (!R) this.t += dt
    const t = this.t, P = this.P, L = (a, b, l) => damp(a, b, l, dt)
    const vx = inp.vx || 0, vy = inp.vy || 0, speed = Math.hypot(vx, vy)
    const lt = t - this.locoT
    const ground = this.loco === 'ground', fly = this.loco === 'fly', take = this.loco === 'takeoff', land = this.loco === 'land'
    const bank = clamp(vx / 1100, -1, 1), sp = clamp(speed / 500, 0.4, 1)

    // --- gesture layer
    let g = null, env = 0, gv = null
    if (this.gest && !R) {
      const gt = t - this.gest.t0
      if (gt >= this.gest.def.dur) this.gest = null
      else { g = this.gest; env = sm(gt / 0.22) * sm((g.def.dur - gt) / 0.3); gv = g.def.fn(gt, gt / g.def.dur, g.ctx) }
    }
    const gside = g ? g.ctx.side : this.innerSide()

    // --- idle pose drift (varies the standing pose; the wanted pose stays most likely)
    if (!R && ground && !g && t > this.nextPose) {
      this.poseName = Math.random() < 0.5 ? this.poseWant : pick(Object.keys(POSES), this.poseName)
      this.nextPose = t + rnd(14, 24)
    }
    const pp = POSES[this.poseName]
    for (const k in pp) this.pose[k] = L(this.pose[k], pp[k], 1.8)

    // --- resolve gesture channels against the idle base
    const base = { pAx: this.pose.ax, pAz: this.pose.az, pAe: this.pose.ae, sAx: this.pose.ax, sAz: this.pose.az, sAe: this.pose.ae, hop: 0, crouch: 0, lean: this.pose.lean, roll: this.pose.roll, nod: 0, yaw: 0, sway: 0 }
    const c = {}
    for (const k in base) c[k] = lerp(base[k], gv && gv[k] !== undefined ? gv[k] : base[k], env)
    let tA = gside > 0 ? { ax: c.pAx, az: c.pAz, ae: c.pAe } : { ax: c.sAx, az: c.sAz, ae: c.sAe }
    let tB = gside > 0 ? { ax: c.sAx, az: c.sAz, ae: c.sAe } : { ax: c.pAx, az: c.pAz, ae: c.pAe }
    // locomotion overrides: arms pull back on takeoff, trail in flight, spread for balance on landing
    if (fly) tA = tB = { ax: 0.9 * sp, az: 0.45, ae: 0.3 }
    else if (take) tA = tB = { ax: 0.35, az: 0.3, ae: 0.2 }
    else if (land && lt < 0.6) tA = tB = { ax: 0, az: 0.6 * (1 - lt / 0.6) + 0.15, ae: 0.15 }
    for (const [o, tg] of [[P.A, tA], [P.B, tB]]) { o.ax = L(o.ax, tg.ax, 14); o.az = L(o.az, tg.az, 14); o.ae = L(o.ae, tg.ae, 14) }

    // --- idle life: breathing, float, weight shift
    if (!R) this.breathPh += dt * (1.15 + 0.12 * Math.sin(t * 0.37))
    P.breath = R ? 0 : Math.sin(this.breathPh)
    this.shift.v = L(this.shift.v, t < this.shift.until ? this.shift.x : 0, 2.2)
    const bob = R || fly ? 0 : Math.sin(t * 1.6) * 0.06 + Math.sin(t * 0.63 + 1) * 0.035
    const sq = c.crouch + (take ? 0.14 * sm(lt / 0.24) : 0) + (land ? Math.exp(-lt * 7) * Math.cos(lt * 15) * 0.16 : 0)
    P.root.x = this.shift.v + c.sway
    P.root.y = bob + c.hop
    P.root.sq = sq

    // --- body facing: toward the content, a little toward the cursor, banking in flight
    const cursorOn = this.cur.active && t - this.cur.t < 2.5 && this.cur.dist < 480 // only deliberate interaction near Kanna; otherwise she follows the page content
    const faceT = (this.dock === 'right' ? -0.28 : 0.28) * (ground ? 1 : 0.4) + (cursorOn && ground ? this.cur.x * 0.25 : 0) + (fly ? bank * 0.35 : 0)
    this.yaw = L(this.yaw, faceT, 3)
    P.root.ry = this.yaw
    P.root.rx = c.lean + (this.near && ground ? 0.05 : 0)
    P.root.rz = (fly ? -bank * 0.35 : 0) + (R ? 0 : Math.sin(t * 0.8) * 0.03) - this.shift.v * 0.4
    P.legRoll = -this.shift.v * 1.2
    const legT = fly ? 0.9 + Math.sin(t * 9) * 0.08 * sp : take ? 0.2 : 0
    P.legA = L(P.legA, legT, 7); P.legB = L(P.legB, fly ? legT * 0.95 : legT, 7)
    P.thr = L(P.thr, fly ? clamp(speed / 400, 0.45, 1) : take ? 0.3 * sm(lt / 0.24) : land ? Math.max(0, 1 - lt * 3) * 0.5 : 0, 6)

    // --- gaze (radians). Priority: travel > explicit focus (narration, hover, click) > deliberate cursor > page content > idle scan.
    this.tick += dt
    if (this.tick > 0.066) { this.tick = 0; this.sample() }
    if (t > this.sac.next) { this.sac.x = rnd(-0.04, 0.04); this.sac.y = rnd(-0.03, 0.03); this.sac.next = t + rnd(0.35, 1.6) }
    if (t > this.scan.next) { this.scan.x = rnd(-0.2, 0.2); this.scan.y = rnd(-0.08, 0.14); this.scan.next = t + rnd(2, 5) }
    if (this.seq && t >= this.seq.until) {
      const s = this.seq.steps[++this.seq.i]
      if (s) { this.focus = { target: { x: s[0], y: s[1] }, until: t + s[2] }; this.seq.until = t + s[2] } else this.seq = null
    }
    if (cursorOn && !this.away && !this.focus && t > this.nextAway) {
      this.nextAway = t + rnd(7, 12)
      if (Math.random() < 0.4) this.away = { x: rnd(0.3, 0.5) * (Math.random() < 0.5 ? -1 : 1), y: rnd(-0.05, 0.25), until: t + rnd(0.8, 1.6) }
    }
    if (this.away && t > this.away.until) this.away = null
    if (this.focus && t > this.focus.until) this.focus = null
    let gx, gy
    if (fly || take) { gx = this.dir * 0.35; gy = -0.05 }
    else if (this.focus && this.focusAng) { gx = this.focusAng.x; gy = this.focusAng.y }
    else if (cursorOn && this.away) { gx = this.away.x; gy = this.away.y }
    else if (cursorOn) { gx = this.cur.x; gy = this.cur.y }
    else if (this.autoAng) { gx = this.autoAng.x; gy = this.autoAng.y }
    else { gx = this.scan.x; gy = this.scan.y }
    gx += 0.15 * this.ex.tk + Math.sin(t * 0.7) * 0.02; gy += -0.12 * this.ex.tk + Math.sin(t * 0.53 + 1) * 0.012 // thinking bias + subtle idle drift
    this.eye.x = L(this.eye.x, gx + this.sac.x, 18); this.eye.y = L(this.eye.y, gy + this.sac.y, 18)
    this.hd.x = L(this.hd.x, this.eye.x * 0.85, 3.5); this.hd.y = L(this.hd.y, this.eye.y * 0.8, 3.5)
    const hy = this.sy.step(this.hd.x, dt), hp = this.sp.step(this.hd.y, dt)
    P.head.yaw = clamp(hy, -0.55, 0.55) + c.yaw + (fly ? bank * 0.2 : 0)
    P.head.pitch = clamp(hp, -0.35, 0.35) + c.nod + (fly ? 0.1 : 0)
    P.head.roll = c.roll + (fly ? -bank * 0.15 : 0)
    // eyes sit where the target is relative to where the head already points: they lead, then re-center as the head catches up
    P.eye.x = clamp((this.eye.x - P.head.yaw) / 0.28, -1, 1); P.eye.y = clamp((this.eye.y - P.head.pitch) / 0.2, -1, 1)

    // --- cursor proximity -> curiosity (with hysteresis), fading out gradually
    if (cursorOn) { if (this.cur.dist < 170) this.near = true; else if (this.cur.dist > 260 && this.near) { this.near = false; this.nearUntil = t + 1.2 } }
    else if (this.near) { this.near = false; this.nearUntil = t + 0.6 }

    // --- expression: gesture > flash > cursor curiosity > locomotion > section mood, always eased
    let name = this.moodName
    if (fly || take) name = 'happy'
    else if ((this.near || t < this.nearUntil) && ground) name = 'curious'
    if (this.flashName && t < this.flashUntil) name = this.flashName
    if (g && g.def.expr) name = g.def.expr
    const tx = EXPR[name]
    for (const k in tx) this.ex[k] = L(this.ex[k], tx[k], 7)
    this.browPop = L(this.browPop, 0, 3)
    Object.assign(P.face, this.ex)
    P.face.bl += 0.04 * this.browPop; P.face.br += 0.04 * this.browPop

    // --- blinking (random, sometimes double)
    if (!R && t > this.blink.next) { this.blink.start = t; this.blink.next = t + (Math.random() < 0.2 ? 0.26 : rnd(2, 6)) }
    const bt = t - this.blink.start
    P.eye.blink = bt >= 0 && bt < 0.14 ? 1 - Math.sin((bt / 0.14) * Math.PI) * 0.9 : 1

    // --- random idle events, only when nothing else is going on
    if (!R && ground && !g && !this.near && !this.seq && t > this.nextIdle) { this.idle(); this.nextIdle = t + rnd(6, 13) }
    return P
  }
}
