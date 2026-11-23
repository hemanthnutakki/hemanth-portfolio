import { lazy, Suspense, useState } from 'react'
import Nav from './components/layout/Nav'
import Footer from './components/layout/Footer'
import SectionShell from './components/layout/SectionShell'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Research from './components/sections/Research'
import Achievements from './components/sections/Achievements'
import Leadership from './components/sections/Leadership'
import Skills from './components/sections/Skills'
import PromptEngineering from './components/sections/PromptEngineering'
import Contact from './components/sections/Contact'
import Loader from './components/ui/Loader'
import useLenis from './hooks/useLenis'
import { sections } from './data/profile'

// Kanna ships in its own lazy chunk and enters only after the loader has finished.
const HemiMascot = lazy(() => import('./components/three/HemiMascot'))

const BODY = { about: About, experience: Experience, projects: Projects, research: Research, achievements: Achievements, leadership: Leadership, skills: Skills, 'ai-prompting': PromptEngineering, contact: Contact }
const TITLE = {
  about: 'Engineer. Researcher. Founder.',
  experience: 'Professional journey',
  projects: 'Things I\u2019ve built',
  research: 'Research & publications',
  achievements: 'Achievements & certifications',
  leadership: 'Leadership & responsibility',
  skills: 'Technical toolkit',
  'ai-prompting': 'AI PROMPT ENGINEERING \u2013 TURNING IDEAS INTO INTELLIGENT INSTRUCTIONS.',
  contact: 'HAVE AN IDEA? LET\u2019S BUILD SOMETHING EXTRAORDINARY.'
}

let introSeen = false // memory only (no storage): the loader plays once per visit, not every time you return from a policy page

export default function App() {
  const [ready, setReady] = useState(introSeen)
  useLenis()
  return (
    <>
      {!ready && <Loader onDone={() => { introSeen = true; setReady(true) }} />}
      <a href="#top" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-white">Skip to content</a>
      <Nav />
      <main id="top" tabIndex={-1} className="outline-none">
        <Hero play={ready} />
        {sections.map(([id, label], i) => {
          const Body = BODY[id]
          return (
            <SectionShell key={id} id={id} eyebrow={`0${i + 1} / ${label}`} title={TITLE[id] || label}>
              <Body />
            </SectionShell>
          )
        })}
      </main>
      <Footer />
      {ready && <Suspense fallback={null}><HemiMascot /></Suspense>}
    </>
  )
}
