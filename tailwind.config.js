export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#04060c', navy: '#0a1020', slate2: '#10182b', electric: '#3b82f6', violet: '#8b5cf6', cyan2: '#22d3ee', mute: '#8a96b2' },
      fontFamily: { display: ['"Space Grotesk"', 'system-ui', 'sans-serif'], body: ['Inter', 'system-ui', 'sans-serif'], mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'] },
      backgroundImage: { 'grad-brand': 'linear-gradient(100deg,#3b82f6,#8b5cf6 55%,#22d3ee)' }
    }
  },
  plugins: []
}
