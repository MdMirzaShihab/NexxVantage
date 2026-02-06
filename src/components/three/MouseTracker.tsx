"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MouseTrackerProps {
  children: React.ReactNode;
  intensity?: number;
}

export default function MouseTracker({ children, intensity = 0.15 }: MouseTrackerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(({ pointer }) => {
    mouse.current.x = pointer.x * intensity;
    mouse.current.y = pointer.y * intensity;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y,
        0.05
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
}
