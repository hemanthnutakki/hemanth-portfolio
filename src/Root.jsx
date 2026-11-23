import { lazy, Suspense } from 'react'
import App from './App'
import { useRoute } from './lib/router'
import { LEGAL_LINKS } from './data/legalLinks'

// Legal pages are lazy-loaded real routes; the portfolio itself stays on "/".
const LegalPage = lazy(() => import('./components/legal/LegalPage'))
const LEGAL_PATHS = new Set(['/legal', ...LEGAL_LINKS.map(([p]) => p)])

export default function Root() {
  const path = useRoute()
  if (path === '/') return <App />
  return <Suspense fallback={null}><LegalPage path={LEGAL_PATHS.has(path) ? path : '/404'} /></Suspense>
}
