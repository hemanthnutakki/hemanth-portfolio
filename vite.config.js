import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// If VITE_SITE_URL is set (e.g. https://your-site.netlify.app) the build adds canonical/og tags,
// sitemap.xml and a robots.txt that points to it. Without it, robots.txt simply allows crawling.
function siteSeo(site) {
  return {
    name: 'site-seo',
    transformIndexHtml() {
      if (!site) return []
      const m = (a) => ({ tag: 'meta', attrs: a, injectTo: 'head' })
      return [
        { tag: 'link', attrs: { rel: 'canonical', href: `${site}/` }, injectTo: 'head' },
        m({ property: 'og:url', content: `${site}/` }),
        m({ property: 'og:image', content: `${site}/og-image.png` }),
        m({ name: 'twitter:image', content: `${site}/og-image.png` })
      ]
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${site ? `Sitemap: ${site}/sitemap.xml\n` : ''}` })
      if (site) {
        const paths = ['/', '/legal', '/privacy', '/terms', '/cookies', '/copyright', '/disclaimer', '/accessibility', '/credits']
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${site}${p}</loc></url>`).join('')}</urlset>\n` })
      }
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const site = (env.VITE_SITE_URL || '').replace(/\/$/, '')
  return {
    plugins: [react(), siteSeo(site)],
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: { output: { manualChunks: { three: ['three', '@react-three/fiber', '@react-three/drei'], motion: ['framer-motion', 'gsap'] } } }
    }
  }
})
