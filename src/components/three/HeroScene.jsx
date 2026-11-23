import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

// Centerpiece: a metallic torus knot (interlocking loops = connected systems) around a glowing data core,
// wrapped by a wire lattice, three orbiting rings with nodes, and a particle field.
function Knot() {
  const knot = useRef(), lattice = useRef(), core = useRef()
  useFrame((s, dt) => {
    knot.current.rotation.y += dt * 0.25
    knot.current.rotation.x += dt * 0.08
    lattice.current.rotation.y -= dt * 0.12
    lattice.current.rotation.z += dt * 0.07
    core.current.scale.setScalar(1 + Math.sin(s.clock.elapsedTime * 2) * 0.07)
  })
  return (
    <group>
      <mesh ref={knot}>
        <torusKnotGeometry args={[1, 0.3, 220, 28, 2, 3]} />
        <meshPhysicalMaterial color="#1b2a5e" metalness={1} roughness={0.16} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.5} />
      </mesh>
      <mesh ref={core}><sphereGeometry args={[0.42, 32, 32]} /><meshBasicMaterial color="#67e8f9" toneMapped={false} /></mesh>
      <mesh ref={lattice}><icosahedronGeometry args={[1.9, 1]} /><meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.22} /></mesh>
    </group>
  )
}

function Ring({ radius, tilt, speed, color }) {
  const g = useRef()
  useFrame((_, dt) => { g.current.rotation.z += dt * speed })
  return (
    <group rotation={tilt}>
      <group ref={g}>
        <mesh><torusGeometry args={[radius, 0.012, 8, 160]} /><meshBasicMaterial color={color} transparent opacity={0.55} /></mesh>
        <mesh position={[radius, 0, 0]}><sphereGeometry args={[0.07, 16, 16]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      </group>
    </group>
  )
}

function Particles({ count }) {
  const ref = useRef()
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 10, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1)
      a[i * 3] = r * Math.sin(ph) * Math.cos(th); a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); a[i * 3 + 2] = r * Math.cos(ph)
    }
    return a
  }, [count])
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.02; ref.current.rotation.x += dt * 0.006 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.035} color="#9db8ff" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// Entrance (scale-in + camera dolly) and mouse parallax.
function Rig({ play, still, mobile, children }) {
  const g = useRef(), t0 = useRef(null), mouse = useRef({ x: 0, y: 0 })
  const { camera, size } = useThree()
  useEffect(() => {
    const m = (e) => { mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2 }
    window.addEventListener('pointermove', m, { passive: true })
    return () => window.removeEventListener('pointermove', m)
  }, [])
  useFrame((s, dt) => {
    if (still) return
    const wide = size.width > 900
    const base = mobile ? 0.7 : 1
    g.current.position.set(wide ? 2.4 : 0, mobile ? 1.2 : 0, 0)
    let e = 0
    if (play) {
      if (t0.current === null) t0.current = s.clock.elapsedTime
      const k = Math.min((s.clock.elapsedTime - t0.current) / 2.2, 1)
      e = 1 - Math.pow(1 - k, 4)
    }
    g.current.scale.setScalar(Math.max(base * e, 0.0001))
    g.current.rotation.y = (1 - e) * 2.5
    const z = 12 - 5 * e
    camera.position.x = THREE.MathUtils.damp(camera.position.x, mouse.current.x * 1.1, 3, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, mouse.current.y * 0.7, 3, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 4, dt)
    camera.lookAt(0, 0, 0)
  })
  return <group ref={g} scale={still ? 1 : 0.0001} position={[0, 0, 0]}>{children}</group>
}

export default function HeroScene({ play, still, mobile, active }) {
  return (
    <Canvas dpr={[1, mobile ? 1.25 : 1.75]} camera={{ position: [0, 0, still ? 7 : 12], fov: 45 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active && !still ? 'always' : 'demand'} style={{ pointerEvents: 'none' }}>
      <ambientLight intensity={0.8} color="#7aa2ff" />
      <pointLight position={[4, 3, 5]} color="#22d3ee" intensity={40} distance={20} />
      <pointLight position={[-4, -2, 4]} color="#8b5cf6" intensity={40} distance={20} />
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={2.5} color="#9fd8ff" position={[4, 3, 4]} scale={[5, 5, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[-4, 4, 2]} scale={[5, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#6d5cff" position={[0, -4, -3]} scale={[8, 2, 1]} />
      </Environment>
      <Rig play={play} still={still} mobile={mobile}>
        <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}><Knot /></Float>
        <Ring radius={2.5} tilt={[1.2, 0.2, 0]} speed={0.5} color="#22d3ee" />
        <Ring radius={3.0} tilt={[0.5, 0.9, 0.3]} speed={-0.35} color="#8b5cf6" />
        <Ring radius={3.5} tilt={[1.5, -0.6, 0.8]} speed={0.25} color="#3b82f6" />
      </Rig>
      <Particles count={mobile ? 300 : 900} />
    </Canvas>
  )
}
