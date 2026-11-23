const BG = { cravekart: 'from-orange-500/30 to-violet/30', fluxreviews: 'from-violet/40 to-electric/30', ews: 'from-cyan2/30 to-electric/40', potato: 'from-emerald-500/30 to-cyan2/20', gesture: 'from-electric/40 to-violet/40' }
const STAR = '6,0 7.8,4.2 12,4.6 8.8,7.4 9.8,11.5 6,9.3 2.2,11.5 3.2,7.4 0,4.6 4.2,4.2'

const ART = {
  cravekart: (
    <>
      <path d="M52 50 L80 66 M52 72 L80 70 M52 94 L80 78" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      <circle cx="46" cy="50" r="6" fill="#fdba74" /><circle cx="46" cy="72" r="6" fill="#fdba74" /><circle cx="46" cy="94" r="6" fill="#fdba74" />
      <rect x="80" y="52" width="64" height="52" rx="10" fill="rgba(4,6,12,.55)" stroke="#fb923c" strokeWidth="2" />
      <path d="M96 52 Q112 26 128 52" stroke="#fb923c" strokeWidth="2.5" fill="none" />
      <circle cx="112" cy="78" r="9" fill="#22d3ee" opacity=".9" />
      <circle cx="168" cy="30" r="11" fill="#fbbf24" /><ellipse cx="156" cy="42" rx="14" ry="7" fill="#e2e8f0" opacity=".85" />
    </>
  ),
  fluxreviews: (
    <>
      <rect x="40" y="16" width="120" height="76" rx="10" fill="rgba(4,6,12,.55)" stroke="#9db8ff" strokeWidth="1.5" />
      <polygon points="92,40 92,68 118,54" fill="#22d3ee" />
      {[0, 1, 2, 3, 4].map((i) => <polygon key={i} transform={`translate(${64 + i * 17},98)`} points={STAR} fill={i < 4 ? '#fbbf24' : '#475569'} />)}
    </>
  ),
  ews: (
    <>
      <path d="M50 70 L100 42 L150 70" stroke="#9db8ff" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="70" r="9" fill="#f87171" /><circle cx="100" cy="42" r="9" fill="#fbbf24" /><circle cx="150" cy="70" r="9" fill="#4ade80" />
      <path d="M20 104 L60 96 L100 100 L140 84" stroke="#22d3ee" strokeWidth="2" fill="none" />
      <path d="M140 84 L180 76" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" fill="none" />
    </>
  ),
  potato: (
    <>
      <path d="M100 14 C152 28 162 78 100 106 C38 78 48 28 100 14 Z" fill="#22c55e" opacity=".85" />
      <path d="M100 20 L100 104" stroke="#14532d" strokeWidth="2" />
      <circle cx="84" cy="54" r="5" fill="#92400e" /><circle cx="114" cy="70" r="4" fill="#92400e" /><circle cx="94" cy="84" r="3" fill="#92400e" />
      <path d="M30 30 V18 H42 M170 30 V18 H158 M30 92 V104 H42 M170 92 V104 H158" stroke="#22d3ee" strokeWidth="2" fill="none" />
    </>
  ),
  gesture: (
    <>
      <rect x="78" y="62" width="46" height="38" rx="16" fill="#eef3fb" />
      {[80, 91, 102, 113].map((x, i) => <rect key={x} x={x} y={30 + (i === 1 || i === 2 ? -6 : 4)} width="9" height="40" rx="4.5" fill="#eef3fb" />)}
      <path d="M150 52 Q166 70 150 88 M160 44 Q182 70 160 96" stroke="#22d3ee" strokeWidth="2" fill="none" />
      <path d="M50 52 Q34 70 50 88 M40 44 Q18 70 40 96" stroke="#22d3ee" strokeWidth="2" fill="none" />
    </>
  )
}

export default function ProjectArt({ id, className = 'h-40' }) {
  return (
    <div aria-hidden="true" className={`relative overflow-hidden bg-gradient-to-br ${BG[id]} ${className}`}>
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:24px_24px]" />
      <svg viewBox="0 0 200 120" className="relative h-full w-full" preserveAspectRatio="xMidYMid meet">{ART[id]}</svg>
    </div>
  )
}
