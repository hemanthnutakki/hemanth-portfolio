import { Link } from '../../lib/router'

// Tiny inline markup used in the policy text: [label](url) and **bold**. Internal links use the router.
export function Inline({ text }) {
  const out = [], re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0, m, i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) {
      const href = m[2]
      out.push(href.startsWith('/') ? <Link key={i++} to={href}>{m[1]}</Link> : <a key={i++} href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{m[1]}</a>)
    } else out.push(<strong key={i++}>{m[3]}</strong>)
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}

export function Block({ b }) {
  if (typeof b === 'string') return <p><Inline text={b} /></p>
  if (b.ul) return <ul>{b.ul.map((x, i) => <li key={i}><Inline text={x} /></li>)}</ul>
  if (b.note) return <p className="legal-note"><Inline text={b.note} /></p>
  if (b.table) {
    return (
      <div className="legal-table" role="region" aria-label={b.table.label} tabIndex={0}>
        <table>
          <thead><tr>{b.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}><Inline text={c} /></td>))}</tr>)}</tbody>
        </table>
      </div>
    )
  }
  return null
}
