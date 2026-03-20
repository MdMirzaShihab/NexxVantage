interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  overline?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  overline,
  className = "",
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${align === "center" ? "text-center" : ""} ${className}`}>
      {overline && (
        <p className={`nv-overline mb-4 ${align === "center" ? "mx-auto" : ""}`}>
          {overline}
        </p>
      )}
      <h2
        className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display"
        style={{ color: "var(--nv-text-heading)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="nv-lead mt-4 max-w-2xl mx-auto"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
