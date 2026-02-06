export default function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Floating CSS shapes for mobile */}
      <div className="absolute top-1/4 right-1/4 h-32 w-32 rounded-full bg-brand-primary/10 blur-2xl animate-float" />
      <div className="absolute top-1/3 left-1/5 h-24 w-24 rounded-2xl bg-brand-lime/10 blur-xl animate-float-slow rotate-45" />
      <div className="absolute bottom-1/3 right-1/3 h-20 w-20 rounded-full bg-brand-primary/5 blur-lg animate-float-slower" />
      <div className="absolute top-2/3 left-1/3 h-16 w-16 rounded-lg bg-brand-lime/5 blur-xl animate-float rotate-12" />
      <div className="absolute top-1/2 right-1/5 h-28 w-28 rounded-full bg-brand-primary-dark/30 blur-2xl animate-float-slow" />
    </div>
  );
}
