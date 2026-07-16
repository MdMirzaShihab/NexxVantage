import Link from "next/link";

function NexusMark() {
  return (
    <svg
      className="h-7 w-7 md:h-9 md:w-9 shrink-0"
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Structural lines — 2 verticals + 2 diagonals forming X */}
      <g stroke="var(--nv-text-heading)" strokeWidth="3.3" strokeLinecap="round">
        <line x1="30" y1="30" x2="30" y2="82" />
        <line x1="82" y1="30" x2="82" y2="82" />
        <line x1="30" y1="30" x2="82" y2="82" />
        <line x1="82" y1="30" x2="30" y2="82" />
      </g>
      {/* 4 corner nodes */}
      <g fill="var(--nv-text-heading)">
        <circle cx="30" cy="30" r="7.5" />
        <circle cx="82" cy="30" r="7.5" />
        <circle cx="30" cy="82" r="7.5" />
        <circle cx="82" cy="82" r="7.5" />
      </g>
      {/* Outer orbital ring — always gold */}
      <circle cx="56" cy="56" r="19" stroke="var(--nv-gold)" strokeWidth="1.4" opacity="0.45" />
      {/* Central node — always gold */}
      <circle cx="56" cy="56" r="13" fill="var(--nv-gold)" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 md:gap-2.5 font-display">
      <NexusMark />
      <span className="text-base md:text-xl tracking-tight leading-none">
        <span className="font-bold" style={{ color: "var(--nv-gold)" }}>
          Nexx
        </span>
        <span className="font-normal" style={{ color: "var(--nv-text-heading)" }}>
          Vantage
        </span>
      </span>
    </Link>
  );
}
