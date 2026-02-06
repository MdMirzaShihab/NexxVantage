import Link from "next/link";

type ButtonVariant = "primary" | "ghost" | "outline";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-black font-semibold hover:bg-brand-primary/90 shadow-glow hover:shadow-glow-lg",
  ghost:
    "bg-transparent text-white border border-white/20 hover:border-brand-primary/50 hover:text-brand-primary",
  outline:
    "bg-transparent text-brand-primary border border-brand-primary/50 hover:bg-brand-primary/10 hover:border-brand-primary",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-secondary disabled:opacity-50 disabled:pointer-events-none";

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
