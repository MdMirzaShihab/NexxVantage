# Hero Hologram Film Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the ~38 s "The Commission" hologram film and play it as a muted autoplay loop in the homepage hero's right-column square.

**Architecture:** Claude-built assets (HTML screens and the two code-exact stills K0/K1, rendered with headless Chrome) feed Gemini keyframe edits K2–K7; the owner chains Kling start/end-frame clips and edits them in Resolve into one master; an ffmpeg script encodes AV1 + H.264 and a verify script gates colour, loop seam and size; a small `HeroFilm` client component replaces the mark in `HeroMovement.tsx`.

**Tech Stack:** Next.js 14 static export, React 18, TypeScript; Node ESM scripts with `sharp` (already a devDependency); headless Google Chrome for HTML → PNG; ffmpeg with `libsvtav1` and `libx264` (both present in `/opt/homebrew/bin/ffmpeg`); Gemini (Nano Banana), Kling 3.0 Pro, DaVinci Resolve (free).

**Spec:** `docs/superpowers/specs/2026-09-30-hero-hologram-film-design.md`

## Who does what

Tasks marked **[Claude]** are code/asset tasks an agent executes. Tasks marked **[Owner]** are done by the owner in Gemini, Kling and Resolve; their "tests" are the gates run by Claude on the files the owner produces. An agent executing this plan **stops at the first [Owner] task**, tells the owner exactly which files to produce, and resumes when they exist.

## Global Constraints

- Hero background: `#0F1E35` (`--nv-hero-bg`, pinned by `.nv-velvet` in both themes). Gold: `#C9A84C`. No blue or cyan light anywhere in the film.
- Film frame: square 1:1, master 1080×1080, 30 fps, ~38 s, loops from the gold point back to the gold point.
- Site slot: existing square, `280px` mobile / `440px` desktop, in `src/components/sections/HeroMovement.tsx`.
- Only in-film word: "Approved", added in Resolve in Space Grotesk. Never ask Gemini or Kling for text.
- Screens: realistic software designed for the film, invented names and figures, style of `docs/production/hologram/reference-sample.html`. No owner screenshots.
- Film assets live outside the repo in `~/NexxVantage-film/`; only the encoded files and stills go in `public/hero-film/`.
- Size gates: AV1 ≤ 3 MB, H.264 ≤ 6 MB, poster ≤ 20 KB, still ≤ 120 KB.
- Do not change hero copy, CTAs, or other sections (AGENTS.md: "Do NOT change content or functionality").
- Brand tokens: use `var(--nv-*)` in components, never hard-coded colours.

## Review Focus

1. Decoded video background differs from `#0F1E35` in a browser (codec range/primaries) → expected: no visible square edge. Pinned by `verify-film.mjs` (Task 7) and the in-browser pixel check (Task 8 Step 6).
2. Loop seam: the last frame does not match the first → expected: no jump each loop. Pinned by `verify-film.mjs` seam check (Task 7).
3. Autoplay refused (iOS Low Power Mode, browser policy) → expected: the K6 still, not a frozen gold point. Pinned by the `play()` rejection branch and its browser check (Task 8 Step 6).
4. Reduced motion or Save-Data → expected: K6 still and **no** `.mp4` request at all. Pinned by Task 8 Step 6 network check.
5. Video download competing with first paint → expected: no `.mp4` request before the `load` event. Pinned by Task 8 Step 6 network check.

---

## File map

| File | Responsibility |
|---|---|
| `scripts/hero-film/check-still.mjs` (modify) | Keyframe gate; thresholds retuned for multi-subject frames |
| `scripts/hero-film/flatten-still.mjs` (modify) | Background snap; new `keep` mode that never reframes |
| `scripts/hero-film/selftest.mjs` (create) | Synthetic-image self-check for both scripts above |
| `scripts/hero-film/render-html.sh` (create) | HTML → PNG at an exact size via headless Chrome |
| `docs/production/hologram/holo.css` (create) | Shared hologram-glass styles, extracted from the reference sample |
| `docs/production/hologram/screens/*.html` (create, 7) | The seven designed screens |
| `docs/production/hologram/stills/k0.html`, `k1.html` (create) | Code-exact gold point and mark stills |
| `scripts/hero-film/encode.sh` (create) | Master → AV1, H.264, poster, still |
| `scripts/hero-film/verify-film.mjs` (create) | Gate: decoded background, loop seam, sizes |
| `src/components/hero-film/HeroFilm.tsx` (create) | The video, its loading and fallbacks |
| `src/components/sections/HeroMovement.tsx` (modify) | Swap the mark for `HeroFilm` |
| `public/hero-film/*` (create) | Encoded outputs |

---

### Task 1: [Claude] Retune the still tooling for this film

The old gate assumed one compact subject (≤ 45% of frame, nothing in the outer 15%). This film's K5–K7 spread a mark, a screen stack, a robot and a client across the square, and the site feathers only the outer 5%. `flatten-still.mjs` also reframes by padding, which would move subjects between chained keyframes.

**Files:**
- Modify: `scripts/hero-film/check-still.mjs` (constants at the top; the outer-band block near the end)
- Modify: `scripts/hero-film/flatten-still.mjs` (argument parsing; the final pad block)
- Create: `scripts/hero-film/selftest.mjs`
- Modify: `docs/superpowers/plans/2026-07-23-hero-scrub-film.md`, `docs/production/hero-film-runbook.md` (superseded banner)

**Interfaces:**
- Produces: `node scripts/hero-film/check-still.mjs <png...> [--ref <png>]` exit 0 = ACCEPT; `node scripts/hero-film/flatten-still.mjs <in> <out> keep` writes a same-size PNG with background snapped to `#0F1E35`; `node scripts/hero-film/selftest.mjs` exit 0 = both behave.

- [ ] **Step 1: Write the failing self-check**

Create `scripts/hero-film/selftest.mjs`:

```js
// Self-check for the hero-film still tools. Run: node scripts/hero-film/selftest.mjs
// Builds synthetic 1080² frames with sharp, runs the real scripts on them, asserts the verdicts.
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const dir = mkdtempSync(join(tmpdir(), "hf-selftest-"));
const BG = { r: 15, g: 30, b: 53 };
const S = 1080;
const blob = (x, y, w, h, c = "#C9A84C") =>
  ({ input: Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${Math.min(w, h) / 4}" fill="${c}"/></svg>`), left: x, top: y });

async function frame(name, bg, parts) {
  const f = join(dir, name);
  await sharp({ create: { width: S, height: S, channels: 3, background: bg } }).composite(parts).png().toFile(f);
  return f;
}
const run = (script, args) => {
  try { execFileSync("node", [`scripts/hero-film/${script}`, ...args], { stdio: "pipe" }); return 0; }
  catch (e) { return e.status; }
};

// 1. A spread K5-style frame: four subjects covering ~40% of the frame (~50% once tile edges count),
//    clear of the outer 5%. The old gate (field >= 55%, subject <= 45%) rejects this; the new one must not.
const spread = await frame("spread.png", BG, [
  blob(70, 520, 300, 300), blob(280, 90, 520, 360), blob(720, 560, 300, 300), blob(420, 560, 260, 380, "#E6CB7E"),
]);
assert.equal(run("check-still.mjs", [spread]), 0, "spread multi-subject frame should ACCEPT");

// 2. A floor running to the frame edge must still be rejected.
const floor = await frame("floor.png", BG, [blob(400, 400, 280, 280), blob(0, 900, S, 180, "#3A3A3A")]);
assert.equal(run("check-still.mjs", [floor]), 1, "a floor touching the edge should REGENERATE");

// 3. flatten keep: a tinted background comes back at exactly #0F1E35, same size, subject untouched.
const tinted = await frame("tinted.png", { r: 11, g: 26, b: 44 }, [blob(420, 420, 240, 240)]);
const out = join(dir, "flat.png");
assert.equal(run("flatten-still.mjs", [tinted, out, "keep"]), 0, "flatten keep should succeed");
const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true });
assert.equal(info.width, S); assert.equal(info.height, S);
const px = (x, y) => [...data.subarray((y * S + x) * info.channels, (y * S + x) * info.channels + 3)];
assert.deepEqual(px(20, 20), [15, 30, 53], "corner should be snapped to #0F1E35");
// The flat-field fit shifts the whole frame by the background's offset (+4,+4,+9), subject included — by design.
assert.deepEqual(px(540, 540), [205, 172, 85], "subject centre shifts by exactly the background offset");

console.log("selftest: all passed");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node scripts/hero-film/selftest.mjs`
Expected: FAIL on `spread multi-subject frame should ACCEPT` (the old 55% field floor and 45% subject cap reject it).

- [ ] **Step 3: Retune `check-still.mjs`**

Replace the constants block:

```js
const FIELD_NEAR = 45;                 // ...and this close to TARGET to count as field, not a flat subject
const MAX_DRIFT = 6;                   // how far a field tile may sit from TARGET
const MIN_FIELD = 0.40;                // field must cover at least this much of the frame (multi-subject frames)
const MAX_SUBJECT = 0.60;              // subjects may cover up to this much; they must still float clear of the edge
const EDGE_BAND = 0.05;                // the site feathers the outer 5% of the square
```

In `ok`, change `floats: !touches && subjectPct <= 0.45,` to:

```js
    floats: !touches && subjectPct <= MAX_SUBJECT,
```

Replace the outer-band block (from `// content in the outer 15%` through the `edgeTot` loop) with:

```js
  // content in the outer band — the site's CSS feather fades it
  let edge = 0, edgeTot = 0;
  const m = Math.round(W * EDGE_BAND);
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) {
    if (x >= m && x < W - m && y >= m && y < H - m) continue;
    edgeTot++;
    if (d3(at(x, y), TARGET) > 16) edge++;
  }
```

and its report line to:

```js
  console.log(`  content in outer ${EDGE_BAND * 100}% ... ${((100 * edge) / edgeTot).toFixed(1)}%${edge / edgeTot > 0.02 ? "  <- the CSS feather will fade it; keep subjects inside" : ""}`);
```

Update the header comment's first line to: `// Gate a hero-film keyframe: flat #0F1E35 field, square, gold in family, subjects float clear of the edge.`

- [ ] **Step 4: Add `keep` to `flatten-still.mjs`**

Replace the argument lines:

```js
const [inFile, outFile, fracArg] = process.argv.slice(2);
if (!inFile || !outFile) {
  console.error("usage: node scripts/hero-film/flatten-still.mjs <in> <out> [subjectFraction=0.58 | keep]");
  process.exit(2);
}
const keep = fracArg === "keep";   // chained keyframes: snap the ground, never move the framing
const frac = keep ? 1 : Number(fracArg ?? 0.58);
```

Replace the final block from `// --- bounding box of the subject` to the end with:

```js
if (keep) {
  await sharp(Buffer.from(px), { raw: { width: W, height: H, channels: C } }).png().toFile(outFile);
  console.log(`${inFile} -> ${outFile}`);
  console.log(`  ground snapped to #0F1E35 over ${((100 * ground.reduce((a, b) => a + b, 0)) / (W * H)).toFixed(1)}% of the frame; framing kept`);
} else {
  // --- bounding box of the subject, then pad (never scale) to the requested fraction ---
  let x0 = W, x1 = -1, y0 = H, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (dist((y * W + x) * C) <= SUBJECT) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const sw = x1 - x0 + 1, sh = y1 - y0 + 1;
  let canvas = Math.round(Math.max(sw, sh) / frac);
  canvas += canvas % 2;
  const left = ((canvas - sw) >> 1) - x0;
  const top = ((canvas - sh) >> 1) - y0;

  await sharp(Buffer.from(px), { raw: { width: W, height: H, channels: C } })
    .extend({
      left: Math.max(0, left), top: Math.max(0, top),
      right: Math.max(0, canvas - W - left), bottom: Math.max(0, canvas - H - top),
      background: { r: TARGET[0], g: TARGET[1], b: TARGET[2] },
    })
    .png()
    .toFile(outFile);

  const pct = ((100 * Math.max(sw, sh)) / canvas).toFixed(1);
  console.log(`${inFile} -> ${outFile}`);
  console.log(`  ground snapped to #0F1E35 over ${((100 * ground.reduce((a, b) => a + b, 0)) / (W * H)).toFixed(1)}% of the frame`);
  console.log(`  subject ${sw}x${sh} kept at native size; canvas ${canvas}x${canvas}; subject now ${pct}% of frame width`);
}
```

- [ ] **Step 5: Run the self-check to verify it passes**

Run: `node scripts/hero-film/selftest.mjs`
Expected: `selftest: all passed`, exit 0.

- [ ] **Step 6: Mark the old Atelier docs superseded**

Insert as the first line after the H1 of both `docs/superpowers/plans/2026-07-23-hero-scrub-film.md` and `docs/production/hero-film-runbook.md`:

```markdown
> **SUPERSEDED 2026-10-01** by `docs/superpowers/specs/2026-09-30-hero-hologram-film-design.md` and `docs/superpowers/plans/2026-10-01-hero-hologram-film.md`. Kept for history; the Kling settings and pricing notes still apply.
```

- [ ] **Step 7: Commit**

```bash
git add scripts/hero-film/check-still.mjs scripts/hero-film/flatten-still.mjs scripts/hero-film/selftest.mjs docs/superpowers/plans/2026-07-23-hero-scrub-film.md docs/production/hero-film-runbook.md
git commit -m "feat(hero-film): retune still gate for multi-subject frames; flatten keep mode"
```

---

### Task 2: [Claude] HTML renderer and the code-exact stills K0 and K1

K0 (gold point) and K1 (the mark, glowing) are drawn from `NexusMark` geometry, not generated, so the mark is exact where it matters most: the start, the end and the loop hinge.

**Files:**
- Create: `scripts/hero-film/render-html.sh`
- Create: `docs/production/hologram/stills/k0.html`, `docs/production/hologram/stills/k1.html`

**Interfaces:**
- Produces: `scripts/hero-film/render-html.sh <in.html> <out.png> <width> <height>` (CSS-pixel size, rendered at device scale 1). Outputs `~/NexxVantage-film/02-keyframes/K0.png`, `K1.png`, 1080×1080.

- [ ] **Step 1: Create the renderer**

`scripts/hero-film/render-html.sh`:

```bash
#!/usr/bin/env bash
# Render a local HTML file to a PNG of an exact CSS-pixel size with headless Chrome.
# Usage: scripts/hero-film/render-html.sh <in.html> <out.png> <width> <height>
set -euo pipefail
in="$1"; out="$2"; w="$3"; h="$4"
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$chrome" ] || { echo "Google Chrome not found at $chrome" >&2; exit 2; }
mkdir -p "$(dirname "$out")"
abs="$(cd "$(dirname "$in")" && pwd)/$(basename "$in")"
"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --default-background-color=0F1E35FF --virtual-time-budget=3000 \
  --window-size="$w,$h" --screenshot="$out" "file://$abs" >/dev/null 2>&1
node -e "require('sharp')('$out').metadata().then(m=>{if(m.width!==$w||m.height!==$h){console.error('wrong size',m.width,m.height);process.exit(1)}console.log('$out',m.width+'x'+m.height)})"
```

Run: `chmod +x scripts/hero-film/render-html.sh`

- [ ] **Step 2: Create `k1.html` (the mark, glowing, centred)**

`docs/production/hologram/stills/k1.html`:

```html
<!doctype html>
<meta charset="utf-8">
<style>
  html, body { margin: 0; width: 1080px; height: 1080px; background: #0F1E35; overflow: hidden; }
  svg { position: absolute; left: 50%; top: 50%; width: 240px; height: 240px; transform: translate(-50%, -50%);
        filter: drop-shadow(0 0 18px rgba(201,168,76,.55)) drop-shadow(0 0 48px rgba(201,168,76,.25)); }
</style>
<!-- NexusMark geometry copied from src/components/ui/Logo.tsx; heading colour = white on the hero -->
<svg viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#FFFFFF" stroke-width="3.3" stroke-linecap="round">
    <line x1="30" y1="30" x2="30" y2="82"/><line x1="82" y1="30" x2="82" y2="82"/>
    <line x1="30" y1="30" x2="82" y2="82"/><line x1="82" y1="30" x2="30" y2="82"/>
  </g>
  <g fill="#FFFFFF"><circle cx="30" cy="30" r="7.5"/><circle cx="82" cy="30" r="7.5"/><circle cx="30" cy="82" r="7.5"/><circle cx="82" cy="82" r="7.5"/></g>
  <circle cx="56" cy="56" r="19" stroke="#C9A84C" stroke-width="1.4" opacity="0.45"/>
  <circle cx="56" cy="56" r="13" fill="#C9A84C"/>
</svg>
```

- [ ] **Step 3: Create `k0.html` (the gold point, at the mark's core position)**

`docs/production/hologram/stills/k0.html`:

```html
<!doctype html>
<meta charset="utf-8">
<style>
  html, body { margin: 0; width: 1080px; height: 1080px; background: #0F1E35; overflow: hidden; }
  i { position: absolute; left: 50%; top: 50%; width: 14px; height: 14px; border-radius: 50%; transform: translate(-50%, -50%);
      background: #E6CB7E; box-shadow: 0 0 10px 3px rgba(201,168,76,.9), 0 0 40px 10px rgba(201,168,76,.35); }
</style>
<i></i>
```

- [ ] **Step 4: Render and gate both**

```bash
mkdir -p ~/NexxVantage-film/02-keyframes
scripts/hero-film/render-html.sh docs/production/hologram/stills/k0.html ~/NexxVantage-film/02-keyframes/K0.png 1080 1080
scripts/hero-film/render-html.sh docs/production/hologram/stills/k1.html ~/NexxVantage-film/02-keyframes/K1.png 1080 1080
node scripts/hero-film/check-still.mjs ~/NexxVantage-film/02-keyframes/K1.png
```

Expected: both print `…1080x1080`; K1 verdict `ACCEPT`. (K0 is skipped by the gate: it has too little gold to measure, by design.) Open K1 with the Read tool and confirm the mark matches `Logo.tsx`: two verticals, an X, four white nodes, gold core with a faint ring.

- [ ] **Step 5: Archive the Atelier keyframes**

```bash
mkdir -p ~/NexxVantage-film/_archive-atelier
mv ~/NexxVantage-film/02-keyframes/S*.png ~/NexxVantage-film/_archive-atelier/
```

- [ ] **Step 6: Commit**

```bash
git add scripts/hero-film/render-html.sh docs/production/hologram/stills
git commit -m "feat(hero-film): headless-Chrome renderer and code-exact K0/K1 stills"
```

---

### Task 3: [Claude] The seven designed screens

Every screen follows `docs/production/hologram/reference-sample.html` (approved). That file already contains the hotel desktop (`tpl-desk`) and guest mobile (`tpl-phone`) designs; extract them rather than redrawing.

**Files:**
- Create: `docs/production/hologram/holo.css`
- Create: `docs/production/hologram/screens/hotel-desktop.html`, `hotel-wireframe.html`, `legal-desktop.html`, `retail-desktop.html`, `guest-mobile.html`, `shop-mobile.html`, `call-mobile.html`

**Interfaces:**
- Consumes: `render-html.sh` (Task 2).
- Produces: `~/NexxVantage-film/01-references/screens/<name>.png` — desktops 2560×1600, mobiles 780×1640 (2× the design size, so Gemini gets sharp detail).

- [ ] **Step 1: Extract `holo.css`**

Copy from `reference-sample.html` into `holo.css`: the `:root` token block; every rule from `/* hologram glass shared by both screens */` down to and including `.ph-tabs i.on`; and the `.typing` keyframes. Add at the top:

```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");
html, body { margin: 0; background: #0F1E35; overflow: hidden; }
body { zoom: 2; }                         /* render at 2x: desktop 1280x800 -> 2560x1600 */
.surface { position: relative; }          /* standalone page: no scaler wrapper */
.typing i { animation: none; }            /* stills, not animation */
```

- [ ] **Step 2: Hotel desktop and guest mobile**

`hotel-desktop.html`: `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="../holo.css">` followed by the inner HTML of `<template id="tpl-desk">` from the reference, with the seven room lanes written out as static HTML (expand the `ROOMS` array from the reference script by hand: one `<div class="lane">` per room, one `<div class="bk …">` per booking, using the same `left`/`width` `calc()` formula). No script.

`guest-mobile.html`: the same head, then the inner HTML of `<template id="tpl-phone">`.

- [ ] **Step 3: Hotel wireframe**

`hotel-wireframe.html`: a copy of `hotel-desktop.html` with this added inside a `<style>` after the stylesheet link, so the layout is identical and only the fill is stripped:

```css
.surface { background: transparent; box-shadow: 0 0 30px rgba(201,168,76,.18); }
.surface * { color: transparent !important; background: transparent !important; box-shadow: none !important; }
.surface *:not(.surface) { outline: 1px dashed rgba(201,168,76,.45); outline-offset: -1px; }
.kpi, .board, .ai, .side, .card, .bk, .m, .input { outline: 1.5px solid rgba(201,168,76,.7) !important; }
```

- [ ] **Step 4: Legal desktop**

`legal-desktop.html`, same three-column grid as the hotel desktop (`.desk`: sidebar 210px, main, AI panel 300px), brand `Lexora Legal` with the `i` badge letter `L`. Content:
- Sidebar: Matters (active, badge `28`), Clients, Calendar, Documents, Billing, Reports.
- Top: `Matters` · `Mon · 14 Oct` · search `Search matters, parties…`.
- KPI row: `Open matters 128 / ▲ 9 this month`; `Due this week 14 / 3 today`; `Billable hours 1,246 / ▲ 7%`; `Win rate 82%` with the sparkline.
- Board titled `Active matters` `sorted by deadline`, chips `All` (on), `Litigation`, `Corporate`. Instead of the timeline, a table (reuse `.lane` rows, 5 columns: Matter, Client, Stage, Deadline, Owner) with seven rows: `Harbor v. Cole · Northwind Ltd · Discovery · Oct 16 · R. Akhtar`, `Delta merger · Delta Foods · Due diligence · Oct 18 · M. Grant`, `Lease dispute · Arcadia Mall · Mediation · Oct 21 · S. Bose`, `IP filing 0447 · Kestrel Labs · Filing · Oct 22 · J. Park`, `Estate of Varga · Varga family · Probate · Oct 25 · L. Hale`, `Supply breach · Orion Steel · Pleadings · Oct 28 · A. Noor`, `Visa appeal · T. Ibrahim · Hearing · Nov 2 · K. Osei`. Rows use `.lane` with an inline override `style="grid-template-columns: 1.6fr 1.3fr 1fr .8fr 1fr; gap: 12px"` and a header row in `.days` style with the same override. Stage cells hold a static `.bk` pill (`position: static`; `.in` for Discovery and Hearing, `.hold` for Mediation).
- AI panel `AI Counsel` `● reviewing 3 documents`: user message `Summarise the risks in the Delta merger agreement.`; AI reply `Two clauses need attention: <b>§7.2 indemnity cap</b> is below market and <b>§11 change of control</b> triggers on any share transfer.`; card `Redline draft · §7.2, §11` / `2 edits · 4 min to review` / button `Open redline`; typing dots; input `Ask about any matter…`.

- [ ] **Step 5: Retail desktop**

`retail-desktop.html`, same grid, brand `Northstar Commerce`, badge `N`. Content:
- Sidebar: Overview (active), Orders (badge `64`), Products, Inventory, Customers, Campaigns, Reports.
- Top: `Overview` · `Fri · 18 Oct` · search `Search products, orders…`.
- KPI row: `Revenue $84.2k / ▲ 12% vs last week`; `Orders 1,318 / 64 pending`; `Conversion 3.8% / ▲ 0.4 pts`; `Avg order $63.90` with the sparkline.
- Board `Sales, last 14 days` `all channels`, chips `Online` (on), `Stores`, `App`: an inline SVG area chart filling the board (gold `#E6CB7E` 2px line over a 25%-opacity gold area, 14 points rising with one weekend dip, faint horizontal gridlines every quarter, day labels in `.days` style beneath).
- AI panel `AI Forecast` `● updated 2 min ago`: user `What should we restock before the weekend?`; AI `Demand for <b>Linen Shirt · Sand</b> will run out by Saturday at current pace; <b>Canvas Tote</b> is trending 3x.`; card `Reorder 240 units · 2 SKUs` / `arrives Thu · $3,180` / button `Approve order`; typing dots; input `Ask about sales or stock…`.

- [ ] **Step 6: Shopping mobile**

`shop-mobile.html`, the phone frame from `guest-mobile.html`:
- Header small `For you`, title `Hi Amina, new in`.
- Two `.stay`-style product cards side by side (reduce `.pic` to 110px): `Linen Shirt · Sand / $58 · 4.8★` and `Canvas Tote / $34 · trending`; each with a single gold `Add` chip.
- `.ph-ai` block `Stylist` `● picked for you`: AI message `These pair well with the sandals you bought in June.` and user message `Show me in size M`.
- Tabs bar as in the guest app.

- [ ] **Step 7: Incoming call mobile**

`call-mobile.html`, the phone frame, no tabs:
- Centred column: a 120px circular avatar (`.av` style scaled up, gold ring pulsing as three concentric 1px gold rings at 140/170/200px, opacities .5/.3/.15).
- Name `Amina Rahman`, line `Seabreeze Hotels · video call` in mono muted.
- At the bottom, two 64px round buttons: decline (outline only, gold 1.5px border, a 24px diagonal bar) and accept (solid gold, a 24px dark navy camera glyph built from a rounded rect + triangle). No red or green: brand palette only.

- [ ] **Step 8: Render all seven**

```bash
S=docs/production/hologram/screens; O=~/NexxVantage-film/01-references/screens
for n in hotel-desktop hotel-wireframe legal-desktop retail-desktop; do scripts/hero-film/render-html.sh $S/$n.html $O/$n.png 2560 1600; done
for n in guest-mobile shop-mobile call-mobile; do scripts/hero-film/render-html.sh $S/$n.html $O/$n.png 780 1640; done
```

Expected: seven lines with the right sizes. Open each PNG with the Read tool and check: nothing clipped at the right or bottom edge, fonts are Space Grotesk/Inter (not Times), no colour outside navy/gold/white.

- [ ] **Step 9: Show the owner**

Put the seven PNGs side by side in one artifact page (desktops in a row, mobiles in a row, on `#0F1E35`) and ask the owner to approve them before Task 4. Fix and re-render what they flag.

- [ ] **Step 10: Commit**

```bash
git add docs/production/hologram/holo.css docs/production/hologram/screens
git commit -m "feat(hero-film): seven designed hologram screens for the film"
```

---

### Task 4: [Owner] Robot reference sheet

**Files:** produces `~/NexxVantage-film/01-references/robot-sheet.png`; moves the client reference.

- [ ] **Step 1: Move the client reference**

```bash
mkdir -p ~/NexxVantage-film/01-references
mv ~/Downloads/Gemini_Generated_Image_6h2rux6h2rux6h2r.jpeg ~/NexxVantage-film/01-references/client-ref.jpeg
```

- [ ] **Step 2: Generate the robot sheet in Gemini** (generate 3–4, keep the best)

```
Character design sheet of a friendly floating AI assistant robot, shown three times side by side: front view, three-quarter view, side view — the identical robot in each. Body: a smooth glossy pearl-white sphere, soft rounded forms, no sharp edges, no square parts. Face: a rounded dark navy glass visor screen with two small glowing warm-gold dot eyes and a small gold smile line. A thin polished gold ring orbits the sphere at a slight tilt, like a planet's ring. Two small floating pearl-white sphere hands hover beside the body, not attached. Soft warm-gold glow beneath it. Premium, calm, friendly; high-end product render with realistic materials. Background: perfectly flat solid color #0F1E35 midnight navy — no gradient, no floor, no shadow, no vignette. No text, no logos.
```

Save the chosen one as `~/NexxVantage-film/01-references/robot-sheet.png`.

- [ ] **Step 3: Gate (Claude)** — Claude opens it with the Read tool and checks: all three views are the same robot; ring, visor, gold eyes, smile, two floating hands present; no hard edges. Owner approves.

---

### Task 5: [Owner] Keyframes K2–K7 in Gemini, gated by Claude

Always **edit** the previous approved keyframe with the listed attachments; never generate a keyframe from scratch. Ask for a square image. After each keyframe, Claude runs the gate before the next one is made.

**Gate for every keyframe (Claude):**

```bash
K=~/NexxVantage-film/02-keyframes
node scripts/hero-film/flatten-still.mjs $K/raw/Kn.png $K/Kn.png keep
node scripts/hero-film/check-still.mjs $K/Kn.png --ref $K/K2.png      # for K2 itself, omit --ref
sips -Z 280 $K/Kn.png --out /tmp/Kn-280.png
```

Then Claude opens `Kn.png` and `/tmp/Kn-280.png` with the Read tool and checks: the verdict is `ACCEPT`; the mark matches K1; the robot matches the sheet; the client matches `client-ref.jpeg`; positions match the spec's layout; at 280 px the mark, the robot, the client's smile and (K7) the tick are still recognisable. If Gemini returns a non-square image, the owner regenerates; do not crop.

Save Gemini's raw output as `~/NexxVantage-film/02-keyframes/raw/Kn.png` (convert JPEG with `sips -s format png in.jpeg --out raw/Kn.png`).

Append the spec's **global style block** to every prompt below:

```
Futuristic holographic scene, premium cinematic render. Everything floats in empty space against a completely flat, solid, uniform dark navy background (#0F1E35) filling the entire frame edge to edge — no floor, no surface, no horizon, no cast shadow, no vignette, no gradient, no haze. Holograms are warm gold (#C9A84C) and soft white light with fine horizontal scanlines and glowing gold edges; no blue or cyan light. Square composition with a generous empty margin at the edges. No text, no logos, no watermarks.
```

- [ ] **Step 1: K2 — the orbit.** Attach `K1.png` and the six screens `hotel-desktop.png`, `legal-desktop.png`, `retail-desktop.png`, `guest-mobile.png`, `shop-mobile.png`, `call-mobile.png`.

```
Edit the first attached image. Keep the glowing emblem exactly as it is — same shape, size, position and colours. Add six floating holographic screens orbiting the emblem in a loose ring at different depths: three wide desktop screens and three tall phone screens, each showing one of the other attached screen designs exactly. Each screen is a sheet of glass with glowing gold edges and fine scanlines. Thin straight gold light rays run from the emblem's gold centre to the middle of each screen, as if the emblem is projecting them. Screens nearer the viewer are larger; the ring tilts slightly toward the viewer. The whole ring stays inside the central 85% of the frame.
```

- [ ] **Step 2: K3 — the robot takes the phone.** Attach `K2.png`, `robot-sheet.png`.

```
Edit the first attached image. Keep the emblem, the rays and five of the screens exactly where they are. The tall phone screen showing the incoming call has left the ring and its ray is gone: it now floats at about 72% across and 45% down, beside the friendly floating robot from the second attached image (match it exactly), which has drifted in from the right. The robot is at about 82% across and 60% down, facing the phone, one floating sphere hand raised near it.
```

- [ ] **Step 3: K4 — the call.** Attach `K3.png`, `client-ref.jpeg`.

```
Edit the first attached image. Replace the phone screen beside the robot with the woman from the second attached image, as a hologram showing head and shoulders, at the same spot, about 22% of the frame tall, turned toward the robot and talking. Keep her exactly as in the reference: face, navy hijab with gold border, scanlines, gold sparkles dissolving at the shoulders. Everything else stays unchanged.
```

- [ ] **Step 4: K5 — the stack.** Attach `K4.png`, `hotel-wireframe.png`.

```
Recompose the first attached image as if the camera has moved. The glowing emblem now sits on the left at about 22% across and 55% down, the same size. One wide screen showing the second attached wireframe design floats in the centre at about 50% across and 45% down, about 36% of the frame wide, turned slightly toward the emblem; the other four screens are stacked in layers behind it, each slightly smaller and dimmer. Gold rays run from the emblem's centre into the stack. The robot floats on the right at about 80% across and 60% down. The woman's hologram floats above the robot at about 76% across and 24% down, turned toward the robot. Keep the robot and the woman exactly as they are.
```

- [ ] **Step 5: K6 — the finished app.** Attach `K5.png`, `hotel-desktop.png`.

```
Edit the first attached image. The front screen now shows the second attached app design instead of the wireframe — same position, size and angle. The robot's nearer sphere hand is raised toward the screen. The woman leans slightly forward, smiling, pointing at the screen. Nothing else changes.
```

- [ ] **Step 6: K7 — approved.** Attach `K6.png`.

```
Edit the attached image. The woman is gone. In her place, at the same size, is a large glowing gold check mark (a tick) made of dense gold light particles, with a few loose sparkles drifting around it. No words or letters anywhere. Nothing else changes.
```

- [ ] **Step 7: Final gate (Claude).** Run the gate on all of K2–K7 together with `--ref K2.png`, and build one artifact page showing K0–K7 in order at 280 px and 440 px for the owner. **No Kling credits are spent until the owner approves this page.**

---

### Task 6: [Owner] Kling clips 1–8

Kling settings for every clip: Image to Video → **Start & End frame**, model Kling 3.0 Pro (professional mode), 1080p, **5 s**, sound off, relevance high. Generate up to 3 takes; keep the best.

Negative prompt for every clip:

```
text, letters, words, distorted emblem, blue light, cyan light, floor, ground, shadow, vignette, gradient background, extra hands, distorted face, flicker, fast motion, camera shake
```

**The chain rule.** Clip 1 starts at `K0.png`. Every later clip starts at the **actual last frame of the approved previous clip**, not the designed keyframe; the end frame is always the designed keyframe. Export the last frame with:

```bash
C=~/NexxVantage-film/03-clips
ffmpeg -sseof -0.05 -i $C/clip-N.mp4 -frames:v 1 -update 1 $C/clip-N-last.png
```

Save each approved clip as `~/NexxVantage-film/03-clips/clip-N.mp4`. After each, Claude extracts the last frame, compares it with the next keyframe using the Read tool, and flags drift in the robot, client or mark before the next clip is generated.

| Clip | Start | End | Prompt |
|---|---|---|---|
| 1 | `K0.png` | `K1.png` | A tiny glowing gold point pulses twice in a flat dark navy void, then lines of white and gold light draw outward from it, tracing a geometric emblem stroke by stroke until the emblem is complete and glows softly. Static camera. Slow, smooth, elegant. |
| 2 | `clip-1-last.png` | `K2.png` | Thin gold light rays shoot out from the emblem's gold centre. At the end of each ray a holographic glass screen flickers into existence, then the screens drift outward and settle into a slow orbit around the emblem. Static camera. Slow, smooth motion; the screens' content stays steady. |
| 3 | `clip-2-last.png` | `K3.png` | The screens keep orbiting slowly. A friendly round pearl-white robot with an orbiting gold ring floats gently in from the right, reaches out with a floating sphere hand and draws one phone screen out of the orbit to hover beside it. Gentle floating motion. Static camera. |
| 4 | `clip-3-last.png` | `K4.png` | The robot taps the phone screen twice with its sphere hand. The screen ripples like water, glows, and unfolds into a hologram of a smiling woman's head and shoulders made of gold light, who begins talking warmly to the robot. Static camera. Smooth. |
| 5 | `clip-4-last.png` | `K5.png` | The robot gestures toward the orbiting screens. One wide screen glides forward and the others slide into a neat layered stack behind it, while the camera slowly drifts so the emblem moves to the left side of the frame, the stack settles in the centre and the robot and the woman end on the right. Slow, smooth camera move. |
| 6 | `clip-5-last.png` | `K6.png` | The robot makes small precise gestures toward the front screen. The gold wireframe on the screen fills in section by section into a finished app interface, and a chat panel slides in on its right side. The woman leans in, points at the screen and smiles. Static camera. Smooth, deliberate. |
| 7 | `clip-6-last.png` | `K7.png` | The woman nods happily, then dissolves into glowing gold particles that swirl together into a large gold check mark in the same place. Static camera. Smooth, restrained. |
| 8 | `clip-7-last.png` | `K1.png` | The robot gives a small friendly wave. The check mark, the stacked screens and the robot fold back along the gold rays and are absorbed into the emblem, while the camera drifts back so the emblem returns to the centre of the frame, alone and glowing. Slow, smooth. |

Clip 9 is not generated: it is clip 1 reversed (Task 7).

---

### Task 7: [Owner + Claude] Edit in Resolve, then encode and verify

**Files:**
- Create: `scripts/hero-film/encode.sh`, `scripts/hero-film/verify-film.mjs`
- Produces: `~/NexxVantage-film/04-master/hero-master.mov`; `public/hero-film/hero-film.av1.mp4`, `hero-film.h264.mp4`, `poster.webp`, `still.webp`

**Interfaces:**
- `scripts/hero-film/encode.sh <master.mov> <still-seconds>` writes the four files in `public/hero-film/`.
- `node scripts/hero-film/verify-film.mjs` exit 0 = all gates pass.

- [ ] **Step 1: [Owner] Resolve edit**

1. New project, timeline 1080×1080, 30 fps. Import `clip-1.mp4` … `clip-8.mp4` and lay them end to end.
2. Add `clip-1.mp4` again at the end; right-click → Change Clip Speed → Reverse, speed 167% (≈3 s).
3. Put a 4-frame cross-dissolve on every cut (covers any residual drift in the chain).
4. Speed-ramp (Retime Controls) the orbit in clip 2 and the stack in clip 5 so the total lands at 37–39 s.
5. Color page, one node on the whole timeline: lift/offset until the background reads `R15 G30 B53` with the colour picker in several corners of several clips.
6. During clip 7, add a Text+ title "Approved", font Space Grotesk Medium, colour `#C9A84C`, centred about 8% below the tick, 0.4 s fade in when the tick forms, fade out as clip 8 starts.
7. Deliver: QuickTime, Apple ProRes 422 HQ, 1080×1080, 30 fps, no audio → `~/NexxVantage-film/04-master/hero-master.mov`. Note the timecode where K6 (finished app, client smiling) is fully visible, in seconds, for Step 2.

- [ ] **Step 2: [Claude] Write the verify script first**

`scripts/hero-film/verify-film.mjs`:

```js
// Gate the encoded hero film. Run: node scripts/hero-film/verify-film.mjs
// Checks each encode decodes to a #0F1E35 background, loops without a seam, and meets the size gates.
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { statSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DIR = "public/hero-film";
const TARGET = [15, 30, 53];
const BG_TOL = 2;          // per-channel levels the decoded background may differ by
const SEAM_MAX = 4;        // mean absolute difference (0-255) allowed between last and first frame
const SIZES = { "hero-film.av1.mp4": 3e6, "hero-film.h264.mp4": 6e6, "poster.webp": 20e3, "still.webp": 120e3 };
const tmp = mkdtempSync(join(tmpdir(), "hf-verify-"));
let ok = true;
const fail = (m) => { ok = false; console.log(`  FAIL ${m}`); };

const grab = (file, args, out) => {
  execFileSync("ffmpeg", ["-v", "error", ...args, "-i", file, "-frames:v", "1", "-update", "1", "-y", out]);
  return sharp(out).removeAlpha().raw().toBuffer({ resolveWithObject: true });
};
const corners = ({ data, info }) => {
  const s = Math.round(info.width * 0.03), pts = [];
  for (const [x, y] of [[s, s], [info.width - s, s], [s, info.height - s], [info.width - s, info.height - s]]) {
    const i = (y * info.width + x) * info.channels;
    pts.push([data[i], data[i + 1], data[i + 2]]);
  }
  return pts;
};
const mad = (a, b) => { let s = 0; for (let i = 0; i < a.data.length; i++) s += Math.abs(a.data[i] - b.data[i]); return s / a.data.length; };

for (const [name, max] of Object.entries(SIZES)) {
  const bytes = statSync(join(DIR, name)).size;
  console.log(`${name}  ${(bytes / 1e6).toFixed(2)} MB`);
  if (bytes > max) fail(`${name} is ${bytes} bytes, gate is ${max}`);
}
for (const name of ["hero-film.av1.mp4", "hero-film.h264.mp4"]) {
  const f = join(DIR, name);
  console.log(`\n${name}`);
  const first = await grab(f, [], join(tmp, `${name}-first.png`));
  const mid = await grab(f, ["-ss", "20"], join(tmp, `${name}-mid.png`));
  const last = await grab(f, ["-sseof", "-0.04"], join(tmp, `${name}-last.png`));
  for (const [label, fr] of [["first", first], ["mid", mid], ["last", last]]) {
    for (const p of corners(fr)) {
      const d = Math.max(...p.map((v, i) => Math.abs(v - TARGET[i])));
      if (d > BG_TOL) fail(`${label} frame corner decodes to [${p}] (target [${TARGET}], off by ${d})`);
    }
  }
  const seam = mad(first, last);
  console.log(`  loop seam: mean difference ${seam.toFixed(2)} (gate ${SEAM_MAX})`);
  if (seam > SEAM_MAX) fail(`loop seam ${seam.toFixed(2)} > ${SEAM_MAX}`);
}
console.log(ok ? "\nVERIFY: PASS" : "\nVERIFY: FAIL");
process.exitCode = ok ? 0 : 1;
```

- [ ] **Step 3: [Claude] Run it to verify it fails**

Run: `node scripts/hero-film/verify-film.mjs`
Expected: FAIL with `ENOENT … public/hero-film/hero-film.av1.mp4` (nothing encoded yet).

- [ ] **Step 4: [Claude] Write the encoder**

`scripts/hero-film/encode.sh`:

```bash
#!/usr/bin/env bash
# Encode the hero film master for the site. Usage: scripts/hero-film/encode.sh <master.mov> <still-seconds>
set -euo pipefail
in="$1"; still_t="$2"; out=public/hero-film
mkdir -p "$out"
tags=(-color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv)
vf="scale=1080:1080:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p"
ffmpeg -v error -y -i "$in" -an -vf "$vf" -c:v libsvtav1 -preset 5 -crf 40 -g 300 "${tags[@]}" -movflags +faststart "$out/hero-film.av1.mp4"
ffmpeg -v error -y -i "$in" -an -vf "$vf" -c:v libx264 -preset slow -crf 25 -profile:v high -g 300 "${tags[@]}" -movflags +faststart "$out/hero-film.h264.mp4"
ffmpeg -v error -y -i "$in" -frames:v 1 "$out/poster.png"
ffmpeg -v error -y -ss "$still_t" -i "$in" -frames:v 1 "$out/still.png"
node -e "const s=require('sharp');Promise.all([s('$out/poster.png').resize(880).webp({quality:80}).toFile('$out/poster.webp'),s('$out/still.png').resize(880).webp({quality:78}).toFile('$out/still.webp')]).then(()=>console.log('stills written'))"
rm "$out/poster.png" "$out/still.png"
ls -l "$out"
```

Run: `chmod +x scripts/hero-film/encode.sh`

- [ ] **Step 5: [Claude] Encode and verify**

```bash
scripts/hero-film/encode.sh ~/NexxVantage-film/04-master/hero-master.mov <K6-seconds-from-Step-1>
node scripts/hero-film/verify-film.mjs
```

Expected: `VERIFY: PASS`. If a size gate fails, raise `-crf` by 3 for that codec and re-run. If the background is off, the fix is in Resolve Step 1.5, not in the encoder. If the seam fails, the owner tightens the reversed clip's end in Resolve.

- [ ] **Step 6: Commit**

```bash
git add scripts/hero-film/encode.sh scripts/hero-film/verify-film.mjs public/hero-film
git commit -m "feat(hero-film): encode and verify the hologram film"
```

---

### Task 8: [Claude] HeroFilm component in the hero

**Files:**
- Create: `src/components/hero-film/HeroFilm.tsx`
- Modify: `src/components/sections/HeroMovement.tsx` (imports at lines 3–8, `can3D`/`canvasReady`/`t` at lines 24–26, the square at lines 59–76)

**Interfaces:**
- Consumes: `public/hero-film/hero-film.av1.mp4`, `hero-film.h264.mp4`, `poster.webp`, `still.webp` (Task 7).
- Produces: `export default function HeroFilm({ className }: { className?: string })`.

- [ ] **Step 1: Create the component**

`src/components/hero-film/HeroFilm.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

const BASE = "/hero-film";

// Fade the outer 5% so a codec's step of drift on the flat background can never draw the square.
const feather = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(to bottom, transparent, #000 5%, #000 95%, transparent)",
  WebkitMaskComposite: "source-in",
  maskImage:
    "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(to bottom, transparent, #000 5%, #000 95%, transparent)",
  maskComposite: "intersect",
} as const;

/** The hero film: muted autoplay loop, loaded after the page and only while on screen. */
export default function HeroFilm({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reduced || saveData) {
      setStill(true);
      return;
    }

    let loaded = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        v.pause();
        return;
      }
      if (!loaded) {
        loaded = true;
        v.querySelectorAll("source").forEach((s) => (s.src = s.dataset.src ?? ""));
        v.load();
      }
      v.muted = true; // autoplay is only allowed muted; set the property, not just the attribute
      v.play().catch(() => setStill(true)); // autoplay refused (e.g. iOS Low Power Mode)
    });
    const start = () => io.observe(v);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      io.disconnect();
      window.removeEventListener("load", start);
    };
  }, []);

  if (still) {
    // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized
    return <img src={`${BASE}/still.webp`} alt="" aria-hidden="true" className={className} style={feather} />;
  }
  return (
    <video
      ref={ref}
      className={className}
      style={feather}
      poster={`${BASE}/poster.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      <source data-src={`${BASE}/hero-film.av1.mp4`} type='video/mp4; codecs="av01.0.08M.08"' />
      <source data-src={`${BASE}/hero-film.h264.mp4`} type="video/mp4" />
    </video>
  );
}
```

- [ ] **Step 2: Swap it into the hero**

In `src/components/sections/HeroMovement.tsx`:

Replace the imports

```tsx
import { motion, useMotionValue } from "motion/react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import MarkStatic from "@/components/mark/MarkStatic";
import MarkCanvas from "@/components/mark/MarkCanvas";
import { useCan3D } from "@/lib/useCan3D";
import { HOME } from "@/lib/constants";
```

with

```tsx
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import HeroFilm from "@/components/hero-film/HeroFilm";
import { HOME } from "@/lib/constants";
```

Delete these three lines from the component body:

```tsx
  const can3D = useCan3D();
  const [canvasReady, setCanvasReady] = useState(false);
  const t = useMotionValue(0); // hero mark stays assembled
```

Replace the whole square block (from `{/* The mark: static SVG is the SSR/LCP element; canvas cross-fades over it */}` to its closing `</div>`) with:

```tsx
        {/* The film: flat #0F1E35 frame on the #0F1E35 hero, so the square itself is invisible */}
        <div className="relative mx-auto h-[280px] w-[280px] md:h-[440px] md:w-[440px]">
          <HeroFilm className="absolute inset-0 h-full w-full object-cover" />
        </div>
```

`MarkStatic`, `MarkCanvas`, `MarkScene` and `useCan3D` stay in the codebase: `MethodCTA.tsx` still uses `MarkCanvas`.

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: no lint errors; build succeeds; `out/hero-film/` contains the four files.

- [ ] **Step 4: Start the dev server**

Run (background): `npm run dev` and wait for `Ready`.

- [ ] **Step 5: [Claude] Browser checks with the Playwright MCP tools**

Navigate to `http://localhost:3000/`, viewport 1440×900. Then evaluate:

```js
() => new Promise(r => setTimeout(() => {
  const v = document.querySelector("section video");
  const reqs = performance.getEntriesByType("resource").filter(e => e.name.includes("/hero-film/") && e.name.endsWith(".mp4"));
  const nav = performance.getEntriesByType("navigation")[0];
  r({ playing: !!v && !v.paused, t: v?.currentTime, src: v?.currentSrc,
      mp4BeforeLoad: reqs.some(e => e.startTime < nav.loadEventEnd) });
}, 4000))
```

Expected: `playing: true`, `t > 2`, `src` ends with `.av1.mp4` in Chromium, `mp4BeforeLoad: false`.

- [ ] **Step 6: [Claude] The Review Focus checks**

1. **Background match:** take a screenshot, then with `sharp` read the pixel 30 px inside the square's left edge and 30 px outside it; both must be within 2 levels of `[15,30,53]`.
2. **Reduced motion:** `browser_emulate_media` with `reducedMotion: "reduce"`, reload, evaluate `({ img: !!document.querySelector('section img[src$="still.webp"]'), video: !!document.querySelector('section video'), mp4: performance.getEntriesByType('resource').some(e => e.name.endsWith('.mp4')) })`. Expected `{ img: true, video: false, mp4: false }`. Reset the emulation afterwards.
3. **Autoplay refused:** with `browser_run_code_unsafe` run
   ```js
   async (page) => {
     await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new Error("blocked")); });
     await page.reload();
     await page.waitForTimeout(4000);
     return page.evaluate(() => !!document.querySelector('section img[src$="still.webp"]'));
   }
   ```
   Expected: `true` (the still is shown, not a paused gold point). Open a fresh page afterwards so the override is gone.
4. **Mobile:** viewport 390×844, reload, scroll the square into view; expected `playing: true` once visible and a 280 px square.
5. **Light theme:** evaluate `document.documentElement.dataset.theme = "light"`; screenshot; the hero stays midnight and the square is still invisible.

- [ ] **Step 7: [Owner] Safari check**

Open `http://localhost:3000/` in Safari (desktop) and on an iPhone on the same network (`http://<mac-ip>:3000/`). Expected: the film plays (H.264 on older devices), and no square edge is visible against the hero.

- [ ] **Step 8: Commit**

```bash
git add src/components/hero-film/HeroFilm.tsx src/components/sections/HeroMovement.tsx
git commit -m "feat(hero): play the hologram film in the hero square"
```
