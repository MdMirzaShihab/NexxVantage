import { SITE_CONFIG } from "@/lib/constants";

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold font-display" style={{ color: "var(--nv-text-heading)" }}>
          Other Ways to Connect
        </h3>
        <p className="mt-1 text-sm" style={{ color: "var(--nv-text-secondary)" }}>
          Prefer a different approach? We&apos;re flexible.
        </p>
      </div>

      <div className="space-y-6">
        {/* Book a Call */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--nv-gold-bg-light)", color: "var(--nv-gold)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium font-display" style={{ color: "var(--nv-text-heading)" }}>Book a Call</h4>
            <a
              href={SITE_CONFIG.bookingUrl}
              className="mt-1 text-sm transition-colors"
              style={{ color: "var(--nv-gold)" }}
            >
              Schedule a consultation &rarr;
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--nv-gold-bg-light)", color: "var(--nv-gold)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium font-display" style={{ color: "var(--nv-text-heading)" }}>Email Us</h4>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="mt-1 text-sm transition-colors"
              style={{ color: "var(--nv-text-secondary)" }}
            >
              {SITE_CONFIG.email}
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--nv-gold-bg-light)", color: "var(--nv-gold)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium font-display" style={{ color: "var(--nv-text-heading)" }}>Location</h4>
            <p className="mt-1 text-sm" style={{ color: "var(--nv-text-secondary)" }}>{SITE_CONFIG.location}</p>
          </div>
        </div>

        {/* Social */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--nv-gold-bg-light)", color: "var(--nv-gold)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium font-display" style={{ color: "var(--nv-text-heading)" }}>Social</h4>
            <div className="mt-2 flex gap-3">
              <a href={SITE_CONFIG.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: "var(--nv-text-secondary)" }}>
                LinkedIn
              </a>
              <a href={SITE_CONFIG.social.twitter} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: "var(--nv-text-secondary)" }}>
                X / Twitter
              </a>
              <a href={SITE_CONFIG.social.github} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: "var(--nv-text-secondary)" }}>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--nv-gold-bg-subtle)",
          border: "1px solid var(--nv-gold-border-subtle)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--nv-text-secondary)" }}>
          We typically respond within <span className="font-medium" style={{ color: "var(--nv-text-heading)" }}>24 hours</span>.
        </p>
      </div>
    </div>
  );
}
