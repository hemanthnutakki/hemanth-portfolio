// Tiny event bus between page components and the mascot (no shared React state needed).
// Events: kanna:cmd {cmd, script}, kanna:state {script, status, index, total}, kanna:step {script, index, total, ...sync},
//         kanna:focus {script, stage|part}, kanna:tech {name, category, click}
export const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }))
export const on = (name, fn) => { window.addEventListener(name, fn); return () => window.removeEventListener(name, fn) }

// The toolkit universe registers a function returning the selected node's current screen position, so Kanna can look at it.
let techPoint = null
export const setTechPoint = (fn) => { techPoint = fn }
export const getTechPoint = () => (techPoint ? techPoint() : null)
