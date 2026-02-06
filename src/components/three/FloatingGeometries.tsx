"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function GlowMesh({
  geometry,
  position,
  scale,
  speed,
  rotationIntensity,
  floatIntensity,
  color = "#00C853",
}: {
  geometry: React.ReactNode;
  position: [number, number, number];
  scale: number;
  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <Float
      speed={speed}
      rotationIntensity={rotationIntensity}
      floatIntensity={floatIntensity}
      floatingRange={[-0.3, 0.3]}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingGeometries() {
  return (
    <group>
      {/* Icosahedron — center-right */}
      <GlowMesh
        geometry={<icosahedronGeometry args={[1, 1]} />}
        position={[2.5, 0.5, -1]}
        scale={1.2}
        speed={1.5}
        rotationIntensity={0.6}
        floatIntensity={1.5}
        color="#00C853"
      />

      {/* Torus knot — upper left */}
      <GlowMesh
        geometry={<torusKnotGeometry args={[0.6, 0.2, 128, 32]} />}
        position={[-2, 1.5, -2]}
        scale={1}
        speed={1.2}
        rotationIntensity={0.8}
        floatIntensity={1.2}
        color="#76FF03"
      />

      {/* Cube — lower right */}
      <GlowMesh
        geometry={<boxGeometry args={[1, 1, 1]} />}
        position={[3.5, -1.5, -3]}
        scale={0.8}
        speed={1}
        rotationIntensity={0.5}
        floatIntensity={1}
        color="#00C853"
      />

      {/* Octahedron — upper right */}
      <GlowMesh
        geometry={<octahedronGeometry args={[0.8]} />}
        position={[1, 2, -2.5]}
        scale={0.9}
        speed={1.8}
        rotationIntensity={0.7}
        floatIntensity={1.3}
        color="#B9F6CA"
      />

      {/* Sphere — lower left */}
      <GlowMesh
        geometry={<sphereGeometry args={[0.6, 32, 32]} />}
        position={[-3, -1, -1.5]}
        scale={1}
        speed={0.8}
        rotationIntensity={0.3}
        floatIntensity={0.8}
        color="#76FF03"
      />
    </group>
  );
}
