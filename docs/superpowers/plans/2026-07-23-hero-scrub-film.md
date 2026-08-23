# Hero Scroll-Scrub Film Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero's idle 3D mark with a pinned, scroll-scrubbed 144-frame image-sequence film (shipped first with a code-rendered animatic), with poster fallbacks, and simplify the Method section to a calm block.

**Architecture:** Pure frame/beat math lives in `src/lib/hero-film.ts` (unit-tested with `node --test`). `useFrameSequence` fetches AVIF/WebP frames coarse-to-fine; `FilmCanvas` draws the frame for the current scroll progress over an always-present poster `<img>`; `HeroFilm` owns the 450vh sticky section, the HTML text states per beat, the progress rail, and the static fallback. Two `sharp` scripts produce the frame sets from 1080² masters — the animatic script writes masters from parametric SVG, and the build script turns any masters (animatic or AI renders) into `public/hero-film/<theme>/{900,600}/`.

**Tech Stack:** Next.js 14 (static export), React 18, `motion/react` v12 (`useScroll`, `useMotionValueEvent`), Tailwind 3, `sharp` (already installed), Node 25 (`node --test`, native TS type-stripping for tests and scripts).

**Spec:** `docs/superpowers/specs/2026-07-23-hero-scrub-film-design.md`

## Global Constraints

- Hero section classes stay `nv-velvet nv-hero`; hero background token is `var(--nv-hero-bg)` (midnight `#0F1E35` in both themes via `.nv-velvet`).
- `FRAME_COUNT = 144`, `BEAT_COUNT = 8`, `HERO_SCRUB_VH = 450`; frame sets at 900² (desktop) and 600² (mobile `<768px`); AVIF quality 50, WebP quality 78.
- Size gates: 900 AVIF set ≤ 6 MB, 600 AVIF set ≤ 3 MB, poster ≤ 50 KB.
- Outer 54 px (5 %) of every 1080² master is solid `#0F1E35`.
- All copy lives in `src/lib/constants.ts` (`HOME.hero.film`); no inline copy in components. Sentence case; no exclamation marks; `-ise` spelling.
- Fallbacks (reduced motion, `navigator.connection.saveData`, no JS) render the poster, no pin, no captions.
- Canvas is `aria-hidden`; poster `<img>` carries `alt`; H1 stays in the hero.
- Never add a test framework: tests are `tests/*.test.mjs` with `node:test` + `node:assert/strict`; React components are verified by `npm run lint`, `npm run build`, and a browser check.
- Commit after every task. Do not commit `hero-film-masters/`; do commit `public/hero-film/`.

---

### Task 1: Frame and beat math (`src/lib/hero-film.ts`)

**Files:**
- Create: `src/lib/hero-film.ts`
- Create: `tests/hero-film.test.mjs`
- Modify: `package.json` (add `"test": "node --test"` to `scripts`)

**Interfaces:**
- Produces:
  - `FRAME_COUNT: 144`, `BEAT_COUNT: 8`, `HERO_SCRUB_VH: 450`, `FRAME_SIZES: { desktop: 900, mobile: 600 }`
  - `type FilmTheme = "dark" | "light"`, `type FrameExt = "avif" | "webp"`
  - `frameForProgress(p: number): number` — 0..1 → 0..143, clamped
  - `beatForProgress(p: number): number` — 0..1 → 0..7, equal slices, `p = 1` → 7
  - `loadOrder(count: number): number[]` — every 4th, then every 2nd, then the rest; each index once
  - `nearestLoaded(loaded: ArrayLike<number | boolean>, target: number): number` — nearest loaded at/below target, else above, else `-1`
  - `pad3(i: number): string`, `frameUrl(theme, size, i, ext): string`, `posterUrl(theme, size, ext): string`

- [ ] **Step 1: Write the failing test**

`tests/hero-film.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FRAME_COUNT, frameForProgress, beatForProgress, loadOrder, nearestLoaded, frameUrl, posterUrl,
} from "../src/lib/hero-film.ts";

test("frameForProgress maps 0..1 onto 0..143 and clamps", () => {
  assert.equal(frameForProgress(0), 0);
  assert.equal(frameForProgress(1), 143);
  assert.equal(frameForProgress(-1), 0);
  assert.equal(frameForProgress(2), 143);
  assert.equal(frameForProgress(0.5), 72);
});

test("beatForProgress gives 8 equal slices and keeps p=1 in beat 7", () => {
  assert.equal(beatForProgress(0), 0);
  assert.equal(beatForProgress(0.124), 0);
  assert.equal(beatForProgress(0.125), 1);
  assert.equal(beatForProgress(0.9), 7);
  assert.equal(beatForProgress(1), 7);
});

test("loadOrder visits every frame exactly once, coarse first", () => {
  const order = loadOrder(FRAME_COUNT);
  assert.equal(order.length, FRAME_COUNT);
  assert.equal(new Set(order).size, FRAME_COUNT);
  assert.deepEqual(order.slice(0, 3), [0, 4, 8]);
  assert.ok(order.indexOf(2) > order.indexOf(140));
});

test("nearestLoaded prefers at/below, falls back above, -1 when nothing loaded", () => {
  const l = new Uint8Array(10); l[2] = 1; l[8] = 1;
  assert.equal(nearestLoaded(l, 5), 2);
  assert.equal(nearestLoaded(l, 2), 2);
  assert.equal(nearestLoaded(l, 1), 2);
  assert.equal(nearestLoaded(l, 9), 8);
  assert.equal(nearestLoaded(new Uint8Array(3), 1), -1);
});

test("urls are zero-padded and theme/size scoped", () => {
  assert.equal(frameUrl("dark", 900, 7, "avif"), "/hero-film/dark/900/f-007.avif");
  assert.equal(frameUrl("light", 600, 143, "webp"), "/hero-film/light/600/f-143.webp");
  assert.equal(posterUrl("dark", 900, "avif"), "/hero-film/dark/900/poster.avif");
});
```

- [ ] **Step 2: Add the test script and run it to verify it fails**

In `package.json` `scripts`, add `"test": "node --test"`.

Run: `npm test`
Expected: FAIL — `Cannot find module '.../src/lib/hero-film.ts'`

- [ ] **Step 3: Write the implementation**

`src/lib/hero-film.ts`:

```ts
export const FRAME_COUNT = 144;
export const BEAT_COUNT = 8;
export const HERO_SCRUB_VH = 450;
export const FRAME_SIZES = { desktop: 900, mobile: 600 } as const;

export type FilmTheme = "dark" | "light";
export type FrameExt = "avif" | "webp";

const clamp01 = (p: number) => (p < 0 ? 0 : p > 1 ? 1 : p);

/** Scroll progress 0..1 → frame index 0..FRAME_COUNT-1. */
export function frameForProgress(p: number): number {
  return Math.round(clamp01(p) * (FRAME_COUNT - 1));
}

/** Scroll progress 0..1 → beat index 0..BEAT_COUNT-1 (equal slices; p=1 stays in the last beat). */
export function beatForProgress(p: number): number {
  return Math.min(BEAT_COUNT - 1, Math.floor(clamp01(p) * BEAT_COUNT));
}

/** Coarse-to-fine fetch order: every 4th frame, then every 2nd, then the rest. Each index once. */
export function loadOrder(count: number): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const step of [4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) { seen.add(i); out.push(i); }
    }
  }
  return out;
}

/** Nearest loaded index at or below target; else nearest above; else -1. */
export function nearestLoaded(loaded: ArrayLike<number | boolean>, target: number): number {
  for (let i = Math.min(target, loaded.length - 1); i >= 0; i--) if (loaded[i]) return i;
  for (let i = target + 1; i < loaded.length; i++) if (loaded[i]) return i;
  return -1;
}

export const pad3 = (i: number) => String(i).padStart(3, "0");

export function frameUrl(theme: FilmTheme, size: number, i: number, ext: FrameExt): string {
  return `/hero-film/${theme}/${size}/f-${pad3(i)}.${ext}`;
}

export function posterUrl(theme: FilmTheme, size: number, ext: FrameExt): string {
  return `/hero-film/${theme}/${size}/poster.${ext}`;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: `# pass 5`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add src/lib/hero-film.ts tests/hero-film.test.mjs package.json
git commit -m "feat(hero-film): frame/beat math with node:test coverage"
```

---

### Task 2: Animatic masters (`scripts/hero-film/animatic.mjs`)

Renders 144 parametric SVG frames (8 beats × 18 frames) into 1080² PNG masters using `sharp`. The frames are stylised stand-ins for the AI film, in the brand palette, following the spec's beat sheet. The build pipeline and the engine never know whether masters came from here or from DaVinci.

**Files:**
- Create: `scripts/hero-film/animatic.mjs`
- Create: `tests/animatic.test.mjs`
- Modify: `.gitignore` (append `hero-film-masters/`)
- Modify: `package.json` (add `"film:animatic": "node scripts/hero-film/animatic.mjs"`)

**Interfaces:**
- Consumes: `FRAME_COUNT`, `pad3` from `src/lib/hero-film.ts`
- Produces: `frameSvg(i: number): string` (exported), `render(outDir: string): Promise<void>`; running the script writes `hero-film-masters/dark/f-000.png … f-143.png`

- [ ] **Step 1: Write the failing test**

`tests/animatic.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { frameSvg } from "../scripts/hero-film/animatic.mjs";

test("frameSvg renders a 1080 square with the solid 54px edge ring on every frame", () => {
  for (const i of [0, 17, 18, 72, 143]) {
    const svg = frameSvg(i);
    assert.match(svg, /<svg [^>]*width="1080" height="1080"/);
    assert.ok(svg.includes('<rect width="1080" height="54"/>'), `ring missing on frame ${i}`);
    assert.ok(svg.endsWith("</svg>"));
  }
});

test("frameSvg changes across beats and within a beat", () => {
  assert.notEqual(frameSvg(0), frameSvg(17));
  assert.notEqual(frameSvg(18), frameSvg(36));
  assert.notEqual(frameSvg(90), frameSvg(143));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../scripts/hero-film/animatic.mjs'`

- [ ] **Step 3: Write the animatic generator**

`scripts/hero-film/animatic.mjs`:

```js
// Animatic: parametric SVG stand-ins for the 8 beats of the hero film.
// Run: npm run film:animatic  → hero-film-masters/dark/f-000..143.png (1080²)
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { FRAME_COUNT, pad3 } from "../../src/lib/hero-film.ts";

const W = 1080, R = 54, FPB = FRAME_COUNT / 8; // frames per beat
const BG = "#0F1E35", GOLD = "#C9A84C", IVORY = "#EFE6D0", OBS = "#0B1728";
const DEV = { x: 560, y: 200, w: 340, h: 520 };
const RECESS_Y = DEV.y + 440;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => { const c = clamp(t); return c * c * (3 - 2 * c); };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const bell = (a) => Math.sin(Math.PI * clamp(a));

const defs = `<defs>
<radialGradient id="key" cx="0.38" cy="0.18" r="0.45"><stop offset="0" stop-color="#1A2F4D"/><stop offset="1" stop-color="${BG}" stop-opacity="0"/></radialGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${GOLD}" stop-opacity=".55"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>
<linearGradient id="goldm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2C878"/><stop offset="1" stop-color="#8F7431"/></linearGradient>
</defs>`;
const bench = `<rect width="${W}" height="${W}" fill="${BG}"/><rect width="${W}" height="${W}" fill="url(#key)"/><line x1="140" y1="760" x2="940" y2="760" stroke="${GOLD}" stroke-opacity=".18" stroke-width="2"/>`;
const ring = `<g fill="${BG}"><rect width="${W}" height="${R}"/><rect y="${W - R}" width="${W}" height="${R}"/><rect width="${R}" height="${W}"/><rect x="${W - R}" width="${R}" height="${W}"/></g>`;

const card = (op = 1) => `<g opacity="${op}" transform="rotate(-3 450 690)"><rect x="300" y="600" width="300" height="180" rx="6" fill="${IVORY}"/><rect x="330" y="640" width="200" height="10" rx="2" fill="${BG}" opacity=".55"/><rect x="330" y="672" width="150" height="10" rx="2" fill="${BG}" opacity=".4"/><rect x="330" y="704" width="180" height="10" rx="2" fill="${BG}" opacity=".4"/></g>`;

const caliper = (enter, close, op = 1) => {
  const cx = 430 + lerp(400, 0, ease(enter));
  const gap = lerp(330, 220, ease(close));
  return `<g opacity="${op}"><g stroke="${GOLD}" stroke-width="6" fill="none" stroke-linecap="round"><line x1="${cx - gap / 2}" y1="560" x2="${cx - gap / 2}" y2="720"/><line x1="${cx + gap / 2}" y1="560" x2="${cx + gap / 2}" y2="720"/><line x1="${cx - gap / 2}" y1="560" x2="${cx + gap / 2}" y2="560"/></g><text x="${cx}" y="536" fill="${GOLD}" font-size="28" font-family="monospace" text-anchor="middle" opacity="${ease(close)}">${(gap / 5.9).toFixed(1)}</text></g>`;
};

const plan = (t, op = 1) => {
  const L = 2000, off = L * (1 - ease(t));
  return `<g fill="none" stroke="${GOLD}" stroke-width="3" stroke-opacity="${0.85 * op}" stroke-dasharray="${L}" stroke-dashoffset="${off}"><rect x="180" y="220" width="420" height="300" rx="4"/><rect x="640" y="220" width="240" height="130" rx="4"/><rect x="640" y="390" width="240" height="130" rx="4"/><line x1="180" y1="560" x2="880" y2="560"/><line x1="180" y1="540" x2="180" y2="580"/><line x1="880" y1="540" x2="880" y2="580"/></g>`;
};

const goldModule = (x, y, w = 140, h = 70, op = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#goldm)" opacity="${op}"/>`;

const mill = (t) => {
  const y = lerp(120, 330, bell(t * 1.2));
  const chips = [0, 1, 2, 3, 4].map((k) => {
    const a = seg(t, 0.25 + k * 0.08, 0.55 + k * 0.08);
    return `<circle cx="${560 + k * 40 + a * 60}" cy="${lerp(380, 450, a)}" r="${4 + (k % 3)}" fill="${GOLD}" opacity="${bell(a)}"/>`;
  }).join("");
  return `<rect x="520" y="${y}" width="60" height="120" rx="4" fill="#93A1B5" opacity=".9"/>${goldModule(470, 400)}${chips}`;
};

const body = (op = 1) => `<rect x="${DEV.x}" y="${DEV.y}" width="${DEV.w}" height="${DEV.h}" rx="26" fill="${OBS}" stroke="${GOLD}" stroke-opacity=".7" stroke-width="3" opacity="${op}"/>`;
const slot = (k, op = 1) => `<rect x="${DEV.x - 14}" y="${DEV.y + 110 + k * 110}" width="44" height="30" rx="4" fill="url(#goldm)" opacity="${op}"/>`;
const recess = `<rect x="${DEV.x - 14}" y="${RECESS_Y}" width="44" height="30" rx="4" fill="${OBS}" stroke="${GOLD}" stroke-opacity=".4"/>`;
const signModule = (y, op = 1) => `<rect x="${DEV.x - 14}" y="${y}" width="44" height="30" rx="4" fill="url(#goldm)" opacity="${op}"/>`;
const tweezers = (x, y, op = 1) => `<g stroke="#93A1B5" stroke-width="8" stroke-linecap="round" opacity="${op}"><line x1="${x - 40}" y1="${y - 160}" x2="${x}" y2="${y}"/><line x1="${x + 40}" y1="${y - 160}" x2="${x + 6}" y2="${y}"/></g>`;
const glint = (x, y, a) => `<circle cx="${x}" cy="${y}" r="${18 * bell(a)}" fill="#FFFFFF" opacity="${bell(a)}"/>`;

const screen = (op) => `<rect x="${DEV.x + 40}" y="${DEV.y + 60}" width="${DEV.w - 80}" height="${DEV.h - 120}" rx="12" fill="url(#glow)" opacity="${op}"/><rect x="${DEV.x + 70}" y="${DEV.y + 110}" width="140" height="16" rx="4" fill="${GOLD}" opacity="${op}"/><rect x="${DEV.x + 70}" y="${DEV.y + 150}" width="200" height="12" rx="4" fill="#E6EAF2" opacity="${op * 0.4}"/><rect x="${DEV.x + 70}" y="${DEV.y + 180}" width="170" height="12" rx="4" fill="#E6EAF2" opacity="${op * 0.3}"/>`;

const layers = (g, rot) => {
  const cx = DEV.x + DEV.w / 2, cy = DEV.y + DEV.h / 2;
  const plate = (k, attrs) => `<rect x="${DEV.x + 20}" y="${cy - 30 + (k - 1.5) * (80 + g)}" width="${DEV.w - 40}" height="60" rx="10" ${attrs}/>`;
  return `<g transform="rotate(${rot} ${cx} ${cy})">${plate(0, 'fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)"')}${plate(1, `fill="#16283F" stroke="${GOLD}" stroke-opacity=".6"`)}${plate(2, 'fill="url(#goldm)"')}${plate(3, 'fill="none" stroke="#93A1B5" stroke-dasharray="10 8"')}</g>`;
};

const threads = (draw, flow, op = 1) => {
  const L = 1400;
  const dash = draw < 1 ? `stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - ease(draw))}"` : `stroke-dasharray="40 24" stroke-dashoffset="${-200 * flow}"`;
  return `<g fill="none" stroke="${GOLD}" stroke-width="3" stroke-opacity="${0.5 * op}" ${dash}><path d="M${DEV.x} 640 C 420 640, 360 560, 160 560"/><path d="M${DEV.x} 680 C 440 690, 380 760, 160 740"/><path d="M${DEV.x + DEV.w} 600 C 960 600, 980 520, 1000 500"/></g>`;
};

const zoom = (s, cx, cy, inner) => `<g transform="translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})">${inner}</g>`;

function scene(beat, t) {
  switch (beat) {
    case 0: // still life → caliper enters and closes at the end
      return body(0.25) + card() + (t > 0.7 ? caliper(seg(t, 0.7, 0.85), seg(t, 0.85, 1)) : "");
    case 1: // words become the plan
      return card(1 - 0.6 * ease(t)) + caliper(1, 1, 1 - ease(seg(t, 0, 0.3))) + plan(seg(t, 0.1, 1));
    case 2: { // machining, push-in to macro at the end
      const s = lerp(1, 1.5, ease(seg(t, 0.66, 1)));
      return plan(1, 1 - 0.7 * ease(t)) + zoom(s, 540, 435, mill(t));
    }
    case 3: { // tweezers seat three modules
      let out = body(1) + recess;
      for (let k = 0; k < 3; k++) {
        const a = ease(seg(t, k * 0.3, k * 0.3 + 0.25));
        const sy = DEV.y + 110 + k * 110;
        const y = lerp(sy - 140, sy, a);
        out += `<rect x="${DEV.x - 14}" y="${y}" width="44" height="30" rx="4" fill="url(#goldm)"/>` + (a < 1 ? tweezers(DEV.x + 8, y, 1) : "");
      }
      return out;
    }
    case 4: { // exploded hold
      const a = ease(t);
      return body(1 - a) + slot(0, 1 - a) + slot(1, 1 - a) + slot(2, 1 - a) + layers(110 * a, 8 * a);
    }
    case 5: { // layers home, sealed; module held above the recess
      const home = ease(seg(t, 0, 0.6)), back = ease(seg(t, 0.5, 0.8)), hold = ease(seg(t, 0.7, 1));
      return layers(110 * (1 - home), 8 * (1 - home)) + body(back) + slot(0, back) + slot(1, back) + slot(2, back) + (back > 0 ? recess : "") + signModule(RECESS_Y - 140, hold) + tweezers(DEV.x + 8, RECESS_Y - 140, hold);
    }
    case 6: { // signed: module seats, glint, screen wakes, threads start
      const a = ease(seg(t, 0, 0.5)), y = lerp(RECESS_Y - 140, RECESS_Y, a);
      return body(1) + slot(0) + slot(1) + slot(2) + recess + signModule(y) + tweezers(DEV.x + 8, y, 1 - ease(seg(t, 0.5, 0.7))) + glint(DEV.x + 8, RECESS_Y + 15, seg(t, 0.45, 0.7)) + screen(ease(seg(t, 0.55, 1))) + threads(seg(t, 0.75, 1), 0);
    }
    default: { // running: ease back, settle, threads flow
      const s = lerp(1, 0.9, ease(t));
      return zoom(s, 540, 540, body(1) + slot(0) + slot(1) + slot(2) + signModule(RECESS_Y) + screen(1) + threads(1, t));
    }
  }
}

export function frameSvg(i) {
  const beat = Math.floor(i / FPB), t = (i % FPB) / (FPB - 1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">${defs}${bench}${scene(beat, t)}${ring}</svg>`;
}

export async function render(outDir) {
  await mkdir(outDir, { recursive: true });
  for (let i = 0; i < FRAME_COUNT; i++) {
    await sharp(Buffer.from(frameSvg(i))).png().toFile(`${outDir}/f-${pad3(i)}.png`);
  }
}

if (process.argv[1]?.endsWith("animatic.mjs")) {
  render("hero-film-masters/dark").then(() => console.log(`${FRAME_COUNT} masters written to hero-film-masters/dark`));
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: `# pass 7`, `# fail 0`

- [ ] **Step 5: Render the masters and check the edge ring on a real pixel**

Append `hero-film-masters/` to `.gitignore`. Add `"film:animatic": "node scripts/hero-film/animatic.mjs"` to `package.json` scripts.

Run: `npm run film:animatic && ls hero-film-masters/dark | wc -l`
Expected: `144 masters written…` then `144`

Run (corner pixel must equal `#0F1E35` = 15,30,53):
```bash
node -e 'import("sharp").then(async ({default: sharp}) => { const { data } = await sharp("hero-film-masters/dark/f-072.png").raw().toBuffer({ resolveWithObject: true }); console.log([data[0], data[1], data[2]]); })'
```
Expected: `[ 15, 30, 53 ]`

Open `hero-film-masters/dark/f-000.png`, `f-040.png`, `f-090.png`, `f-120.png`, `f-143.png` with the Read tool and confirm: card+device silhouette / plan lines / exploded layers / module seating with glow / settled device with threads.

- [ ] **Step 6: Commit**

```bash
git add scripts/hero-film/animatic.mjs tests/animatic.test.mjs .gitignore package.json
git commit -m "feat(hero-film): parametric SVG animatic renders 144 masters"
```

---

### Task 3: Frame-set build (`scripts/hero-film/build.mjs`)

**Files:**
- Create: `scripts/hero-film/build.mjs`
- Modify: `package.json` (add `"film:build": "node scripts/hero-film/build.mjs dark"`)
- Produces on disk: `public/hero-film/dark/{900,600}/f-000..143.{avif,webp}` and `poster.{avif,webp}`

**Interfaces:**
- Consumes: `FRAME_COUNT`, `FRAME_SIZES`, `pad3` from `src/lib/hero-film.ts`; masters from Task 2
- Produces: the asset layout `frameUrl`/`posterUrl` (Task 1) point at

- [ ] **Step 1: Write the build script**

`scripts/hero-film/build.mjs`:

```js
// Build AVIF/WebP frame sets from 1080² masters.
// Run: npm run film:build            (theme defaults to "dark")
//      node scripts/hero-film/build.mjs light
import sharp from "sharp";
import { mkdir, readdir, stat, copyFile } from "node:fs/promises";
import path from "node:path";
import { FRAME_COUNT, FRAME_SIZES, pad3 } from "../../src/lib/hero-film.ts";

const theme = process.argv[2] ?? "dark";
const src = `hero-film-masters/${theme}`;
const out = `public/hero-film/${theme}`;
const GATES = { 900: 6e6, 600: 3e6 }; // bytes, AVIF set per size (spec §4)
const POSTER_GATE = 50e3;

for (const size of Object.values(FRAME_SIZES)) {
  const dir = path.join(out, String(size));
  await mkdir(dir, { recursive: true });
  for (let i = 0; i < FRAME_COUNT; i++) {
    const base = sharp(path.join(src, `f-${pad3(i)}.png`)).resize(size, size);
    await base.clone().avif({ quality: 50 }).toFile(path.join(dir, `f-${pad3(i)}.avif`));
    await base.clone().webp({ quality: 78 }).toFile(path.join(dir, `f-${pad3(i)}.webp`));
  }
  for (const ext of ["avif", "webp"]) {
    await copyFile(path.join(dir, `f-${pad3(FRAME_COUNT - 1)}.${ext}`), path.join(dir, `poster.${ext}`));
  }
  let avifBytes = 0;
  for (const f of await readdir(dir)) {
    if (f.startsWith("f-") && f.endsWith(".avif")) avifBytes += (await stat(path.join(dir, f))).size;
  }
  const poster = (await stat(path.join(dir, "poster.avif"))).size;
  const ok = avifBytes <= GATES[size] && poster <= POSTER_GATE;
  console.log(`${theme}/${size}: avif set ${(avifBytes / 1e6).toFixed(2)} MB, poster ${(poster / 1e3).toFixed(0)} KB — ${ok ? "OK" : "OVER GATE"}`);
  if (!ok) process.exitCode = 1;
}
```

- [ ] **Step 2: Run it and check gates and file counts**

Add `"film:build": "node scripts/hero-film/build.mjs dark"` to `package.json` scripts.

Run: `npm run film:build && ls public/hero-film/dark/900 | wc -l && ls public/hero-film/dark/600 | wc -l`
Expected: two `… — OK` lines; `290` and `290` (144 × 2 formats + 2 posters each)

If a gate reads OVER GATE: lower `avif({ quality })` to 45 and rerun. The animatic's flat colours compress far below the gates; this only matters for AI masters later.

- [ ] **Step 3: Commit the script and the built assets**

```bash
git add scripts/hero-film/build.mjs package.json public/hero-film
git commit -m "feat(hero-film): sharp build for AVIF/WebP frame sets; animatic dark set"
```

---

### Task 4: Copy (`HOME.hero.film`)

**Files:**
- Modify: `src/lib/constants.ts` (inside `HOME.hero`, after `ctaGhost`)

**Interfaces:**
- Produces: `HOME.hero.film.captions: readonly { label: string; line: string }[]` (6 entries, beats 2–7), `HOME.hero.film.closing: { label; line }`, `HOME.hero.film.posterAlt: string`

- [ ] **Step 1: Add the copy**

In `src/lib/constants.ts`, after the line `ctaGhost: { label: "See the craft", href: "/work" },` add:

```ts
    film: {
      posterAlt: "A slim obsidian device at rest on a midnight bench, its screen alive with gold light.",
      captions: [
        { label: "Drawn", line: "Your goal, your problems, your plan — drawn from your words, not a template." },
        { label: "Machined", line: "Every part cut to your spec, by senior hands." },
        { label: "Assembled", line: "Built in the order your business needs it." },
        { label: "Opened", line: "No sealed boxes. Every layer visible, every layer yours." },
        { label: "Sealed", line: "Closed only when every layer is right." },
        { label: "Signed", line: "The last part we fit is our name." },
      ],
      closing: { label: "Running", line: "Your product. Our movement inside. At full speed." },
    },
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0)

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.ts
git commit -m "feat(hero-film): beat captions and closing copy"
```

---

### Task 5: Frame loader and canvas (`useFrameSequence`, `FilmCanvas`)

**Files:**
- Create: `src/components/hero-film/useFrameSequence.ts`
- Create: `src/components/hero-film/FilmCanvas.tsx`

**Interfaces:**
- Consumes: Task 1 exports; assets from Task 3
- Produces:
  - `useFrameSequence(theme: FilmTheme, size: number, enabled: boolean): { get(i: number): HTMLImageElement | null; loadedCount: number }`
  - `<FilmCanvas progress={MotionValue<number>} alt={string} enabled?={boolean} theme?={FilmTheme} className?={string} />`

- [ ] **Step 1: Write the loader**

`src/components/hero-film/useFrameSequence.ts`:

```ts
"use client";

import { useEffect, useRef, useState } from "react";
import { FRAME_COUNT, frameUrl, loadOrder, nearestLoaded, type FilmTheme, type FrameExt } from "@/lib/hero-film";

// 1×1 AVIF; onload fires only where the browser can decode AVIF.
const AVIF_PROBE =
  "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZjFNQTFCAAAA0WF2aWZtZXRhAAAAAAAAAChoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAbGlicmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=";

function supportsAvif(): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = AVIF_PROBE;
  });
}

export function useFrameSequence(theme: FilmTheme, size: number, enabled: boolean) {
  const frames = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const loaded = useRef(new Uint8Array(FRAME_COUNT));
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let inFlight = 0;
    let done = 0;
    (async () => {
      const ext: FrameExt = (await supportsAvif()) ? "avif" : "webp";
      for (const i of loadOrder(FRAME_COUNT)) {
        if (cancelled) return;
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(theme, size, i, ext);
        inFlight++;
        img
          .decode()
          .then(() => {
            if (cancelled) return;
            loaded.current[i] = 1;
            frames.current[i] = img;
            done++;
            if (done === 1 || done % 8 === 0 || done === FRAME_COUNT) setLoadedCount(done);
          })
          .catch(() => {})
          .finally(() => { inFlight--; });
        // ponytail: crude 6-wide throttle; replace with a real queue only if a browser ever stalls on it
        while (inFlight >= 6 && !cancelled) await new Promise((r) => setTimeout(r, 16));
      }
    })();
    return () => { cancelled = true; };
  }, [theme, size, enabled]);

  const get = (i: number): HTMLImageElement | null => {
    const j = nearestLoaded(loaded.current, i);
    return j < 0 ? null : frames.current[j];
  };

  return { get, loadedCount };
}
```

- [ ] **Step 2: Write the canvas**

`src/components/hero-film/FilmCanvas.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { FRAME_SIZES, frameForProgress, posterUrl, type FilmTheme } from "@/lib/hero-film";
import { useFrameSequence } from "./useFrameSequence";

type FilmCanvasProps = {
  progress: MotionValue<number>;
  alt: string;
  enabled?: boolean;
  theme?: FilmTheme;
  className?: string;
};

/** Poster <img> is always in the DOM (LCP, no-JS); the canvas cross-fades over it once frames decode. */
export default function FilmCanvas({ progress, alt, enabled = true, theme = "dark", className = "" }: FilmCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const [size, setSize] = useState<number>(FRAME_SIZES.desktop);
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setSize(FRAME_SIZES.mobile);
  }, []);
  const { get, loadedCount } = useFrameSequence(theme, size, enabled);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = get(frameRef.current);
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (canvas.width !== size) { canvas.width = size; canvas.height = size; }
    ctx.drawImage(img, 0, 0, size, size);
  }, [get, size]);

  useMotionValueEvent(progress, "change", (p) => {
    frameRef.current = frameForProgress(p);
    draw();
  });
  useEffect(() => { draw(); }, [loadedCount, draw]); // finer frames arrive → redraw the held position

  const live = enabled && loadedCount > 0;
  const fade = { transition: "opacity 600ms var(--nv-ease)" };

  return (
    <div className={`relative overflow-hidden rounded-none ${className}`}>
      <picture>
        <source type="image/avif" srcSet={posterUrl(theme, FRAME_SIZES.desktop, "avif")} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl(theme, FRAME_SIZES.desktop, "webp")}
          alt={alt}
          width={FRAME_SIZES.desktop}
          height={FRAME_SIZES.desktop}
          decoding="async"
          {...({ fetchpriority: "high" } as object)}
          className="absolute inset-0 h-full w-full"
          style={{ opacity: live ? 0 : 1, ...fade }}
        />
      </picture>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: live ? 1 : 0, ...fade }}
      />
      {/* edge feather: hides any one-shade mismatch between frame ring and page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 24px 12px var(--nv-hero-bg)" }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Lint and type-check**

Run: `npm run lint && npx tsc --noEmit`
Expected: `✔ No ESLint warnings or errors`; tsc exits 0. (If tsc rejects the `fetchpriority` spread, replace that line with nothing — it is a hint only.)

- [ ] **Step 4: Commit**

```bash
git add src/components/hero-film
git commit -m "feat(hero-film): coarse-to-fine frame loader and poster-backed canvas"
```

---

### Task 6: The hero section (`HeroFilm`) and wiring

**Files:**
- Create: `src/components/sections/HeroFilm.tsx`
- Modify: `src/app/page.tsx` (import/use `HeroFilm` instead of `HeroMovement`)
- Modify: `src/app/layout.tsx:52-59` (`<noscript>` style: append `.nv-hero-film{height:100svh!important}`)
- Delete: `src/components/sections/HeroMovement.tsx`

**Interfaces:**
- Consumes: `FilmCanvas` (Task 5), `HOME.hero.film` (Task 4), `HERO_SCRUB_VH`, `BEAT_COUNT`, `beatForProgress` (Task 1), `useReducedMotionSafe`, `Button`, `Logo`
- Produces: `<HeroFilm />` default export (no props)

- [ ] **Step 1: Write the section**

`src/components/sections/HeroFilm.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import FilmCanvas from "@/components/hero-film/FilmCanvas";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { BEAT_COUNT, HERO_SCRUB_VH, beatForProgress } from "@/lib/hero-film";
import { HOME } from "@/lib/constants";

// Same contract as the old hero: keep initial/animate unconditional; the site-wide
// <MotionConfig reducedMotion="user"> strips `y` for reduced-motion users.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

function useSaveData(): boolean {
  const [save, setSave] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    setSave(Boolean(nav.connection?.saveData));
  }, []);
  return save;
}

const SQUARE = "relative mx-auto h-[240px] w-[240px] md:h-[440px] md:w-[440px] order-first md:order-none";
const GRID = "relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-4 md:grid-cols-2 md:gap-10 md:px-6";

function HeroCopy() {
  const { hero } = HOME;
  return (
    <div className="max-w-2xl">
      <motion.p className="nv-overline mb-4" {...rise(0)}>{hero.overline}</motion.p>
      <motion.h1
        className="font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-[var(--nv-text-display-lg)]"
        style={{ color: "var(--nv-hero-heading)" }}
        {...rise(0.08)}
      >
        {hero.headlinePre} <span style={{ color: "var(--nv-hero-accent)" }}>{hero.headlineGold}</span>
      </motion.h1>
      <motion.p className="nv-lead mt-6 max-w-xl" {...rise(0.16)}>{hero.sub}</motion.p>
      <motion.div className="mt-8 flex flex-row flex-wrap gap-4 md:mt-10" {...rise(0.24)}>
        <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
        <Button href={hero.ctaGhost.href} variant="ghost">{hero.ctaGhost.label}</Button>
      </motion.div>
    </div>
  );
}

function Caption({ label, line }: { label: string; line: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <p className="nv-overline mb-4" style={{ color: "var(--nv-hero-accent)" }}>{label}</p>
      <p className="font-display text-2xl font-semibold leading-snug md:text-4xl" style={{ color: "var(--nv-hero-heading)" }}>{line}</p>
    </motion.div>
  );
}

function Closing() {
  const { film, ctaPrimary, ctaGhost } = HOME.hero;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      <p className="nv-overline mb-4" style={{ color: "var(--nv-hero-accent)" }}>{film.closing.label}</p>
      <p className="font-display text-2xl font-semibold leading-snug md:text-4xl" style={{ color: "var(--nv-hero-heading)" }}>{film.closing.line}</p>
      <div className="mt-8"><Logo /></div>
      <div className="mt-8 flex flex-row flex-wrap gap-4">
        <Button href={ctaPrimary.href}>{ctaPrimary.label}</Button>
        <Button href={ctaGhost.href} variant="ghost">{ctaGhost.label}</Button>
      </div>
    </motion.div>
  );
}

function ProgressRail({ beat }: { beat: number }) {
  return (
    <div aria-hidden="true" className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
      {Array.from({ length: BEAT_COUNT }, (_, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
          style={{ background: i <= beat ? "var(--nv-gold)" : "rgba(255,255,255,0.18)" }}
        />
      ))}
    </div>
  );
}

const Atmosphere = () => (
  <div
    className="pointer-events-none absolute -top-24 right-[-10%] h-[320px] w-[320px] rounded-full blur-3xl md:h-[560px] md:w-[560px]"
    style={{ background: "var(--nv-gold-glow-subtle)" }}
    aria-hidden="true"
  />
);
const BottomFade = () => (
  <div
    className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
    style={{ background: "linear-gradient(to top, var(--nv-bg-page), transparent)" }}
  />
);

export default function HeroFilm() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const saveData = useSaveData();
  const staticHero = reduced || saveData;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [beat, setBeat] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setBeat(beatForProgress(p)));
  const { film } = HOME.hero;

  if (staticHero) {
    return (
      <section className="nv-velvet nv-hero relative flex min-h-[100svh] items-center overflow-hidden py-24">
        <Atmosphere />
        <div className={GRID}>
          <HeroCopy />
          <FilmCanvas progress={scrollYProgress} enabled={false} alt={film.posterAlt} className={SQUARE} />
        </div>
        <BottomFade />
      </section>
    );
  }

  return (
    <section ref={ref} className="nv-velvet nv-hero nv-hero-film relative" style={{ height: `${HERO_SCRUB_VH}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-start overflow-hidden pt-20 md:items-center md:pt-0">
        <Atmosphere />
        <div className={GRID}>
          <div className="relative md:min-h-[320px]">
            {beat === 0 && <HeroCopy />}
            {beat > 0 && beat < BEAT_COUNT - 1 && <Caption key={beat} {...film.captions[beat - 1]} />}
            {beat === BEAT_COUNT - 1 && <Closing />}
          </div>
          <FilmCanvas progress={scrollYProgress} alt={film.posterAlt} className={SQUARE} />
        </div>
        <ProgressRail beat={beat} />
        <BottomFade />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire it in, remove the old hero, add the no-JS height rule**

`src/app/page.tsx`: replace `import HeroMovement from "@/components/sections/HeroMovement";` with `import HeroFilm from "@/components/sections/HeroFilm";` and `<HeroMovement />` with `<HeroFilm />`.

`src/app/layout.tsx` `<noscript>` style string: append `.nv-hero-film{height:100svh!important}` so JS-less visitors get a one-screen hero with the poster instead of a 450vh blank scroll.

Delete `src/components/sections/HeroMovement.tsx`.

- [ ] **Step 3: Lint, type-check, build**

Run: `npm run lint && npm run build`
Expected: no lint errors; build succeeds and exports `out/` (static export). If the build complains that `HeroMovement` is still imported somewhere, `grep -rn HeroMovement src` and fix the import.

- [ ] **Step 4: Browser check (dev server + Playwright MCP or a manual browser)**

Run: `npm run dev` (background), open `http://localhost:3000`.

Check, in order:
1. Top of page: headline, subline, both CTAs visible; the square shows the poster (settled device) then cross-fades to frame 0 (brief card) within ~1 s.
2. Scroll slowly: the square scrubs forward and backward without pops; the left column switches to `DRAWN … SIGNED` captions and ends on `RUNNING` + Logo + CTAs; rail dots fill in gold.
3. Canvas corner colour equals the page background. In the console:
   ```js
   const c = document.querySelector("canvas"); const d = c.getContext("2d").getImageData(0, 0, 1, 1).data; [d[0], d[1], d[2]]
   ```
   Expected: `[15, 30, 53]`.
4. Mobile 390×844: film square on top, copy below; at beat 0 both CTAs sit inside the viewport. At 375×667 the ghost CTA may touch the bottom edge — acceptable ceiling (`ponytail:` noted in the spec's stage section); it is still reachable after the film ends.
5. Reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion, or Playwright `page.emulateMedia({ reducedMotion: "reduce" })`): hero is one screen, poster only, no pin.

Take screenshots `hero-film-top.png`, `hero-film-mid.png`, `hero-film-end.png` into the scratchpad (not the repo root).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroFilm.tsx src/app/page.tsx src/app/layout.tsx
git rm -q src/components/sections/HeroMovement.tsx
git commit -m "feat(hero): scroll-scrubbed film hero with HTML beat captions and poster fallbacks"
```

---

### Task 7: Calm Method section, remove the WebGL mark and three.js

**Files:**
- Modify: `src/components/sections/MethodCTA.tsx` (rewrite)
- Delete: `src/components/mark/MarkCanvas.tsx`, `src/components/mark/MarkScene.tsx`, `src/lib/useCan3D.ts`
- Modify: `package.json` / `package-lock.json` (uninstall `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`)

**Interfaces:**
- Consumes: `METHOD_PHASES`, `HOME.method`, `HOME.cta`, `MarkStatic`, `AnimatedSection`, `Button`
- Produces: `<MethodCTA />` default export (server component, no props)

- [ ] **Step 1: Rewrite MethodCTA as the calm block**

Replace the whole of `src/components/sections/MethodCTA.tsx` with:

```tsx
import Link from "next/link";
import Button from "@/components/ui/Button";
import MarkStatic from "@/components/mark/MarkStatic";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { METHOD_PHASES } from "@/lib/method";
import { HOME } from "@/lib/constants";

export default function MethodCTA() {
  const { method, cta } = HOME;
  return (
    <section className="nv-velvet px-4 py-24 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
        <div>
          <AnimatedSection>
            <p className="nv-overline mb-3">{method.overline}</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{method.heading}</h2>
          </AnimatedSection>
          <div className="mt-10 space-y-8">
            {METHOD_PHASES.map((p, i) => (
              <AnimatedSection key={p.num} delay={0.08 * i} className="flex gap-5">
                <span className="nv-overline w-8 flex-none pt-1">{p.num}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-heading">{p.name}</h3>
                  <p className="mt-1 max-w-md text-sm text-secondary">{p.short}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.35}>
            <Link href={method.link.href} className="mt-8 inline-block font-display text-sm font-semibold">
              {method.link.label} →
            </Link>
          </AnimatedSection>
        </div>
        <AnimatedSection className="self-center">
          <MarkStatic variant="exploded" idPrefix="method" className="mx-auto w-56 md:w-72" />
        </AnimatedSection>
      </div>
      <AnimatedSection className="mx-auto mt-24 max-w-3xl text-center">
        <MarkStatic variant="assembled" idPrefix="cta" className="mx-auto mb-6 w-14" />
        <p className="nv-overline mb-3">{cta.overline}</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">{cta.heading}</h2>
        <p className="nv-lead mx-auto mt-4">{cta.sub}</p>
        <div className="mt-8"><Button href={cta.button.href}>{cta.button.label}</Button></div>
      </AnimatedSection>
    </section>
  );
}
```

- [ ] **Step 2: Delete the WebGL mark and its hook; confirm no consumers remain**

Run: `git rm -q src/components/mark/MarkCanvas.tsx src/components/mark/MarkScene.tsx src/lib/useCan3D.ts && grep -rn "MarkCanvas\|MarkScene\|useCan3D\|from \"three\"\|@react-three" src || echo "no consumers"`
Expected: `no consumers`

- [ ] **Step 3: Uninstall three.js**

Run: `npm uninstall three @react-three/fiber @react-three/drei @types/three`
Expected: `package.json` no longer lists them; lockfile updated.

- [ ] **Step 4: Lint, test, build**

Run: `npm run lint && npm test && npm run build`
Expected: lint clean; `# pass 7`; build succeeds. Note the homepage first-load JS drops (three was ~150 KB gzipped) — record the before/after size from the build output in the commit message.

- [ ] **Step 5: Browser check**

With `npm run dev`: scroll to the Method section — rows fade in once, the exploded mark sits beside them, the CTA block shows the small assembled mark; no canvas, no pinning, no console errors.

- [ ] **Step 6: Commit**

```bash
git add -A src package.json package-lock.json
git commit -m "refactor(method): calm phase block; remove WebGL mark and three.js"
```

---

### Task 8: Acceptance pass against the spec

**Files:** none new — verification only (fix-ups go into the task they belong to).

- [ ] **Step 1: Static export smoke**

Run: `npm run build && python3 -m http.server 8080 -d out` (background), open `http://localhost:8080/`.
Expected: identical behaviour to dev; network tab shows `f-000.avif` first, then every 4th frame, then the rest; no 404s under `/hero-film/`.

- [ ] **Step 2: Spec §9 checklist**

- Scrubbing both directions is frame-exact with no visible pop.
- Canvas corner pixel `[15, 30, 53]` (Task 6 step 4 snippet).
- At `p = 0` both CTAs are clickable without scrolling.
- Reduced motion → poster hero; DevTools → Network → "Save-Data" cannot be toggled in all browsers, so verify `useSaveData` by temporarily running `Object.defineProperty(navigator, "connection", { value: { saveData: true } })` before load in a Playwright `addInitScript`, or accept the reduced-motion path as the proxy.
- JS disabled (DevTools → Settings → Debugger → Disable JavaScript): hero is one screen with the poster, no 450vh blank.
- `grep -rn MarkCanvas src` → nothing.
- The film contains no wordmark, no CTA, no logo other than the signature module (animatic: plain gold module; AI frames: composited glyph).

- [ ] **Step 3: Record results**

Append a short "Verified 2026-MM-DD" block to the bottom of the spec (`docs/superpowers/specs/2026-07-23-hero-scrub-film-design.md`) listing each §9 line with ✓ or the deviation, and commit:

```bash
git add docs/superpowers/specs/2026-07-23-hero-scrub-film-design.md
git commit -m "docs(hero-film): acceptance results"
```

---

## Later (not in this plan)

- Replace `hero-film-masters/dark/*.png` with the DaVinci export, run `npm run film:build`, commit `public/hero-film/dark` — no code changes.
- Light sibling: `node scripts/hero-film/build.mjs light` after `hero-film-masters/light/` exists; `FilmCanvas` already accepts `theme="light"` — wire it to the site theme only when those assets exist.
