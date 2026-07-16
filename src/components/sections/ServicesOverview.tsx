"use client";

import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import ServiceIcon from "@/components/ui/ServiceIcon";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { SERVICES } from "@/lib/constants";

export default function ServicesOverview() {
  return (
    <section className="py-12 sm:py-24 md:py-32" style={{ background: "var(--nv-bg-page)" }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedSection>
          <SectionHeading
            overline="Our Expertise"
            title="Services We Deliver"
            subtitle="From custom MCP servers to enterprise platforms. One accountable partner. Delivered to the highest standard."
          />
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <StaggerItem key={service.id}>
              <Link href="/services" className="group block h-full">
                <Card className="h-full">
                  <ServiceIcon icon={service.icon} />
                  <h3
                    className="mt-4 text-lg font-semibold font-display"
                    style={{ color: "var(--nv-text-heading)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--nv-text-secondary)" }}>
                    {service.shortDescription}
                  </p>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
