import type { Metadata } from "next";
import PageHeroBanner from "@/components/sections/PageHeroBanner";
import ContactForm from "@/components/sections/ContactForm";
import ContactInfo from "@/components/sections/ContactInfo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with NexxVantage. Tell us about your project or book a consultation.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeroBanner
        title="Let's Build Together"
        subtitle="Tell us about your project or book a call — we'd love to hear from you."
      />

      <section className="nv-section-alt py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-16 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
