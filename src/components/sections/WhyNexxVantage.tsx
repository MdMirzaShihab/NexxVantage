"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { VALUE_PROPS } from "@/lib/constants";

export default function WhyNexxVantage() {
  return (
    <section className="nv-section-alt py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            overline="The NexxVantage Difference"
            title="Built Different"
            subtitle="A rare combination: deep engineering and financial expertise, disciplined delivery, and a transparent operating model you can audit."
          />
        </AnimatedSection>

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((prop) => (
            <StaggerItem key={prop.title}>
              <div className="group">
                <div
                  className="mb-4 h-1 w-8 rounded-full transition-all duration-300 group-hover:w-12"
                  style={{ background: "var(--nv-gold)" }}
                />
                <h3 className="text-lg font-semibold font-display" style={{ color: "var(--nv-text-heading)" }}>
                  {prop.title}
                </h3>
                <p className="mt-2 text-sm max-w-prose" style={{ color: "var(--nv-text-secondary)" }}>
                  {prop.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
