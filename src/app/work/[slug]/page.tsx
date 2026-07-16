import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/seo/JsonLd";
import { CASE_STUDIES, getCaseStudy, WORK_PAGE } from "@/lib/work";
import { SITE_CONFIG } from "@/lib/constants";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cs = getCaseStudy(params.slug);
  if (!cs) return {};
  return { title: `${cs.title} — NexxVantage Work`, description: cs.summary };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug);
  if (!cs) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 md:px-6 md:py-32">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: cs.title,
          about: cs.summary,
          creator: { "@type": "Organization", name: "NexxVantage" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
            { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_CONFIG.url}/work` },
            { "@type": "ListItem", position: 3, name: cs.title, item: `${SITE_CONFIG.url}/work/${cs.slug}` },
          ],
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/work">{WORK_PAGE.breadcrumbLabel}</Link> <span aria-hidden="true">/</span> {cs.title}
      </nav>

      {/* 1 — Brief */}
      <p className="nv-overline">{`${cs.client} · ${cs.sector}`}</p>
      <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">{cs.title}</h1>
      <dl className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
        <div><dt className="nv-overline">{WORK_PAGE.brief.engagement}</dt><dd className="mt-1 text-sm">{cs.engagement}</dd></div>
        <div><dt className="nv-overline">{WORK_PAGE.brief.timeline}</dt><dd className="mt-1 text-sm">{cs.timeline}</dd></div>
        <div><dt className="nv-overline">{WORK_PAGE.brief.sector}</dt><dd className="mt-1 text-sm">{cs.sector}</dd></div>
      </dl>
      <div className="relative mt-10 h-[320px] overflow-hidden rounded-xl md:h-[440px]">
        <Image src={cs.cover.src} alt={cs.cover.alt} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 896px" />
      </div>

      {/* 2 — The problem, in the client's words */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">{WORK_PAGE.problemHeading}</h2>
        <blockquote className="nv-testimonial mt-6"><p className="text-lg italic">&ldquo;{cs.problemQuote}&rdquo;</p></blockquote>
      </section>

      {/* 3 — What we built first, and why */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">{WORK_PAGE.firstBuildHeading}</h2>
        <p className="mt-4 text-secondary">{cs.firstBuild}</p>
      </section>

      {/* 4 — The outcome */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">{WORK_PAGE.outcomeHeading}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {cs.outcomes.map((o) => (
            <div key={o.label} className="nv-plaque">
              <p className="font-display text-3xl font-bold text-gold">{o.value}</p>
              <p className="mt-1 text-sm text-secondary">{o.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 text-center">
        <h2 className="font-display text-2xl font-bold">{WORK_PAGE.cta.heading}</h2>
        <p className="nv-lead mx-auto mt-3">{WORK_PAGE.cta.sub}</p>
        <div className="mt-6"><Button href="/contact">{WORK_PAGE.cta.button}</Button></div>
      </section>
    </div>
  );
}
