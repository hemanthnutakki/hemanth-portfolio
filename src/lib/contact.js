import { profile } from '../data/profile'

const env = import.meta.env
// True only when all three EmailJS values exist in .env
export const emailConfigured = Boolean(env.VITE_EMAILJS_SERVICE_ID && env.VITE_EMAILJS_TEMPLATE_ID && env.VITE_EMAILJS_PUBLIC_KEY)

export function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.subject.trim().length < 3) e.subject = 'Please add a short subject.'
  if (v.message.trim().length < 10) e.message = 'Your message should be at least 10 characters.'
  else if (v.message.length > 2000) e.message = 'Please keep the message under 2000 characters.'
  if (!v.consent) e.consent = 'Please tick the box to confirm before sending.'
  return e
}

// EmailJS template variables: {{from_name}} {{reply_to}} {{subject}} {{message}}
export async function sendMessage(v) {
  const emailjs = (await import('@emailjs/browser')).default
  await emailjs.send(
    env.VITE_EMAILJS_SERVICE_ID, env.VITE_EMAILJS_TEMPLATE_ID,
    { from_name: v.name.trim(), reply_to: v.email.trim(), subject: v.subject.trim(), message: v.message.trim() },
    { publicKey: env.VITE_EMAILJS_PUBLIC_KEY }
  )
}

export const mailtoHref = (v) =>
  `mailto:${profile.email}?subject=${encodeURIComponent(v.subject)}&body=${encodeURIComponent(`${v.message}\n\n\u2014 ${v.name} (${v.email})`)}`
