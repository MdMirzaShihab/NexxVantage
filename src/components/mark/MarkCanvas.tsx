"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

const MarkScene = dynamic(() => import("./MarkScene"), { ssr: false });

type MarkCanvasProps = {
  t: MotionValue<number>;
  idle?: boolean;
  className?: string;
  /** Called once the canvas has mounted — callers cross-fade MarkStatic out. */
  onReady?: () => void;
};

export default function MarkCanvas({ t, idle = false, className, onReady }: MarkCanvasProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "20%" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (mounted) onReady?.();
  }, [mounted, onReady]);

  return (
    <div
      ref={holder}
      className={className}
      style={{ opacity: mounted ? 1 : 0, transition: "opacity 600ms var(--nv-ease)" }}
      aria-hidden="true"
    >
      {visible || mounted ? (
        <MarkScene t={t} idle={idle} active={visible} onCreated={() => setMounted(true)} />
      ) : null}
    </div>
  );
}
