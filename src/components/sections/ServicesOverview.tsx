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
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="What We Do"
            subtitle="End-to-end software solutions, from concept to deployment."
          />
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <StaggerItem key={service.id}>
              <Link href="/services" className="group block h-full">
                <Card className="h-full">
                  <ServiceIcon icon={service.icon} />
                  <h3 className="mt-4 text-lg font-semibold group-hover:text-brand-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-gray">
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
