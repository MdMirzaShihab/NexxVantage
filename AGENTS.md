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