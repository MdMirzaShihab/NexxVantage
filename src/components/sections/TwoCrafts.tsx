import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SheenPanel from "@/components/ui/SheenPanel";
import { PILLARS } from "@/lib/constants";

export default function TwoCrafts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <div className="grid gap-8 md:grid-cols-2">
        {PILLARS.map((pillar, i) => (
          <AnimatedSection key={pillar.id} delay={i * 0.08}>
            <SheenPanel className="nv-card nv-card-elevated flex h-full flex-col p-8 md:p-10">
              <p className="nv-overline">{pillar.overline}</p>
              <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">{pillar.heading}</h2>
              <p className="mt-4 flex-1 text-secondary">{pillar.body}</p>
              <Link href={pillar.link.href} className="mt-6 font-display text-sm font-semibold">
                {pillar.link.label} →
              </Link>
            </SheenPanel>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
