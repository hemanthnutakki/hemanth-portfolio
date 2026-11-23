import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from '../../lib/router'
import { Block, Inline } from './LegalContent'
import { LEGAL_PAGES, NOT_FOUND } from '../../data/legal'
import { COPYRIGHT_LINE, LEGAL_LINKS } from '../../data/legalLinks'
import '../../styles/legal.css'

// Consistent layout for every legal page: back link, page list, last-updated date, table of contents, readable text. No animation.
export default function LegalPage({ path }) {
  const hub = path === '/legal'
  const page = hub ? { title: 'Legal & Policies', updated: null, intro: 'The policies below describe how this portfolio website works and how it handles information.', sections: [] } : LEGAL_PAGES[path] || NOT_FOUND
  useEffect(() => {
    const prev = document.title
    document.title = `${page.title} \u00B7 N. Hemanth`
    const m = document.getElementById('legal-main'); if (m) m.focus({ preventScroll: true })
    return () => { document.title = prev }
  }, [path, page.title])

  return (
    <div className="min-h-screen bg-ink text-slate-200">
      <a href="#legal-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-navy focus:px-5 focus:py-2 focus:text-white">Skip to content</a>
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-[5vw] py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16} aria-hidden="true" /> Back to portfolio</Link>
          <span className="font-display text-sm font-bold tracking-[.18em]">N.HEMANTH</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 px-[5vw] py-12 lg:grid-cols-[210px_minmax(0,1fr)]">
        <nav aria-label="Legal pages" className="lg:sticky lg:top-8 lg:self-start">
          <p className="eyebrow mb-3">Legal &amp; policies</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm lg:flex-col lg:gap-y-1.5">
            {LEGAL_LINKS.map(([p, , title]) => (
              <li key={p}><Link to={p} aria-current={p === path ? 'page' : undefined} className={p === path ? 'font-medium text-cyan-300' : 'text-slate-400 hover:text-white'}>{title}</Link></li>
            ))}
          </ul>
        </nav>

        <main id="legal-main" tabIndex={-1} className="min-w-0 outline-none">
          <article className="legal">
            <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">{page.title}</h1>
            {page.updated && <p className="mt-2 text-sm text-mute">Last updated: <time>{page.updated}</time></p>}
            {page.copyright && <p className="legal-copyright">{COPYRIGHT_LINE}</p>}
            <p className="mt-6 text-slate-300"><Inline text={page.intro} /></p>

            {hub && (
              <ul className="legal-cards">
                {LEGAL_LINKS.map(([p, , title]) => (
                  <li key={p}><Link to={p}><span>{title}</span><small>Last updated: {LEGAL_PAGES[p].updated}</small></Link></li>
                ))}
              </ul>
            )}
            {path === '/404' || (!hub && !LEGAL_PAGES[path]) ? <p className="mt-6"><Link to="/">Return to the portfolio</Link> or see the <Link to="/legal">policies</Link>.</p> : null}

            {page.sections.length >= 4 && (
              <nav aria-label="On this page" className="legal-toc">
                <h2>On this page</h2>
                <ol>{page.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol>
              </nav>
            )}
            {page.sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}>{s.title}</h2>
                {s.body.map((b, i) => <Block key={i} b={b} />)}
              </section>
            ))}
          </article>
        </main>
      </div>

      <footer className="border-t border-white/10 px-[5vw] py-8 text-center text-xs text-mute">
        <nav aria-label="Legal footer" className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {LEGAL_LINKS.map(([p, label]) => <Link key={p} to={p} className="hover:text-white">{label}</Link>)}
        </nav>
        <p>{COPYRIGHT_LINE}</p>
      </footer>
    </div>
  )
}
