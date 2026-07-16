"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { HOME } from "@/lib/constants";

function Word({ progress, index, total, children, gold }: {
  progress: MotionValue<number>; index: number; total: number; children: string; gold?: boolean;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <motion.span style={{ opacity, color: gold ? "var(--nv-gold-400)" : undefined }}>
      {children}{" "}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.35"] });
  const { manifesto } = HOME;

  const mutedWords = manifesto.muted.split(" ");
  const mainWords = manifesto.main.split(" ");
  const goldWords = manifesto.gold.split(" ");
  const total = mutedWords.length + mainWords.length + goldWords.length;

  if (reduced) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-28 text-center md:px-6 md:py-36">
        <p className="font-display text-2xl font-semibold md:text-4xl">
          <span className="text-muted">{manifesto.muted}</span>
          <br /><br />
          <span className="text-heading">{manifesto.main} <span className="text-gold">{manifesto.gold}</span></span>
        </p>
      </section>
    );
  }

  return (
    <section ref={ref} className="mx-auto max-w-3xl px-4 py-28 text-center md:px-6 md:py-36">
      <p className="font-display text-2xl font-semibold leading-snug md:text-4xl" aria-label={`${manifesto.muted} ${manifesto.main} ${manifesto.gold}`}>
        <span className="text-muted" aria-hidden="true">
          {mutedWords.map((w, idx) => (
            <Word key={`muted-${idx}`} progress={scrollYProgress} index={idx} total={total}>{w}</Word>
          ))}
        </span>
        <br /><br />
        <span className="text-heading" aria-hidden="true">
          {mainWords.map((w, idx) => (
            <Word key={`main-${idx}`} progress={scrollYProgress} index={mutedWords.length + idx} total={total}>{w}</Word>
          ))}
          {goldWords.map((w, idx) => (
            <Word key={`gold-${idx}`} progress={scrollYProgress} index={mutedWords.length + mainWords.length + idx} total={total} gold>{w}</Word>
          ))}
        </span>
      </p>
    </section>
  );
}
