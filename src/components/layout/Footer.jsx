import { Link } from '../../lib/router'
import { sections } from '../../data/profile'
import { COPYRIGHT_LINE, LEGAL_LINKS } from '../../data/legalLinks'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-[5vw] py-10 pb-28 text-center text-sm text-mute">
      <nav aria-label="Footer" className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {sections.map(([id, label]) => <a key={id} href={`#${id}`} className="hover:text-white">{label}</a>)}
      </nav>
      <nav aria-label="Legal" className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
        {LEGAL_LINKS.map(([path, label]) => <Link key={path} to={path} className="hover:text-white">{label}</Link>)}
        <Link to="/legal" className="hover:text-white">All policies</Link>
      </nav>
      <p>{COPYRIGHT_LINE} &middot; SRM Institute of Science and Technology</p>
    </footer>
  )
}
