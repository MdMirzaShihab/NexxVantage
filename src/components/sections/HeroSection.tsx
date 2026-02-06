"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import HeroSceneLoader from "@/components/three/HeroSceneLoader";
import HeroFallback from "@/components/sections/HeroFallback";
import { SITE_CONFIG } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-secondary">
      {/* 3D scene — desktop only */}
      <div className="absolute inset-0 z-0 hidden md:block" aria-hidden="true">
        <HeroSceneLoader />
      </div>

      {/* CSS fallback — mobile */}
      <div className="md:hidden">
        <HeroFallback />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div className="max-w-3xl">
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {SITE_CONFIG.tagline.split(" ").map((word, i) => {
              if (word === "Software" || word === "Scales") {
                return (
                  <span key={i} className="text-brand-primary">
                    {word}{" "}
                  </span>
                );
              }
              return <span key={i}>{word} </span>;
            })}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-lg text-brand-gray sm:text-xl"
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
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-secondary to-transparent" />
    </section>
  );
}
