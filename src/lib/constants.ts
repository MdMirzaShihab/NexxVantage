export const SITE_CONFIG = {
  name: "NexxVantage",
  tagline: "Premium by Design. Transparent by Default.",
  description:
    "We build Enterprise-grade software, ERP platforms, AI-powered products, and custom MCP servers. Engineered with precision, delivered with transparency.",
  url: "https://nexxvantage.com",
  email: "hello@nexxvantage.com",
  location: "Dhaka, Bangladesh",
  bookingUrl: "/contact",
  social: {
    linkedin: "https://linkedin.com/company/nexxvantage",
    twitter: "https://x.com/nexxvantage",
    github: "https://github.com/nexxvantage",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICES = [
  {
    id: "custom-software",
    icon: "code" as const,
    title: "Custom Software Development",
    shortDescription:
      "Bespoke web apps, platforms, and MCP integrations — architected from scratch, not assembled from templates.",
    fullDescription:
      "Every NexxVantage project is designed and built from the ground up. We deliver full-stack web applications, mobile platforms, enterprise systems, and MCP server integrations using Next.js, React, and Node.js — with disciplined Agile delivery, so you get predictable sprints and measurable progress from day one.",
    keyPoints: [
      "Full-stack Next.js & React architecture",
      "MCP server integration & custom tooling",
      "From MVP to enterprise scale",
    ],
  },
  {
    id: "erp-enterprise",
    icon: "building" as const,
    title: "ERP & Enterprise Systems",
    shortDescription:
      "Business logic designed by finance experts. Built by senior engineers.",
    fullDescription:
      "Every ERP system we deliver starts with rigorous business logic — designed by professionals who understand accounting and operations inside out. The result: platforms that handle real operational complexity — billing, case management, financial reporting, HR, and document workflows — with numbers you can trust.",
    keyPoints: [
      "Accounting-verified financial logic",
      "Law firm & professional services focus",
      "Cross-department workflow automation",
    ],
  },
  {
    id: "ai-ml",
    icon: "brain" as const,
    title: "AI, MCP Servers & Intelligent Automation",
    shortDescription:
      "Custom MCP server development, practical AI integrations, and automation that delivers measurable efficiency.",
    fullDescription:
      "We build custom MCP (Model Context Protocol) servers that connect AI models to your business data and tools — giving LLMs secure, structured access to databases, APIs, and internal systems. Beyond MCP, we deliver end-to-end AI integration: document analysis, smart reporting, workflow automation, and AI-assisted drafting — all production-grade and built to deliver ROI from day one.",
    keyPoints: [
      "Custom MCP server development & deployment",
      "LLM integration (OpenAI, Claude, custom models)",
      "Workflow automation with n8n & custom pipelines",
    ],
  },
  {
    id: "white-label",
    icon: "handshake" as const,
    title: "White-Label Development Partnership",
    shortDescription:
      "Your brand, our engineering. Senior-level execution under NDA.",
    fullDescription:
      "For agencies and consultancies that need a premium technical partner without the overhead. We operate invisibly under your brand — dedicated delivery, clear communication, no juniors, no outsourcing. Your clients get the quality they expect. You keep the relationship.",
    keyPoints: [
      "NDA-backed, fully white-labelled",
      "Senior engineers only — no outsourcing",
      "Dedicated project manager per engagement",
    ],
  },
  {
    id: "cloud",
    icon: "cloud" as const,
    title: "Cloud & Infrastructure",
    shortDescription:
      "Infrastructure-as-code on AWS, GCP, or Azure — built to scale and optimised for cost.",
    fullDescription:
      "We architect cloud-native infrastructure using Terraform, Docker, and Kubernetes. Every deployment includes CI/CD pipelines, automated testing, monitoring, and cost optimisation — so your platform performs reliably as you grow without runaway cloud bills.",
    keyPoints: [
      "AWS / GCP / Azure certified",
      "CI/CD pipelines & DevOps automation",
      "Cost optimisation & monitoring",
    ],
  },
  {
    id: "ui-ux",
    icon: "palette" as const,
    title: "UI/UX & Design Systems",
    shortDescription:
      "Premium interfaces that convert — grounded in accessibility and user research.",
    fullDescription:
      "Great software deserves great design. We craft conversion-optimised interfaces backed by user research, WCAG accessibility compliance, and scalable design systems. Every component is built to work across devices and tested with real users before launch.",
    keyPoints: [
      "WCAG-compliant design systems",
      "Conversion-optimised interfaces",
      "User research & prototype testing",
    ],
  },
] as const;

export type ServiceIcon = (typeof SERVICES)[number]["icon"];

export const VALUE_PROPS = [
  {
    title: "Radical Transparency",
    description:
      "No hidden costs. No scope surprises. Weekly progress reports and open access to your project board — because trust is built on visibility, not promises.",
  },
  {
    title: "Premium Without the Agency Tax",
    description:
      "Boutique-quality output at a fraction of large agency overhead. Every project is led and delivered by senior professionals — never handed off to juniors.",
  },
  {
    title: "Rare Hybrid Expertise",
    description:
      "Deep expertise across engineering, finance, AI, and MCP server development. We understand your business and your systems — so every platform we build is technically excellent and future-ready.",
  },
  {
    title: "Disciplined Delivery",
    description:
      "Structured project management means predictable sprints, documented processes, and on-time delivery. What we promise is exactly what you receive.",
  },
] as const;

export const BUDGET_OPTIONS = [
  { value: "", label: "Select a range (optional)" },
  { value: "5k-15k", label: "$5k – $15k" },
  { value: "15k-50k", label: "$15k – $50k" },
  { value: "50k+", label: "$50k+" },
  { value: "discuss", label: "Let's discuss" },
] as const;

export const SERVICE_OPTIONS = [
  { value: "", label: "Select a service" },
  { value: "custom-software", label: "Custom Software Development" },
  { value: "erp-enterprise", label: "ERP & Enterprise Systems" },
  { value: "ai-ml", label: "AI, MCP Servers & Automation" },
  { value: "white-label", label: "White-Label Partnership" },
  { value: "cloud", label: "Cloud & Infrastructure" },
  { value: "ui-ux", label: "UI/UX & Design Systems" },
  { value: "not-sure", label: "Not sure yet" },
] as const;
