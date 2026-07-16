# NexxVantage Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the NexxVantage marketing site as a luxury "hybrid neumorphic 3D" experience — 7-section immersive homepage (WebGL mark + pinned work gallery), plus Work, Services, Method, and Contact pages — per the approved spec at `docs/superpowers/specs/2026-07-16-nexxvantage-redesign-design.md`.

**Architecture:** All content is server-rendered semantic HTML; 3D/motion is a progressive enhancement layered on top. One procedural react-three-fiber "mark" (the NexusMark logo as a machined mechanism) drives the hero, the Method exploded-view, and the CTA reassembly. The Selected Work gallery is a pinned CSS-3D dolly (no WebGL). Copy and data live in typed data files so pages are templates.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind 3, `motion` (Framer Motion v12), `@react-three/fiber` v8 + `three` (already installed). Custom CSS design system in `src/styles/nv-theme.css`.

## Global Constraints

- Brand colors are immutable: midnight `#0F1E35`, gold `#C9A84C` (use existing `--nv-*` tokens; never hardcode new hex for UI besides 3D material colors specified below)
- Fonts fixed: Space Grotesk (display), Inter (body), JetBrains Mono (mono)
- Hero headline is locked verbatim: `Create your own Dimensions.` (gold on "Dimensions.")
- Tagline retained for footer/meta: `Premium by Design. Transparent by Default.`
- Copy voice: no exclamation marks, sentence case UI, active verbs, `-ise` British spelling site-wide
- All page copy must be server-rendered (view-source visible); WebGL/motion never gates content
- `prefers-reduced-motion` must be honoured by every animated element (Framer's `useReducedMotion`)
- Three.js may only ship on the homepage bundle — zero three.js on `/work`, `/services`, `/method`, `/contact`
- The three "3D moments" (Hero, Method, CTA) stay midnight in BOTH themes (`.nv-velvet` class); calm sections follow the light/dark toggle
- Performance: Lighthouse mobile Perf ≥ 90, SEO ≥ 95, A11y ≥ 95; CLS ≈ 0; LCP is hero text/SVG, never canvas
- Placeholder case studies allowed, each field tagged `// PLACEHOLDER — replace with real client data before launch`
- Motion discipline: stagger ≤ 80ms, one gold glint per viewport, text never parallaxes, calm sections fade/rise only

## Verification Model (applies to every task)

No JS test framework exists in this repo and we are not adding one (marketing site — build/lint/SSR checks are the meaningful verifications). Each task's cycle is:

1. `npm run lint` → expect `✔ No ESLint warnings or errors`
2. `npm run build` → expect `✓ Compiled successfully` and static generation of all routes without errors
3. Where stated, SSR content assertions: start `npm run dev` (background, port 3000) once at the start of execution, then `curl -s http://localhost:3000/<route> | grep -c "<text>"` → expect `1` (or stated count). These prove the SEO guarantee.
4. Visual checks where stated (browser or Playwright MCP if available): described with exact expectations.

Commit after every task with the message given.

## File Structure

```
src/lib/constants.ts                     — MODIFY: site config, nav, pillars, why-points, contact copy, budget/timeline options
src/lib/work.ts                          — CREATE: CaseStudy type + CASE_STUDIES data (placeholders)
src/lib/method.ts                        — CREATE: METHOD_PHASES, METHOD_PAGE sections, FAQ data
src/lib/useCan3D.ts                      — CREATE: WebGL/low-end/reduced-motion capability hook
src/styles/nv-theme.css                  — MODIFY: display type scale, velvet class, sheen, focus-visible
src/components/mark/MarkStatic.tsx       — CREATE: SSR inline-SVG mark (assembled + exploded variants)
src/components/mark/MarkScene.tsx        — CREATE: r3f scene — procedural mark, materials, lights, t-driven explode
src/components/mark/MarkCanvas.tsx       — CREATE: client wrapper — dynamic import, IntersectionObserver frameloop gate, crossfade
src/components/sections/HeroMovement.tsx — CREATE: hero (replaces HeroSection)
src/components/sections/Manifesto.tsx    — CREATE: scroll-brightening statement
src/components/sections/TwoCrafts.tsx    — CREATE: pillar panels
src/components/sections/WorkGallery.tsx  — CREATE: pinned dolly + mobile swipe deck
src/components/sections/MethodCTA.tsx    — CREATE: exploded-view + reassembly CTA (shared sticky canvas)
src/components/sections/WhyUs.tsx        — CREATE: recessed proof plaques
src/components/ui/SheenPanel.tsx         — CREATE: cursor-sheen wrapper
src/components/seo/JsonLd.tsx            — CREATE: JSON-LD script component
src/app/page.tsx                         — MODIFY: new 7-section order
src/app/work/page.tsx                    — CREATE: work index
src/app/work/[slug]/page.tsx             — CREATE: case-study template
src/app/services/page.tsx                — MODIFY: two-pillar restructure + agencies block
src/app/method/page.tsx                  — CREATE: method page
src/app/contact/page.tsx                 — MODIFY: consultation reframe
src/components/sections/ContactForm.tsx  — MODIFY: timeline field
src/app/api/contact/route.ts             — MODIFY: accept timeline
src/components/layout/Navbar.tsx         — MODIFY: new links + CTA button
src/components/layout/Footer.tsx         — MODIFY: new links/anchors
src/app/layout.tsx                       — MODIFY: Organization JSON-LD, skip link
src/app/sitemap.ts                       — MODIFY: new routes
DELETE: src/components/lottie/*, src/components/three/*, src/components/sections/HeroSection.tsx,
        src/components/sections/HeroFallback.tsx, src/components/sections/ServicesOverview.tsx,
        src/components/sections/WhyNexxVantage.tsx, src/components/sections/CTABanner.tsx,
        public/lottie/, dep @lottiefiles/dotlottie-react
```

Read the spec (`docs/superpowers/specs/2026-07-16-nexxvantage-redesign-design.md`) before starting. Where this plan and the spec conflict, the spec wins.

---

### Task 1: Content & data layer

**Files:**
- Modify: `src/lib/constants.ts`
- Create: `src/lib/work.ts`
- Create: `src/lib/method.ts`

**Interfaces:**
- Consumes: nothing (leaf task)
- Produces: `SITE_CONFIG`, `NAV_LINKS`, `HOME` (hero/manifesto/crafts/why/cta copy), `PILLARS`, `AGENCY_OFFER`, `WHY_POINTS`, `BUDGET_OPTIONS`, `TIMELINE_OPTIONS`, `CONTACT_STEPS` from `constants.ts`; `CaseStudy` type + `CASE_STUDIES` from `work.ts`; `METHOD_PHASES`, `METHOD_FAQ`, `METHOD_SECTIONS` from `method.ts`. All later tasks import copy from here — never inline copy strings in components.

- [ ] **Step 1: Rewrite `src/lib/constants.ts`**

Keep `SITE_CONFIG` (update `description` and add `taglineShort`), keep `BUDGET_OPTIONS` and `SERVICE_OPTIONS` as-is. Replace `NAV_LINKS`, remove `SERVICES` and `VALUE_PROPS` exports (moved/reshaped), add the new exports:

```ts
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
```

Note: `ServiceIcon` type and the old `SERVICES`/`VALUE_PROPS` exports are deleted; any imports of them will be removed in later tasks (build will fail until Tasks 10–13 complete if you build mid-task — this task only requires lint on the file itself; run the full build at the end of Task 1 only if old imports are still satisfied — they are not, so **defer the build check to Step 4's grep** and rely on `npx tsc --noEmit` scoped expectations described there).

- [ ] **Step 2: Create `src/lib/work.ts`**

```ts
export type CaseStudy = {
  slug: string;
  client: string;       // anonymised where NDA
  sector: string;
  title: string;
  summary: string;
  problemQuote: string; // "the problem, in the client's words"
  firstBuild: string;   // what we built first, and why
  outcomes: { value: string; label: string }[];
  timeline: string;
  engagement: string;
  cover: { src: string; alt: string };
};

// PLACEHOLDER — replace with real client data before launch (all three entries).
// Outcome numbers are illustrative. Swapping real data must require editing only this file.
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "hospitality-booking-platform",
    client: "A boutique hotel group", // PLACEHOLDER — replace with real client data before launch
    sector: "Hospitality",
    title: "A booking platform that feels like a lobby",
    summary:
      "Direct-booking platform designed to carry the brand's in-person warmth online — and stop paying a third of revenue to OTA commissions.",
    problemQuote:
      "Guests loved us in person, but our website felt like a budget airline. Most bookings went through agencies that took a third of the revenue.", // PLACEHOLDER
    firstBuild:
      "Phase one was the booking flow alone — not the marketing site. The consultation showed commission leakage was the bleeding wound, so the MVP put a beautiful, brand-true direct booking path live in six weeks. The full site followed in phase two.",
    outcomes: [
      { value: "+38%", label: "direct bookings in the first quarter" }, // PLACEHOLDER
      { value: "6 weeks", label: "from consultation to live MVP" }, // PLACEHOLDER
    ],
    timeline: "6 weeks to MVP, 4 months total", // PLACEHOLDER
    engagement: "The Studio + Engineering House",
    cover: { src: "/work/hospitality-cover.webp", alt: "Booking platform interface over a midnight background" },
  },
  {
    slug: "legal-practice-erp",
    client: "A Dhaka-based law firm", // PLACEHOLDER — replace with real client data before launch
    sector: "Legal",
    title: "Practice ERP with accounting-verified logic",
    summary:
      "Case management, billing, and financial reporting unified in one system — with business logic designed by accounting professionals.",
    problemQuote:
      "Month-end close took nine days and three spreadsheets. Nobody trusted the numbers until the senior partner re-checked them by hand.", // PLACEHOLDER
    firstBuild:
      "Phase one replaced the billing and time-capture spreadsheets — the direct revenue path — while case management stayed in the old tools. Only after the numbers earned trust did phases two and three absorb cases and documents.",
    outcomes: [
      { value: "9 days → 2", label: "month-end close" }, // PLACEHOLDER
      { value: "100%", label: "of invoices reconciled without manual re-checks" }, // PLACEHOLDER
    ],
    timeline: "8 weeks to MVP, 7 months total", // PLACEHOLDER
    engagement: "The Engineering House",
    cover: { src: "/work/legal-erp-cover.webp", alt: "ERP dashboard showing billing and case views" },
  },
  {
    slug: "retail-flagship-site",
    client: "A premium retail brand", // PLACEHOLDER — replace with real client data before launch
    sector: "Retail",
    title: "A flagship site cut to the brand's cloth",
    summary:
      "A brand-first flagship website where every scroll, hover, and headline was tailored to the label's identity.",
    problemQuote:
      "Our products are premium. Our website looked like everyone else's Shopify theme. Customers noticed.", // PLACEHOLDER
    firstBuild:
      "The consultation ranked brand perception above catalogue size, so phase one shipped the brand experience — home, story, and hero products — while the long-tail catalogue followed in phase two.",
    outcomes: [
      { value: "×2.4", label: "session duration" }, // PLACEHOLDER
      { value: "+61%", label: "returning visitors" }, // PLACEHOLDER
    ],
    timeline: "5 weeks to launch, 3 months total", // PLACEHOLDER
    engagement: "The Studio",
    cover: { src: "/work/retail-cover.webp", alt: "Flagship retail site hero with gold typography" },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
```

- [ ] **Step 3: Create `src/lib/method.ts`**

```ts
export const METHOD_PHASES = [
  {
    num: "01",
    name: "Consult",
    short: "Your goal, your problems, your plan — defined before a line is written.",
    deep: "Every engagement opens with a consultation session: we define the business goal, list the problems in the way, and understand how you plan to win. You leave with a written recommendation — a ranked problem map and a phase plan — whether or not we build it.",
    deliverable: "A written recommendation: ranked problems, phase plan, and an honest estimate.",
    layer: "ring",
  },
  {
    num: "02",
    name: "MVP",
    short: "The problems that matter most, solved first. Live, in production, earning.",
    deep: "We do not build everything you asked for in one shot. The MVP solves the highest-ranked problems only — the ones blocking revenue or operations — and ships to production where it starts earning its keep and teaching us what phase two should be.",
    deliverable: "A production system solving your most expensive problems, plus a measured baseline.",
    layer: "struts",
  },
  {
    num: "03",
    name: "Evolve",
    short: "Phases planned with your business team — features land when revenue says so.",
    deep: "After the MVP, we plan each phase with your business team against your revenue targets and calendar. A feature ships when the business is ready to use it — not when a backlog says so. Priorities will change; our process is built so change is cheap, not catastrophic.",
    deliverable: "A phase roadmap re-planned each cycle, with weekly reports and an open project board.",
    layer: "nodes",
  },
  {
    num: "04",
    name: "Scale",
    short: "Enterprise-grade hardening when enterprise arrives. Not a day sooner than useful.",
    deep: "When the numbers demand it, we harden: performance, security, infrastructure-as-code, monitoring, compliance. You pay for enterprise-grade when you are becoming an enterprise — not as an upfront tax on an unproven idea.",
    deliverable: "A hardened platform with CI/CD, monitoring, and documented operations.",
    layer: "core",
  },
] as const;

export const METHOD_PAGE = {
  hero: {
    overline: "The NexxVantage Method",
    heading: "We don't sell software. We assemble outcomes.",
    sub: "Most firms build what you ask for, in one shot, and hand you a sealed box. We build what your business needs, in the order it needs it — and show you every layer.",
  },
  consultation: {
    heading: "It starts with a consultation, not a quote",
    body: "Before we talk about technology, we map three things: the business goal you are chasing, the problems standing in the way, and how you plan to get there. From that map we draft the phase plan — which problems the MVP must solve, and what earns its place in each phase after. The session ends with a written recommendation that is yours to keep, whether or not we build it.",
  },
  change: {
    heading: "Change is cheap here",
    body: "Priorities will change — that is not a risk to our process, it is the reason our process exists. Because phases are planned against your business calendar and re-planned each cycle, changing direction costs a conversation, not a contract renegotiation. That is what agile means when it is practised rather than performed.",
  },
} as const;

export const METHOD_FAQ = [
  {
    q: "How long until the MVP is live?",
    a: "Typically 5–8 weeks from the consultation, depending on scope. The MVP is deliberately narrow: the highest-ranked problems only, live in production.",
  },
  {
    q: "How does pricing work per phase?",
    a: "Each phase is estimated and agreed before it starts, based on the phase plan from your consultation. You always know what the current phase costs and what the next is likely to — no open-ended retainers.",
  },
  {
    q: "What if we change direction mid-build?",
    a: "That is expected. Phases are re-planned with your business team each cycle, so direction changes are absorbed at the next phase boundary — a conversation, not a crisis.",
  },
  {
    q: "Who owns the code?",
    a: "You do. Full repository access from day one, and everything we build for you is yours — code, designs, documentation, infrastructure definitions.",
  },
  {
    q: "How do you report progress?",
    a: "Weekly written reports plus live access to the project board. You see what we see, always.",
  },
  {
    q: "Do you work with existing in-house teams?",
    a: "Yes. We slot in as the senior delivery partner — architecture, build, and mentoring — and hand over cleanly when your team is ready to own it.",
  },
] as const;
```

- [ ] **Step 4: Verify types compile in isolation**

Run: `npx tsc --noEmit --skipLibCheck src/lib/work.ts src/lib/method.ts 2>&1 | head -5`
Expected: no output related to these two files (isolated compile may surface unrelated project flags — acceptable; the definitive check comes when the full build passes in Task 10). Also verify the placeholder tags:
Run: `grep -c "PLACEHOLDER — replace with real client data" src/lib/work.ts`
Expected: `4` or more.

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants.ts src/lib/work.ts src/lib/method.ts
git commit -m "feat: content and data layer for redesign (pillars, case studies, method)"
```

Note: the full `npm run build` will FAIL from now until Task 10 removes the old components that import deleted exports (`SERVICES`, `VALUE_PROPS`). That is expected; intermediate tasks verify with `npx tsc --noEmit` on their own files and lint. If you prefer green builds throughout, execute Task 10's deletion steps for `ServicesOverview`/`WhyNexxVantage`/`CTABanner` imports at the point each replacement lands — the plan notes where.

### Task 2: Theme extensions

**Files:**
- Modify: `src/styles/nv-theme.css`

**Interfaces:**
- Consumes: existing `--nv-*` tokens
- Produces: CSS classes/tokens used by later tasks: `--nv-text-display`, `--nv-text-display-lg`, `.nv-velvet`, `.nv-sheen`, `:focus-visible` rule, `.nv-plaque`

- [ ] **Step 1: Append to the `:root` block (after the `--nv-text-6xl` line)**

```css
  --nv-text-display:    clamp(2.75rem, 6vw, 4.75rem);
  --nv-text-display-lg: clamp(3.25rem, 7.5vw, 5.5rem);
```

- [ ] **Step 2: Append new component styles at the end of the file**

```css
/* ── VELVET (3D moments stay midnight in both themes) ── */
/* Applied to Hero, Method, and CTA sections. Re-pins dark tokens so children
   using semantic tokens stay midnight even when <html data-theme="light">. */
.nv-velvet {
  --nv-bg-page: var(--nv-midnight-500);
  --nv-bg-surface: var(--nv-midnight-400);
  --nv-bg-surface-2: var(--nv-midnight-600);
  --nv-text-primary: #F0F2F5;
  --nv-text-heading: var(--nv-white);
  --nv-text-secondary: var(--nv-midnight-200);
  --nv-text-muted: var(--nv-midnight-300);
  --nv-text-accent: var(--nv-gold-400);
  --nv-border-default: rgba(255, 255, 255, 0.08);
  --nv-hero-heading: var(--nv-white);
  --nv-hero-muted: rgba(255, 255, 255, 0.6);
  --nv-hero-accent: var(--nv-gold-400);
  --nv-neu-shadow:
    6px 6px 14px rgba(3, 6, 9, 0.6),
    -6px -6px 14px rgba(26, 51, 82, 0.25);
  --nv-neu-inset:
    inset 3px 3px 8px rgba(3, 6, 9, 0.5),
    inset -3px -3px 8px rgba(26, 51, 82, 0.2);
  background-color: var(--nv-midnight-500);
  color: var(--nv-text-primary);
  color-scheme: dark;
}

/* ── SHEEN (cursor-following gold glow on panels — never on text) ── */
.nv-sheen { position: relative; overflow: hidden; }
.nv-sheen::before {
  content: '';
  position: absolute; inset: 0;
  opacity: 0;
  transition: opacity var(--nv-duration) var(--nv-ease);
  background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%),
              var(--nv-gold-bg-light), transparent 65%);
  pointer-events: none;
}
.nv-sheen:hover::before { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .nv-sheen::before { display: none; }
}

/* ── RECESSED PLAQUE (Why NexxVantage) ── */
.nv-plaque {
  background: var(--nv-bg-page);
  border-radius: var(--nv-radius-lg);
  padding: 1.5rem 1.75rem;
  box-shadow: var(--nv-neu-inset);
}

/* ── FOCUS VISIBILITY (global) ── */
:focus-visible {
  outline: 2px solid var(--nv-gold-400);
  outline-offset: 3px;
  border-radius: var(--nv-radius-sm);
}

/* ── SKIP LINK ── */
.nv-skip-link {
  position: absolute; left: -9999px; top: 0; z-index: 100;
  background: var(--nv-gold-500); color: var(--nv-midnight-500);
  font-family: var(--nv-font-display); font-weight: 600;
  padding: 0.6rem 1.2rem; border-radius: 0 0 var(--nv-radius-md) 0;
}
.nv-skip-link:focus { left: 0; }
```

- [ ] **Step 3: Verify**

Run: `npm run lint`
Expected: `✔ No ESLint warnings or errors`

- [ ] **Step 4: Commit**

```bash
git add src/styles/nv-theme.css
git commit -m "feat: theme extensions — velvet, sheen, plaque, display scale, focus ring"
```

### Task 3: MarkStatic — the SSR SVG mark

**Files:**
- Create: `src/components/mark/MarkStatic.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `MarkStatic({ variant?: "assembled" | "exploded", className?: string })` — server component, inline SVG. Used as the LCP hero visual, the reduced-motion Method diagram, and the `/method` sticky `PhaseDiagram`. Layer `<g>` ids: `mark-ring`, `mark-struts`, `mark-nodes`, `mark-core`.

- [ ] **Step 1: Create the component**

```tsx
type MarkStaticProps = {
  variant?: "assembled" | "exploded";
  className?: string;
  highlight?: "ring" | "struts" | "nodes" | "core" | null;
};

/** Server-renderable NexusMark. `exploded` separates the four layers vertically
 *  (used for reduced-motion and the /method phase diagram). `highlight` dims
 *  all layers except one (used by the /method sticky diagram). */
export default function MarkStatic({ variant = "assembled", className, highlight = null }: MarkStaticProps) {
  const exploded = variant === "exploded";
  const dy = (i: number) => (exploded ? i * 64 : 0);
  const op = (layer: string) => (highlight && highlight !== layer ? 0.25 : 1);
  const height = exploded ? 112 + 3 * 64 : 112;
  return (
    <svg
      viewBox={`0 0 112 ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g id="mark-ring" transform={`translate(0 ${dy(0)})`} opacity={op("ring")}>
        <circle cx="56" cy="56" r="42" stroke="#C9A84C" strokeWidth="1.4" opacity="0.85" />
        <circle cx="56" cy="56" r="42" stroke="#E0C76F" strokeWidth="0.5" opacity="0.5" />
      </g>
      <g id="mark-struts" transform={`translate(0 ${dy(1)})`} opacity={op("struts")}>
        <g stroke="#5B729B" strokeWidth="3.5" strokeLinecap="round">
          <line x1="30" y1="30" x2="82" y2="82" />
          <line x1="82" y1="30" x2="30" y2="82" />
          <line x1="30" y1="30" x2="30" y2="82" />
          <line x1="82" y1="30" x2="82" y2="82" />
        </g>
        <g stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" opacity="0.8">
          <line x1="30" y1="30" x2="82" y2="82" />
          <line x1="82" y1="30" x2="30" y2="82" />
        </g>
      </g>
      <g id="mark-nodes" transform={`translate(0 ${dy(2)})`} opacity={op("nodes")}>
        <g fill="#C9A84C">
          <circle cx="30" cy="30" r="6" />
          <circle cx="82" cy="30" r="6" />
          <circle cx="30" cy="82" r="6" />
          <circle cx="82" cy="82" r="6" />
        </g>
        <g fill="#E0C76F" opacity="0.8">
          <circle cx="28.5" cy="28.5" r="2" />
          <circle cx="80.5" cy="28.5" r="2" />
          <circle cx="28.5" cy="80.5" r="2" />
          <circle cx="80.5" cy="80.5" r="2" />
        </g>
      </g>
      <g id="mark-core" transform={`translate(0 ${dy(3)})`} opacity={op("core")}>
        <circle cx="56" cy="56" r="13" fill="#C9A84C" />
        <circle cx="56" cy="56" r="7" fill="#0F1E35" />
        <circle cx="53" cy="53" r="2.4" fill="#E0C76F" opacity="0.9" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Verify + commit**

Run: `npm run lint` → expect clean.

```bash
git add src/components/mark/MarkStatic.tsx
git commit -m "feat: MarkStatic SSR SVG with assembled/exploded/highlight variants"
```

### Task 4: Capability hook + WebGL mark

**Files:**
- Create: `src/lib/useCan3D.ts`
- Create: `src/components/mark/MarkScene.tsx`
- Create: `src/components/mark/MarkCanvas.tsx`

**Interfaces:**
- Consumes: `MarkStatic` (fallback rendering happens in callers, not here)
- Produces:
  - `useCan3D(): boolean` — true only when WebGL available, device adequate, and motion not reduced
  - `MarkCanvas({ t, idle, className })` — client component; `t: MotionValue<number>` assembly state (0 assembled → 1 exploded); `idle: boolean` enables slow Y-rotation + cursor tilt; lazy-loads the scene, gates frameloop by visibility, fades in on ready.

- [ ] **Step 1: Create `src/lib/useCan3D.ts`**

```ts
"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Tier gate for the WebGL mark: requires WebGL context, a non-low-end
 *  device heuristic, and no reduced-motion preference. Returns false on
 *  the server and until mounted (SSR-safe). */
export function useCan3D(): boolean {
  const reduced = useReducedMotion();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (reduced) { setOk(false); return; }
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      const nav = navigator as Navigator & { deviceMemory?: number };
      const memOk = (nav.deviceMemory ?? 8) >= 4;
      const cpuOk = (navigator.hardwareConcurrency ?? 8) >= 4;
      setOk(Boolean(gl) && memOk && cpuOk);
    } catch {
      setOk(false);
    }
  }, [reduced]);
  return ok;
}
```

- [ ] **Step 2: Create `src/components/mark/MarkScene.tsx`** (the r3f scene — imported only dynamically)

```tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

const CORNERS: [number, number][] = [[-1.15, -1.15], [1.15, -1.15], [-1.15, 1.15], [1.15, 1.15]];

function useMaterials() {
  return useMemo(() => {
    const midnight = new THREE.MeshStandardMaterial({ color: "#24406B", metalness: 0.85, roughness: 0.35 });
    const gold = new THREE.MeshStandardMaterial({ color: "#C9A84C", metalness: 1.0, roughness: 0.25 });
    const goldBright = new THREE.MeshStandardMaterial({ color: "#E0C76F", metalness: 1.0, roughness: 0.2 });
    return { midnight, gold, goldBright };
  }, []);
}

function Strut({ a, b, material }: { a: [number, number]; b: [number, number]; material: THREE.Material }) {
  const { mid, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(a[0], a[1], 0);
    const vb = new THREE.Vector3(b[0], b[1], 0);
    const dir = vb.clone().sub(va);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { mid: va.clone().add(vb).multiplyScalar(0.5), quat, len };
  }, [a, b]);
  return (
    <mesh position={mid} quaternion={quat} material={material}>
      <cylinderGeometry args={[0.05, 0.05, len, 20]} />
    </mesh>
  );
}

function Mark({ t, idle }: { t: MotionValue<number>; idle: boolean }) {
  const mats = useMaterials();
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const struts = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const v = t.get();
    if (ring.current) ring.current.position.z = -0.9 * v;
    if (struts.current) struts.current.position.z = -0.3 * v;
    if (nodes.current) nodes.current.position.z = 0.35 * v;
    if (core.current) core.current.position.z = 1.0 * v;
    if (spin.current && idle) spin.current.rotation.y += delta * 0.12;
    if (tilt.current) {
      const targetX = idle ? state.pointer.y * -0.16 : 0.35 * v; // exploded view leans back
      const targetY = idle ? state.pointer.x * 0.2 : -0.15 * v;
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, targetX, 3, delta);
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, targetY, 3, delta);
    }
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <group ref={ring}>
          <mesh material={mats.gold}>
            <torusGeometry args={[1.9, 0.045, 16, 96]} />
          </mesh>
        </group>
        <group ref={struts}>
          <Strut a={CORNERS[0]} b={CORNERS[3]} material={mats.midnight} />
          <Strut a={CORNERS[1]} b={CORNERS[2]} material={mats.midnight} />
          <Strut a={CORNERS[0]} b={CORNERS[2]} material={mats.midnight} />
          <Strut a={CORNERS[1]} b={CORNERS[3]} material={mats.midnight} />
        </group>
        <group ref={nodes}>
          {CORNERS.map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0]} material={mats.gold}>
              <sphereGeometry args={[0.16, 24, 24]} />
            </mesh>
          ))}
        </group>
        <group ref={core}>
          <mesh material={mats.gold} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.12, 48]} />
          </mesh>
          <mesh material={mats.midnight} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 48]} />
          </mesh>
          <mesh material={mats.goldBright} position={[-0.09, 0.09, 0.08]}>
            <sphereGeometry args={[0.045, 16, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function MarkScene({ t, idle, active }: { t: MotionValue<number>; idle: boolean; active: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.18} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#F2E2AE" />
      <pointLight position={[-4, -2, -3]} intensity={0.9} color="#516689" />
      <Mark t={t} idle={idle} />
    </Canvas>
  );
}
```

- [ ] **Step 3: Create `src/components/mark/MarkCanvas.tsx`** (dynamic wrapper + visibility gate + fade-in)

```tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

const MarkScene = dynamic(() => import("./MarkScene"), { ssr: false });

type MarkCanvasProps = {
  t: MotionValue<number>;
  idle?: boolean;
  className?: string;
  /** Called once the canvas has mounted — callers cross-fade MarkStatic out. */
  onReady?: () => void;
};

export default function MarkCanvas({ t, idle = false, className, onReady }: MarkCanvasProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "20%" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (mounted) onReady?.();
  }, [mounted, onReady]);

  return (
    <div
      ref={holder}
      className={className}
      style={{ opacity: mounted ? 1 : 0, transition: "opacity 600ms var(--nv-ease)" }}
      aria-hidden="true"
    >
      {visible || mounted ? (
        <ReadyProbe onMount={() => setMounted(true)}>
          <MarkScene t={t} idle={idle} active={visible} />
        </ReadyProbe>
      ) : null}
    </div>
  );
}

function ReadyProbe({ children, onMount }: { children: React.ReactNode; onMount: () => void }) {
  useEffect(() => { onMount(); }, [onMount]);
  return <>{children}</>;
}
```

- [ ] **Step 4: Verify + commit**

Run: `npm run lint` → expect clean.

```bash
git add src/lib/useCan3D.ts src/components/mark/MarkScene.tsx src/components/mark/MarkCanvas.tsx
git commit -m "feat: WebGL mark — procedural r3f scene, capability gate, lazy canvas wrapper"
```

### Task 5: HeroMovement + remove Lottie

**Files:**
- Create: `src/components/sections/HeroMovement.tsx`
- Modify: `src/app/page.tsx` (hero swap only; full reorder happens Task 10)
- Delete: `src/components/lottie/HeroLottie.tsx`, `src/components/lottie/HeroLottieLoader.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/sections/HeroFallback.tsx`, `public/lottie/`
- Modify: `package.json` (remove `@lottiefiles/dotlottie-react`)

**Interfaces:**
- Consumes: `HOME.hero` from constants, `MarkStatic`, `MarkCanvas`, `useCan3D`, existing `Button` component (`@/components/ui/Button`, props `href`, `variant`)
- Produces: `HeroMovement()` — default export, self-contained hero section. Also re-exports nothing; `GhostMark` (previously exported from HeroSection) has no other importers — verify in Step 3.

- [ ] **Step 1: Create `src/components/sections/HeroMovement.tsx`**

```tsx
"use client";

import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import MarkStatic from "@/components/mark/MarkStatic";
import MarkCanvas from "@/components/mark/MarkCanvas";
import { useCan3D } from "@/lib/useCan3D";
import { HOME } from "@/lib/constants";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function HeroMovement() {
  const can3D = useCan3D();
  const reduced = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);
  const t = useMotionValue(0); // hero mark stays assembled

  const { hero } = HOME;

  return (
    <section className="nv-velvet nv-hero relative flex min-h-[100svh] items-center overflow-hidden">
      {/* atmosphere */}
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-[320px] w-[320px] rounded-full blur-3xl md:h-[560px] md:w-[560px]"
        style={{ background: "var(--nv-gold-glow-subtle)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-24 md:grid-cols-2 md:px-6 md:py-32">
        <div className="max-w-2xl">
          <motion.p className="nv-overline mb-4" {...(reduced ? {} : rise(0))}>
            {hero.overline}
          </motion.p>
          <motion.h1
            className="font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-[var(--nv-text-display-lg)]"
            style={{ color: "var(--nv-hero-heading)" }}
            {...(reduced ? {} : rise(0.08))}
          >
            {hero.headlinePre}{" "}
            <span style={{ color: "var(--nv-hero-accent)" }}>{hero.headlineGold}</span>
          </motion.h1>
          <motion.p className="nv-lead mt-6 max-w-xl" {...(reduced ? {} : rise(0.16))}>
            {hero.sub}
          </motion.p>
          <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row" {...(reduced ? {} : rise(0.24))}>
            <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
            <Button href={hero.ctaGhost.href} variant="ghost">{hero.ctaGhost.label}</Button>
          </motion.div>
        </div>

        {/* The mark: static SVG is the SSR/LCP element; canvas cross-fades over it */}
        <div className="relative mx-auto h-[280px] w-[280px] md:h-[440px] md:w-[440px]">
          <div
            className="absolute inset-0"
            style={{ opacity: canvasReady ? 0 : 1, transition: "opacity 600ms var(--nv-ease)" }}
          >
            <MarkStatic className="h-full w-full" variant="assembled" />
          </div>
          {can3D && (
            <MarkCanvas
              t={t}
              idle
              className="absolute inset-0"
              onReady={() => setCanvasReady(true)}
            />
          )}
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, var(--nv-bg-page), transparent)" }}
      />
    </section>
  );
}
```

Implementation note: the static mark stays mounted (SSR/LCP + no-JS tier) and only fades to `opacity: 0` once the canvas reports ready — never conditionally unmount it.

- [ ] **Step 2: Swap the hero in `src/app/page.tsx`**

Replace the `HeroSection` import and usage with `HeroMovement` (leave the other sections untouched for now):

```tsx
import HeroMovement from "@/components/sections/HeroMovement";
```

- [ ] **Step 3: Delete Lottie + old hero files and dep**

Run: `grep -rn "GhostMark\|HeroLottie\|HeroFallback\|HeroSection" src --include="*.tsx" --include="*.ts" | grep -v "HeroMovement"`
Expected: no remaining importers (if `PageHeroBanner` or others import `GhostMark`, move the `GhostMark` function into `src/components/ui/Logo.tsx` and update those imports first).

```bash
rm -rf src/components/lottie src/components/sections/HeroSection.tsx src/components/sections/HeroFallback.tsx public/lottie
npm uninstall @lottiefiles/dotlottie-react
rm -rf src/components/three
```

- [ ] **Step 4: Verify**

Run: `npm run dev` (background if not running), then:
`curl -s http://localhost:3000 | grep -c "Create your own"` → Expected: `1` (or more)
`curl -s http://localhost:3000 | grep -c "mark-ring"` → Expected: `1` (static SVG is server-rendered)
Visual check: hero shows headline + mark; with WebGL the mark subtly rotates and tilts toward cursor.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: HeroMovement — SSR mark + WebGL crossfade; remove lottie and old three"
```

### Task 6: Manifesto + WhyUs (calm sections)

**Files:**
- Create: `src/components/sections/Manifesto.tsx`
- Create: `src/components/sections/WhyUs.tsx`

**Interfaces:**
- Consumes: `HOME.manifesto`, `HOME.why`, `WHY_POINTS` from constants; `.nv-plaque` from theme
- Produces: `Manifesto()`, `WhyUs()` — default exports, drop-in homepage sections

- [ ] **Step 1: Create `src/components/sections/Manifesto.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { HOME } from "@/lib/constants";

function Word({ progress, index, total, children, gold }: {
  progress: MotionValue<number>; index: number; total: number; children: string; gold?: boolean;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <motion.span style={{ opacity, color: gold ? "var(--nv-gold-400)" : undefined }}>
      {children}{" "}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.35"] });
  const { manifesto } = HOME;

  const mutedWords = manifesto.muted.split(" ");
  const mainWords = manifesto.main.split(" ");
  const goldWords = manifesto.gold.split(" ");
  const total = mutedWords.length + mainWords.length + goldWords.length;

  if (reduced) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-28 text-center md:px-6 md:py-36">
        <p className="font-display text-2xl font-semibold md:text-4xl">
          <span className="text-muted">{manifesto.muted}</span>
          <br /><br />
          <span className="text-heading">{manifesto.main} <span className="text-gold">{manifesto.gold}</span></span>
        </p>
      </section>
    );
  }

  let i = 0;
  return (
    <section ref={ref} className="mx-auto max-w-3xl px-4 py-28 text-center md:px-6 md:py-36">
      <p className="font-display text-2xl font-semibold leading-snug md:text-4xl" aria-label={`${manifesto.muted} ${manifesto.main} ${manifesto.gold}`}>
        <span className="text-muted" aria-hidden="true">
          {mutedWords.map((w) => <Word key={i} progress={scrollYProgress} index={i++} total={total}>{w}</Word>)}
        </span>
        <br /><br />
        <span className="text-heading" aria-hidden="true">
          {mainWords.map((w) => <Word key={i} progress={scrollYProgress} index={i++} total={total}>{w}</Word>)}
          {goldWords.map((w) => <Word key={i} progress={scrollYProgress} index={i++} total={total} gold>{w}</Word>)}
        </span>
      </p>
    </section>
  );
}
```

Note: keys via the incrementing `i` inside `.map` — React needs stable keys; use `key={\`m-${idx}\`}` per array with its own index counter if lint complains about the pattern above. The aria-label carries the full sentence; word spans are aria-hidden so screen readers get one clean sentence.

- [ ] **Step 2: Create `src/components/sections/WhyUs.tsx`**

```tsx
import AnimatedSection from "@/components/ui/AnimatedSection";
import StaggerContainer from "@/components/ui/StaggerContainer";
import { HOME, WHY_POINTS } from "@/lib/constants";

export default function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <AnimatedSection>
        <p className="nv-overline mb-3">{HOME.why.overline}</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">{HOME.why.heading}</h2>
      </AnimatedSection>
      <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2">
        {WHY_POINTS.map((p) => (
          <div key={p.title} className="nv-plaque">
            <h3 className="font-display text-lg font-semibold" style={{ color: "var(--nv-gold-300)" }}>
              {p.title}
            </h3>
            <p className="mt-2 text-sm text-secondary">{p.description}</p>
          </div>
        ))}
      </StaggerContainer>
    </section>
  );
}
```

Check `AnimatedSection` and `StaggerContainer` prop signatures in `src/components/ui/` before use — if `StaggerContainer` requires different props (e.g. children as items), adapt to its actual API; if its stagger exceeds 80ms, pass/adjust to ≤ 80ms.

- [ ] **Step 3: Verify + commit**

Run: `npm run lint` → clean.

```bash
git add src/components/sections/Manifesto.tsx src/components/sections/WhyUs.tsx
git commit -m "feat: Manifesto scroll-brightening and WhyUs recessed plaques"
```

### Task 7: SheenPanel + TwoCrafts

**Files:**
- Create: `src/components/ui/SheenPanel.tsx`
- Create: `src/components/sections/TwoCrafts.tsx`

**Interfaces:**
- Consumes: `PILLARS`, `.nv-sheen` CSS
- Produces: `SheenPanel({ children, className })` — client wrapper setting `--mx`/`--my`; `TwoCrafts()` — homepage section. `SheenPanel` is reused by `WorkGallery` panels (Task 8).

- [ ] **Step 1: Create `src/components/ui/SheenPanel.tsx`**

```tsx
"use client";

import { useRef } from "react";

export default function SheenPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`nv-sheen ${className}`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/TwoCrafts.tsx`**

```tsx
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SheenPanel from "@/components/ui/SheenPanel";
import { PILLARS } from "@/lib/constants";

export default function TwoCrafts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <div className="grid gap-8 md:grid-cols-2">
        {PILLARS.map((pillar, i) => (
          <AnimatedSection key={pillar.id} delay={i * 0.08}>
            <SheenPanel className="nv-card nv-card-elevated flex h-full flex-col p-8 md:p-10">
              <p className="nv-overline">{pillar.overline}</p>
              <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">{pillar.heading}</h2>
              <p className="mt-4 flex-1 text-secondary">{pillar.body}</p>
              <Link href={pillar.link.href} className="mt-6 font-display text-sm font-semibold">
                {pillar.link.label} →
              </Link>
            </SheenPanel>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
```

Check `AnimatedSection`'s actual props (`delay` may be named differently) and adapt.

- [ ] **Step 3: Verify + commit**

Run: `npm run lint` → clean.

```bash
git add src/components/ui/SheenPanel.tsx src/components/sections/TwoCrafts.tsx
git commit -m "feat: TwoCrafts pillars with cursor sheen"
```

### Task 8: WorkGallery — pinned dolly + swipe deck

**Files:**
- Create: `src/components/sections/WorkGallery.tsx`

**Interfaces:**
- Consumes: `CASE_STUDIES`, `HOME.work`, `SheenPanel`
- Produces: `WorkGallery()` — homepage section. Desktop: pinned CSS-3D dolly. Touch/small: horizontal scroll-snap deck. Reduced motion: plain stacked list.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import SheenPanel from "@/components/ui/SheenPanel";
import { CASE_STUDIES, type CaseStudy } from "@/lib/work";
import { HOME } from "@/lib/constants";

const GAP = 420; // z-distance between panels (px)

function PanelContent({ cs }: { cs: CaseStudy }) {
  return (
    <SheenPanel className="nv-card nv-card-elevated flex h-full flex-col overflow-hidden p-6">
      <p className="nv-overline">{`Client · ${cs.sector}`}</p>
      <h3 className="mt-2 font-display text-xl font-bold">{cs.title}</h3>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-lg" style={{ minHeight: 160 }}>
        <Image src={cs.cover.src} alt={cs.cover.alt} fill className="object-cover" sizes="(max-width: 768px) 80vw, 480px" />
      </div>
      <p className="mt-4 text-sm text-secondary">
        <span className="font-semibold text-gold">{cs.outcomes[0].value}</span> {cs.outcomes[0].label}
      </p>
      <Link href={`/work/${cs.slug}`} className="mt-3 font-display text-sm font-semibold">
        Read the case →
      </Link>
    </SheenPanel>
  );
}

function DollyPanel({ cs, index, cam }: { cs: CaseStudy; index: number; cam: MotionValue<number> }) {
  const opacity = useTransform(cam, (v) => {
    const d = v - index * GAP;
    if (d <= 0) return 1;
    return Math.max(0, 1 - d / 120);
  });
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-[420px] w-[480px] -translate-x-1/2 -translate-y-1/2"
      style={{ z: -index * GAP, y: -index * 10 - 210, x: -240, opacity, transformStyle: "preserve-3d" }}
    >
      <PanelContent cs={cs} />
    </motion.div>
  );
}

export default function WorkGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cam = useTransform(scrollYProgress, [0.05, 0.95], [0, GAP * (CASE_STUDIES.length - 1)]);

  const header = (
    <div className="text-center">
      <p className="nv-overline mb-3">{HOME.work.overline}</p>
      <h2 className="font-display text-3xl font-bold md:text-4xl">{HOME.work.heading}</h2>
      <Link href={HOME.work.link.href} className="mt-3 inline-block font-display text-sm font-semibold">
        {HOME.work.link.label} →
      </Link>
    </div>
  );

  // Reduced motion (any width): plain stacked list
  if (reduced) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        {header}
        <div className="mx-auto mt-12 grid max-w-2xl gap-8">
          {CASE_STUDIES.map((cs) => <div key={cs.slug} className="h-[420px]"><PanelContent cs={cs} /></div>)}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Desktop: pinned dolly */}
      <section ref={ref} className="relative hidden md:block" style={{ height: `${(CASE_STUDIES.length + 1) * 100}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden" style={{ perspective: "900px" }}>
          <div className="pt-20">{header}</div>
          <motion.div className="relative flex-1" style={{ z: cam, transformStyle: "preserve-3d" }}>
            {CASE_STUDIES.map((cs, i) => <DollyPanel key={cs.slug} cs={cs} index={i} cam={cam} />)}
          </motion.div>
        </div>
      </section>
      {/* Touch/small: swipe deck */}
      <section className="py-24 md:hidden">
        <div className="px-4">{header}</div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
          {CASE_STUDIES.map((cs) => (
            <div key={cs.slug} className="h-[440px] w-[82vw] flex-none snap-center">
              <PanelContent cs={cs} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
```

Layout tuning is expected here (panel width/y-centering: the `y`/`x` offsets above manually centre the absolutely-positioned panel — verify visually and adjust; Framer's `z` maps to `translateZ`). Cover images don't exist yet — add three 960×640 dark-navy placeholder WebP images at `public/work/hospitality-cover.webp`, `legal-erp-cover.webp`, `retail-cover.webp` (generate solid-colour placeholders with ImageMagick if available: `convert -size 960x640 xc:"#16294A" public/work/hospitality-cover.webp` etc., or commit simple gradient PNGs renamed appropriately — any dark placeholder is fine, tagged for replacement).

- [ ] **Step 2: Verify**

`npm run lint` → clean. Visual check (desktop viewport): scrolling into Selected Work pins the section; panels approach and pass the camera; "View all work →" stays visible; after the last panel the page unpins. Narrow viewport: horizontal swipe deck, no pinning.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/WorkGallery.tsx public/work
git commit -m "feat: WorkGallery pinned depth dolly with swipe-deck and reduced-motion fallbacks"
```

### Task 9: MethodCTA — exploded view + reassembly

**Files:**
- Create: `src/components/sections/MethodCTA.tsx`

**Interfaces:**
- Consumes: `METHOD_PHASES` from `@/lib/method`, `HOME.method` + `HOME.cta`, `MarkCanvas`, `MarkStatic`, `useCan3D`, `Button`
- Produces: `MethodCTA()` — one homepage section covering spec §4.5 and §4.7 with a shared sticky canvas. Assembly state: progress 0→0.5 explodes (t 0→1), 0.5→0.75 holds, 0.75→1 reassembles (t→0).

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Button from "@/components/ui/Button";
import MarkCanvas from "@/components/mark/MarkCanvas";
import MarkStatic from "@/components/mark/MarkStatic";
import { useCan3D } from "@/lib/useCan3D";
import { METHOD_PHASES } from "@/lib/method";
import { HOME } from "@/lib/constants";

function PhaseRow({ phase, index, progress }: {
  phase: (typeof METHOD_PHASES)[number]; index: number; progress: MotionValue<number>;
}) {
  const start = 0.08 + index * 0.11;
  const opacity = useTransform(progress, [start, start + 0.07], [0.2, 1]);
  return (
    <motion.div style={{ opacity }} className="flex gap-5">
      <span className="nv-overline w-8 flex-none pt-1">{phase.num}</span>
      <div>
        <h3 className="font-display text-lg font-semibold text-heading">{phase.name}</h3>
        <p className="mt-1 max-w-md text-sm text-secondary">{phase.short}</p>
      </div>
    </motion.div>
  );
}

export default function MethodCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const can3D = useCan3D();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const t = useTransform(scrollYProgress, [0, 0.5, 0.75, 1], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.72, 0.85], [0, 1]);

  const { method, cta } = HOME;

  if (reduced) {
    // Static variant: exploded diagram + phases + CTA, normal flow
    return (
      <section className="nv-velvet px-4 py-24 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <div>
            <p className="nv-overline mb-3">{method.overline}</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{method.heading}</h2>
            <div className="mt-10 space-y-8">
              {METHOD_PHASES.map((p) => (
                <div key={p.num} className="flex gap-5">
                  <span className="nv-overline w-8 flex-none pt-1">{p.num}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-heading">{p.name}</h3>
                    <p className="mt-1 max-w-md text-sm text-secondary">{p.short}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href={method.link.href} className="mt-8 inline-block font-display text-sm font-semibold">
              {method.link.label} →
            </Link>
          </div>
          <MarkStatic variant="exploded" className="mx-auto w-56 md:w-72" />
        </div>
        <div className="mx-auto mt-24 max-w-3xl text-center">
          <p className="nv-overline mb-3">{cta.overline}</p>
          <h2 className="font-display text-3xl font-bold md:text-4xl">{cta.heading}</h2>
          <p className="nv-lead mx-auto mt-4">{cta.sub}</p>
          <div className="mt-8"><Button href={cta.button.href}>{cta.button.label}</Button></div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="nv-velvet relative" style={{ height: "350vh" }}>
      {/* Sticky stage: canvas on the right */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute right-0 top-0 hidden h-full w-1/2 md:block">
          {can3D ? (
            <MarkCanvas t={t} className="h-full w-full" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <MarkStatic variant="exploded" className="w-64" />
            </div>
          )}
        </div>
        {/* CTA overlay — fades in at the end while the mark reassembles */}
        <motion.div
          style={{ opacity: ctaOpacity }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4"
        >
          <div className="pointer-events-auto max-w-3xl text-center" style={{ background: "transparent" }}>
            <p className="nv-overline mb-3">{cta.overline}</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{cta.heading}</h2>
            <p className="nv-lead mx-auto mt-4">{cta.sub}</p>
            <div className="mt-8"><Button href={cta.button.href}>{cta.button.label}</Button></div>
          </div>
        </motion.div>
      </div>
      {/* Scrolling copy — occupies the first ~70% of the section height */}
      <div className="absolute inset-x-0 top-0 z-[5]" style={{ height: "70%" }}>
        <div className="mx-auto flex h-full max-w-7xl px-4 md:px-6">
          <div className="flex w-full flex-col justify-around py-[20vh] md:w-1/2">
            <div>
              <p className="nv-overline mb-3">{method.overline}</p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">{method.heading}</h2>
            </div>
            <div className="space-y-10">
              {METHOD_PHASES.map((p, i) => <PhaseRow key={p.num} phase={p} index={i} progress={scrollYProgress} />)}
            </div>
            <Link href={method.link.href} className="font-display text-sm font-semibold">
              {method.link.label} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Layout note: the CTA overlay must not intercept scroll or clicks while invisible — `pointer-events-none` on the wrapper with `pointer-events-auto` inside is shown above; additionally gate inner pointer events on visibility if clicks pass through unexpectedly (e.g. also toggle `visibility` via `useTransform(ctaOpacity, v => v < 0.05 ? "hidden" : "visible")`). Expect to tune the copy column's vertical rhythm and phase-row windows against the real scroll feel.

- [ ] **Step 2: Verify**

`npm run lint` → clean. Visual: section pins; mark explodes as phases brighten one by one; holds; CTA fades in while mark reassembles; button clickable; page releases after.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/MethodCTA.tsx
git commit -m "feat: MethodCTA — scroll-scrubbed exploded view with reassembly CTA"
```

### Task 10: Homepage assembly + delete old sections

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/sections/ServicesOverview.tsx`, `src/components/sections/WhyNexxVantage.tsx`, `src/components/sections/CTABanner.tsx`

**Interfaces:**
- Consumes: all Task 5–9 sections
- Produces: the complete homepage; **the full `npm run build` must pass from this task onward**

- [ ] **Step 1: Rewrite `src/app/page.tsx`**

```tsx
import HeroMovement from "@/components/sections/HeroMovement";
import Manifesto from "@/components/sections/Manifesto";
import TwoCrafts from "@/components/sections/TwoCrafts";
import WorkGallery from "@/components/sections/WorkGallery";
import MethodCTA from "@/components/sections/MethodCTA";
import WhyUs from "@/components/sections/WhyUs";

export default function HomePage() {
  return (
    <>
      <HeroMovement />
      <Manifesto />
      <div className="nv-divider" />
      <TwoCrafts />
      <WorkGallery />
      <WhyUs />
      <MethodCTA />
    </>
  );
}
```

Ordering note vs spec §4: spec order is Hero → Manifesto → Crafts → Work → Method → Why → CTA. Because Method and CTA share one sticky canvas (Task 9), WhyUs is placed before MethodCTA so the reassembled CTA remains the final beat. This preserves the approved rhythm (wow → calm → calm → wow → calm → wow/resolution) with the same content.

- [ ] **Step 2: Delete superseded sections and stale imports**

```bash
rm src/components/sections/ServicesOverview.tsx src/components/sections/WhyNexxVantage.tsx src/components/sections/CTABanner.tsx
grep -rn "ServicesOverview\|WhyNexxVantage\|CTABanner\|VALUE_PROPS\|SERVICES\b" src --include="*.tsx" --include="*.ts"
```
Expected: only hits inside `src/app/services/page.tsx` (fixed in Task 12) and possibly `ServiceIcon`/`ServiceBlock`. If `services/page.tsx` still imports deleted exports, apply Task 12 now before building, or temporarily keep a `SERVICES` re-export shim — prefer doing Task 12 next without a shim if executing sequentially; if a green build is required immediately, proceed to Task 12 before running the build.

- [ ] **Step 3: Full verify**

Run: `npm run build`
Expected: `✓ Compiled successfully` (if services/contact pages still reference removed exports, complete Tasks 12/14 first — sequential executors: it is acceptable to defer this build gate to the end of Task 12).
Run: `curl -s http://localhost:3000 | grep -c "phase by phase, in the order that pays"` → `1`
Run: `curl -s http://localhost:3000 | grep -c "Built senior. Priced boutique. Run transparent."` → `1`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: assemble 7-beat homepage; remove superseded sections"
```

### Task 11: Work pages

**Files:**
- Create: `src/app/work/page.tsx`
- Create: `src/app/work/[slug]/page.tsx`

**Interfaces:**
- Consumes: `CASE_STUDIES`, `getCaseStudy`, `CaseStudy` from `@/lib/work`; existing `PageHeroBanner` (check its props in `src/components/sections/PageHeroBanner.tsx` and reuse if suitable); `JsonLd` is added in Task 16 — do not add JSON-LD here
- Produces: `/work` and `/work/[slug]` routes with `generateStaticParams` + `generateMetadata`

- [ ] **Step 1: Create `src/app/work/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CASE_STUDIES } from "@/lib/work";

export const metadata: Metadata = {
  title: "Selected Work — NexxVantage",
  description:
    "Case studies from the NexxVantage studio and engineering house: premium web design and custom software, delivered phase by phase with measured outcomes.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <AnimatedSection>
        <p className="nv-overline mb-3">Selected Work</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Few projects. Full courses.</h1>
        <p className="nv-lead mt-4 max-w-2xl">
          We take on a small number of engagements and give each one everything. Here is what that looks like when it ships.
        </p>
      </AnimatedSection>
      <div className="mt-16 space-y-16">
        {CASE_STUDIES.map((cs, i) => (
          <AnimatedSection key={cs.slug} delay={i * 0.06}>
            <Link href={`/work/${cs.slug}`} className="group block no-underline">
              <article className="nv-card nv-card-elevated grid gap-8 overflow-hidden p-8 md:grid-cols-2 md:p-10">
                <div className="relative min-h-[240px] overflow-hidden rounded-lg">
                  <Image src={cs.cover.src} alt={cs.cover.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 90vw, 560px" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="nv-overline">{`${cs.client} · ${cs.sector}`}</p>
                  <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">{cs.title}</h2>
                  <p className="mt-4 text-secondary">{cs.summary}</p>
                  <p className="mt-6 text-sm">
                    <span className="font-display text-2xl font-bold text-gold">{cs.outcomes[0].value}</span>{" "}
                    <span className="text-secondary">{cs.outcomes[0].label}</span>
                  </p>
                  <span className="mt-6 font-display text-sm font-semibold text-accent">Read the case →</span>
                </div>
              </article>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create `src/app/work/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import { CASE_STUDIES, getCaseStudy } from "@/lib/work";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cs = getCaseStudy(params.slug);
  if (!cs) return {};
  return { title: `${cs.title} — NexxVantage Work`, description: cs.summary };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug);
  if (!cs) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-24 md:px-6 md:py-32">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/work">Work</Link> <span aria-hidden="true">/</span> {cs.title}
      </nav>

      {/* 1 — Brief */}
      <p className="nv-overline">{`${cs.client} · ${cs.sector}`}</p>
      <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">{cs.title}</h1>
      <dl className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
        <div><dt className="nv-overline">Engagement</dt><dd className="mt-1 text-sm">{cs.engagement}</dd></div>
        <div><dt className="nv-overline">Timeline</dt><dd className="mt-1 text-sm">{cs.timeline}</dd></div>
        <div><dt className="nv-overline">Sector</dt><dd className="mt-1 text-sm">{cs.sector}</dd></div>
      </dl>
      <div className="relative mt-10 h-[320px] overflow-hidden rounded-xl md:h-[440px]">
        <Image src={cs.cover.src} alt={cs.cover.alt} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 896px" />
      </div>

      {/* 2 — The problem, in the client's words */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">The problem, in the client's words</h2>
        <blockquote className="nv-testimonial mt-6"><p className="text-lg italic">&ldquo;{cs.problemQuote}&rdquo;</p></blockquote>
      </section>

      {/* 3 — What we built first, and why */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">What we built first, and why</h2>
        <p className="mt-4 text-secondary">{cs.firstBuild}</p>
      </section>

      {/* 4 — The outcome */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">The outcome</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {cs.outcomes.map((o) => (
            <div key={o.label} className="nv-plaque">
              <p className="font-display text-3xl font-bold text-gold">{o.value}</p>
              <p className="mt-1 text-sm text-secondary">{o.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 text-center">
        <h2 className="font-display text-2xl font-bold">Your sector next</h2>
        <p className="nv-lead mx-auto mt-3">Every engagement starts with a conversation, not a quote.</p>
        <div className="mt-6"><Button href="/contact">Book a consultation</Button></div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Verify**

`curl -s http://localhost:3000/work | grep -c "Few projects"` → `1`
`curl -s http://localhost:3000/work/legal-practice-erp | grep -c "in the client&#x27;s words\|in the client's words"` → `1`

- [ ] **Step 4: Commit**

```bash
git add src/app/work
git commit -m "feat: work index and case-study pages with static params"
```

### Task 12: Services restructure

**Files:**
- Modify: `src/app/services/page.tsx`

**Interfaces:**
- Consumes: `PILLARS`, `AGENCY_OFFER`; existing `ServiceBlock`/`PageHeroBanner` components — read them first; if `ServiceBlock` is tightly coupled to the old `SERVICES` shape (icon field etc.), render pillar service blocks inline with `nv-card` instead and delete `ServiceBlock` + `ServiceIcon` if unused afterwards
- Produces: `/services` with `#studio` and `#engineering` anchors + agencies block; removes the last imports of the deleted `SERVICES` export (build goes green here if it wasn't already)

- [ ] **Step 1: Rewrite the page**

```tsx
import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { PILLARS, AGENCY_OFFER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services — NexxVantage Studio & Engineering House",
  description:
    "Two crafts under one roof: brand-first web design from the Studio, and enterprise-grade custom software — ERP, AI & MCP, cloud — from the Engineering House.",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <AnimatedSection>
        <p className="nv-overline mb-3">Services</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Two crafts. One standard.</h1>
      </AnimatedSection>

      {PILLARS.map((pillar) => (
        <section key={pillar.id} id={pillar.id} className="mt-20 scroll-mt-28">
          <AnimatedSection>
            <p className="nv-overline">{pillar.overline}</p>
            <h2 className="mt-2 font-display text-3xl font-bold">{pillar.heading}</h2>
            <p className="nv-lead mt-4 max-w-3xl">{pillar.intro}</p>
          </AnimatedSection>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {pillar.services.map((svc) => (
              <AnimatedSection key={svc.id}>
                <article id={svc.id} className="nv-card h-full scroll-mt-28 p-8">
                  <h3 className="font-display text-xl font-bold">{svc.title}</h3>
                  <p className="mt-3 text-secondary">{svc.description}</p>
                  <ul className="mt-5 space-y-2">
                    {svc.keyPoints.map((kp) => (
                      <li key={kp} className="flex gap-2 text-sm text-secondary">
                        <span className="text-gold" aria-hidden="true">—</span>{kp}
                      </li>
                    ))}
                  </ul>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </section>
      ))}

      <section id="agencies" className="mt-24 scroll-mt-28">
        <AnimatedSection>
          <div className="nv-card-inset nv-card p-8 md:p-10">
            <p className="nv-overline">{AGENCY_OFFER.overline}</p>
            <h2 className="mt-2 font-display text-2xl font-bold">{AGENCY_OFFER.title}</h2>
            <p className="mt-3 max-w-3xl text-secondary">{AGENCY_OFFER.description}</p>
            <ul className="mt-5 space-y-2">
              {AGENCY_OFFER.keyPoints.map((kp) => (
                <li key={kp} className="flex gap-2 text-sm text-secondary">
                  <span className="text-gold" aria-hidden="true">—</span>{kp}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </section>

      <section className="mt-24 text-center">
        <h2 className="font-display text-2xl font-bold">Not sure which door to knock on?</h2>
        <p className="nv-lead mx-auto mt-3">Start with the conversation. We will point you at the right craft.</p>
        <div className="mt-6"><Button href="/contact">Book a consultation</Button></div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Clean orphans + verify**

Run: `grep -rn "ServiceBlock\|ServiceIcon" src --include="*.tsx"` — delete `src/components/sections/ServiceBlock.tsx` and `src/components/ui/ServiceIcon.tsx` if now unimported.
Run: `npm run build` → Expected: `✓ Compiled successfully` (**hard gate — from here the build must stay green**)
Run: `curl -s http://localhost:3000/services | grep -c 'id="studio"'` → `1`; same for `id="engineering"` → `1`

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: services page restructured around Studio and Engineering House pillars"
```

### Task 13: Method page

**Files:**
- Create: `src/app/method/page.tsx`
- Create: `src/components/sections/PhaseDiagram.tsx`

**Interfaces:**
- Consumes: `METHOD_PHASES`, `METHOD_PAGE`, `METHOD_FAQ` from `@/lib/method`; `MarkStatic` (with `highlight` prop)
- Produces: `/method` route; `PhaseDiagram({ activeLayer })` client component (sticky sidebar diagram)

- [ ] **Step 1: Create `src/components/sections/PhaseDiagram.tsx`**

A client component that observes which phase section is in view and highlights that layer of the exploded static mark:

```tsx
"use client";

import { useEffect, useState } from "react";
import MarkStatic from "@/components/mark/MarkStatic";
import { METHOD_PHASES } from "@/lib/method";

export default function PhaseDiagram() {
  const [active, setActive] = useState<(typeof METHOD_PHASES)[number]["layer"]>("ring");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const layer = (e.target as HTMLElement).dataset.layer as typeof active;
            if (layer) setActive(layer);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    document.querySelectorAll("[data-layer]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return <MarkStatic variant="exploded" highlight={active} className="w-40 md:w-48" />;
}
```

- [ ] **Step 2: Create `src/app/method/page.tsx`**

```tsx
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PhaseDiagram from "@/components/sections/PhaseDiagram";
import { METHOD_PHASES, METHOD_PAGE, METHOD_FAQ } from "@/lib/method";

export const metadata: Metadata = {
  title: "The NexxVantage Method — Phased, Consultative Delivery",
  description:
    "How NexxVantage works: consultation first, MVP where it earns, phases planned against your revenue targets, enterprise hardening when enterprise arrives.",
};

export default function MethodPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <AnimatedSection>
        <p className="nv-overline mb-3">{METHOD_PAGE.hero.overline}</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{METHOD_PAGE.hero.heading}</h1>
        <p className="nv-lead mt-4 max-w-3xl">{METHOD_PAGE.hero.sub}</p>
      </AnimatedSection>

      <section className="mt-20">
        <AnimatedSection>
          <h2 className="font-display text-3xl font-bold">{METHOD_PAGE.consultation.heading}</h2>
          <p className="mt-4 max-w-3xl text-secondary">{METHOD_PAGE.consultation.body}</p>
        </AnimatedSection>
      </section>

      {/* Phases with sticky diagram */}
      <section className="mt-20 grid gap-12 md:grid-cols-[1fr_240px]">
        <div className="space-y-16">
          {METHOD_PHASES.map((p) => (
            <AnimatedSection key={p.num}>
              <article data-layer={p.layer} className="scroll-mt-28">
                <p className="nv-overline">{`Phase ${p.num}`}</p>
                <h3 className="mt-2 font-display text-2xl font-bold">{p.name}</h3>
                <p className="mt-3 max-w-2xl text-secondary">{p.deep}</p>
                <p className="mt-4 text-sm">
                  <span className="font-display font-semibold text-gold">You receive: </span>
                  <span className="text-secondary">{p.deliverable}</span>
                </p>
              </article>
            </AnimatedSection>
          ))}
        </div>
        <div className="hidden md:block">
          <div className="sticky top-28"><PhaseDiagram /></div>
        </div>
      </section>

      <section className="mt-24">
        <AnimatedSection>
          <div className="nv-card nv-card-accent p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold">{METHOD_PAGE.change.heading}</h2>
            <p className="mt-3 max-w-3xl text-secondary">{METHOD_PAGE.change.body}</p>
          </div>
        </AnimatedSection>
      </section>

      <section className="mt-24">
        <h2 className="font-display text-3xl font-bold">Questions we actually get asked</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {METHOD_FAQ.map((f) => (
            <div key={f.q} className="nv-plaque">
              <h3 className="font-display text-base font-semibold text-heading">{f.q}</h3>
              <p className="mt-2 text-sm text-secondary">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 text-center">
        <h2 className="font-display text-2xl font-bold">Map your phases</h2>
        <p className="nv-lead mx-auto mt-3">The consultation is the first deliverable — and it is yours to keep.</p>
        <div className="mt-6"><Button href="/contact">Book a consultation</Button></div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Verify + commit**

`npm run build` → green. `curl -s http://localhost:3000/method | grep -c "assemble outcomes"` → `1`.

```bash
git add src/app/method src/components/sections/PhaseDiagram.tsx
git commit -m "feat: method page with sticky phase diagram and FAQ"
```

### Task 14: Contact reframe

**Files:**
- Modify: `src/app/contact/page.tsx`
- Modify: `src/components/sections/ContactForm.tsx`
- Modify: `src/app/api/contact/route.ts`

**Interfaces:**
- Consumes: `CONTACT`, `TIMELINE_OPTIONS`, `BUDGET_OPTIONS`, `SERVICE_OPTIONS`; existing `FormFields` components and existing form submission flow (read both files first and preserve their validation/submit patterns)
- Produces: reframed contact page; API accepts optional `timeline: string`

- [ ] **Step 1: Update `src/app/contact/page.tsx`**

Read the existing page first; preserve its structure (metadata export, layout wrappers, `ContactInfo`). Replace the heading block with the consultation framing and add the steps column beside the form:

```tsx
// heading block:
<p className="nv-overline mb-3">Contact</p>
<h1 className="font-display text-4xl font-bold md:text-5xl">{CONTACT.headline}</h1>
<p className="nv-lead mt-4 max-w-2xl">{CONTACT.sub}</p>

// layout: two-column on md+ — form left (3/5), steps right (2/5):
<div className="mt-14 grid gap-12 md:grid-cols-5">
  <div className="md:col-span-3"><ContactForm /></div>
  <aside className="md:col-span-2">
    <h2 className="font-display text-lg font-semibold">What happens next</h2>
    <ol className="mt-6 space-y-6">
      {CONTACT.steps.map((s, i) => (
        <li key={s.title} className="flex gap-4">
          <span className="nv-badge nv-badge-primary h-7 w-7 flex-none items-center justify-center rounded-full font-display">{i + 1}</span>
          <div>
            <h3 className="font-display text-sm font-semibold text-heading">{s.title}</h3>
            <p className="mt-1 text-sm text-secondary">{s.description}</p>
          </div>
        </li>
      ))}
    </ol>
  </aside>
</div>
```

- [ ] **Step 2: Add timeline field to `ContactForm.tsx`**

Follow the exact pattern the form uses for the budget select (state, validation, payload). Add after budget:

```tsx
<SelectField
  id="timeline"
  label="Timeline"
  options={TIMELINE_OPTIONS}
  value={form.timeline}
  onChange={(v) => setField("timeline", v)}
/>
```

(Adapt names to the file's actual API — e.g. if it uses a `FormFields.tsx` `Select` export or plain state object; the field is optional, no validation required.)

- [ ] **Step 3: Accept `timeline` in `src/app/api/contact/route.ts`**

Add `timeline` wherever `budget` is read/forwarded (payload parsing, email body/log line). Optional string, no validation beyond length trim like budget.

- [ ] **Step 4: Verify + commit**

`npm run build` → green. `curl -s http://localhost:3000/contact | grep -c "Begin with a conversation."` → `1`; `grep -c "yours to keep"` → `1`.
Manual: submit the form with and without timeline; expect the same success behaviour as before.

```bash
git add src/app/contact src/components/sections/ContactForm.tsx src/app/api/contact/route.ts
git commit -m "feat: contact page reframed as consultation start with timeline field"
```

### Task 15: Navbar + Footer

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: updated `NAV_LINKS` (5 links), `SITE_CONFIG`, `PILLARS`
- Produces: nav with CTA button; footer with page + service-anchor links

- [ ] **Step 1: Navbar**

`NAV_LINKS` already carries the new links (Task 1) — the existing embossed nav renders them automatically. Add the CTA button as the last element of the desktop link row and at the bottom of the mobile drawer, using the existing `Button` or an `<a class="nv-btn nv-btn-primary nv-btn-sm">`:

```tsx
<Link href="/contact" className="nv-btn nv-btn-primary nv-btn-sm ml-2">
  Book a consultation
</Link>
```

Keep the theme toggle. Verify active-state logic handles `/work/[slug]` (highlight "Work" for any `/work*` path — if the current check is exact-match `pathname === href`, change to `href === "/" ? pathname === "/" : pathname.startsWith(href)`).

- [ ] **Step 2: Footer**

Three link columns + brand block, using existing footer classes:
- Brand: logo, `SITE_CONFIG.tagline`, "Dhaka · Working worldwide"
- Pages: the 5 nav links
- Services: `PILLARS.flatMap(p => p.services).map(s => ({label: s.title, href: \`/services#\${s.id}\`}))` + agencies link `/services#agencies`
- Social: existing `SITE_CONFIG.social` links

- [ ] **Step 3: Verify + commit**

`npm run build` → green. Visual: nav shows 5 links + gold CTA; footer anchors jump to service sections (scroll-mt is set in Task 12).

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
git commit -m "feat: navigation with consultation CTA and SEO footer links"
```

### Task 16: SEO layer

**Files:**
- Create: `src/components/seo/JsonLd.tsx`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx` (metadata only), `src/app/services/page.tsx`, `src/app/method/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/sitemap.ts`

**Interfaces:**
- Consumes: all page routes, `SITE_CONFIG`, `PILLARS`, `METHOD_FAQ`, `CASE_STUDIES`
- Produces: `JsonLd({ data })`; structured data on every page; complete sitemap

- [ ] **Step 1: Create `src/components/seo/JsonLd.tsx`**

```tsx
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
```

- [ ] **Step 2: Organization JSON-LD + skip link in `src/app/layout.tsx`**

Inside `<body>`, first children:

```tsx
<a href="#main" className="nv-skip-link">Skip to content</a>
<JsonLd
  data={{
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    slogan: SITE_CONFIG.tagline,
    address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
    sameAs: Object.values(SITE_CONFIG.social),
  }}
/>
```

Ensure the main content wrapper has `id="main"` (add to the `<main>` element in layout or each page's `main`; prefer one `<main id="main">` in layout if pages currently render their own `main` — reconcile so exactly one `main` landmark exists per page).

Also update the root `metadata` in layout: default title `NexxVantage — Premium Software Design Studio & Engineering House`, template `%s`, description from `SITE_CONFIG.description`.

- [ ] **Step 3: Per-page JSON-LD**

- `services/page.tsx`: one `JsonLd` with an array of `Service` objects: `PILLARS.flatMap(p => p.services).map(s => ({"@context":"https://schema.org","@type":"Service",name:s.title,description:s.description,provider:{"@type":"Organization",name:"NexxVantage"}}))`
- `method/page.tsx`: `FAQPage` built from `METHOD_FAQ`: `{"@context":"https://schema.org","@type":"FAQPage",mainEntity:METHOD_FAQ.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))}`
- `work/[slug]/page.tsx`: `CreativeWork` (`name`, `about: cs.summary`, `creator` Organization) + `BreadcrumbList` (Home → Work → title)

- [ ] **Step 4: Extend `src/app/sitemap.ts`**

Add `/work`, `/method`, and every `/work/${slug}` from `CASE_STUDIES` to the returned array, matching the file's existing entry shape.

- [ ] **Step 5: Verify + commit**

`npm run build` → green.
`curl -s http://localhost:3000 | grep -c "application/ld+json"` → ≥ `1`
`curl -s http://localhost:3000/method | grep -c "FAQPage"` → `1`
`curl -s http://localhost:3000/sitemap.xml | grep -c "/work/"` → `3`

```bash
git add -A
git commit -m "feat: JSON-LD structured data, skip link, sitemap for new routes"
```

### Task 17: Accessibility, degradation & performance gate

**Files:**
- Modify: only where audits below demand it

**Interfaces:**
- Consumes: the finished site
- Produces: verified spec §6.3 ladder, §8 accessibility, §6.6 performance budget

- [ ] **Step 1: Reduced-motion audit**

With OS/browser `prefers-reduced-motion: reduce` emulated (DevTools → Rendering): homepage must show static mark (no canvas), plain Work list (no pinning), static Method layout, no entrance animations. Fix any element that still animates.

- [ ] **Step 2: No-JS audit**

Disable JavaScript (DevTools) and load every route. All copy must be readable top to bottom; hero shows the static SVG mark. Sections rendered by client components (`WorkGallery`, `MethodCTA`, `Manifesto`, `HeroMovement`) ARE still server-rendered by Next (client components SSR their initial markup) — verify their text is present in view-source; if any content is gated behind `useEffect` state, refactor so initial render includes it.

- [ ] **Step 3: Keyboard audit**

Tab through the homepage: skip link appears first; every link/button shows the gold focus ring; the pinned gallery's links are reachable in DOM order; no focus trap.

- [ ] **Step 4: Bundle audit**

Run: `npm run build` and inspect the route table: `/work`, `/services`, `/method`, `/contact` first-load JS must NOT include the three.js chunk (their First Load JS should be roughly the shared baseline; `/` will be larger). If three leaks into shared chunks, ensure `MarkScene` is only imported via the `dynamic()` call in `MarkCanvas`.

- [ ] **Step 5: Lighthouse**

Run Lighthouse (mobile) against the production build (`npm run build && npm run start`) for `/`, `/work`, `/method`: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95. Iterate on failures (common: image sizing → add `sizes`; contrast → use `--nv-text-secondary` not `--nv-text-muted` for body text).

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: accessibility, degradation, and performance gates pass"
```

---

## Plan Self-Review Notes (already applied)

- Spec §4 order adjusted in Task 10 (WhyUs before MethodCTA) because Method+CTA share one sticky canvas — same beats, resolution stays last; flagged as a deliberate deviation.
- Old `SERVICES`/`VALUE_PROPS` deletion (Task 1) breaks the build until Tasks 10/12 — called out with a sequencing note; executors wanting green-at-every-commit should run Tasks 10 and 12 back-to-back.
- `HOME`, `PILLARS`, `CASE_STUDIES`, `METHOD_PHASES` names are used consistently across Tasks 5–16.
- Cover images are placeholders created in Task 8 and referenced by Tasks 8/11; all placeholder copy is tagged per the Global Constraints.
