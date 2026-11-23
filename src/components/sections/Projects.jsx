import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ProjectCard from './projects/ProjectCard'
import ProjectDetail from './projects/ProjectDetail'
import { projects } from '../../data/profile'

export default function Projects() {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const nav = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + projects.length) % projects.length)), [])
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => <ProjectCard key={p.id} p={p} index={i} onOpen={setOpen} />)}
      </div>
      <AnimatePresence>{open !== null && <ProjectDetail key="detail" project={projects[open]} onClose={close} onNav={nav} />}</AnimatePresence>
    </>
  )
}
