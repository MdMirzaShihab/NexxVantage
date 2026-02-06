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
        className={`flex flex-col gap-12 py-16 lg:flex-row lg:items-center lg:gap-20 ${
          reversed ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Content */}
        <div className="flex-1">
          <ServiceIcon icon={icon} className="h-12 w-12" />
          <h3 className="mt-4 text-2xl font-bold sm:text-3xl">{title}</h3>
          <p className="mt-4 text-brand-gray leading-relaxed">{description}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {keyPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual placeholder */}
        <div className="flex-1">
          <div className="relative aspect-square max-w-md mx-auto rounded-2xl glass overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <ServiceIcon icon={icon} className="h-24 w-24 opacity-20" />
            </div>
            {/* Decorative glow */}
            <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-brand-primary/10 blur-2xl" />
            <div className="absolute bottom-1/4 right-1/4 h-24 w-24 rounded-full bg-brand-lime/10 blur-2xl" />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
