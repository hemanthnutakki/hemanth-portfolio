export const normalizePath = (p) => { const x = (p || '/').split(/[?#]/)[0].replace(/\/+$/, ''); return x || '/' }
