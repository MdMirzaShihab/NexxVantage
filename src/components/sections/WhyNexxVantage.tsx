"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { VALUE_PROPS } from "@/lib/constants";

export default function WhyNexxVantage() {
  return (
    <section className="py-24 sm:py-32 bg-brand-slate/30">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="Why Choose Us"
            subtitle="We combine deep technical expertise with a relentless focus on delivering results."
          />
        </AnimatedSection>

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((prop, i) => (
            <StaggerItem key={i}>
              <div className="group">
                <div className="mb-4 h-1 w-8 rounded-full bg-brand-primary transition-all duration-300 group-hover:w-12" />
                <h3 className="text-lg font-semibold">{prop.title}</h3>
                <p className="mt-2 text-sm text-brand-gray">{prop.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
