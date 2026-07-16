"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import SheenPanel from "@/components/ui/SheenPanel";
import { CASE_STUDIES, type CaseStudy } from "@/lib/work";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { HOME } from "@/lib/constants";

const GAP = 420; // z-distance between panels (px)

function PanelContent({ cs }: { cs: CaseStudy }) {
  return (
    <SheenPanel className="nv-card nv-card-elevated flex h-full flex-col overflow-hidden p-6">
      <p className="nv-overline">{`${HOME.work.clientLabel} · ${cs.sector}`}</p>
      <h3 className="mt-2 font-display text-xl font-bold">{cs.title}</h3>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-lg" style={{ minHeight: 160 }}>
        <Image src={cs.cover.src} alt={cs.cover.alt} fill className="object-cover" sizes="(max-width: 768px) 80vw, 480px" />
      </div>
      <p className="mt-4 text-sm text-secondary">
        <span className="font-semibold text-gold">{cs.outcomes[0].value}</span> {cs.outcomes[0].label}
      </p>
      <Link href={`/work/${cs.slug}`} className="mt-3 font-display text-sm font-semibold">
        {HOME.work.readCase} →
      </Link>
    </SheenPanel>
  );
}

function DollyPanel({ cs, index, cam }: { cs: CaseStudy; index: number; cam: MotionValue<number> }) {
  const opacity = useTransform(cam, (v) => {
    const d = v - index * GAP;
    if (d <= 0) return 1;
    return Math.max(0, 1 - d / 120);
  });
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-[420px] w-[480px] -translate-x-1/2 -translate-y-1/2"
      style={{ z: -index * GAP, y: -index * 10 - 210, x: -240, opacity, transformStyle: "preserve-3d" }}
    >
      <PanelContent cs={cs} />
    </motion.div>
  );
}

export default function WorkGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cam = useTransform(scrollYProgress, [0.05, 0.95], [0, GAP * (CASE_STUDIES.length - 1)]);

  const header = (
    <div className="text-center">
      <p className="nv-overline mb-3">{HOME.work.overline}</p>
      <h2 className="font-display text-3xl font-bold md:text-4xl">{HOME.work.heading}</h2>
      <Link href={HOME.work.link.href} className="mt-3 inline-block font-display text-sm font-semibold">
        {HOME.work.link.label} →
      </Link>
    </div>
  );

  // Reduced motion (any width): plain stacked list
  if (reduced) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        {header}
        <div className="mx-auto mt-12 grid max-w-2xl gap-8">
          {CASE_STUDIES.map((cs) => <div key={cs.slug} className="h-[420px]"><PanelContent cs={cs} /></div>)}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Desktop: pinned dolly */}
      <section ref={ref} className="relative hidden md:block" style={{ height: `${(CASE_STUDIES.length + 1) * 100}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden" style={{ perspective: "900px" }}>
          <div className="pt-20">{header}</div>
          <motion.div className="relative flex-1" style={{ z: cam, transformStyle: "preserve-3d" }}>
            {CASE_STUDIES.map((cs, i) => <DollyPanel key={cs.slug} cs={cs} index={i} cam={cam} />)}
          </motion.div>
        </div>
      </section>
      {/* Touch/small: swipe deck */}
      <section className="py-24 md:hidden">
        <div className="px-4">{header}</div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
          {CASE_STUDIES.map((cs) => (
            <div key={cs.slug} className="h-[440px] w-[82vw] flex-none snap-center">
              <PanelContent cs={cs} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
