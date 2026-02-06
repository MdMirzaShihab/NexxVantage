import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-0 text-2xl font-bold tracking-tight">
      <span className="text-brand-primary">Nexx</span>
      <span className="text-white">Vantage</span>
    </Link>
  );
}
