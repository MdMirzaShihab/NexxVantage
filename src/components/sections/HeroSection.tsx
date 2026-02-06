"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import HeroLottieLoader from "@/components/lottie/HeroLottieLoader";
import { SITE_CONFIG } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-secondary">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-32 md:grid-cols-2 md:gap-12">
        {/* Text content */}
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-secondary to-transparent" />
    </section>
  );
}
