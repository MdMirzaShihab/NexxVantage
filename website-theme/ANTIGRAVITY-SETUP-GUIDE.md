# NexxVantage Theme — Google Antigravity Setup Guide

## Overview

This guide walks you through overhauling your Next.js website using Google Antigravity with the NexxVantage refined neumorphic theme. We'll use **Claude Opus 4.6** as the model (available on Max plan) in **Planning mode** for the best architectural outcomes.

---

## Step 1 — Open Your Project in Antigravity

Open your Next.js project folder in Google Antigravity.

---

## Step 2 — Select the Right Model

1. Open the **Agent Manager** (top of the chat panel)
2. Click the **model selector dropdown**
3. Select **Claude Opus 4.6**

> Claude Opus 4.6 is the strongest model for large refactors — it holds the full context of your codebase and the theme system simultaneously, understands nuanced design token relationships, and produces more deliberate, architecturally sound changes than faster models. Use it for the initial overhaul. You can switch to **Claude Sonnet 4.6** later for quick follow-up tweaks.

---

## Step 3 — Set Development Mode

In the Agent Manager, choose:

- **Mode:** `Review-driven development` (the agent will ask before making changes — important for a visual overhaul where you want to approve each file)
- **Terminal Policy:** `Auto` (let standard build/lint commands run automatically)

---

## Step 4 — Add the Theme Files to Your Project

Copy the three files from `MARKETING/website-theme/` into your Next.js project:

```
your-nextjs-project/
├── tailwind.config.js          ← REPLACE with the NV version
├── src/
│   └── styles/
│       └── nv-theme.css        ← ADD this file
│   └── app/
│       └── layout.tsx          ← IMPORT the CSS here
```

Add the Google Fonts to your root layout `<head>` or use `next/font`:

```
Space Grotesk (400, 500, 600, 700)
Inter (400, 500, 600, 700)
JetBrains Mono (400, 500)
```

Import the CSS:

```tsx
// app/layout.tsx (or _app.tsx)
import '@/styles/nv-theme.css'
```

---

## Step 5 — Create Project Rules File

Create a file at your project root called `AGENTS.md`:

```
your-nextjs-project/
├── AGENTS.md          ← CREATE THIS
├── tailwind.config.js
├── src/
│   └── ...
```

Paste the following content into `AGENTS.md`:

---

```markdown
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
```

---

## Step 6 — Use Planning Mode for the Initial Overhaul

Click the **Plan** toggle (or type `/plan`) in the Antigravity agent chat to activate Planning mode. This makes the agent build a full roadmap before writing code.

### The Prompt

Paste this into the Antigravity agent chat:

---

```
I'm overhauling my Next.js website's entire UI to adopt the NexxVantage
brand theme with refined neumorphism.

The theme system is already installed:
- tailwind.config.js has brand colors, fonts, and neumorphic shadow utilities
- src/styles/nv-theme.css has CSS custom properties + component classes
- Project rules are in AGENTS.md

READ both theme files thoroughly first.

Then plan and execute a full UI refactor across every file:

PHASE 1 — Foundation
- Root layout: set dark bg, import fonts, add theme toggle logic
- globals.css: remove conflicting styles, import nv-theme.css
- Shared components: Nav → .nv-nav, Footer → .nv-footer with .nv-footer-gold-rule

PHASE 2 — Components
- All buttons → .nv-btn variants with neumorphic shadows
- All cards → .nv-card with .nv-card-accent or .nv-card-elevated
- All inputs/forms → .nv-input with inset shadows and gold focus
- All badges/tags → .nv-badge variants
- All tables → .nv-table
- All code blocks → .nv-code

PHASE 3 — Pages
- Hero sections → .nv-hero with ghost mark watermark SVG
- Add .nv-overline before section headings
- Add .nv-divider between major sections
- Apply .nv-section-alt for alternating section backgrounds
- Ensure body text uses font-body, headings use font-display

PHASE 4 — Theme & Polish
- Implement theme toggle in nav (dark default, light = parchment)
- Verify all colors come from CSS custom properties (auto-switch)
- Add gold accent borders on featured/CTA elements
- Ensure neumorphic depth on every interactive element

Do NOT change text content, routing, or functionality.
Go file by file, show me each change for approval.
```

---

## Step 7 — Review Each File

Since you selected Review-driven development, the agent will present each change and wait for approval. For each file:

1. **Review the diff** — check that colors, fonts, and shadows match the brand
2. **Approve** or request adjustments
3. Move to the next file

---

## Step 8 — Follow-Up Prompts for Fine-Tuning

After the main overhaul, switch to **Fast mode** and use **Claude Sonnet 4.6** for quick targeted fixes:

```
The contact form inputs don't have neumorphic inset shadows yet.
Apply var(--nv-neu-inset-sm) and gold focus ring to all form fields.
```

```
The pricing section cards need .nv-pricing-card and the featured
card needs .nv-pricing-card-featured with gold glow shadow.
```

```
Add the ghost mark watermark SVG (nexus node at 4% opacity,
positioned absolute top-right) to the hero section.
```

```
The nav should have backdrop-filter: blur(12px) and position: sticky
with the neumorphic shadow.
```

```
Check all hardcoded color values (#xxx) across the codebase and
replace them with var(--nv-*) custom properties from the theme.
```

---

## Configuration Summary

| Setting | Value |
|---------|-------|
| IDE | Google Antigravity |
| Model (overhaul) | Claude Opus 4.6 |
| Model (follow-up) | Claude Sonnet 4.6 |
| Mode (overhaul) | Planning mode + Review-driven |
| Mode (follow-up) | Fast mode |
| Rules file | AGENTS.md at project root |
| Theme CSS | src/styles/nv-theme.css |
| Tailwind config | tailwind.config.js (replaced) |
| Default theme | Dark (Midnight Blue) |
| Light theme | data-theme="light" (Parchment) |
