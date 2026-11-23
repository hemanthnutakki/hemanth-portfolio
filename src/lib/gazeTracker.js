// Autonomous content tracking: which text should Kanna look at, and at what head angle.
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const soft = (a, L) => L * Math.tanh(a / L) // smooth limit: approaches +/-L without a hard stop (no neck twisting)
export const YAW_LIM = 0.55, PITCH_LIM = 0.32
const DEPTH = 8, CAM_FOV = 32, CAM_Z = 5.2, CAM_Y = 0.1, HEAD_Y = 0.55 // must match the mascot canvas camera and head height

// Screen point (px) -> head-relative yaw/pitch in radians.
// The mascot canvas is a small perspective view, so one canvas pixel equals (visibleHeight / canvasHeight) world units on the character plane.
// The point is converted into that world space and placed on a virtual plane DEPTH units in front of the head; angles come from the
// resulting 3D direction. Far-away text therefore gives large (soft-limited) angles instead of a 90-degree profile turn.
export function aimAngles(px, py, rect) {
  const s = (2 * CAM_Z * Math.tan((CAM_FOV * Math.PI) / 360)) / rect.height
  const hx = rect.left + rect.width / 2, hy = rect.top + rect.height / 2 - (HEAD_Y - CAM_Y) / s
  const dx = (px - hx) * s, dy = -(py - hy) * s
  const yaw = Math.atan2(dx, DEPTH), pitch = Math.atan2(-dy, Math.hypot(dx, DEPTH))
  return { x: soft(yaw, YAW_LIM), y: soft(pitch, PITCH_LIM), dist: Math.hypot(px - hx, py - hy) }
}

const DEF = { heading: ['h2'], sub: ['h3', 'h4', '[data-gaze]'], content: ['article', '[data-project]', 'p', 'li'] }

// Weighted target selection with stickiness: priority (heading > subheading > content), visibility, closeness to the reading line,
// a bonus for the current target, a 20% hysteresis margin and a minimum dwell time. This prevents flicker between neighbouring elements.
export function createTracker(cfgOf, aim) {
  let section = 'top', cur = null, since = 0
  const vh = () => window.innerHeight
  const root = () => document.getElementById(section === 'top' ? 'hero' : section)
  function point(el) {
    const r = el.getBoundingClientRect(), v = vh()
    return { x: r.left + Math.min(r.width * 0.4, 220), y: clamp(r.top + Math.min(r.height / 2, 110), 0, v) }
  }
  function candidates() {
    const r = root(); if (!r) return []
    const t = { ...DEF, ...(cfgOf(section) || {}) }, out = []
    const add = (sels, base) => sels.forEach((s) => r.querySelectorAll(s).forEach((el) => out.push({ el, base })))
    add(section === 'top' ? ['h1'] : t.heading, 1); add(t.sub, 0.7); add(t.content, 0.45)
    return out
  }
  function score(c, v) {
    const r = c.el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return -1
    const vis = Math.max(0, Math.min(r.bottom, v) - Math.max(r.top, 0)) / Math.min(r.height, v * 0.6)
    if (vis < 0.15) return -1
    const prox = 1 - Math.min(1, Math.abs((r.top + r.bottom) / 2 - v * 0.4) / (v * 0.6))
    return c.base * (0.5 + 0.5 * clamp(vis, 0, 1)) + 0.4 * prox + (c.el === cur ? 0.3 : 0)
  }
  function refresh() {
    const v = vh(), now = performance.now(), cs = candidates()
    let best = null, bs = -1, curScore = -1
    for (const c of cs) { const s = score(c, v); if (c.el === cur) curScore = s; if (s > bs) { bs = s; best = c } }
    if (!best) { cur = null; return }
    if (cur && curScore > 0 && best.el !== cur && (bs < curScore * 1.2 || now - since < 1400)) return
    if (best.el !== cur) { cur = best.el; since = now }
  }
  return {
    point,
    refresh,
    setSection(id) { if (id !== section) { section = id; cur = null; since = 0; refresh() } },
    angles() { if (!cur || !cur.isConnected) return null; const p = point(cur); return aim(p.x, p.y) },
    glance() { // look briefly at some other visible heading or subheading
      const v = vh(), pool = candidates().filter((c) => c.el !== cur && c.base >= 0.7 && score(c, v) > 0)
      if (!pool.length) return null
      const p = point(pool[Math.floor(Math.random() * pool.length)].el); return aim(p.x, p.y)
    },
    get element() { return cur }
  }
}
