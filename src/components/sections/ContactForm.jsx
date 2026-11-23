import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import { emailConfigured, mailtoHref, sendMessage, validate } from '../../lib/contact'

const INIT = { name: '', email: '', subject: '', message: '', company: '', consent: false } // company = honeypot
const input = 'w-full rounded-xl border bg-navy px-4 py-3 text-sm text-slate-100 placeholder:text-mute/70 transition focus:border-cyan2 focus:outline-none'

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>
      {children}
      <p id={`${id}-err`} className="mt-1 min-h-[1.25rem] text-xs text-red-300">{error}</p>
    </div>
  )
}

export default function ContactForm() {
  const [v, setV] = useState(INIT)
  const [err, setErr] = useState({})
  const [st, setSt] = useState('idle') // idle | sending | sent | mailto | error
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); if (err[k]) setErr((x) => ({ ...x, [k]: undefined })) }
  const props = (k) => ({ id: `cf-${k}`, value: v[k], onChange: set(k), 'aria-invalid': !!err[k], 'aria-describedby': `cf-${k}-err`, className: `${input} ${err[k] ? 'border-red-400/70' : 'border-white/10'}` })

  const submit = async (e) => {
    e.preventDefault()
    if (st === 'sending' || v.company) return
    const er = validate(v)
    setErr(er)
    const first = Object.keys(er)[0]
    if (first) { document.getElementById(`cf-${first}`)?.focus(); return }
    if (!emailConfigured) { window.location.href = mailtoHref(v); setSt('mailto'); return }
    setSt('sending')
    try { await sendMessage(v); setSt('sent'); setV(INIT) } catch { setSt('error') }
  }

  return (
    <form onSubmit={submit} noValidate className="card-surface p-6 md:p-8">
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field id="cf-name" label="Name" error={err.name}><input {...props('name')} autoComplete="name" placeholder="Your name" /></Field>
        <Field id="cf-email" label="Email" error={err.email}><input {...props('email')} type="email" autoComplete="email" placeholder="you@example.com" /></Field>
      </div>
      <Field id="cf-subject" label="Subject" error={err.subject}><input {...props('subject')} placeholder="What is this about?" /></Field>
      <Field id="cf-message" label="Message" error={err.message}><textarea {...props('message')} rows={5} placeholder="Tell me about your idea" /></Field>
      <div className="mb-4">
        <label className="flex items-start gap-3 text-sm text-slate-300">
          <input id="cf-consent" type="checkbox" checked={v.consent} aria-invalid={!!err.consent} aria-describedby="cf-consent-err" className="mt-1 h-4 w-4 shrink-0 accent-cyan-400"
            onChange={(e) => { setV((s) => ({ ...s, consent: e.target.checked })); if (err.consent) setErr((x) => ({ ...x, consent: undefined })) }} />
          <span>I agree that my name, email and message are used to reply to me, as described in the <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Privacy Policy</a>.</span>
        </label>
        <p id="cf-consent-err" className="mt-1 min-h-[1.25rem] text-xs text-red-300">{err.consent}</p>
      </div>
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden"><label>Company<input tabIndex={-1} autoComplete="off" value={v.company} onChange={set('company')} /></label></div>

      <MagneticButton type="submit" disabled={st === 'sending'} className="btn-primary disabled:opacity-60">
        {st === 'sending' ? <><Loader2 size={16} className="animate-spin" /> Sending&hellip;</> : <><Send size={16} /> Send message</>}
      </MagneticButton>

      <div role="status" aria-live="polite" className="mt-4 text-sm">
        {st === 'sent' && <p className="text-emerald-300">Thanks! Your message was sent. I&rsquo;ll get back to you soon.</p>}
        {st === 'mailto' && <p className="text-slate-300">Direct sending isn&rsquo;t set up on this site, so I opened your email app with the message ready to send.</p>}
        {st === 'error' && <p className="text-red-300">Something went wrong sending your message. Please try again, or <a className="underline" href={mailtoHref(v)}>send it by email</a>.</p>}
      </div>
    </form>
  )
}
