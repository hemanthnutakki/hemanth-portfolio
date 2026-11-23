// Decides when Kanna may start an explanation by herself. Starts only when: she has landed and nothing else is happening, the visitor is
// still in her section, the explanation's diagram/lab is mostly on screen and has stayed there ~1.2 s, and it has not played yet this visit.
export function autoStartStep(s) {
  const blocked = s.reduced || s.busy || s.pending || s.activeKey || s.hidden || !s.cfg || !s.cfg.auto || s.played[s.cfg.script] || s.visible !== s.cur
  if (blocked || s.vis < 0.45) return { start: false, since: 0 }
  if (!s.since) return { start: false, since: s.now }
  return { start: s.now - s.since >= 1200, since: s.since }
}
