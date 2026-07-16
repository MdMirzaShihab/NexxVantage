"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import HeroLottieLoader from "@/components/lottie/HeroLottieLoader";
import { SITE_CONFIG } from "@/lib/constants";

/* Ghost mark — NexusMark logo as subtle watermark */
function GhostMark() {
  return (
    <svg
      className="nv-ghost-mark"
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Structural lines — verticals + diagonals forming X */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="30" y1="30" x2="30" y2="82" />
        <line x1="82" y1="30" x2="82" y2="82" />
        <line x1="30" y1="30" x2="82" y2="82" />
        <line x1="82" y1="30" x2="30" y2="82" />
      </g>
      {/* 4 corner nodes */}
      <g fill="currentColor">
        <circle cx="30" cy="30" r="5.5" />
        <circle cx="82" cy="30" r="5.5" />
        <circle cx="30" cy="82" r="5.5" />
        <circle cx="82" cy="82" r="5.5" />
      </g>
      {/* Outer orbital ring */}
      <circle cx="56" cy="56" r="19" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Central node */}
      <circle cx="56" cy="56" r="10" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export { GhostMark };

export default function HeroSection() {
  return (
    <section className="nv-hero relative flex min-h-[100svh] items-center">
      <GhostMark />

      {/* Atmospheric gold glow — top right */}
      <div
        className="absolute -top-20 -right-20 h-[280px] w-[280px] md:h-[500px] md:w-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--nv-gold-glow-subtle)" }}
        aria-hidden="true"
      />
      {/* Deep midnight glow — bottom left */}
      <div
        className="absolute -bottom-16 -left-16 h-[200px] w-[200px] md:h-[400px] md:w-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "var(--nv-midnight-glow-deep)" }}
        aria-hidden="true"
      />

      {/* ── Desktop: 2-col grid | Mobile: stacked with floating Lottie ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6">

        {/* Desktop layout — classic 2-col */}
        <div className="hidden md:grid md:grid-cols-2 md:items-center md:gap-12 md:py-32">
          <div className="max-w-3xl">
            <motion.p
              className="nv-overline mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Premium by Design. Transparent by Default.
            </motion.p>
            <motion.h1
              className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl font-display"
              style={{ color: "var(--nv-hero-heading)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              Create your own{" "}
              <span style={{ color: "var(--nv-hero-accent, var(--nv-gold))" }}>Dimensions</span>
            </motion.h1>
            <motion.p
              className="nv-lead mt-6 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {SITE_CONFIG.description}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Button href={SITE_CONFIG.bookingUrl}>Book a Consultation</Button>
              <Button href="/services" variant="ghost">
                Our Services
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="w-full max-w-[450px] lg:max-w-[520px]">
              <HeroLottieLoader />
            </div>
          </motion.div>
        </div>

        {/* ── Mobile layout — cinematic full-viewport ── */}
        <div className="flex md:hidden flex-col justify-between min-h-[100svh] py-20">
          {/* Top: Heading + Lottie row */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative">
              {/* Lottie floats to the right of heading */}
              <motion.div
                className="absolute right-0 top-0 w-[110px]"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                aria-hidden="true"
              >
                <HeroLottieLoader />
              </motion.div>

              <motion.h1
                className="text-[2.25rem] leading-[1.15] font-bold tracking-tight font-display pr-[120px]"
                style={{ color: "var(--nv-hero-heading)" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                Create your own{" "}
                <span style={{ color: "var(--nv-hero-accent, var(--nv-gold))" }}>Dimensions</span>
              </motion.h1>
            </div>

            <motion.p
              className="mt-5 text-[0.938rem] leading-relaxed max-w-[300px]"
              style={{ color: "var(--nv-hero-muted)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {SITE_CONFIG.description}
            </motion.p>
          </div>

          {/* Bottom: CTAs pinned near viewport bottom */}
          <motion.div
            className="flex flex-col gap-3 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <Button href={SITE_CONFIG.bookingUrl}>Book a Consultation</Button>
            <Button href="/services" variant="ghost">
              Our Services
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, var(--nv-bg-page), transparent)", pointerEvents: "none" }}
      />
    </section>
  );
}
