interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  className = "",
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${align === "center" ? "text-center" : ""} ${className}`}>
      <div
        className={`mb-4 h-1 w-12 rounded-full bg-brand-primary ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-brand-gray max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
