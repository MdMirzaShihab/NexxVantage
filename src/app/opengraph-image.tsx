import { ImageResponse } from "next/og";

export const alt = "NexxVantage — Premium by Design. Transparent by Default.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F1E35",
          fontFamily: "sans-serif",
        }}
      >
        {/* Nexus mark — simplified X with gold center */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="40" y1="40" x2="40" y2="160" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
          <line x1="160" y1="40" x2="160" y2="160" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
          <line x1="40" y1="40" x2="160" y2="160" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
          <line x1="160" y1="40" x2="40" y2="160" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
          <circle cx="40" cy="40" r="17" fill="#FFFFFF" />
          <circle cx="160" cy="40" r="17" fill="#FFFFFF" />
          <circle cx="40" cy="160" r="17" fill="#FFFFFF" />
          <circle cx="160" cy="160" r="17" fill="#FFFFFF" />
          <circle cx="100" cy="100" r="44" stroke="#C9A84C" strokeWidth="3" opacity="0.45" />
          <circle cx="100" cy="100" r="30" fill="#C9A84C" />
        </svg>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 64,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#C9A84C", fontWeight: 700 }}>Nexx</span>
          <span style={{ color: "#FFFFFF", fontWeight: 400 }}>Vantage</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 24,
            color: "#8B99B1",
            letterSpacing: "0.05em",
          }}
        >
          Premium by Design. Transparent by Default.
        </div>

        {/* Gold rule */}
        <div
          style={{
            width: 120,
            height: 2,
            background: "#C9A84C",
            marginTop: 28,
            borderRadius: 1,
          }}
        />

        {/* Descriptor */}
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 18,
            color: "#516689",
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Enterprise-grade software, ERP platforms & AI solutions
        </div>
      </div>
    ),
    { ...size }
  );
}
