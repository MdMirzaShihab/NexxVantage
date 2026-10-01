# NexxVantage — Project Rules

## Brand Identity
- Company: NexxVantage
- Tagline: "Premium by Design. Transparent by Default."
- Services: World-class Software, Premium SEO, MCP Development for AI Integration
- Tone: Expert, precise, premium, globally credible. Never playful or startup-casual.

## Design System
- Style: Refined Neumorphism
- Default theme: Dark (Midnight Blue #0F1E35 background)
- Light theme: Parchment (#F7F6F4 background), toggled via data-theme="light" on <html>
- All design tokens are in src/styles/nv-theme.css — USE CSS custom properties (var(--nv-*)), never hardcode colors

## Color Rules
- Primary: Midnight Blue #0F1E35 (bg-page in dark, text-heading in light)
- Accent: Gold #C9A84C (CTAs, borders, dividers, active states, focus rings)
- Body text dark: #F0F2F5 | Body text light: #1A1A2E (Charcoal)
- Secondary text: Midnight-200 in dark, Warm Gray #8B8680 in light
- NEVER use colors outside the brand palette. No blues, greens, reds for decoration.
- Status colors: Success #34D399 (dark) / #1A7A3C (light), Error #F87171 / #C0392B

## Typography Rules
- Headings/display/nav/buttons: font-family: var(--nv-font-display) → Space Grotesk
- Body/UI/forms/paragraphs: font-family: var(--nv-font-body) → Inter
- Code blocks: font-family: var(--nv-font-mono) → JetBrains Mono
- Overlines: .nv-overline (all-caps, gold, tracked, Space Grotesk 12px bold)
- Max body text width: 75ch (var(--nv-max-content))

## Neumorphism Rules
- Cards/panels: box-shadow: var(--nv-neu-shadow), hover: var(--nv-neu-shadow-lg)
- Buttons: rest: var(--nv-neu-shadow-sm), hover: var(--nv-neu-gold-glow), active: var(--nv-neu-inset-sm)
- Inputs/textareas: var(--nv-neu-inset-sm), focus adds gold ring + var(--nv-neu-inset)
- Code blocks: var(--nv-neu-inset)
- Featured/CTA elements: var(--nv-neu-gold-glow) with 1px gold border
- Elevated elements (modals, dropdowns): var(--nv-neu-shadow-lg)
- Border radius: buttons var(--nv-radius-md) 0.5rem, cards var(--nv-radius-lg) 0.75rem
- NEVER use flat box-shadow on interactive elements. Everything has neumorphic depth.
- Elements must feel "extruded from" or "pressed into" the surface.

## Component Classes
When building UI, USE these existing CSS classes from nv-theme.css:
- Buttons: .nv-btn .nv-btn-primary | .nv-btn-secondary | .nv-btn-ghost (.nv-btn-sm, .nv-btn-lg)
- Cards: .nv-card .nv-card-accent | .nv-card-elevated | .nv-card-inset
- Inputs: .nv-input with .nv-label and .nv-helper-text
- Badges: .nv-badge .nv-badge-primary | .nv-badge-subtle | .nv-badge-outline
- Navigation: .nv-nav with .nv-nav-link (.active for current)
- Tables: .nv-table (thead gets midnight bg, gold text)
- Code: .nv-code (block) and .nv-code-inline
- Hero sections: .nv-hero (always midnight bg, white text, gold overline)
- Alt sections: .nv-section-alt (uses --nv-section-alt-bg)
- Footer: .nv-footer with .nv-footer-gold-rule div above it
- Typography: .nv-overline, .nv-tagline, .nv-lead
- Neumorphic utilities: .neu, .neu-sm, .neu-lg, .neu-inset, .neu-gold, .neu-interactive
- Theme toggle: .nv-theme-toggle with dark/light buttons

## Theme Toggle Implementation
- Default: dark (no data-theme attribute on <html>)
- Light: data-theme="light" on <html>
- Store preference: localStorage key "nv-theme"
- On page load: check localStorage, apply if "light"
- The .nv-theme-toggle component provides the UI

## Structural Rules
- Gold rule divider (.nv-divider) between major sections
- Ghost mark watermark (nexus node SVG at 3-4% opacity) in hero sections, positioned top-right
- Footer always has .nv-footer-gold-rule (2px gold line) above it
- Section overlines use .nv-overline before each section heading

## Code Quality
- Use TypeScript
- Use CSS custom properties, not Tailwind classes for brand colors (the tokens auto-switch themes)
- Keep components small and focused
- Do NOT change content or functionality — only visual styling
## Hero Hologram Film (in progress)
When the owner asks about the hero film, hologram video, Kling/Gemini prompts, keyframes or "where were we":
- Read `docs/production/hologram/RUNBOOK.md` first. Its **"Where things stand"** table is the source of truth for progress — resume at the first step not marked Done. Every prompt, setting and check command is in that file.
- Design authority: `docs/superpowers/specs/2026-09-30-hero-hologram-film-design.md`. Technical plan: `docs/superpowers/plans/2026-10-01-hero-hologram-film.md` (Tasks 1–3 done; 4–6 owner; 7–8 Claude once the Resolve master exists — run them with subagent-driven development).
- Approved and locked (do not reopen unless the owner asks): story "The Commission", robot R4 "The Halo", the hijab hologram client (`reference-pack/client-ref.jpeg`), the seven screens in `reference-pack/screens/`, square 1:1 muted autoplay loop in the hero's right column.
- Roles: the owner generates in Gemini, Kling and Resolve. Claude hands over the exact prompt from the runbook, runs the runbook's check commands on what the owner produces, looks at every image itself (including at 280 px), and says ACCEPT or what to regenerate.
- After the owner approves an image: copy it into `docs/production/hologram/reference-pack/`, mark the step Done in the runbook's status table, commit and push — that is how progress reaches the owner's other devices.
- On a new device, the working folder `~/NexxVantage-film/` will not exist: create it from the reference pack per RUNBOOK §0 (and `npm install`) before running any check.
