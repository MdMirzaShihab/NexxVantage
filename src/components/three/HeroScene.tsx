"use client";

import { Canvas } from "@react-three/fiber";
import FloatingGeometries from "./FloatingGeometries";
import MouseTracker from "./MouseTracker";

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#00C853" />
      <pointLight position={[-10, -5, 5]} intensity={0.4} color="#76FF03" />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />

      <MouseTracker>
        <FloatingGeometries />
      </MouseTracker>
    </Canvas>
  );
}
