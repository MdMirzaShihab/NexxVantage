/* Ghost mark — NexusMark logo as subtle watermark */
function GhostMark() {
  return (
    <svg
      className="nv-ghost-mark"
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Structural lines — verticals + diagonals forming X */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="30" y1="30" x2="30" y2="82" />
        <line x1="82" y1="30" x2="82" y2="82" />
        <line x1="30" y1="30" x2="82" y2="82" />
        <line x1="82" y1="30" x2="30" y2="82" />
      </g>
      {/* 4 corner nodes */}
      <g fill="currentColor">
        <circle cx="30" cy="30" r="5.5" />
        <circle cx="82" cy="30" r="5.5" />
        <circle cx="30" cy="82" r="5.5" />
        <circle cx="82" cy="82" r="5.5" />
      </g>
      {/* Outer orbital ring */}
      <circle cx="56" cy="56" r="19" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Central node */}
      <circle cx="56" cy="56" r="10" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

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
