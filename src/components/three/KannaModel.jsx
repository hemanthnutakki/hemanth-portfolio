import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const CY = '#3be8ff'

// Same Kanna as before (body, head, visor, eyes, core, backpack, legs, thrusters).
// Additions that keep the silhouette: an elbow joint per arm, tiny thumbs, glowing brow lines and an "o" mouth.
// All motion comes from brain.update(); this component only applies the resulting pose.
function Arm({ s, pivotRef, foreRef, m }) {
  return (
    <group ref={pivotRef} position={[0.5 * s, -0.2, 0]}>
      <mesh position={[0, -0.115, 0]} material={m.white}><capsuleGeometry args={[0.085, 0.1, 6, 12]} /></mesh>
      <mesh position={[0, -0.22, 0]} material={m.grey}><sphereGeometry args={[0.075, 12, 12]} /></mesh>
      <group ref={foreRef} position={[0, -0.22, 0]}>
        <mesh position={[0, -0.11, 0]} material={m.white}><capsuleGeometry args={[0.08, 0.1, 6, 12]} /></mesh>
        <mesh position={[0, -0.22, 0]} material={m.grey}><sphereGeometry args={[0.11, 14, 14]} /></mesh>
        <mesh position={[0, -0.2, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={m.white}><capsuleGeometry args={[0.035, 0.05, 4, 8]} /></mesh>
      </group>
    </group>
  )
}

export default function KannaModel({ brain, reduced, vel }) {
  const root = useRef(), body = useRef(), head = useRef(), eyes = useRef(), eyeL = useRef(), eyeR = useRef()
  const armA = useRef(), armB = useRef(), foreA = useRef(), foreB = useRef(), legA = useRef(), legB = useRef()
  const core = useRef(), tip = useRef(), flame = useRef(), smile = useRef(), mouth = useRef(), browL = useRef(), browR = useRef()
  const { invalidate } = useThree()
  useEffect(() => { brain.invalidate = invalidate; return () => { brain.invalidate = null } }, [brain, invalidate])

  const m = useMemo(() => ({
    white: new THREE.MeshStandardMaterial({ color: '#eef3fb', metalness: 0.5, roughness: 0.22 }),
    grey: new THREE.MeshStandardMaterial({ color: '#9fb0cc', metalness: 0.8, roughness: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#09132b', metalness: 0.85, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }),
    cyan: new THREE.MeshBasicMaterial({ color: CY, toneMapped: false }),
    brow: new THREE.MeshBasicMaterial({ color: CY, transparent: true, opacity: 0.6, toneMapped: false }),
    flame: new THREE.MeshBasicMaterial({ color: CY, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  }), [])

  useFrame((state, dt) => {
    const v = vel ? vel() : null
    const P = brain.update(dt, { reduced, vx: v ? v.vx : 0, vy: v ? v.vy : 0 })
    const now = state.clock.elapsedTime, f = P.face

    root.current.position.set(P.root.x, P.root.y, 0)
    root.current.rotation.set(P.root.rx, P.root.ry, P.root.rz)
    root.current.scale.set(1 + P.root.sq * 0.5, 1 - P.root.sq, 1 + P.root.sq * 0.5)
    body.current.scale.set(1 + P.breath * 0.02, 1 + P.breath * 0.012, 1 + P.breath * 0.02)
    head.current.position.y = 0.55 + P.breath * 0.012
    head.current.rotation.set(P.head.pitch, P.head.yaw, P.head.roll)

    eyes.current.position.set(P.eye.x * 0.07, 0.02 - P.eye.y * 0.045, 0.64)
    eyeL.current.scale.set(0.085 * f.ex, 0.13 * f.ey * P.eye.blink, 0.04)
    eyeR.current.scale.copy(eyeL.current.scale)
    smile.current.scale.set(Math.max(f.sw, 0.001), Math.max(f.sc, 0.12), 1)
    mouth.current.scale.setScalar(Math.max(f.mo, 0.0001))
    browL.current.position.y = 0.17 + f.bl; browL.current.rotation.z = f.ba
    browR.current.position.y = 0.17 + f.br; browR.current.rotation.z = -f.ba
    m.brow.opacity = f.bo

    armA.current.position.y = -0.2 + P.breath * 0.01; armB.current.position.y = -0.2 + P.breath * 0.01
    armA.current.rotation.set(P.A.ax, 0, P.A.az); foreA.current.rotation.x = -P.A.ae
    armB.current.rotation.set(P.B.ax, 0, -P.B.az); foreB.current.rotation.x = -P.B.ae
    legA.current.rotation.set(P.legA, 0, P.legRoll); legB.current.rotation.set(P.legB, 0, P.legRoll)

    core.current.scale.setScalar(1 + (reduced ? 0 : Math.sin(now * 3) * 0.1) + P.thr * 0.15)
    tip.current.scale.setScalar(1 + (reduced ? 0 : Math.sin(now * 4.2) * 0.2))
    flame.current.visible = P.thr > 0.03
    flame.current.scale.set(1, 0.2 + P.thr * (0.8 + Math.random() * 0.2), 1)
  })

  return (
    <>
      <ambientLight intensity={1} color="#8fb4ff" />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-3, 1, -2]} color="#6d5cff" intensity={8} distance={8} />
      <pointLight position={[0, -0.35, 1.3]} color={CY} intensity={6} distance={4} />
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={2} color="#9fd8ff" position={[3, 2, 3]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[-3, 3, 2]} scale={[4, 3, 1]} />
        <Lightformer form="rect" intensity={1} color="#4f7bff" position={[0, -3, -3]} scale={[6, 2, 1]} />
      </Environment>

      <group ref={root}>
        <group ref={body}>
          <mesh position={[0, -0.45, 0]} material={m.white}><capsuleGeometry args={[0.4, 0.3, 8, 20]} /></mesh>
          <mesh position={[0, -0.35, 0.385]} material={m.grey}><torusGeometry args={[0.13, 0.025, 10, 28]} /></mesh>
          <mesh ref={core} position={[0, -0.35, 0.4]} scale={[1, 1, 0.5]} material={m.cyan}><sphereGeometry args={[0.085, 18, 18]} /></mesh>
        </group>

        <RoundedBox args={[0.5, 0.55, 0.22]} radius={0.06} smoothness={4} position={[0, -0.3, -0.5]} material={m.white} />
        <mesh position={[0, -0.28, -0.63]} material={m.cyan}><boxGeometry args={[0.26, 0.05, 0.02]} /></mesh>
        <group ref={flame} position={[0, -0.62, -0.5]}>
          {[-0.12, 0.12].map((x) => (
            <mesh key={x} position={[x, -0.175, 0]} rotation={[Math.PI, 0, 0]} material={m.flame}><coneGeometry args={[0.07, 0.35, 12]} /></mesh>
          ))}
        </group>

        <Arm s={1} pivotRef={armA} foreRef={foreA} m={m} />
        <Arm s={-1} pivotRef={armB} foreRef={foreB} m={m} />

        {[[legA, 0.2], [legB, -0.2]].map(([ref, x]) => (
          <group key={x} ref={ref} position={[x, -0.98, 0]}>
            <mesh position={[0, -0.12, 0]} material={m.white}><capsuleGeometry args={[0.1, 0.12, 6, 12]} /></mesh>
            <mesh position={[0, -0.3, 0.05]} scale={[1, 0.6, 1.4]} material={m.grey}><sphereGeometry args={[0.14, 14, 14]} /></mesh>
          </group>
        ))}

        <group ref={head} position={[0, 0.55, 0]}>
          <mesh scale={[1.1, 0.95, 1]} material={m.white}><sphereGeometry args={[0.6, 32, 32]} /></mesh>
          <mesh position={[0, 0, 0.4]} scale={[0.46, 0.36, 0.28]} material={m.glass}><sphereGeometry args={[1, 32, 24]} /></mesh>
          <group ref={eyes} position={[0, 0.02, 0.64]}>
            <mesh ref={eyeL} position={[-0.19, 0, 0.02]} material={m.cyan}><sphereGeometry args={[1, 16, 16]} /></mesh>
            <mesh ref={eyeR} position={[0.19, 0, 0.02]} material={m.cyan}><sphereGeometry args={[1, 16, 16]} /></mesh>
          </group>
          <group ref={browL} position={[-0.19, 0.17, 0.645]}><mesh rotation={[0, 0, Math.PI / 2]} material={m.brow}><capsuleGeometry args={[0.012, 0.1, 4, 8]} /></mesh></group>
          <group ref={browR} position={[0.19, 0.17, 0.645]}><mesh rotation={[0, 0, Math.PI / 2]} material={m.brow}><capsuleGeometry args={[0.012, 0.1, 4, 8]} /></mesh></group>
          <mesh ref={smile} position={[0, -0.12, 0.66]} rotation={[0, 0, Math.PI]} material={m.cyan}><torusGeometry args={[0.07, 0.012, 8, 20, Math.PI]} /></mesh>
          <mesh ref={mouth} position={[0, -0.11, 0.665]} material={m.cyan}><torusGeometry args={[0.03, 0.009, 8, 16]} /></mesh>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.66, 0, 0]}>
              <mesh rotation={[0, 0, Math.PI / 2]} material={m.grey}><cylinderGeometry args={[0.14, 0.14, 0.13, 20]} /></mesh>
              <mesh position={[s * 0.07, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={m.cyan}><torusGeometry args={[0.09, 0.015, 8, 24]} /></mesh>
            </group>
          ))}
          <mesh position={[0, 0.66, 0]} material={m.grey}><cylinderGeometry args={[0.018, 0.018, 0.22, 8]} /></mesh>
          <mesh ref={tip} position={[0, 0.79, 0]} material={m.cyan}><sphereGeometry args={[0.055, 14, 14]} /></mesh>
        </group>
      </group>

      <ContactShadows position={[0, -1.42, 0]} opacity={0.5} scale={3} blur={2.5} far={2} resolution={128} color="#0b1b4a" />
    </>
  )
}
