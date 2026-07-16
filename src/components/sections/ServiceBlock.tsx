"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { ServiceIcon as ServiceIconType } from "@/lib/constants";

interface ServiceBlockProps {
  icon: ServiceIconType;
  title: string;
  description: string;
  keyPoints: readonly string[];
  reversed?: boolean;
}

export default function ServiceBlock({
  icon,
  title,
  description,
  keyPoints,
  reversed = false,
}: ServiceBlockProps) {
  return (
    <AnimatedSection>
      <div
        className={`flex flex-col gap-6 py-10 md:gap-12 md:py-16 lg:flex-row lg:items-center lg:gap-20 ${
          reversed ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Content */}
        <div className="flex-1">
          <ServiceIcon icon={icon} className="h-12 w-12" />
          <h3
            className="mt-4 text-2xl font-bold sm:text-3xl font-display"
            style={{ color: "var(--nv-text-heading)" }}
          >
            {title}
          </h3>
          <p className="mt-4 leading-relaxed max-w-prose" style={{ color: "var(--nv-text-secondary)" }}>
            {description}
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {keyPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm" style={{ color: "var(--nv-text-primary)" }}>
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--nv-gold-bg-light)", color: "var(--nv-gold)" }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual placeholder — hidden on small screens */}
        <div className="hidden md:block flex-1">
          <div className="nv-card nv-card-inset relative aspect-video md:aspect-square max-w-md mx-auto overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <ServiceIcon icon={icon} className="h-24 w-24 opacity-20" />
            </div>
            {/* Decorative gold glow */}
            <div
              className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full blur-2xl"
              style={{ background: "var(--nv-gold-glow-subtle)" }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 h-24 w-24 rounded-full blur-2xl"
              style={{ background: "var(--nv-midnight-glow)" }}
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
