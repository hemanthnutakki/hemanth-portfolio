export default function SectionShell({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="section-wrap" aria-labelledby={`${id}-h`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${id}-h`} className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  )
}
