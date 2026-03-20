export default function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Floating CSS shapes — NV gold/midnight palette */}
      <div
        className="absolute top-1/4 right-1/4 h-32 w-32 rounded-full blur-2xl animate-float"
        style={{ background: "var(--nv-gold-glow-subtle)" }}
      />
      <div
        className="absolute top-1/3 left-[20%] h-24 w-24 rounded-2xl blur-xl animate-float-slow rotate-45"
        style={{ background: "var(--nv-gold-bg-subtle)" }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 h-20 w-20 rounded-full blur-lg animate-float-slower"
        style={{ background: "var(--nv-midnight-glow)" }}
      />
      <div
        className="absolute top-2/3 left-1/3 h-16 w-16 rounded-lg blur-xl animate-float rotate-12"
        style={{ background: "var(--nv-gold-bg-subtle)" }}
      />
      <div
        className="absolute top-1/2 right-[20%] h-28 w-28 rounded-full blur-2xl animate-float-slow"
        style={{ background: "var(--nv-midnight-glow-deep)" }}
      />
    </div>
  );
}
