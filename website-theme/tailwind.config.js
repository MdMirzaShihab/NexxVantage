/** @type {import('tailwindcss').Config} */

/*
 * NexxVantage — Official Tailwind CSS Configuration v2
 * Premium by Design. Transparent by Default.
 *
 * DEFAULT THEME: Dark (Midnight Blue backgrounds)
 * LIGHT THEME:   Parchment backgrounds — toggle with data-theme="light"
 *
 * Services: World-class Software · Premium SEO · MCP Development for AI Integration
 *
 * Color System: Midnight Blue (authority) · Gold Rule (precision accent) · White (clarity)
 * Typography: Space Grotesk (display/headings) · Inter (body/UI)
 */

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    /* ───────────────────────────────────────────────
     * FONT FAMILIES
     * Space Grotesk — headings, display, wordmark
     * Inter — body text, UI elements, captions
     * ─────────────────────────────────────────────── */
    fontFamily: {
      display: ['"Space Grotesk"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'],
      body:    ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'],
      mono:    ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
    },

    /* ───────────────────────────────────────────────
     * FONT SIZES — Brand Type Scale
     * ─────────────────────────────────────────────── */
    fontSize: {
      'xs':      ['0.75rem',  { lineHeight: '1.4' }],    // 12px — fine print
      'sm':      ['0.875rem', { lineHeight: '1.5' }],    // 14px — captions, labels
      'base':    ['1rem',     { lineHeight: '1.6' }],    // 16px — body default (web)
      'lg':      ['1.125rem', { lineHeight: '1.55' }],   // 18px — body large
      'xl':      ['1.25rem',  { lineHeight: '1.4' }],    // 20px — lead paragraph
      '2xl':     ['1.5rem',   { lineHeight: '1.3' }],    // 24px — H3
      '3xl':     ['1.75rem',  { lineHeight: '1.25' }],   // 28px — H2
      '4xl':     ['2.25rem',  { lineHeight: '1.2' }],    // 36px — H1
      '5xl':     ['3rem',     { lineHeight: '1.1' }],    // 48px — Display
      '6xl':     ['3.75rem',  { lineHeight: '1.05' }],   // 60px — Hero
      '7xl':     ['4.5rem',   { lineHeight: '1' }],      // 72px — Hero XL
    },

    extend: {
      /* ───────────────────────────────────────────────
       * COLOR PALETTE — NexxVantage Brand
       * ─────────────────────────────────────────────── */
      colors: {
        // Primary — Midnight Blue
        midnight: {
          DEFAULT: '#0F1E35',
          50:  '#E8EBF0',
          100: '#C5CCD8',
          200: '#8B99B1',
          300: '#516689',
          400: '#1A3352',
          500: '#0F1E35',  // Brand primary
          600: '#0C1829',
          700: '#09121E',
          800: '#060C14',
          900: '#030609',
        },

        // Accent — Gold Rule
        gold: {
          DEFAULT: '#C9A84C',
          50:  '#FBF7EC',
          100: '#F5ECD0',
          200: '#EBDA9F',
          300: '#E0C76F',
          400: '#D4B55D',
          500: '#C9A84C',  // Brand accent
          600: '#B89539',
          700: '#96792E',
          800: '#745D23',
          900: '#524119',
        },

        // Neutral — Charcoal (body text)
        charcoal: {
          DEFAULT: '#1A1A2E',
          50:  '#EDEDF0',
          100: '#D4D4DA',
          200: '#A9A9B5',
          300: '#7E7E90',
          400: '#4C4C65',
          500: '#1A1A2E',  // Brand body text
          600: '#151525',
          700: '#10101C',
          800: '#0B0B13',
          900: '#06060A',
        },

        // Supporting — Warm Gray
        warmgray: {
          DEFAULT: '#8B8680',
          50:  '#F5F4F3',
          100: '#E8E6E4',
          200: '#D1CDC9',
          300: '#BAB4AE',
          400: '#A39D97',
          500: '#8B8680',  // Brand secondary text
          600: '#706B66',
          700: '#55514D',
          800: '#3A3733',
          900: '#1F1D1A',
        },

        // Supporting — Parchment
        parchment: {
          DEFAULT: '#F7F6F4',
          50:  '#FDFCFB',
          100: '#FAF9F7',
          200: '#F7F6F4',  // Brand subtle background
          300: '#EFEEE9',
          400: '#E5E3DC',
          500: '#DBD8CF',
        },
      },

      /* ───────────────────────────────────────────────
       * SPACING & LAYOUT
       * ─────────────────────────────────────────────── */
      maxWidth: {
        'content': '75ch',       // Max line length for body text (brand rule)
        'narrow':  '48rem',      // Narrow content column
        'wide':    '80rem',      // Wide content area
        'site':    '90rem',      // Max site width
      },

      /* ───────────────────────────────────────────────
       * BORDER RADIUS
       * ─────────────────────────────────────────────── */
      borderRadius: {
        'brand': '0.375rem',     // 6px — primary radius (subtle, geometric)
        'card':  '0.5rem',       // 8px — card radius
        'pill':  '9999px',       // Pill shape for tags/badges
      },

      /* ───────────────────────────────────────────────
       * BOX SHADOWS — Premium, restrained depth
       * ─────────────────────────────────────────────── */
      boxShadow: {
        'brand-sm': '0 1px 3px 0 rgba(15, 30, 53, 0.06), 0 1px 2px -1px rgba(15, 30, 53, 0.06)',
        'brand':    '0 4px 12px -2px rgba(15, 30, 53, 0.08), 0 2px 6px -2px rgba(15, 30, 53, 0.04)',
        'brand-lg': '0 12px 32px -4px rgba(15, 30, 53, 0.12), 0 4px 12px -4px rgba(15, 30, 53, 0.06)',
        'brand-xl': '0 24px 48px -8px rgba(15, 30, 53, 0.16), 0 8px 24px -6px rgba(15, 30, 53, 0.08)',
        'gold':     '0 4px 12px -2px rgba(201, 168, 76, 0.25)',

        // Neumorphic — Dark mode (Midnight Blue surfaces)
        'neu-dark':       '6px 6px 14px rgba(3,6,9,0.6), -6px -6px 14px rgba(26,51,82,0.25)',
        'neu-dark-sm':    '3px 3px 8px rgba(3,6,9,0.5), -3px -3px 8px rgba(26,51,82,0.2)',
        'neu-dark-lg':    '10px 10px 24px rgba(3,6,9,0.7), -10px -10px 24px rgba(26,51,82,0.2)',
        'neu-dark-inset': 'inset 3px 3px 8px rgba(3,6,9,0.5), inset -3px -3px 8px rgba(26,51,82,0.2)',
        'neu-dark-gold':  '6px 6px 14px rgba(3,6,9,0.6), -6px -6px 14px rgba(26,51,82,0.25), 0 0 20px rgba(201,168,76,0.12)',

        // Neumorphic — Light mode (Parchment surfaces)
        'neu-light':       '6px 6px 14px rgba(180,175,168,0.45), -6px -6px 14px rgba(255,255,255,0.85)',
        'neu-light-sm':    '3px 3px 8px rgba(180,175,168,0.35), -3px -3px 8px rgba(255,255,255,0.8)',
        'neu-light-lg':    '10px 10px 24px rgba(180,175,168,0.5), -10px -10px 24px rgba(255,255,255,0.9)',
        'neu-light-inset': 'inset 3px 3px 8px rgba(180,175,168,0.4), inset -3px -3px 8px rgba(255,255,255,0.8)',
        'neu-light-gold':  '6px 6px 14px rgba(180,175,168,0.45), -6px -6px 14px rgba(255,255,255,0.85), 0 0 20px rgba(201,168,76,0.15)',
      },

      /* ───────────────────────────────────────────────
       * TRANSITIONS
       * ─────────────────────────────────────────────── */
      transitionDuration: {
        'brand': '200ms',
      },
      transitionTimingFunction: {
        'brand': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },

      /* ───────────────────────────────────────────────
       * KEYFRAMES & ANIMATIONS
       * ─────────────────────────────────────────────── */
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gold-shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'fade-in':      'fade-in 0.4s ease-out forwards',
        'gold-shimmer': 'gold-shimmer 3s ease-in-out infinite',
      },

      /* ───────────────────────────────────────────────
       * TYPOGRAPHY PLUGIN OVERRIDES
       * ─────────────────────────────────────────────── */
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body':       '#1A1A2E',
            '--tw-prose-headings':   '#0F1E35',
            '--tw-prose-links':      '#0F1E35',
            '--tw-prose-bold':       '#0F1E35',
            '--tw-prose-counters':   '#8B8680',
            '--tw-prose-bullets':    '#C9A84C',
            '--tw-prose-hr':         '#C9A84C',
            '--tw-prose-quotes':     '#0F1E35',
            '--tw-prose-quote-borders': '#C9A84C',
            '--tw-prose-captions':   '#8B8680',
            '--tw-prose-code':       '#0F1E35',
            '--tw-prose-th-borders': '#C9A84C',
            '--tw-prose-td-borders': '#E8E6E4',
            maxWidth: '75ch',
            fontFamily: 'Inter, sans-serif',
            h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: '700' },
            h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: '600' },
            h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: '600' },
            h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: '600' },
            a:  { textDecorationColor: '#C9A84C', textUnderlineOffset: '3px' },
          },
        },
        // Dark mode (Midnight background)
        invert: {
          css: {
            '--tw-prose-body':       '#E8EBF0',
            '--tw-prose-headings':   '#FFFFFF',
            '--tw-prose-links':      '#C9A84C',
            '--tw-prose-bold':       '#FFFFFF',
            '--tw-prose-counters':   '#8B8680',
            '--tw-prose-bullets':    '#C9A84C',
            '--tw-prose-hr':         '#C9A84C',
            '--tw-prose-quotes':     '#E8EBF0',
            '--tw-prose-quote-borders': '#C9A84C',
            '--tw-prose-captions':   '#8B8680',
          },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
};
