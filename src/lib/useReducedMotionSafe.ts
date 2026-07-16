"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** SSR-safe reduced-motion flag for conditional JSX branching.
 *
 * Framer's `useReducedMotion()` reads `matchMedia` synchronously on the
 * client's very first render, so a visitor with `prefers-reduced-motion:
 * reduce` set hydrates with `true` while the server (which cannot see the
 * media query) always rendered assuming `false`/`null` — a real hydration
 * mismatch whenever `reduced` picks between structurally different JSX
 * branches. This hook always returns `false` on the server and on the
 * client's first render (matching SSR), then flips to the real preference
 * in an effect, once hydration has already committed safely. */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();
  const [safe, setSafe] = useState(false);
  useEffect(() => {
    setSafe(Boolean(reduced));
  }, [reduced]);
  return safe;
}
