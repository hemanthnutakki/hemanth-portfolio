import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { CAT_COLORS, EDGES } from '../../data/toolkit'
import { setTechPoint } from '../../lib/kannaBus'
import { CAM_DIST, CAM_FOV, TAU, TILT, buildLayout, nodeAngle, ringPos } from '../../lib/toolkitLayout'

const MAX_P = 36, SEG = 10, RING_N = 128
const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt))

// Clean orbital system: dark core with its label, one ring per category (active ring glows, its nodes are labelled),
// links curve inward through the middle, particles flow along the links of the hovered/selected node.
// One InstancedMesh for all nodes, one dynamic buffer for links, one Points buffer for particles.
function Universe({ data, active, selected, hovered, onHover, onSelect, still, mobile, shared }) {
  const group = useRef(), inst = useRef(), lineAll = useRef(), lineHi = useRef(), pts = useRef(), halo = useRef(), torus = useRef(), glow = useRef(), lattice = useRef()
  const ringRefs = useRef([]), labelRefs = useRef([])
  const L = useMemo(() => buildLayout(data), [data])
  const { cats, rings, nodes } = L
  const N = nodes.length, C = cats.length
  const byName = useMemo(() => new Map(nodes.map((n) => [n.name, n.idx])), [nodes])
  const edges = useMemo(() => EDGES.filter(([a, b]) => byName.has(a) && byName.has(b)).map(([a, b]) => [byName.get(a), byName.get(b)]), [byName])
  const E = edges.length
  const bufs = useMemo(() => ({
    pos: new Float32Array(N * 3), all: new Float32Array(E * SEG * 6), hi: new Float32Array(E * SEG * 6), pt: new Float32Array(MAX_P * 3),
    sc: new Float32Array(N).fill(0.8), br: new Float32Array(N).fill(0.45), tmpP: new Float32Array((SEG + 1) * 3),
    ring: rings.map((r) => { const a = new Float32Array(RING_N * 3); for (let j = 0; j < RING_N; j++) ringPos(r, (j / RING_N) * TAU, a, j * 3); return a }),
    stars: (() => { const a = new Float32Array((mobile ? 60 : 140) * 3); for (let i = 0; i < a.length; i += 3) { const r = 7 + Math.random() * 9, th = Math.random() * TAU, ph = Math.acos(2 * Math.random() - 1); a[i] = r * Math.sin(ph) * Math.cos(th); a[i + 1] = r * Math.sin(ph) * Math.sin(th); a[i + 2] = r * Math.cos(ph) - 4 } return a })()
  }), [N, E, rings, mobile])
  const tmp = useMemo(() => ({ o: new THREE.Object3D(), c: new THREE.Color(), v: new THREE.Vector3(), colors: nodes.map((n) => new THREE.Color(CAT_COLORS[n.ci % CAT_COLORS.length])) }), [nodes])

  useLayoutEffect(() => { if (inst.current) inst.current.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6) }, [])
  useEffect(() => { setTechPoint(() => shared.screen); return () => setTechPoint(null) }, [shared])
  useEffect(() => { // scrolling spins the rings a little
    let last = window.scrollY
    const onScroll = () => { const y = window.scrollY; shared.extra = Math.max(-1.5, Math.min(1.5, shared.extra + (y - last) * 0.004)); last = y }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [shared])

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const t = still ? 0 : state.clock.elapsedTime, g = group.current
    const ci = Math.max(0, cats.indexOf(active)), focusName = selected || hovered
    const fi = focusName ? byName.get(focusName) : undefined
    const mv = (a, b, l) => (still ? b : damp(a, b, l, dt))
    shared.extra = mv(shared.extra, 0, 0.6)
    g.rotation.x = TILT; g.rotation.y = still ? 0.15 : 0.15 + Math.sin(t * 0.07) * 0.1
    g.updateMatrixWorld()

    const { pos, all, hi, pt, sc, br, tmpP } = bufs
    for (let i = 0; i < N; i++) {
      const n = nodes[i], a = nodeAngle(L, n, t, shared.extra), o = [0, 0, 0]
      ringPos(rings[n.ci], a, o)
      pos[i * 3] = o[0]; pos[i * 3 + 1] = o[1] + (still ? 0 : Math.sin(t * 0.9 + n.ph) * 0.05); pos[i * 3 + 2] = o[2]
      const isF = i === fi, on = n.ci === ci
      sc[i] = mv(sc[i], isF ? 2 : on ? 1.2 : 0.85, 8); br[i] = mv(br[i], isF ? 1.6 : on ? 1 : 0.45, 8)
      tmp.o.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]); tmp.o.scale.setScalar(sc[i]); tmp.o.updateMatrix()
      inst.current.setMatrixAt(i, tmp.o.matrix)
      tmp.c.copy(tmp.colors[i]).multiplyScalar(br[i]); inst.current.setColorAt(i, tmp.c)
      const lab = labelRefs.current[i]; if (lab) lab.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
    }
    inst.current.instanceMatrix.needsUpdate = true; if (inst.current.instanceColor) inst.current.instanceColor.needsUpdate = true
    for (let i = 0; i < C; i++) { const m = ringRefs.current[i]; if (m) m.material.opacity = mv(m.material.opacity, i === ci ? 0.6 : 0.13, 6) }

    // links: quadratic arcs pulled toward the core so they stay inside the system
    let m = 0
    for (let e = 0; e < E; e++) {
      const [a, b] = edges[e], ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2], bx = pos[b * 3], by = pos[b * 3 + 1], bz = pos[b * 3 + 2]
      const cx = (ax + bx) * 0.175, cy = (ay + by) * 0.175, cz = (az + bz) * 0.175
      for (let j = 0; j <= SEG; j++) {
        const u = j / SEG, v = 1 - u, w0 = v * v, w1 = 2 * v * u, w2 = u * u
        tmpP[j * 3] = w0 * ax + w1 * cx + w2 * bx; tmpP[j * 3 + 1] = w0 * ay + w1 * cy + w2 * by; tmpP[j * 3 + 2] = w0 * az + w1 * cz + w2 * bz
      }
      for (let j = 0; j < SEG; j++) {
        const o = (e * SEG + j) * 6
        all[o] = tmpP[j * 3]; all[o + 1] = tmpP[j * 3 + 1]; all[o + 2] = tmpP[j * 3 + 2]; all[o + 3] = tmpP[j * 3 + 3]; all[o + 4] = tmpP[j * 3 + 4]; all[o + 5] = tmpP[j * 3 + 5]
      }
      if (fi !== undefined && (a === fi || b === fi)) {
        hi.set(all.subarray(e * SEG * 6, (e + 1) * SEG * 6), m * SEG * 6)
        for (let k = 0; k < 3 && m * 3 + k < MAX_P; k++) { // particles flow away from the focused node
          let u = (t * 0.6 + k / 3) % 1; if (b === fi) u = 1 - u
          const v = 1 - u, j = (m * 3 + k) * 3
          pt[j] = v * v * ax + 2 * v * u * cx + u * u * bx; pt[j + 1] = v * v * ay + 2 * v * u * cy + u * u * by; pt[j + 2] = v * v * az + 2 * v * u * cz + u * u * bz
        }
        m++
      }
    }
    lineAll.current.geometry.attributes.position.needsUpdate = true
    lineHi.current.geometry.attributes.position.needsUpdate = true; lineHi.current.geometry.setDrawRange(0, m * SEG * 2)
    pts.current.geometry.attributes.position.needsUpdate = true; pts.current.geometry.setDrawRange(0, Math.min(m * 3, MAX_P)); pts.current.visible = m > 0
    if (fi !== undefined) { halo.current.visible = true; halo.current.position.set(pos[fi * 3], pos[fi * 3 + 1], pos[fi * 3 + 2]) } else halo.current.visible = false

    glow.current.scale.setScalar(1 + (still ? 0 : Math.sin(t * 2) * 0.05)); lattice.current.rotation.y = t * 0.2; lattice.current.rotation.x = t * 0.1; torus.current.rotation.z = t * 0.3

    // camera: smooth zoom, mouse parallax, gentle focus on the hovered/selected node; screen position shared with Kanna
    const cam = state.camera
    if (fi !== undefined) { tmp.v.set(pos[fi * 3], pos[fi * 3 + 1], pos[fi * 3 + 2]); g.localToWorld(tmp.v); shared.fw.copy(tmp.v) }
    cam.position.z = mv(cam.position.z, (CAM_DIST / shared.zoom) * (fi !== undefined ? 0.85 : 1), 3)
    cam.position.x = mv(cam.position.x, (mobile ? 0 : state.pointer.x * 0.6) + (fi !== undefined ? shared.fw.x * 0.2 : 0), 3)
    cam.position.y = mv(cam.position.y, (mobile ? 0 : state.pointer.y * 0.4) + (fi !== undefined ? shared.fw.y * 0.2 : 0), 3)
    cam.lookAt(fi !== undefined ? shared.fw.x * 0.3 : 0, fi !== undefined ? shared.fw.y * 0.3 : 0, 0)
    cam.updateMatrixWorld()
    if (fi !== undefined) {
      tmp.v.copy(shared.fw).project(cam)
      const r = state.gl.domElement.getBoundingClientRect()
      shared.screen = { x: r.left + (tmp.v.x * 0.5 + 0.5) * r.width, y: r.top + (-tmp.v.y * 0.5 + 0.5) * r.height }
    } else shared.screen = null
  })

  const ci = Math.max(0, cats.indexOf(active)), focusName = selected || hovered, fIdx = focusName ? byName.get(focusName) : undefined
  const labelled = nodes.filter((n) => n.ci === ci || n.idx === fIdx)
  const dyn = (arr) => <bufferAttribute attach="attributes-position" array={arr} count={arr.length / 3} itemSize={3} usage={THREE.DynamicDrawUsage} />
  return (
    <>
      <points><bufferGeometry><bufferAttribute attach="attributes-position" array={bufs.stars} count={bufs.stars.length / 3} itemSize={3} /></bufferGeometry><pointsMaterial color="#9db8ff" size={0.05} transparent opacity={0.5} depthWrite={false} sizeAttenuation /></points>
      <group ref={group}>
        {/* core: dark glass sphere, glowing centre, orbit ring and lattice. The label sits ON the core, not over the nodes. */}
        <mesh><sphereGeometry args={[0.62, 32, 32]} /><meshBasicMaterial color="#071026" /></mesh>
        <mesh ref={glow}><sphereGeometry args={[0.3, 20, 20]} /><meshBasicMaterial color="#67e8f9" toneMapped={false} /></mesh>
        <mesh scale={1.9}><sphereGeometry args={[0.62, 16, 16]} /><meshBasicMaterial color="#22d3ee" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
        <mesh ref={lattice}><icosahedronGeometry args={[0.78, 1]} /><meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.28} /></mesh>
        <mesh ref={torus}><torusGeometry args={[0.92, 0.012, 8, 64]} /><meshBasicMaterial color="#22d3ee" transparent opacity={0.55} toneMapped={false} /></mesh>
        <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="text-center font-mono text-[8px] font-bold leading-tight tracking-[.22em] text-white" style={{ textShadow: '0 0 8px #000' }}>TECHNICAL<br />TOOLKIT</div>
        </Html>

        {rings.map((_, i) => (
          <lineLoop key={i} ref={(el) => { ringRefs.current[i] = el }} frustumCulled={false}>
            <bufferGeometry><bufferAttribute attach="attributes-position" array={bufs.ring[i]} count={RING_N} itemSize={3} /></bufferGeometry>
            <lineBasicMaterial color={CAT_COLORS[i % CAT_COLORS.length]} transparent opacity={0.13} />
          </lineLoop>
        ))}
        <lineSegments ref={lineAll} frustumCulled={false}><bufferGeometry>{dyn(bufs.all)}</bufferGeometry><lineBasicMaterial color="#6d8bff" transparent opacity={0.14} /></lineSegments>
        <lineSegments ref={lineHi} frustumCulled={false}><bufferGeometry>{dyn(bufs.hi)}</bufferGeometry><lineBasicMaterial color="#67e8f9" transparent opacity={0.95} /></lineSegments>
        <points ref={pts} frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" array={bufs.pt} count={MAX_P} itemSize={3} usage={THREE.DynamicDrawUsage} /></bufferGeometry><pointsMaterial color="#b6f7ff" size={0.09} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation /></points>
        <mesh ref={halo} visible={false} scale={2.8}><sphereGeometry args={[0.13, 14, 14]} /><meshBasicMaterial color="#67e8f9" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>

        <instancedMesh ref={inst} args={[null, null, N]} frustumCulled={false}
          onPointerMove={(e) => { if (e.instanceId == null) return; e.stopPropagation(); const nm = nodes[e.instanceId].name; if (shared.hov !== nm) { shared.hov = nm; onHover(nm) } }}
          onPointerOut={() => { shared.hov = null; onHover(null) }}
          onClick={(e) => { if (e.instanceId == null) return; e.stopPropagation(); onSelect(nodes[e.instanceId].name) }}>
          <sphereGeometry args={[0.13, mobile ? 10 : 18, mobile ? 10 : 18]} /><meshBasicMaterial toneMapped={false} />
        </instancedMesh>

        {labelled.map((n) => (
          <group key={n.idx} ref={(el) => { labelRefs.current[n.idx] = el }}>
            <Html center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
              <div className={`mt-6 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] ${n.idx === fIdx ? 'bg-cyan-300 font-semibold text-ink' : 'bg-ink/80 text-slate-100'}`}>{n.name}</div>
            </Html>
          </group>
        ))}
      </group>
    </>
  )
}

export default function ToolkitUniverse({ data, active, selected, hovered, onHover, onSelect, still, mobile, run, zoom }) {
  const shared = useRef({ extra: 0, zoom: 1, fw: new THREE.Vector3(), screen: null, hov: null }).current
  shared.zoom = zoom
  return (
    <Canvas dpr={[1, mobile ? 1.25 : 1.6]} camera={{ position: [0, 0, CAM_DIST], fov: CAM_FOV }} gl={{ alpha: true, antialias: !mobile }} frameloop={run && !still ? 'always' : 'demand'}>
      <Universe data={data} active={active} selected={selected} hovered={hovered} onHover={onHover} onSelect={onSelect} still={still} mobile={mobile} shared={shared} />
    </Canvas>
  )
}
