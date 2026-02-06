interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div className={hover ? "card-tilt" : ""}>
      <div
        className={`rounded-2xl glass p-6 transition-all duration-300 ${
          hover ? "glass-hover hover:-translate-y-1" : ""
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
