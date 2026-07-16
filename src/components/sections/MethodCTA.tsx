"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Button from "@/components/ui/Button";
import MarkCanvas from "@/components/mark/MarkCanvas";
import MarkStatic from "@/components/mark/MarkStatic";
import { useCan3D } from "@/lib/useCan3D";
import { METHOD_PHASES } from "@/lib/method";
import { HOME } from "@/lib/constants";

function PhaseRow({ phase, index, progress }: {
  phase: (typeof METHOD_PHASES)[number]; index: number; progress: MotionValue<number>;
}) {
  const start = 0.08 + index * 0.11;
  const opacity = useTransform(progress, [start, start + 0.07], [0.2, 1]);
  return (
    <motion.div style={{ opacity }} className="flex gap-5">
      <span className="nv-overline w-8 flex-none pt-1">{phase.num}</span>
      <div>
        <h3 className="font-display text-lg font-semibold text-heading">{phase.name}</h3>
        <p className="mt-1 max-w-md text-sm text-secondary">{phase.short}</p>
      </div>
    </motion.div>
  );
}

export default function MethodCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const can3D = useCan3D();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const t = useTransform(scrollYProgress, [0, 0.5, 0.75, 1], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.72, 0.85], [0, 1]);
  const ctaVisibility = useTransform(ctaOpacity, (v) => (v < 0.05 ? "hidden" : "visible"));

  const { method, cta } = HOME;

  if (reduced) {
    // Static variant: exploded diagram + phases + CTA, normal flow
    return (
      <section className="nv-velvet px-4 py-24 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <div>
            <p className="nv-overline mb-3">{method.overline}</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{method.heading}</h2>
            <div className="mt-10 space-y-8">
              {METHOD_PHASES.map((p) => (
                <div key={p.num} className="flex gap-5">
                  <span className="nv-overline w-8 flex-none pt-1">{p.num}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-heading">{p.name}</h3>
                    <p className="mt-1 max-w-md text-sm text-secondary">{p.short}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href={method.link.href} className="mt-8 inline-block font-display text-sm font-semibold">
              {method.link.label} →
            </Link>
          </div>
          <MarkStatic variant="exploded" className="mx-auto w-56 md:w-72" />
        </div>
        <div className="mx-auto mt-24 max-w-3xl text-center">
          <p className="nv-overline mb-3">{cta.overline}</p>
          <h2 className="font-display text-3xl font-bold md:text-4xl">{cta.heading}</h2>
          <p className="nv-lead mx-auto mt-4">{cta.sub}</p>
          <div className="mt-8"><Button href={cta.button.href}>{cta.button.label}</Button></div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="nv-velvet relative" style={{ height: "350vh" }}>
      {/* Sticky stage: canvas on the right */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute right-0 top-0 hidden h-full w-1/2 md:block">
          {can3D ? (
            <MarkCanvas t={t} className="h-full w-full" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <MarkStatic variant="exploded" className="w-64" />
            </div>
          )}
        </div>
        {/* CTA overlay — fades in at the end while the mark reassembles */}
        <motion.div
          style={{ opacity: ctaOpacity, visibility: ctaVisibility }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4"
        >
          <div className="pointer-events-auto max-w-3xl text-center" style={{ background: "transparent" }}>
            <p className="nv-overline mb-3">{cta.overline}</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{cta.heading}</h2>
            <p className="nv-lead mx-auto mt-4">{cta.sub}</p>
            <div className="mt-8"><Button href={cta.button.href}>{cta.button.label}</Button></div>
          </div>
        </motion.div>
      </div>
      {/* Scrolling copy — occupies the first ~70% of the section height */}
      <div className="absolute inset-x-0 top-0 z-[5]" style={{ height: "70%" }}>
        <div className="mx-auto flex h-full max-w-7xl px-4 md:px-6">
          <div className="flex w-full flex-col justify-around py-[20vh] md:w-1/2">
            <div>
              <p className="nv-overline mb-3">{method.overline}</p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">{method.heading}</h2>
            </div>
            <div className="space-y-10">
              {METHOD_PHASES.map((p, i) => <PhaseRow key={p.num} phase={p} index={i} progress={scrollYProgress} />)}
            </div>
            <Link href={method.link.href} className="font-display text-sm font-semibold">
              {method.link.label} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
