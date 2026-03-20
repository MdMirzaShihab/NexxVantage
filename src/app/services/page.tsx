import type { Metadata } from "next";
import PageHeroBanner from "@/components/sections/PageHeroBanner";
import ServiceBlock from "@/components/sections/ServiceBlock";
import CTABanner from "@/components/sections/CTABanner";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software, MCP server development, AI systems, ERP integration, white-label partnership, cloud architecture, and UI/UX design — delivered with precision from Dhaka, Bangladesh.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeroBanner
        title="Our Services"
        subtitle="End-to-end solutions from concept to deployment."
      />

      <section className="py-8 sm:py-16" style={{ background: "var(--nv-bg-page)" }}>
        <div className="mx-auto max-w-7xl px-6">
          {SERVICES.map((service, i) => (
            <div key={service.id}>
              <ServiceBlock
                icon={service.icon}
                title={service.title}
                description={service.fullDescription}
                keyPoints={service.keyPoints}
                reversed={i % 2 !== 0}
              />
              {i < SERVICES.length - 1 && <div className="nv-divider-subtle" />}
            </div>
          ))}
        </div>
      </section>

      <div className="nv-divider" />

      <CTABanner
        title="Have a Project in Mind?"
        primaryLabel="Book a Consultation"
        secondaryLabel="Get in Touch"
      />
    </>
  );
}
