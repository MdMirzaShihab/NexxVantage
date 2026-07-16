import { GhostMark } from "./HeroSection";

interface PageHeroBannerProps {
  title: string;
  subtitle?: string;
}

export default function PageHeroBanner({ title, subtitle }: PageHeroBannerProps) {
  return (
    <section className="nv-hero relative pt-20 pb-10 sm:pt-32 sm:pb-20 md:pt-40 md:pb-24">
      <GhostMark />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 text-center">
        <p className="nv-overline mb-6">NexxVantage</p>
        <h1
          className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-display"
          style={{ color: "var(--nv-hero-heading)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="nv-lead mt-4 max-w-2xl mx-auto"
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
