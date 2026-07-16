"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Schedule during idle time so the heavy three.js chunk this gate unlocks
 *  never competes with the initial text paint (LCP) — falls back to a short
 *  timeout on browsers without `requestIdleCallback` (e.g. Safari). */
function onIdle(cb: () => void): () => void {
  const w = window as Window & { requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number; cancelIdleCallback?: (handle: number) => void };
  if (typeof w.requestIdleCallback === "function") {
    const handle = w.requestIdleCallback(cb, { timeout: 2000 });
    return () => w.cancelIdleCallback?.(handle);
  }
  const timer = setTimeout(cb, 300);
  return () => clearTimeout(timer);
}

/** Tier gate for the WebGL mark: requires WebGL context, a non-low-end
 *  device heuristic, and no reduced-motion preference. Returns false on
 *  the server and until mounted (SSR-safe). The check itself is deferred to
 *  idle time — it gates a `dynamic()` three.js import, and running the
 *  probe (and thus starting that chunk's fetch) synchronously on mount would
 *  contend with the page's largest-contentful-paint text on throttled CPUs. */
export function useCan3D(): boolean {
  const reduced = useReducedMotion();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (reduced) { setOk(false); return; }
    return onIdle(() => {
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
    });
  }, [reduced]);
  return ok;
}
