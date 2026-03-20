"use client";

import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { SITE_CONFIG } from "@/lib/constants";

interface CTABannerProps {
  title?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTABanner({
  title = "Your Next Platform Starts With a Conversation",
  primaryLabel = "Book a Consultation",
  primaryHref = SITE_CONFIG.bookingUrl,
  secondaryLabel = "Get in Touch",
  secondaryHref = "/contact",
}: CTABannerProps) {
  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "var(--nv-cta-bg)" }}
    >
      {/* Subtle gold glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full blur-3xl"
        style={{ background: "var(--nv-gold-bg-subtle)" }}
      />

      <AnimatedSection className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="nv-overline mb-4">Get Started</p>
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display"
          style={{ color: "var(--nv-cta-text)" }}
        >
          {title}
        </h2>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href={primaryHref}>{primaryLabel}</Button>
          <Button href={secondaryHref} variant="ghost">
            {secondaryLabel}
          </Button>
        </div>
      </AnimatedSection>
    </section>
  );
}
