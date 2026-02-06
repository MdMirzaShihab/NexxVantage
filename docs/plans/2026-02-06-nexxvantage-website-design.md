# NexxVantage Website Design Document

**Date:** 2026-02-06
**Domain:** nexxvantage.com
**Status:** Approved

---

## 1. Company Overview

NexxVantage is a software company focused on building scalable, top-end custom software. The company delivers premium service and experience with a focus on software development and AI-based solutions, leveraging the latest technologies and innovations.

---

## 2. Brand Identity

### Color Palette

| Role             | Color         | Hex       | Usage                                |
|------------------|---------------|-----------|--------------------------------------|
| Primary          | Emerald Green | `#00C853` | CTAs, key highlights, brand accent   |
| Primary Dark     | Deep Forest   | `#00391A` | Headers, hero backgrounds, nav       |
| Primary Light    | Mint Glow     | `#B9F6CA` | Subtle backgrounds, hover states     |
| Secondary        | Charcoal Black| `#0A0A0A` | Body text, dark sections             |
| Neutral Dark     | Slate         | `#1A1A2E` | Card backgrounds, footer             |
| Neutral Light    | Off-White     | `#F5F5F7` | Page backgrounds, spacing            |
| Accent           | Electric Lime | `#76FF03` | Code highlights, tech accents, glow  |
| Text Primary     | Pure White    | `#FFFFFF` | Text on dark backgrounds             |
| Text Secondary   | Cool Gray     | `#9E9E9E` | Muted text, captions                 |

### Typography

- **Headings:** Geist Sans — clean, modern, premium tech feel
- **Body:** Geist Sans
- **Code/Tech accents:** Geist Mono

### Visual Direction

- Dark-dominant aesthetic (premium tech — Vercel, Linear inspired)
- Green as the energy/accent color — bold without being overwhelming
- Electric lime accent for cutting-edge, futuristic AI feel
- 3D depth and floating elements inspired by Discord's website
- Glassmorphism on interactive elements (navbar, cards)

### Logo

- Text-based wordmark for launch
- Green accent on "Nexx", white on "Vantage"

---

## 3. Tech Stack & Architecture

### Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **3D & Animation:** React Three Fiber (Three.js) for hero 3D scene + Framer Motion for scroll animations
- **Deployment:** Vercel

### Key Dependencies

- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `framer-motion`

### Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── services/
│   │   └── page.tsx          # Services
│   ├── contact/
│   │   └── page.tsx          # Contact
│   └── layout.tsx            # Root layout (nav + footer)
├── components/
│   ├── ui/                   # Buttons, cards, inputs
│   ├── sections/             # Hero, ServiceCards, CTA, etc.
│   ├── three/                # 3D scene components
│   └── layout/               # Navbar, Footer
├── lib/                      # Utilities, constants
└── styles/                   # Global styles, Tailwind config
```

---

## 4. Pages

### 4.1 Home Page

The showpiece — dark, immersive, conversion-focused.

#### Navbar (sticky, glassmorphism)

- NexxVantage wordmark logo (left) — green accent on "Nexx"
- Nav links: Home, Services, Contact
- Primary CTA: "Book a Consultation" (green, subtle glowing box-shadow)
- Transparent on top, blurs to dark glass on scroll

#### Hero Section

- Full viewport height, deep dark background (`#0A0A0A`)
- 3D scene: Floating geometric shapes (cubes, icosahedrons, torus knots) softly glowing in emerald/lime green, slowly rotating, parallax depth layers
- Mouse-reactive movement on 3D elements
- **Headline:** "We Build Software That Scales"
- **Subtext:** "Custom software & AI solutions engineered for performance, built for the future."
- **CTAs:** "Book a Consultation" (primary green) + "Our Services" (ghost/outline button)

#### Services Overview (4 cards)

- Section heading: "What We Do"
- 4 cards in a grid with icon, title, short description
- Dark glass background, green border glow on hover, subtle lift animation
- Links to full Services page

#### Why NexxVantage

- Section heading: "Why Choose Us"
- 3-4 value propositions in staggered layout with scroll-reveal
- Props: "Future-Ready Tech", "Scalable Architecture", "Client-First Approach", "AI-Powered Innovation"
- Each with 1-liner and subtle green icon/accent line
- Optional animated counter stats (placeholder numbers for launch)

#### CTA Banner

- Full-width, gradient background (deep forest to black)
- **Text:** "Ready to Build Something Extraordinary?"
- **Buttons:** "Book a Consultation" + "Get in Touch"
- Subtle floating 3D particles/mesh in background

#### Footer

- Dark slate background (`#1A1A2E`)
- Logo, nav links, social media icons
- Contact email, copyright
- Clean and minimal

### 4.2 Services Page

#### Hero Banner (small)

- **Heading:** "Our Services"
- **Subtext:** "End-to-end solutions from concept to deployment"
- Subtle 3D background element (lighter version of homepage)

#### 4 Service Blocks (stacked, alternating left-right layout)

1. **Custom Software Development**
   - Web apps, mobile apps, enterprise platforms — tailored to your business
   - Key points: Full-stack development, scalable architecture, agile delivery

2. **AI & Machine Learning Solutions**
   - Intelligent automation, predictive systems, AI-powered products
   - Key points: Custom AI models, NLP, computer vision, LLM integration

3. **Cloud & Scalable Architecture**
   - Cloud-native infrastructure built to grow with you
   - Key points: AWS/GCP/Azure, microservices, CI/CD, DevOps

4. **UI/UX Design**
   - Premium interfaces that users love
   - Key points: Design systems, prototyping, user research, responsive design

Each block has an icon or abstract 3D visual on the opposite side.

#### Bottom CTA

- "Have a project in mind?" + "Book a Consultation" button

### 4.3 Contact Page

#### Hero Banner (small)

- **Heading:** "Let's Build Together"
- **Subtext:** "Tell us about your project or book a call — we'd love to hear from you"

#### Two-Column Layout

**Left — Contact Form:**

- Name (required)
- Email (required)
- Company name (optional)
- Service interested in (dropdown: 4 services + "Not sure yet")
- Project brief / message (textarea)
- Budget range (optional dropdown: "$5k-$15k", "$15k-$50k", "$50k+", "Let's discuss")
- Submit: "Start Your Project" (green, full-width)
- Form backend: Formspree or Resend for launch

**Right — Other Ways to Connect:**

- Book a Call — Calendly/Cal.com embed or link
- Email — hello@nexxvantage.com
- Location — remote-first or city/country
- Social links — LinkedIn, X/Twitter, GitHub

**Bottom:** "We typically respond within 24 hours"

---

## 5. Global Design System

### Dark Mode Only

No light mode toggle — fully dark-themed.

### Animation & Motion

- Hero: Full 3D scene with React Three Fiber — floating geometries, mouse-reactive
- Services page: Lighter 3D element in hero banner (performance)
- Contact page: No 3D — fast and focused
- Hover effects: 3D tilt on cards (CSS transforms), green glow borders
- Page transitions: Framer Motion (fade + subtle slide)
- Scroll-triggered reveal animations on all sections (fade up, stagger children)
- No heavy loading screen — progressive render

### Responsive Behavior

- Mobile-first Tailwind approach
- 3D scene simplified or replaced with static gradient + floating CSS shapes on mobile
- Hamburger menu with slide-in drawer on mobile
- Cards stack to single column
- CTAs go full-width on mobile

### SEO & Performance

- Next.js metadata API for titles, descriptions, Open Graph tags
- Semantic HTML throughout
- Optimized images via `next/image`
- Lighthouse target: 90+ across all metrics

---

## 6. Primary CTAs

- **Primary:** "Book a Consultation" — links to Calendly/Cal.com
- **Secondary:** "Get in Touch" / "Start Your Project" — links to Contact form

---

## 7. Content Needed (Placeholder for Launch)

- Company taglines and descriptions
- Service descriptions (detailed)
- Team bios (if applicable)
- Social media links
- Consultation booking link (Calendly/Cal.com)
- Contact email

---

## 8. Future Expansion (Post-Launch)

- Portfolio / Case Studies page (when real projects are available)
- Blog / Insights page (SEO, thought leadership)
- About page (team, story, mission)
- CMS integration (for blog and portfolio)
- Light mode toggle
