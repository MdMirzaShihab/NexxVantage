"use client";

import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import MarkStatic from "@/components/mark/MarkStatic";
import MarkCanvas from "@/components/mark/MarkCanvas";
import { useCan3D } from "@/lib/useCan3D";
import { HOME } from "@/lib/constants";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function HeroMovement() {
  const can3D = useCan3D();
  const reduced = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);
  const t = useMotionValue(0); // hero mark stays assembled

  const { hero } = HOME;

  return (
    <section className="nv-velvet nv-hero relative flex min-h-[100svh] items-center overflow-hidden">
      {/* atmosphere */}
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-[320px] w-[320px] rounded-full blur-3xl md:h-[560px] md:w-[560px]"
        style={{ background: "var(--nv-gold-glow-subtle)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-24 md:grid-cols-2 md:px-6 md:py-32">
        <div className="max-w-2xl">
          <motion.p className="nv-overline mb-4" {...(reduced ? {} : rise(0))}>
            {hero.overline}
          </motion.p>
          <motion.h1
            className="font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-[var(--nv-text-display-lg)]"
            style={{ color: "var(--nv-hero-heading)" }}
            {...(reduced ? {} : rise(0.08))}
          >
            {hero.headlinePre}{" "}
            <span style={{ color: "var(--nv-hero-accent)" }}>{hero.headlineGold}</span>
          </motion.h1>
          <motion.p className="nv-lead mt-6 max-w-xl" {...(reduced ? {} : rise(0.16))}>
            {hero.sub}
          </motion.p>
          <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row" {...(reduced ? {} : rise(0.24))}>
            <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
            <Button href={hero.ctaGhost.href} variant="ghost">{hero.ctaGhost.label}</Button>
          </motion.div>
        </div>

        {/* The mark: static SVG is the SSR/LCP element; canvas cross-fades over it */}
        <div className="relative mx-auto h-[280px] w-[280px] md:h-[440px] md:w-[440px]">
          <div
            className="absolute inset-0"
            style={{ opacity: canvasReady ? 0 : 1, transition: "opacity 600ms var(--nv-ease)" }}
          >
            <MarkStatic className="h-full w-full" variant="assembled" />
          </div>
          {can3D && (
            <MarkCanvas
              t={t}
              idle
              className="absolute inset-0"
              onReady={() => setCanvasReady(true)}
            />
          )}
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, var(--nv-bg-page), transparent)" }}
      />
    </section>
  );
}
