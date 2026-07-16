type MarkStaticProps = {
  variant?: "assembled" | "exploded";
  className?: string;
  highlight?: "ring" | "struts" | "nodes" | "core" | null;
};

/** Server-renderable NexusMark. `exploded` separates the four layers vertically
 *  (used for reduced-motion and the /method phase diagram). `highlight` dims
 *  all layers except one (used by the /method sticky diagram). */
export default function MarkStatic({ variant = "assembled", className, highlight = null }: MarkStaticProps) {
  const exploded = variant === "exploded";
  const dy = (i: number) => (exploded ? i * 64 : 0);
  const op = (layer: string) => (highlight && highlight !== layer ? 0.25 : 1);
  const height = exploded ? 112 + 3 * 64 : 112;
  return (
    <svg
      viewBox={`0 0 112 ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g id="mark-ring" transform={`translate(0 ${dy(0)})`} opacity={op("ring")}>
        <circle cx="56" cy="56" r="42" stroke="#C9A84C" strokeWidth="1.4" opacity="0.85" />
        <circle cx="56" cy="56" r="42" stroke="#E0C76F" strokeWidth="0.5" opacity="0.5" />
      </g>
      <g id="mark-struts" transform={`translate(0 ${dy(1)})`} opacity={op("struts")}>
        <g stroke="#5B729B" strokeWidth="3.5" strokeLinecap="round">
          <line x1="30" y1="30" x2="82" y2="82" />
          <line x1="82" y1="30" x2="30" y2="82" />
          <line x1="30" y1="30" x2="30" y2="82" />
          <line x1="82" y1="30" x2="82" y2="82" />
        </g>
        <g stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" opacity="0.8">
          <line x1="30" y1="30" x2="82" y2="82" />
          <line x1="82" y1="30" x2="30" y2="82" />
        </g>
      </g>
      <g id="mark-nodes" transform={`translate(0 ${dy(2)})`} opacity={op("nodes")}>
        <g fill="#C9A84C">
          <circle cx="30" cy="30" r="6" />
          <circle cx="82" cy="30" r="6" />
          <circle cx="30" cy="82" r="6" />
          <circle cx="82" cy="82" r="6" />
        </g>
        <g fill="#E0C76F" opacity="0.8">
          <circle cx="28.5" cy="28.5" r="2" />
          <circle cx="80.5" cy="28.5" r="2" />
          <circle cx="28.5" cy="80.5" r="2" />
          <circle cx="80.5" cy="80.5" r="2" />
        </g>
      </g>
      <g id="mark-core" transform={`translate(0 ${dy(3)})`} opacity={op("core")}>
        <circle cx="56" cy="56" r="13" fill="#C9A84C" />
        <circle cx="56" cy="56" r="7" fill="#0F1E35" />
        <circle cx="53" cy="53" r="2.4" fill="#E0C76F" opacity="0.9" />
      </g>
    </svg>
  );
}
