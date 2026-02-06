"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/FormFields";
import { SERVICE_OPTIONS, BUDGET_OPTIONS } from "@/lib/constants";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl glass p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
          <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold">Message Sent!</h3>
        <p className="mt-2 text-brand-gray">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-brand-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Name" id="name" name="name" placeholder="Your name" required />
        <Input label="Email" id="email" name="email" type="email" placeholder="you@company.com" required />
      </div>

      <Input label="Company" id="company" name="company" placeholder="Your company (optional)" />

      <div className="grid gap-6 sm:grid-cols-2">
        <Select label="Service" id="service" name="service" options={SERVICE_OPTIONS} />
        <Select label="Budget Range" id="budget" name="budget" options={BUDGET_OPTIONS} />
      </div>

      <Textarea
        label="Project Brief"
        id="message"
        name="message"
        placeholder="Tell us about your project..."
        required
      />

      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Start Your Project"}
      </Button>
    </form>
  );
}
