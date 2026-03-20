interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  accent?: boolean;
  elevated?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
  accent = true,
  elevated = false,
}: CardProps) {
  const cardClasses = [
    "nv-card",
    accent ? "nv-card-accent" : "",
    elevated ? "nv-card-elevated" : "",
    !hover ? "hover:transform-none hover:shadow-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}
