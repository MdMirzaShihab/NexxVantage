"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

const CORNERS: [number, number][] = [[-1.15, -1.15], [1.15, -1.15], [-1.15, 1.15], [1.15, 1.15]];

function useMaterials() {
  return useMemo(() => {
    const midnight = new THREE.MeshStandardMaterial({ color: "#24406B", metalness: 0.85, roughness: 0.35 });
    const gold = new THREE.MeshStandardMaterial({ color: "#C9A84C", metalness: 1.0, roughness: 0.25 });
    const goldBright = new THREE.MeshStandardMaterial({ color: "#E0C76F", metalness: 1.0, roughness: 0.2 });
    return { midnight, gold, goldBright };
  }, []);
}

function Strut({ a, b, material }: { a: [number, number]; b: [number, number]; material: THREE.Material }) {
  const { mid, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(a[0], a[1], 0);
    const vb = new THREE.Vector3(b[0], b[1], 0);
    const dir = vb.clone().sub(va);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { mid: va.clone().add(vb).multiplyScalar(0.5), quat, len };
  }, [a, b]);
  return (
    <mesh position={mid} quaternion={quat} material={material}>
      <cylinderGeometry args={[0.05, 0.05, len, 20]} />
    </mesh>
  );
}

function Mark({ t, idle }: { t: MotionValue<number>; idle: boolean }) {
  const mats = useMaterials();
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const struts = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const v = t.get();
    if (ring.current) ring.current.position.z = -0.9 * v;
    if (struts.current) struts.current.position.z = -0.3 * v;
    if (nodes.current) nodes.current.position.z = 0.35 * v;
    if (core.current) core.current.position.z = 1.0 * v;
    if (spin.current && idle) spin.current.rotation.y += delta * 0.12;
    if (tilt.current) {
      const targetX = idle ? state.pointer.y * -0.16 : 0.35 * v; // exploded view leans back
      const targetY = idle ? state.pointer.x * 0.2 : -0.15 * v;
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, targetX, 3, delta);
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, targetY, 3, delta);
    }
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <group ref={ring}>
          <mesh material={mats.gold}>
            <torusGeometry args={[1.9, 0.045, 16, 96]} />
          </mesh>
        </group>
        <group ref={struts}>
          <Strut a={CORNERS[0]} b={CORNERS[3]} material={mats.midnight} />
          <Strut a={CORNERS[1]} b={CORNERS[2]} material={mats.midnight} />
          <Strut a={CORNERS[0]} b={CORNERS[2]} material={mats.midnight} />
          <Strut a={CORNERS[1]} b={CORNERS[3]} material={mats.midnight} />
        </group>
        <group ref={nodes}>
          {CORNERS.map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0]} material={mats.gold}>
              <sphereGeometry args={[0.16, 24, 24]} />
            </mesh>
          ))}
        </group>
        <group ref={core}>
          <mesh material={mats.gold} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.12, 48]} />
          </mesh>
          <mesh material={mats.midnight} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 48]} />
          </mesh>
          <mesh material={mats.goldBright} position={[-0.09, 0.09, 0.08]}>
            <sphereGeometry args={[0.045, 16, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function MarkScene({ t, idle, active }: { t: MotionValue<number>; idle: boolean; active: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.18} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#F2E2AE" />
      <pointLight position={[-4, -2, -3]} intensity={0.9} color="#516689" />
      <Mark t={t} idle={idle} />
    </Canvas>
  );
}
