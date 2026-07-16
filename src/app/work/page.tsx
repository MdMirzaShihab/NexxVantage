import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CASE_STUDIES, WORK_PAGE } from "@/lib/work";
import { HOME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Selected Work — NexxVantage",
  description:
    "Case studies from the NexxVantage studio and engineering house: premium web design and custom software, delivered phase by phase with measured outcomes.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <AnimatedSection>
        <p className="nv-overline mb-3">{WORK_PAGE.overline}</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{WORK_PAGE.heading}</h1>
        <p className="nv-lead mt-4 max-w-2xl">{WORK_PAGE.intro}</p>
      </AnimatedSection>
      <div className="mt-16 space-y-16">
        {CASE_STUDIES.map((cs, i) => (
          <AnimatedSection key={cs.slug} delay={i * 0.06}>
            <Link href={`/work/${cs.slug}`} className="group block no-underline">
              <article className="nv-card nv-card-elevated grid gap-8 overflow-hidden p-8 md:grid-cols-2 md:p-10">
                <div className="relative min-h-[240px] overflow-hidden rounded-lg">
                  <Image src={cs.cover.src} alt={cs.cover.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 90vw, 560px" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="nv-overline">{`${cs.client} · ${cs.sector}`}</p>
                  <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">{cs.title}</h2>
                  <p className="mt-4 text-secondary">{cs.summary}</p>
                  <p className="mt-6 text-sm">
                    <span className="font-display text-2xl font-bold text-gold">{cs.outcomes[0].value}</span>{" "}
                    <span className="text-secondary">{cs.outcomes[0].label}</span>
                  </p>
                  <span className="mt-6 font-display text-sm font-semibold text-accent">{HOME.work.readCase} →</span>
                </div>
              </article>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </main>
  );
}
