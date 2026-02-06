interface PageHeroBannerProps {
  title: string;
  subtitle?: string;
}

export default function PageHeroBanner({ title, subtitle }: PageHeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-brand-secondary pt-32 pb-20 sm:pt-40 sm:pb-24">
      {/* Background glow */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-brand-primary/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <div className="mx-auto h-1 w-12 rounded-full bg-brand-primary mb-6" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-brand-gray max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
