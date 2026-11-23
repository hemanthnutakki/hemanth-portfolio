# N. Hemanth — 3D Portfolio

React + Vite + Tailwind + React Three Fiber + GSAP + Framer Motion + Lenis.

    npm install
    npm run dev       # local
    npm run build     # production build -> dist/

All content lives in `src/data/profile.js`. Values set to `null` (GitHub, LinkedIn, resume, IEEE URL, certificate links) are hidden in the UI until you fill them with real, verified values.
Contact form: copy `.env.example` to `.env` and add your EmailJS ids.

## Phases
1. Architecture, design system, data (done)
2. 3D hero + loader (done)
3. About, Skills, Experience (done)
4. Projects gallery + detail view (done)
5. Research, Achievements, Leadership, Certifications (done)
6. Contact + EmailJS (done)
7. Responsive, a11y, SEO, performance
8. Test, build, link check

## Deploy (Netlify + GitHub)
Push to GitHub, import the repo in Netlify (build `npm run build`, publish `dist`; `netlify.toml` already sets this).
Environment variables to add in Netlify: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, and `VITE_SITE_URL` (your final address, for canonical URL, link previews and sitemap).

## QA checklist (Phase 8)
1. `npm run check` (imports, anchors, file-name case) then `npm run build` (must finish with no errors).
2. `npm run preview`, then click every nav link, hero button, project card, project dialog (Esc, arrows), workflow diagram, skill chips, contact form (empty, invalid, valid).
3. Resize to ~375px, ~768px, ~1280px and check for sideways scrolling or overlap, including Kanna and her speech bubbles.
4. Keyboard only: Tab through the page, open and close a project dialog, use "Skip to content".
5. Turn on "reduce motion" in your OS and reload: no flying, typing or tilt.
6. After deploying: Lighthouse (Chrome DevTools) on mobile for Performance, Accessibility, SEO; share the link in a chat to check the preview card.
