export const SITE_CONFIG = {
  name: "NexxVantage",
  tagline: "Premium by Design. Transparent by Default.",
  description:
    "NexxVantage is a design studio and software engineering house crafting premium digital products — bespoke websites for high-end brands and enterprise-grade custom software, delivered phase by phase around your business goals.",
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
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Method", href: "/method" },
  { label: "Contact", href: "/contact" },
] as const;

export const HOME = {
  hero: {
    overline: "Design Studio × Software Engineering — Dhaka · Worldwide",
    headlinePre: "Create your own",
    headlineGold: "Dimensions.",
    sub: "NexxVantage is a design studio and engineering house crafting premium digital products — designed like couture, engineered like a fine movement.",
    ctaPrimary: { label: "Book a consultation", href: "/contact" },
    ctaGhost: { label: "See the craft", href: "/work" },
  },
  manifesto: {
    muted: "Anyone can build what you ask for.",
    main: "We build what your business needs —",
    gold: "phase by phase, in the order that pays.",
  },
  work: {
    overline: "Selected Work",
    heading: "A short walk through the gallery",
    link: { label: "View all work", href: "/work" },
    clientLabel: "Client",
    readCase: "Read the case",
  },
  method: {
    overline: "The NexxVantage Method",
    heading: "We don't sell software. We assemble outcomes.",
    link: { label: "Read the full method", href: "/method" },
  },
  why: {
    overline: "Why teams choose us",
    heading: "Built senior. Priced boutique. Run transparent.",
  },
  cta: {
    overline: "Begin",
    heading: "Every engagement starts with a conversation, not a quote.",
    sub: "A consultation session to map your goal, your problems, and the order in which to solve them. Then we build exactly that.",
    button: { label: "Book a consultation", href: "/contact" },
  },
} as const;

export const PILLARS = [
  {
    id: "studio",
    overline: "01 · The Studio",
    heading: "Design that outdresses your competition",
    body: "Bespoke websites for high-end brands — tailored to your identity, engineered to convert. No templates. Nothing off a shelf.",
    link: { label: "Explore the Studio", href: "/services#studio" },
    intro:
      "The Studio designs for brands that cannot afford to look ordinary. We start from your identity — voice, materials, audience — and craft an interface that could belong to no one else.",
    services: [
      {
        id: "web-design",
        title: "Brand-first web design",
        description:
          "Flagship websites cut to your brand's cloth. Every layout, interaction, and line of copy is tailored — designed to be envied and engineered to convert.",
        keyPoints: [
          "Tailored to your brand identity — never a theme",
          "Conversion-focused structure and copy",
          "Performance and SEO built in from the first sketch",
        ],
      },
      {
        id: "ui-ux",
        title: "UI/UX & design systems",
        description:
          "Premium interfaces grounded in user research, WCAG accessibility, and scalable design systems — components that stay coherent as your product grows.",
        keyPoints: [
          "WCAG-compliant design systems",
          "User research & prototype testing",
          "Design tokens your engineers will thank you for",
        ],
      },
    ],
  },
  {
    id: "engineering",
    overline: "02 · The Engineering House",
    heading: "Software built from your business plan backward",
    body: "Enterprise-grade custom products — ERP, AI & MCP, cloud — assembled around your goals, your timeline, your revenue targets.",
    link: { label: "Explore the Engineering House", href: "/services#engineering" },
    intro:
      "The Engineering House builds custom software the way your business actually needs it: consultation first, MVP where it earns, phases planned against your revenue targets. Scoped in consultation, delivered in phases.",
    services: [
      {
        id: "custom-software",
        title: "Custom software development",
        description:
          "Full-stack web applications, platforms, and enterprise systems architected from scratch with Next.js, React, and Node.js — disciplined Agile delivery with predictable sprints.",
        keyPoints: [
          "Full-stack Next.js & React architecture",
          "From MVP to enterprise scale",
          "Scoped in consultation, delivered in phases",
        ],
      },
      {
        id: "erp-enterprise",
        title: "ERP & enterprise systems",
        description:
          "Business logic designed by finance experts, built by senior engineers. Billing, case management, financial reporting, HR, and document workflows — with numbers you can trust.",
        keyPoints: [
          "Accounting-verified financial logic",
          "Law firm & professional services focus",
          "Cross-department workflow automation",
        ],
      },
      {
        id: "ai-mcp",
        title: "AI, MCP servers & intelligent automation",
        description:
          "Custom MCP (Model Context Protocol) servers that connect AI models to your business data, plus practical AI integration — document analysis, smart reporting, workflow automation.",
        keyPoints: [
          "Custom MCP server development & deployment",
          "LLM integration (OpenAI, Claude, custom models)",
          "Workflow automation with n8n & custom pipelines",
        ],
      },
      {
        id: "cloud",
        title: "Cloud & infrastructure",
        description:
          "Infrastructure-as-code on AWS, GCP, or Azure with Terraform, Docker, and Kubernetes. CI/CD, monitoring, and cost optimisation as standard.",
        keyPoints: [
          "AWS / GCP / Azure certified",
          "CI/CD pipelines & DevOps automation",
          "Cost optimisation & monitoring",
        ],
      },
    ],
  },
] as const;

export const AGENCY_OFFER = {
  overline: "For agencies",
  title: "White-label development partnership",
  description:
    "Your brand, our engineering. For agencies and consultancies that need a premium technical partner without the overhead — we operate invisibly under your brand with dedicated delivery, clear communication, no juniors, no outsourcing.",
  keyPoints: [
    "NDA-backed, fully white-labelled",
    "Senior engineers only — no outsourcing",
    "Dedicated project manager per engagement",
  ],
} as const;

export const WHY_POINTS = [
  {
    title: "Senior hands only",
    description:
      "Every project led and built by senior engineers and designers. No handoffs to juniors.",
  },
  {
    title: "Open project board",
    description:
      "Weekly reports and live access to the board. Trust built on visibility, not promises.",
  },
  {
    title: "Hybrid expertise",
    description:
      "Engineering, finance, AI and design under one roof — we understand the business, not just the build.",
  },
  {
    title: "Agile that follows revenue",
    description:
      "Sprints planned against your business calendar, so delivery dates mean something.",
  },
] as const;

export const BUDGET_OPTIONS = [
  { value: "", label: "Select a range (optional)" },
  { value: "5k-15k", label: "$5k – $15k" },
  { value: "15k-50k", label: "$15k – $50k" },
  { value: "50k+", label: "$50k+" },
  { value: "discuss", label: "Let's discuss" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "", label: "Select a timeline (optional)" },
  { value: "asap", label: "As soon as possible" },
  { value: "1-3m", label: "1–3 months" },
  { value: "3-6m", label: "3–6 months" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const SERVICE_OPTIONS = [
  { value: "", label: "Select a service" },
  { value: "web-design", label: "Brand-first web design" },
  { value: "ui-ux", label: "UI/UX & design systems" },
  { value: "custom-software", label: "Custom software development" },
  { value: "erp-enterprise", label: "ERP & enterprise systems" },
  { value: "ai-mcp", label: "AI, MCP servers & automation" },
  { value: "cloud", label: "Cloud & infrastructure" },
  { value: "white-label", label: "White-label partnership" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const CONTACT = {
  headline: "Begin with a conversation.",
  sub: "Tell us what you're building and what problem it solves. A senior partner will take it from there.",
  steps: [
    {
      title: "A senior partner replies within 24 hours",
      description: "Not a sales rep. The person who answers is the person who would lead your project.",
    },
    {
      title: "A consultation call to map your goal",
      description: "We define the business goal, rank the problems, and sketch the order in which to solve them.",
    },
    {
      title: "A written recommendation — yours to keep",
      description: "Whether or not we build it. If our plan is useful to you elsewhere, take it with our compliments.",
    },
  ],
} as const;
