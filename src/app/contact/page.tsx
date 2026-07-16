import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ContactForm from "@/components/sections/ContactForm";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with NexxVantage. Tell us about your project or book a consultation.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <AnimatedSection>
        <p className="nv-overline mb-3">{CONTACT.overline}</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{CONTACT.headline}</h1>
        <p className="nv-lead mt-4 max-w-2xl">{CONTACT.sub}</p>
      </AnimatedSection>

      <div className="mt-14 grid gap-12 md:grid-cols-5">
        <div className="md:col-span-3">
          <ContactForm />
        </div>
        <aside className="md:col-span-2">
          <h2 className="font-display text-lg font-semibold">{CONTACT.stepsHeading}</h2>
          <ol className="mt-6 space-y-6">
            {CONTACT.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="nv-badge nv-badge-primary h-7 w-7 flex-none items-center justify-center rounded-full font-display">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold text-heading">{s.title}</h3>
                  <p className="mt-1 text-sm text-secondary">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </main>
  );
}
