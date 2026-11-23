// Orbital layout for the toolkit universe: one ring per category, nodes evenly spaced on it, outer rings slower.
// Pure math (no three.js) so it can be unit-tested.
export const TAU = Math.PI * 2
// Values chosen by numeric search (see test): no node clipped at phone/square/wide canvas sizes, minimal node overlap while orbiting.
export const RING0 = 1.1
export const RING_STEP = 0.36
export const TILT = -1.3
export const CAM_DIST = 12
export const CAM_FOV = 40

export function buildLayout(data) {
  const cats = Object.keys(data)
  const rings = cats.map((_, i) => {
    const r = RING0 + i * RING_STEP
    return { r, spd: (0.11 - i * 0.009) * (i % 2 ? -1 : 1), a0: i * 0.9, w: (i % 2 ? 1 : -1) * 0.3 * (r / 3.5), ph: i * 0.9 }
  })
  const nodes = []
  cats.forEach((cat, ci) => data[cat].forEach((name, k) => nodes.push({ name, cat, ci, k, cnt: data[cat].length, idx: nodes.length, ph: k * 1.7 + ci })))
  return { cats, rings, nodes }
}
// gently warped circle so rings feel 3D without crowding
export function ringPos(ring, a, out, o = 0) { out[o] = Math.cos(a) * ring.r; out[o + 1] = Math.sin(a + ring.ph) * ring.w; out[o + 2] = Math.sin(a) * ring.r }
export const nodeAngle = (L, n, t, spin) => L.rings[n.ci].a0 + (n.k * TAU) / n.cnt + t * L.rings[n.ci].spd + spin * (n.ci % 2 ? -1 : 1)
