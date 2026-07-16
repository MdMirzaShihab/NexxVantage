"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Tier gate for the WebGL mark: requires WebGL context, a non-low-end
 *  device heuristic, and no reduced-motion preference. Returns false on
 *  the server and until mounted (SSR-safe). */
export function useCan3D(): boolean {
  const reduced = useReducedMotion();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (reduced) { setOk(false); return; }
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      const nav = navigator as Navigator & { deviceMemory?: number };
      const memOk = (nav.deviceMemory ?? 8) >= 4;
      const cpuOk = (navigator.hardwareConcurrency ?? 8) >= 4;
      setOk(Boolean(gl) && memOk && cpuOk);
    } catch {
      setOk(false);
    }
  }, [reduced]);
  return ok;
}
