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
    <section className="nv-hero relative flex min-h-screen items-center">
      <GhostMark />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-32 md:grid-cols-2 md:gap-12">
        {/* Text content */}
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
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-display"
            style={{ color: "var(--nv-hero-heading)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Create your own{" "}
            <span style={{ color: "var(--nv-hero-accent, var(--nv-gold))" }}>Dimentions</span>
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
            className="mt-10 flex flex-col gap-4 sm:flex-row"
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

        {/* Lottie animation */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[450px] lg:max-w-[520px]">
            <HeroLottieLoader />
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, var(--nv-bg-page), transparent)", pointerEvents: "none" }}
      />
    </section>
  );
}
