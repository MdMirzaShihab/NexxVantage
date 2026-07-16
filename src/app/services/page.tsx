import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { PILLARS, AGENCY_OFFER, SERVICES_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services — NexxVantage Studio & Engineering House",
  description:
    "Two crafts under one roof: brand-first web design from the Studio, and enterprise-grade custom software — ERP, AI & MCP, cloud — from the Engineering House.",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <AnimatedSection>
        <p className="nv-overline mb-3">{SERVICES_PAGE.overline}</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{SERVICES_PAGE.heading}</h1>
      </AnimatedSection>

      {PILLARS.map((pillar) => (
        <section key={pillar.id} id={pillar.id} className="mt-20 scroll-mt-28">
          <AnimatedSection>
            <p className="nv-overline">{pillar.overline}</p>
            <h2 className="mt-2 font-display text-3xl font-bold">{pillar.heading}</h2>
            <p className="nv-lead mt-4 max-w-3xl">{pillar.intro}</p>
          </AnimatedSection>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {pillar.services.map((svc) => (
              <AnimatedSection key={svc.id}>
                <article id={svc.id} className="nv-card h-full scroll-mt-28 p-8">
                  <h3 className="font-display text-xl font-bold">{svc.title}</h3>
                  <p className="mt-3 text-secondary">{svc.description}</p>
                  <ul className="mt-5 space-y-2">
                    {svc.keyPoints.map((kp) => (
                      <li key={kp} className="flex gap-2 text-sm text-secondary">
                        <span className="text-gold" aria-hidden="true">—</span>{kp}
                      </li>
                    ))}
                  </ul>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </section>
      ))}

      <section id="agencies" className="mt-24 scroll-mt-28">
        <AnimatedSection>
          <div className="nv-card-inset nv-card p-8 md:p-10">
            <p className="nv-overline">{AGENCY_OFFER.overline}</p>
            <h2 className="mt-2 font-display text-2xl font-bold">{AGENCY_OFFER.title}</h2>
            <p className="mt-3 max-w-3xl text-secondary">{AGENCY_OFFER.description}</p>
            <ul className="mt-5 space-y-2">
              {AGENCY_OFFER.keyPoints.map((kp) => (
                <li key={kp} className="flex gap-2 text-sm text-secondary">
                  <span className="text-gold" aria-hidden="true">—</span>{kp}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </section>

      <section className="mt-24 text-center">
        <h2 className="font-display text-2xl font-bold">{SERVICES_PAGE.cta.heading}</h2>
        <p className="nv-lead mx-auto mt-3">{SERVICES_PAGE.cta.sub}</p>
        <div className="mt-6"><Button href="/contact">{SERVICES_PAGE.cta.button}</Button></div>
      </section>
    </main>
  );
}
