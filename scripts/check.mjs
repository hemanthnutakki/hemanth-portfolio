// Static sanity checks, no dependencies: node scripts/check.mjs  (or: npm run check)
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve('src')
let errors = 0
const files = []
;(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    e.isDirectory() ? walk(p) : /\.jsx?$/.test(e.name) && files.push(p)
  }
})(root)

const exact = (p) => fs.readdirSync(path.dirname(p)).includes(path.basename(p))
const resolve = (from, spec) => {
  const b = path.resolve(path.dirname(from), spec)
  for (const c of [b, b + '.js', b + '.jsx', b + '.json', path.join(b, 'index.jsx'), path.join(b, 'index.js')]) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return exact(c) ? c : 'CASE'
  }
  return null
}
const rel = (f) => path.relative(root, f)

const { sections } = await import(pathToFileURL(path.join(root, 'data/profile.js')).href)
const ids = new Set(['top', 'hero', ...sections.map(([id]) => id)])
// also accept any id="..." that is written literally somewhere in src (e.g. the legal pages' skip-link target)
for (const f of files) for (const m of fs.readFileSync(f, 'utf8').matchAll(/\bid=["']([\w-]+)["']/g)) ids.add(m[1])

for (const f of files) {
  const s = fs.readFileSync(f, 'utf8')
  for (const m of s.matchAll(/(?:from\s+|import\s*\(?\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const r = resolve(f, m[1])
    if (!r) { errors++; console.error(`MISSING import ${m[1]} in ${rel(f)}`) }
    else if (r === 'CASE') { errors++; console.error(`CASE mismatch in import ${m[1]} (${rel(f)}). This breaks on Netlify (Linux).`) }
  }
  // every named/default import from a local file must really be exported there
  for (const m of s.matchAll(/import\s+(\w+)?\s*,?\s*(?:\{([^}]+)\})?\s*from\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const r = resolve(f, m[3]); if (!r || r === 'CASE') continue
    const target = fs.readFileSync(r, 'utf8')
    if (m[1] && !/export\s+default/.test(target) && /\.jsx?$/.test(r)) { errors++; console.error(`NO DEFAULT EXPORT in ${m[3]} (imported as ${m[1]} in ${rel(f)})`) }
    for (const raw of (m[2] || '').split(',')) {
      const n = raw.trim().split(/\s+as\s+/)[0]; if (!n) continue
      const has = new RegExp(`export\\s+(?:async\\s+)?(?:const|let|var|function|class)\\s+${n}\\b`).test(target) || new RegExp(`export\\s*\\{[^}]*\\b${n}\\b`).test(target)
      if (!has) { errors++; console.error(`NOT EXPORTED: ${n} from ${m[3]} (imported in ${rel(f)})`) }
    }
  }
  for (const m of s.matchAll(/import\s+(?:(\w+)\s*,?\s*)?(?:\{([^}]+)\})?\s*from/g)) {
    const names = [m[1], ...(m[2] || '').split(',').map((x) => x.trim().split(/\s+as\s+/).pop())].filter(Boolean)
    for (const n of names) if ((s.match(new RegExp(`\\b${n}\\b`, 'g')) || []).length < 2) console.warn(`warning: unused import ${n} in ${rel(f)}`)
  }
  for (const m of s.matchAll(/href=["']#([\w-]+)["']/g)) {
    if (!ids.has(m[1])) { errors++; console.error(`BROKEN anchor #${m[1]} in ${rel(f)}`) }
  }
}

const data = fs.readFileSync(path.join(root, 'data/profile.js'), 'utf8')
console.log('\nExternal links in your data (open each one to confirm it works):')
for (const u of new Set(data.match(/https?:\/\/[^'"\s)]+/g) || [])) console.log('  ' + u)
const m = await import(pathToFileURL(path.join(root, 'data/profile.js')).href)
const missing = ['github', 'linkedin', 'resume'].filter((k) => !m.profile[k])
if (missing.length) console.log(`\nNot set yet in src/data/profile.js: ${missing.join(', ')} (those buttons stay hidden/disabled)`)
console.log(`\n${files.length} source files checked, ${errors} error(s).`)
process.exit(errors ? 1 : 0)
