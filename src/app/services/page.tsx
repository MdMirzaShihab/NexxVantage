import type { Metadata } from "next";
import PageHeroBanner from "@/components/sections/PageHeroBanner";
import ServiceBlock from "@/components/sections/ServiceBlock";
import CTABanner from "@/components/sections/CTABanner";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "End-to-end software solutions from concept to deployment. Custom development, AI, cloud architecture, and UI/UX design.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeroBanner
        title="Our Services"
        subtitle="End-to-end solutions from concept to deployment."
      />

      <section className="py-8 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 divide-y divide-white/5">
          {SERVICES.map((service, i) => (
            <ServiceBlock
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.fullDescription}
              keyPoints={service.keyPoints}
              reversed={i % 2 !== 0}
            />
          ))}
        </div>
      </section>

      <CTABanner
        title="Have a Project in Mind?"
        primaryLabel="Book a Consultation"
        secondaryLabel="Get in Touch"
      />
    </>
  );
}
