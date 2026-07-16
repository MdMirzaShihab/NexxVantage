# NexxVantage Website Redesign — Design Spec

**Date:** 2026-07-16
**Status:** Approved by owner (brainstorming session)
**Scope:** Full redesign of the NexxVantage marketing site — homepage, Work, Services, Method, Contact — with an immersive "hybrid neumorphic 3D" design system, premium content strategy, and SEO-first architecture.

---

## 1. Context

NexxVantage is a Dhaka-based, worldwide-serving **design studio × software engineering house** targeting both international clients (US/EU/Gulf) and Bangladesh's premium segment. The site must read as luxury/high-end — *not* as a generic AI-generated agency layout — while staying fast and fully SEO-crawlable.

**Existing codebase** (all of this stays; nothing is replaced wholesale):

- Next.js 14 App Router, TypeScript, Tailwind 3
- `src/styles/nv-theme.css` — Design System v2: midnight `#0F1E35` + gold `#C9A84C` brand colors (immutable), full neumorphic shadow tokens (`--nv-neu-*`), dark default + parchment light mode via `data-theme="light"`
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (mono) — **keep all three**
- Deps already installed and to be used: `@react-three/fiber` v8, `@react-three/drei`, `three`, `motion` (Framer Motion v12)
- `@lottiefiles/dotlottie-react` + the robot Lottie hero — **to be removed** (replaced by the mark)
- Old three components in `src/components/three/` (`HeroScene`, `FloatingGeometries`, `MouseTracker`, `HeroSceneLoader`) — superseded; delete and rebuild per this spec
- Existing pages: `/` (Hero, ServicesOverview, WhyNexxVantage, CTABanner), `/services`, `/contact`, plus `/api/contact`, sitemap, robots, opengraph-image

## 2. Design Direction — "The Movement"

The visual world is **haute horlogerie**: midnight + gold + soft-machined neumorphic surfaces = a luxury watchmaker's atelier. Software presented as a precision-machined mechanism.

**The signature element** (the one memorable thing): the NexusMark logo (X-frame struts, 4 corner nodes, orbital ring, core) rebuilt as a **3D machined mechanism** — midnight metal with gold-inlaid edges, under a single warm key light. It:

1. Floats assembled in the hero, idle-rotating, tilting toward the cursor
2. **Explodes into its layers on scroll** in the Method section — like a watch movement disassembling — each layer annotating one delivery phase
3. **Reassembles** behind the final CTA

The exploded view is not decoration; it is the sales argument rendered: *no sealed boxes — every layer visible, assembled in the order the business needs.*

**Secondary motif** (whisper volume, borrowed from a rejected direction): a faint gold sheen that follows the cursor across neumorphic panels (pillar cards, work panels). Never on text, never animated on its own.

**Contained immersive moment #2**: the homepage "Selected Work" section is a **pinned depth-dolly** — scrolling dollies a camera through 2–4 case-study panels stacked in Z-space (CSS 3D, no WebGL). Bounded and skippable; the rest of the page scrolls normally. This was explicitly chosen over a whole-page fly-through (rejected: scroll-jacking, SEO/accessibility cost, template-adjacent).

**Rhythm rule:** wow → calm → calm → wow → wow → calm → resolution. Calm sections hold still; the two wow systems get the entire motion budget.

## 3. Verbal Identity

- **Hero headline (locked by owner):** `Create your own Dimensions.` — "Dimensions" in gold. The word is made literal by the design (exploded dimensions, gallery travelled in Z).
- **Hero subline:** "NexxVantage is a design studio and engineering house crafting premium digital products — designed like couture, engineered like a fine movement."
- **Manifesto:** "Anyone can build what you ask for. We build what your business needs — phase by phase, in the order that pays."
- **Tagline (retained, secondary usage — footer/meta):** "Premium by Design. Transparent by Default."
- **Voice rules:** assured, concrete, no filler, no exclamation marks, sentence case for UI, active verbs on all controls ("Book a consultation", never "Submit"). Luxury is specificity, not adjectives. British-neutral spelling is acceptable but be consistent (existing copy uses "optimised" — keep -ise site-wide).

## 4. Homepage — seven sections, final copy

### 4.1 Hero — The Movement *(wow, WebGL)*

- Overline: `DESIGN STUDIO × SOFTWARE ENGINEERING — DHAKA · WORLDWIDE`
- H1: `Create your own Dimensions.` (gold on "Dimensions.")
- Subline: as §3
- CTAs: `Book a consultation` (primary → /contact), `See the craft` (ghost → /work)
- Right side (desktop): the 3D mark. Mobile: mark sits behind/above headline at reduced scale, no cursor tilt.
- Motion: page-load — headline rises line by line (≤ 80ms stagger); mark cross-fades from static SVG to WebGL with one gold glint. Idle: slow rotation + gentle float. Cursor: parallax tilt (max ~10°).
- Layout note: full viewport height (100svh), bottom gradient fade into page background (pattern already in current `HeroSection`).

### 4.2 Manifesto *(calm, pure HTML)*

- One typographic statement, centered, max-width ~640px, display face at clamp(1.5rem→2.25rem):
  - Line 1 (muted): "Anyone can build what you ask for."
  - Line 2 (heading color, gold on final clause): "We build what your business needs — **phase by phase, in the order that pays.**"
- Motion: words brighten from 20% → 100% opacity as they cross viewport middle (scroll-linked). No translation.

### 4.3 The Two Crafts *(calm)*

Twin raised neumorphic panels (`--nv-neu-shadow`), equal width, cursor-sheen on hover:

| | Pillar 1 | Pillar 2 |
|---|---|---|
| Overline | `01 · THE STUDIO` | `02 · THE ENGINEERING HOUSE` |
| Heading | Design that outdresses your competition | Software built from your business plan backward |
| Body | Bespoke websites for high-end brands — tailored to your identity, engineered to convert. No templates. Nothing off a shelf. | Enterprise-grade custom products — ERP, AI & MCP, cloud — assembled around your goals, your timeline, your revenue targets. |
| Link | Explore the Studio → `/services#studio` | Explore the Engineering House → `/services#engineering` |

Motion: rise 20px + fade on scroll-in, 2-panel stagger.

### 4.4 Selected Work — The Gallery *(wow, pinned CSS dolly)*

- Overline `SELECTED WORK`, H2 `A short walk through the gallery`
- Pinned section (~300vh scroll length for 3 panels). Scroll progress dollies camera through panels at z = 0 / −280px / −560px (values tuned in build). Panel passing the camera fades/blurs out.
- Each panel (real HTML, server-rendered): client sector overline (`CLIENT · HOSPITALITY`), one-line project title, cover image, one outcome line with the number in gold (e.g. "Direct bookings **+38%** in the first quarter").
- Escape hatch: persistent `View all work →` link (→ /work) visible during the pinned scroll.
- **Mobile/touch: no pinning.** Render as a horizontal scroll-snap swipe deck.
- Content: 2–4 case studies from `constants.ts` data (see §10 placeholder policy).

### 4.5 The Method — Exploded View *(wow, WebGL — the signature moment)*

- Overline `THE NEXXVANTAGE METHOD`, H2 `We don't sell software. We assemble outcomes.`
- The hero's mark returns (sticky within section) and explodes as scroll progresses; each separated layer aligns with its phase row (plain HTML, fades in beside its layer):

| # | Phase | Copy |
|---|---|---|
| 01 | Consult | Your goal, your problems, your plan — defined before a line is written. |
| 02 | MVP | The problems that matter most, solved first. Live, in production, earning. |
| 03 | Evolve | Phases planned with your business team — features land when revenue says so. |
| 04 | Scale | Enterprise-grade hardening when enterprise arrives. Not a day sooner than useful. |

- Layer mapping: ring→Consult, struts→MVP, nodes→Evolve, core→Scale.
- Link: `Read the full method →` `/method`

### 4.6 Why NexxVantage *(calm)*

- Overline `WHY TEAMS CHOOSE US`, H2 `Built senior. Priced boutique. Run transparent.`
- Four **recessed** plaques (`--nv-neu-inset` — carved into the surface, not floating), 2×2 grid, no icons:
  1. **Senior hands only** — Every project led and built by senior engineers and designers. No handoffs to juniors.
  2. **Open project board** — Weekly reports and live access to the board. Trust built on visibility, not promises.
  3. **Hybrid expertise** — Engineering, finance, AI and design under one roof — we understand the business, not just the build.
  4. **Agile that follows revenue** — Sprints planned against your business calendar, so delivery dates mean something.
- Motion: stagger fade-up only.

### 4.7 CTA — Reassembly *(resolution, WebGL shared with 4.5)*

- Overline `BEGIN`, H2 `Every engagement starts with a conversation, not a quote.`
- Sub: "A consultation session to map your goal, your problems, and the order in which to solve them. Then we build exactly that."
- Button: `Book a consultation` → /contact (neumorphic press on click).
- Motion: the exploded layers glide home with a soft settle and a single gold glint on contact.

## 5. Pages

### 5.1 Work — `/work` and `/work/[slug]`

- **Index:** intro line + one full-width panel per project (no thumbnail grids — with few projects, each gets a full course). Panel = cover, client sector, title, one outcome number, link.
- **Case study page template** (fixed order, mirrors the Method):
  1. **Brief** — client (anonymized where NDA: "A Dhaka-based law firm"), sector, engagement type, timeline
  2. **The problem, in the client's words** — one quoted paragraph (`blockquote`, gold left rule — existing `.nv-testimonial` style)
  3. **What we built first, and why** — the phased decision narrative
  4. **The outcome** — 1–3 measured numbers, stated plainly
  5. Footer CTA → /contact
- Motion: subtle Z-parallax on imagery only. This page's job is credibility; it holds still.
- Data-driven: case studies defined in `src/lib/constants.ts` (or `src/lib/work.ts`) as typed objects; pages generated via `generateStaticParams`.

### 5.2 Services — `/services`

Restructured around the pillars, same order as homepage:

1. **The Studio** (`id="studio"`) — intro para, then service blocks: Brand-first web design; UI/UX & design systems. Copy leads with the client's brand, not our tools.
2. **The Engineering House** (`id="engineering"`) — intro para, then service blocks: Custom software development; ERP & enterprise systems; AI, MCP servers & intelligent automation; Cloud & infrastructure. Each block keeps existing keyPoints and adds one Method tie-line ("Scoped in consultation, delivered in phases.").
3. **For agencies** — quiet bottom block: White-label development partnership (existing copy retained). Different buyer, visually separated, smaller.

Each service is an `h2`/`h3` anchor section with `Service` JSON-LD, structured so services can graduate to standalone pages later without redesign. Existing `SERVICES` array in constants is reshaped into `PILLARS` (studio/engineering grouping) + `AGENCY_OFFER`.

### 5.3 Method — `/method` (new page; named Method, not Process)

The differentiator page. Sections:

1. **Hero statement** — "We don't sell software. We assemble outcomes." + one paragraph on building *how* you want, not one-shot *what* you asked.
2. **The consultation session** — what actually happens: goals defined, problems ranked, plan mapped. Deliverable named: a written recommendation.
3. **The four phases in depth** — one section each (Consult / MVP / Evolve / Scale): what happens, what the client receives, how the next phase is planned against revenue targets. Sticky mini-diagram of the mark's layers tracks the current phase (SVG, whisper-volume echo of the homepage signature).
4. **"Change is cheap here"** — the agile honesty section: priorities will change; the process is built so change is cheap, not catastrophic.
5. **FAQ** (5–6 real questions: How long until MVP? · How does pricing work per phase? · What if we change direction mid-build? · Who owns the code? · How do you report progress? · Do you work with existing teams?) — marked up as `FAQPage` JSON-LD.
6. CTA → /contact.

### 5.4 Contact — `/contact` (reframed)

- H1: `Begin with a conversation.`
- Form mirrors the consultation agenda: name, email, company, what are you building / what problem are you solving (textarea), budget range (existing `BUDGET_OPTIONS`), timeline (new select: "ASAP / 1–3 months / 3–6 months / exploring").
- Beside the form, **What happens next** (numbered, three steps):
  1. A senior partner replies within 24 hours — not a sales rep.
  2. A consultation call to map your goal and problems.
  3. A written recommendation — yours to keep, whether or not we build it.
- Keep existing `/api/contact` route; add `timeline` field.

### 5.5 Navigation & Footer

- **Navbar:** Home · Work · Services · Method · Contact + gold `Book a consultation` button (→ /contact). Keep existing embossed nav-board component and mobile drawer; update `NAV_LINKS`.
- **Footer:** tagline ("Premium by Design. Transparent by Default."), page links, service anchor links (internal SEO), "Dhaka · Working worldwide", social links, gold rule top (existing footer patterns).

## 6. Motion & Technical System

### 6.1 WebGL — the mark

- Built **procedurally** in react-three-fiber (no model files): torus (ring), 4 cylinders (struts), 4 spheres (nodes), lathed disc (core). Materials: midnight metal (high metalness, mid roughness) with gold (`#C9A84C`) accent material on edges/nodes/core. Lighting: one warm key light (gold-tinted), cool rim light, low ambient.
- **SSR-first:** an inline static SVG mark renders server-side (this is the LCP element); the canvas lazy-loads (`next/dynamic`, `ssr: false`) after first paint and cross-fades in.
- Two canvas instances: one in the hero; one spanning Method→CTA (sticky). Rendering pauses when off-screen (`frameloop` gating via IntersectionObserver). `dpr` capped at `[1, 2]`.
- Scroll drive: Framer Motion `useScroll` progress values passed into r3f state (no drei ScrollControls — content must remain normal HTML flow).
- Explosion choreography: layer offsets along local Z with per-layer ease; assembly state `t ∈ [0,1]` is the single source of truth (hero t=0, Method t→1 scrubbed by scroll, CTA t→0 with settle).

### 6.2 The dolly (Selected Work)

- No WebGL. Pinned container (`position: sticky` inside a tall section), CSS 3D `perspective` + `useScroll`/`useTransform` mapping scroll → `translateZ` of the plane stack.
- Touch devices: horizontal scroll-snap deck, no pinning.

### 6.3 Degradation ladder (must all be built, not aspirational)

1. Full: WebGL + scroll choreography + cursor tilt + sheen
2. `prefers-reduced-motion`: static exploded diagram (SVG), normal scroll, no pinning, no tilt, instant text
3. No WebGL / low-end (feature-detect + `deviceMemory`/`hardwareConcurrency` heuristic): layered SVG with CSS 3D transforms (visually proven in brainstorm mockups)
4. No JS: complete semantic HTML page, static SVG mark, all copy readable

### 6.4 Light mode policy (owner-approved)

The three 3D moments (Hero, Method, CTA) **stay midnight in both themes** — the "velvet jewelry box" rule. All calm sections follow the existing parchment light-mode tokens. The 3D scene is *not* re-lit for light mode.

### 6.5 Motion discipline

- All easing/durations from tokens: `--nv-ease`, 200ms/400ms; scroll-linked (scrubbed) choreography preferred over autoplaying animation
- Stagger ≤ 80ms; max one gold glint per viewport; text never parallaxes; calm sections limited to fade/rise-in only
- Every `motion.*` element respects `useReducedMotion`

### 6.6 Performance budget

- Lighthouse mobile ≥ 90 (Performance), CLS ≈ 0, LCP = hero text/SVG (not canvas)
- three.js chunk (~200KB gz) deferred until after first paint; no 3D on `/work`, `/services`, `/contact` (zero three.js in those bundles)
- Remove `@lottiefiles/dotlottie-react` dependency and `public/lottie/` assets

## 7. SEO Plan

- All copy server-rendered; motion/3D never gates content
- Per-page unique `metadata` (title ≤ 60 chars, description ≤ 155): Home "NexxVantage — Premium Software Design Studio & Engineering House"; Work, Services, Method, Contact + per-case-study
- JSON-LD: `Organization` (site-wide, in layout), `Service` (services page blocks), `FAQPage` (/method), `CreativeWork` per case study, `BreadcrumbList` on nested pages
- Semantic structure: exactly one `h1` per page; section `h2`s; landmarks (`header`/`main`/`footer`/`nav`)
- `sitemap.ts` extended with /work, /work/[slug], /method; `opengraph-image` kept
- Internal links: pillars → service anchors; method section → /method; work panels → case pages; footer service links

## 8. Accessibility

- WCAG AA contrast on all text (gold-on-midnight passes for large text/accents; body text uses `--nv-text-primary`)
- Visible keyboard focus on all interactive elements (gold focus ring token)
- Pinned gallery: keyboard users get standard sequential access to panels (they're in DOM order); skip link past pinned section
- `prefers-reduced-motion` honored globally (see ladder tier 2); decorative canvas is `aria-hidden`
- Form fields labeled, error text explains what to fix

## 9. Component Inventory

**New:** `MarkStatic` (inline SVG, SSR), `MarkCanvas` (r3f mark + materials + lights), `HeroMovement` (hero section), `Manifesto`, `TwoCrafts` (pillars), `WorkGallery` (pinned dolly + swipe-deck fallback), `MethodExploded` (scroll-scrubbed section), `ReassemblyCTA`, `SheenPanel` (cursor-sheen wrapper), `PhaseDiagram` (sticky SVG on /method), Work index + case-study page components, Method page sections.

**Modified:** `page.tsx` (new section order), `Navbar` (links + CTA button), `Footer` (links), `constants.ts` (NAV_LINKS, PILLARS regrouping, CASE_STUDIES, TIMELINE_OPTIONS, method/FAQ content), `services/page.tsx` (pillar structure), `contact/page.tsx` (reframe + timeline field), `ContactForm`, `/api/contact` (timeline), `sitemap.ts`.

**Removed:** `components/lottie/*`, `components/three/*` (old), `HeroFallback` (superseded by `MarkStatic`), `public/lottie/`, `@lottiefiles/dotlottie-react` dep, `SERVICES` flat usage on homepage (`ServicesOverview`, `WhyNexxVantage`, `CTABanner` replaced by new sections; `HeroSection` replaced by `HeroMovement`).

## 10. Placeholder policy (launch gate, not spec gap)

Owner has 2–4 showable projects but has not yet supplied details. Build with **clearly-marked placeholder case studies** (the three used in the storyboard: hospitality booking platform / legal ERP / retail flagship site) in a single data file, each field tagged `// PLACEHOLDER — replace with real client data before launch`. Outcome numbers in placeholders must be obviously illustrative. Swapping real data must require **only** editing that data file.

## 11. Out of scope (YAGNI)

Blog/insights, CMS integration, i18n/Bangla, pricing page, careers, testimonials carousel, chat widgets, analytics beyond what exists, full light-mode 3D re-lighting, per-service standalone pages (structure allows later).

## 12. Success criteria

1. Homepage delivers the 7-section flow with both wow systems working and all four degradation tiers functional
2. All five pages ship with the copy in this spec (placeholders only where §10 allows)
3. Lighthouse mobile: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95 on all pages
4. Every page fully readable with JavaScript disabled
5. Light-mode toggle works everywhere; 3D moments stay midnight by design
