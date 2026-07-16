import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { HOME, WHY_POINTS } from "@/lib/constants";

export default function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <AnimatedSection>
        <p className="nv-overline mb-3">{HOME.why.overline}</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">{HOME.why.heading}</h2>
      </AnimatedSection>
      <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2">
        {WHY_POINTS.map((p) => (
          <StaggerItem key={p.title} className="nv-plaque">
            <h3 className="font-display text-lg font-semibold" style={{ color: "var(--nv-gold-300)" }}>
              {p.title}
            </h3>
            <p className="mt-2 text-sm text-secondary">{p.description}</p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
