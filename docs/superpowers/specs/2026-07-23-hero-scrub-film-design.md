# Hero Scroll-Scrub Film — "The Atelier Commission"

**Date:** 2026-07-23
**Status:** Approved in brainstorming (owner decisions recorded inline)
**Scope:** Replace the homepage hero's idle 3D mark with a scroll-scrubbed, image-sequence film that shows a client's software being made for them; the scrub engine, fallbacks, the AI production pipeline (prompt kit + post checklist), and the resulting simplification of the Method section.

---

## 1. Goal and decisions

The hero must make a visitor feel: *this is my product, built from my own thinking, by people with the highest technical craft, in the order my business needs — and it will run at full speed.* It must look like a living part of the page, not a video.

Owner decisions (all locked):

| Decision | Choice |
|---|---|
| Placement | The hero **is** the film. Method section loses its exploded-mark scrub (no repeated trick). |
| Story | Atelier spine (unseen craftsman's bench) + blueprint beat + one exploded hold. **No logo geometry carries meaning.** The mark appears once, as the maker's signature part. |
| Frame | Square 1:1, right half on desktop, stacked on mobile (existing hero grid). Outer ~5% of every frame is the exact `--nv-hero-bg` hex. |
| Themes | Dark film first. Light "white studio" sibling only if dark succeeds. Hero stays velvet-midnight in light mode until then (`.nv-velvet` already does this). |
| Delivery | Image-sequence scrub on `<canvas>` (AVIF + WebP). Never `<video>` (seek jank, codec colour shift). |
| Text | All captions, wordmark, closing line, CTAs are HTML beside the film. In-film text only on the brief card and the mark glyph — both composited in post, never generated. |
| Production | Stills: Gemini (Nano Banana) / Draw Things. Hero clips: Kling 3.0 Pro on the Standard plan (commercial licence, 1080p, start+end frame). Low-stakes clips + variants: LTX-2 local on the M4 Pro. Post: DaVinci Resolve + ffmpeg. |

---

## 2. The film — beat sheet

Eight beats, one bench, midnight velvet, single warm key light from upper-left. Scroll progress `p ∈ [0,1]` splits into eight equal slices; 144 frames (18 per beat); nine boundary stills S0–S8 sit at frames 0, 18, … 144. Each beat's clip is generated **from still Sn to still Sn+1**.

| # | Beat | p range | What the frame shows (S_start → S_end) | Caption (HTML, draft — owner locks) |
|---|---|---|---|---|
| 1 | Still life | 0–.125 | S0 brief card resting on the bench, nothing else moving → S1 calipers have closed on one line of the words; gold readout glows. Hero headline/sub/CTAs visible in HTML; no caption. | — |
| 2 | Drawn | .125–.25 | S1 → S2 the measured words unravel into gold ink that draws a technical plan across the bench — the floor plan of *their* product, dimensions annotated with fragments of their sentence. | **DRAWN** · Your goal, your problems, your plan — drawn from your words, not a template. |
| 3 | Machined | .25–.375 | S2 → S3 the plan's dimensions feed a milling head; a gold module is cut, shavings catch the light; ends on a macro of the finished part. | **MACHINED** · Every part cut to your spec, by senior hands. |
| 4 | Assembled | .375–.5 | S3 → S4 precision tweezers seat the module into the obsidian chassis; two more parts arrive and seat in rhythm; device nearly complete. | **ASSEMBLED** · Built in the order your business needs it. |
| 5 | Opened | .5–.625 | S4 → S5 assembly pauses: the device lifts and suspends apart into four named layers — interface glass, workflow boards, gold AI core, infrastructure lattice — slow quarter-turn. | **OPENED** · No sealed boxes. Every layer visible, every layer yours. |
| 6 | Sealed | .625–.75 | S5 → S6 layers glide home, glass closes; a small blank gold module waits above an empty recess on the device's edge. | **SEALED** · Closed only when every layer is right. |
| 7 | Signed | .75–.875 | S6 → S7 tweezers lower the module into the recess; it seats — one gold glint — and *that* wakes the device: the screen blooms, first gold threads of traffic flow. (The NexxVantage mark is composited onto this module in post.) | **SIGNED** · The last part we fit is our name. |
| 8 | Running | .875–1 | S7 → S8 camera eases back; device settles to its resting angle, alive, threads streaming. S8 is also the poster frame. HTML beside it: mark + wordmark rise, closing line, CTAs. | **RUNNING** · Your product. Our movement inside. At full speed. |

Caption placement: desktop — left column, replaces headline block after beat 1 (cross-fade at slice boundaries); mobile — directly below the square. Caption labels are the only words on screen during beats 2–7. The caliper measurement lands at the end of beat 1 while the hero headline is still up — it is the hook, not a captioned beat.

Brief-card sentence (in-film, post-composited, ≤ 7 words, owner may replace): `Every quote takes us three days.`

---

## 3. The stage — layout in the page

- Section: `min-height: 450vh` (tunable constant `HERO_SCRUB_VH`), inner wrapper `position: sticky; top: 0; height: 100svh`, same two-column grid as today's `HeroMovement`.
- Square slot: `280px` mobile, `440px` desktop (unchanged). Film canvas fills it; `box-shadow: inset 0 0 24px 12px var(--nv-hero-bg)` feathers the edge ring onto the page.
- At `p = 0` the hero reads as a normal hero: overline, H1 `Create your own Dimensions.`, subline, both CTAs. Nothing moves until scroll. CTAs are reachable without scrubbing.
- At `p ≥ .875` the left column shows: MarkStatic + wordmark, closing line (draft: *Every engagement starts with a conversation, not a quote.*), primary CTA `Book a consultation`, ghost `See the craft`.
- Native scroll only (sticky pin, no scroll-jacking). A thin vertical progress rail with eight ticks sits at the square's right edge on desktop.

---

## 4. The scrub engine

**Assets** — `public/hero-film/dark/{900,600}/f-000.avif … f-143.avif` plus `.webp` siblings, and `poster.avif` (= f-143, S8). Mobile (`<768px`) loads the 600 set. Built by `scripts/hero-film/build.ts` from `masters/*.png` (1080²) using the already-installed `sharp`.

**Component boundaries** (new files; `HeroMovement.tsx` is replaced):

- `src/components/sections/HeroFilm.tsx` — section, sticky layout, HTML text states, progress rail. Owns `useScroll` (motion/react, already used in `MethodCTA`) → `p`.
- `src/components/hero-film/FilmCanvas.tsx` — `<img poster priority>` always in DOM (LCP, no-JS), `<canvas aria-hidden>` overlaid once the first frames decode; draws `frames[round(p*143)]`, falling back to the nearest *loaded* lower frame.
- `src/components/hero-film/useFrameSequence.ts` — loads frames coarse-to-fine: every 4th, then every 2nd, then fill; `Image` objects with `decode()`; returns `{ get(frame), ready }`. `ponytail:` relies on the browser decode cache; add a ±12-frame `ImageBitmap` window if mobile memory complaints appear.
- `src/lib/hero-film.ts` — `HERO_SCRUB_VH`, `FRAME_COUNT = 144`, beat table (caption copy lives in `constants.ts` with the rest of HOME copy).

**Fallbacks** (all render the poster, no pin, captions omitted):

- `prefers-reduced-motion` (via existing `useReducedMotionSafe`)
- `navigator.connection.saveData === true`
- JS disabled — poster `<img>` is server-rendered, section height collapses to `100svh` via a `no-js` class toggle in the existing `layout.tsx` pattern.

**Accessibility** — canvas is decorative (`aria-hidden`); captions are real text; the poster `alt` describes the device; heading order unchanged (H1 stays in the hero).

**Performance gates** — poster ≤ 50 KB; 900-set ≤ 6 MB, 600-set ≤ 3 MB total; first interactive frame within 1 s on 4G; no layout shift (square has fixed dimensions).

**Animatic** — `scripts/hero-film/animatic.ts` renders 144 SVG frames (parametric per beat, brand palette) through `sharp` into the *same* asset layout. The engine has no animatic-specific code; the AI frames replace files one-for-one.

---

## 5. Homepage ripples

- `MethodCTA.tsx`: remove pin/scrub, `MarkCanvas`, `useCan3D`; keep the four `METHOD_PHASES` rows with the existing fade-in (`AnimatedSection`) and the `Read the full method →` link; CTA block shows `MarkStatic` (assembled) with no motion.
- `MarkCanvas.tsx`, `MarkScene.tsx`, `useCan3D.ts`: delete if no consumer remains after the above (expected: none).
- Rhythm becomes: **film → calm → calm → gallery (wow) → calm → calm → resolution.** The `/method` page's sticky phase diagram is untouched and remains the deep dive.

---

## 6. Production pipeline (owner runbook)

| Step | Tool | Output | Cost |
|---|---|---|---|
| 1 Reference pack | Gemini (Nano Banana) or Draw Things | 4–8 stills: device from 3 angles + bench/lighting, all 1:1 | $0 |
| 2 Keyframes | same, **edit mode** (derive from approved stills, never regenerate fresh) | S0–S8, 1:1, ≥ 1024² | $0 — **approval gate before any video** |
| 3 Bake-off | Kling 3.0 Pro vs LTX-2 local, beat 3 (machining), same S3→S4 | pick per-beat assignment | ≈ 40 credits |
| 4 Clips | Kling Standard plan: beats 2–7 (hero takes, best of 3); LTX-2 local: beats 1 and 8 + variants | 8 clips, 1080p, 4–8 s, audio off | ≈ $7–16, cancel after |
| 5 Post | DaVinci Resolve (free) | 144 PNG stills 1080² | $0 |
| 6 Ship | `scripts/hero-film/build.ts` | AVIF/WebP sets, poster | — |
| 7 Light sibling | relight S0–S8 in edit mode → repeat 3–6 | `public/hero-film/light/` | only if dark lands |

Kling settings: Image-to-video, **Start & End frame** = Sn / Sn+1, Professional mode, 1080p, duration 5 s (8 s for beats 2 and 5), sound off, creativity/relevance toward *relevance*. Output aspect follows the input stills (square).

---

## 7. Prompt kit

**Global style block** (prepend to every still and clip prompt):
> Luxury product cinematography, macro lens, shallow depth of field. Deep midnight navy velvet workbench (#0F1E35) under a single warm key light from upper-left; background falls to solid dark navy at all edges, no gradients touching the frame edge. Materials: obsidian black glass, brushed gold (#C9A84C), dark machined metal. No people, no hands, no text, no logos, no watermarks. Square composition, subject centred with generous margin.

**Negative block:** `hands, fingers, person, text, letters, numbers, logo, watermark, lens flare streaks, bright white background, busy background, motion blur smear, extra objects`

**Device design brief (step 1):** a slim obsidian glass slab with softly rounded corners, about the proportion of a closed notebook, standing at a slight resting angle on a low dark stand; a thin brushed-gold rim; three small rectangular gold modules set flush into its edge; a single empty recess beside them. Keep the geometry simple — it must survive eight regenerations.

**Keyframe stills (step 2)** — each begins with the global block, then:

- **S0** — a small ivory paper brief card lies on the bench at a slight angle, soft text blur visible, the device faint in the background shadow.
- **S1** — a fine steel vernier caliper closed around one line of the card, a small glowing gold numeric readout beside it.
- **S2** — a technical plan drawn in thin luminous gold ink across the bench surface: rectangles, dimension lines, annotation ticks; the card at the edge of frame.
- **S3** — macro of a freshly machined brushed-gold module on the bench, a few curled gold shavings beside it, a milling head withdrawn at top of frame.
- **S4** — the obsidian device standing on its stand, three gold modules seated in its edge, precision tweezers withdrawing at top of frame.
- **S5** — the device suspended mid-air, separated into four floating horizontal layers with even gaps: a clear glass plate on top, a dark board with fine gold traces, a small glowing gold core, a thin lattice frame below.
- **S6** — the device reassembled and standing, glass closed, one empty recess on its edge; a small blank gold module held in tweezers just above it.
- **S7** — the module seated in the recess with a single gold glint; the device's screen glowing softly with abstract light and thin gold threads beginning to flow across the bench.
- **S8** — the device at rest, screen alive with soft light, gold threads of light streaming across the bench and into the dark.

**Clip motion prompts (step 4)** — start frame Sn, end frame Sn+1, global block, then only the motion:

1. `Nothing moves but the light: a slow breath of the key light across the card; in the last second the caliper enters from the right and closes on one line.`
2. `The measured line lifts off the card as glowing gold ink and flows onto the bench, drawing rectangles and dimension lines in one continuous stroke.`
3. `The milling head descends once, cuts in a slow pass, gold shavings curl away and settle; camera pushes in to a macro of the finished module.`
4. `Tweezers lower the module into the device edge; it seats with a soft settle; two further modules arrive the same way in rhythm; tweezers withdraw.`
5. `The device lifts and its layers separate vertically with even spacing, rotating a slow quarter-turn; camera orbits slightly; everything stays in focus.`
6. `The layers glide back together and the glass closes; tweezers enter carrying a small blank gold module and hold it above the recess.`
7. `The module lowers and seats; one sharp gold glint; the screen blooms on from the centre outward; thin gold threads begin to flow across the bench.`
8. `Camera eases back slowly; the device settles into its resting angle; light threads stream steadily; the scene comes to rest.`

Retry rule: generate three takes per beat; reject any take where the device geometry, module count, or stand changes; prefer the take whose last frame is closest to Sn+1.

---

## 8. Post checklist (Resolve)

1. Import clips in beat order; trim each to the steady motion (cut generator warm-up/wind-down frames).
2. Conform timeline to 1080×1080, 24 fps; retime each beat to **18 frames** of export (use speed ramps, not frame drops, so scrub motion stays smooth).
3. Edge ring: square vignette/matte so the outer 5% of every frame is solid `#0F1E35`; feather inward 6–8%. This also removes any corner watermark.
4. Grade: lift gold toward `#C9A84C`; crush background to the exact hex; verify with the colour picker on the corner pixels of three random frames.
5. Planar-track the NexxVantage mark SVG (gold, matte finish) onto the seated module, beats 7–8 only. Planar-track the brief-card sentence (Inter, ivory, slight blur) onto the card, beats 1–2.
6. Export PNG image sequence `f-000 … f-143`; poster = `f-143`.
7. Run `scripts/hero-film/build.ts`; check set sizes against §4 gates.

---

## 9. Acceptance

- Scrubbing both directions is frame-exact with no visible pop; corner pixels of the live canvas equal the CSS background in both directions of the feather.
- At `p = 0` the hero passes the existing accessibility and LCP gates; CTAs are clickable without scrolling.
- Reduced-motion, save-data, and no-JS each render the poster hero with CTAs.
- Method section renders without WebGL; no `MarkCanvas` import remains.
- The film contains no wordmark, no CTA, and no logo other than the post-composited signature glyph.

## 10. Later (explicitly out of scope now)

Light sibling (§6 step 7); 600-set frame-count reduction if mobile memory proves tight; per-beat sound design (none — silent film).
