import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PhaseDiagram from "@/components/sections/PhaseDiagram";
import JsonLd from "@/components/seo/JsonLd";
import { METHOD_PHASES, METHOD_PAGE, METHOD_FAQ } from "@/lib/method";

export const metadata: Metadata = {
  title: "The NexxVantage Method — Phased, Consultative Delivery",
  description:
    "How NexxVantage works: consultation first, MVP where it earns, phases planned against your revenue targets, enterprise hardening when enterprise arrives.",
};

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: METHOD_FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <AnimatedSection>
        <p className="nv-overline mb-3">{METHOD_PAGE.hero.overline}</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{METHOD_PAGE.hero.heading}</h1>
        <p className="nv-lead mt-4 max-w-3xl">{METHOD_PAGE.hero.sub}</p>
      </AnimatedSection>

      <section className="mt-20">
        <AnimatedSection>
          <h2 className="font-display text-3xl font-bold">{METHOD_PAGE.consultation.heading}</h2>
          <p className="mt-4 max-w-3xl text-secondary">{METHOD_PAGE.consultation.body}</p>
        </AnimatedSection>
      </section>

      {/* Phases with sticky diagram */}
      <section className="mt-20 grid gap-12 md:grid-cols-[1fr_240px]">
        <div className="space-y-16">
          {METHOD_PHASES.map((p) => (
            <AnimatedSection key={p.num}>
              <article data-layer={p.layer} className="scroll-mt-28">
                <p className="nv-overline">{`${METHOD_PAGE.phaseLabel} ${p.num}`}</p>
                <h3 className="mt-2 font-display text-2xl font-bold">{p.name}</h3>
                <p className="mt-3 max-w-2xl text-secondary">{p.deep}</p>
                <p className="mt-4 text-sm">
                  <span className="font-display font-semibold text-gold">{METHOD_PAGE.receiveLabel} </span>
                  <span className="text-secondary">{p.deliverable}</span>
                </p>
              </article>
            </AnimatedSection>
          ))}
        </div>
        <div className="hidden md:block">
          <div className="sticky top-28"><PhaseDiagram /></div>
        </div>
      </section>

      <section className="mt-24">
        <AnimatedSection>
          <div className="nv-card nv-card-accent p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold">{METHOD_PAGE.change.heading}</h2>
            <p className="mt-3 max-w-3xl text-secondary">{METHOD_PAGE.change.body}</p>
          </div>
        </AnimatedSection>
      </section>

      <section className="mt-24">
        <h2 className="font-display text-3xl font-bold">{METHOD_PAGE.faqHeading}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {METHOD_FAQ.map((f) => (
            <div key={f.q} className="nv-plaque">
              <h3 className="font-display text-base font-semibold text-heading">{f.q}</h3>
              <p className="mt-2 text-sm text-secondary">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 text-center">
        <h2 className="font-display text-2xl font-bold">{METHOD_PAGE.cta.heading}</h2>
        <p className="nv-lead mx-auto mt-3">{METHOD_PAGE.cta.sub}</p>
        <div className="mt-6"><Button href="/contact">{METHOD_PAGE.cta.button}</Button></div>
      </section>
    </div>
  );
}
