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
| Story | Atelier spine (tools enter and withdraw; the maker is never seen) + blueprint beat + one exploded hold. The mark appears **twice, with two meanings**: beat 7 as the maker's signature part, beat 8 as what the finished product is *running*. No device geometry is a disguised logo — the mark is only ever the mark. |
| Frame | Square 1:1, right half on desktop, stacked on mobile (existing hero grid). **The whole background is the exact `--nv-hero-bg` hex** — the subject floats in the page, so the frame's rectangle is invisible. No bench, no surface, no floor, no horizon line, no vignette, no cast shadow. |
| Themes | One film, both site themes — no light sibling. `.nv-velvet` re-pins `--nv-hero-bg` to `--nv-midnight-500` (`#0F1E35`) even under `data-theme="light"`, so the hero is midnight either way and a single frame set blends in both. |
| Delivery | Image-sequence scrub on `<canvas>` (AVIF + WebP). Never `<video>` on the site (seek jank, codec colour shift). The same 144 frames also export **once** as a seamless looping MP4 for off-site use — social, decks, email. The site never loads it. |
| Text | All captions, wordmark, closing line and CTAs are HTML beside the film. The **mark is in-film only** — there is no `<Logo />` in the closing HTML block. In-film graphics are limited to the brief-card sentence and the mark, both composited in post, never generated. |
| Production | Stills: Gemini (Nano Banana) / Draw Things. All 8 clips: Kling 3.0 Pro on the Standard plan (commercial licence, 1080p, start+end frame). Local video generation was evaluated and rejected (see runbook Appendix B). Post: DaVinci Resolve + ffmpeg. |

---

## 2. The film — beat sheet

Eight beats, no set. Every subject floats in flat `#0F1E35` under a single warm key light from upper-left; tools enter frame and withdraw; nothing rests on anything. Scroll progress `p ∈ [0,1]` splits into eight equal slices; 144 frames (18 per beat); nine boundary stills S0–S8 sit at frames 0, 18, … 144. Each beat's clip is generated **from still Sn to still Sn+1**.

**The film loops.** `f-143` must sit next to `f-000` without a seam, so that scrubbing back up reads as a return rather than a rewind and the exported MP4 can autoplay on repeat. Beat 8 therefore ends on the mark alone in flat `#0F1E35` — the one frame with no card, no tool and no device — from which the next brief card can enter without a cut. That hold is the loop hinge, and it is what makes the mark mean *partner across every commission* rather than *author of this one*.

| # | Beat | p range | What the frame shows (S_start → S_end) | Caption (HTML, draft — owner locks) |
|---|---|---|---|---|
| 1 | Still life | 0–.125 | S0 brief card floating alone in the field, nothing else moving → S1 calipers have closed on one line of the words; gold readout glows. Hero headline/sub/CTAs visible in HTML; no caption. | — |
| 2 | Drawn | .125–.25 | S1 → S2 the measured words unravel into gold ink that draws a technical plan in the space beside the card — the floor plan of *their* product, dimensions annotated with fragments of their sentence. | **DRAWN** · Your goal, your problems, your plan — drawn from your words, not a template. |
| 3 | Machined | .25–.375 | S2 → S3 the plan's dimensions feed a milling head; a gold module is cut, shavings catch the light; ends on a macro of the finished part. | **MACHINED** · Every part cut to your spec, by senior hands. |
| 4 | Assembled | .375–.5 | S3 → S4 precision tweezers seat a gold module into the top plate; a second arrives and seats in rhythm; two of the three bays are filled and one is left open. | **ASSEMBLED** · Built in the order your business needs it. |
| 5 | Opened | .5–.625 | S4 → S5 assembly pauses: the device lifts and suspends apart into four named layers — interface glass, workflow boards, gold AI core, infrastructure lattice — slow quarter-turn. | **OPENED** · No sealed boxes. Every layer visible, every layer yours. |
| 6 | Sealed | .625–.75 | S5 → S6 layers glide home, glass closes; a small blank gold module is held between both tweezer tines directly above the empty recess on the device's edge. | **SEALED** · Closed only when every layer is right. |
| 7 | Signed | .75–.875 | S6 → S7 tweezers lower the third and final module into the empty recess; it seats — one gold glint — and *that* wakes the device: the screen blooms, first gold threads of traffic stream outward. (The NexxVantage mark is composited onto this module in post.) | **SIGNED** · The last part we fit is our name. |
| 8 | Running | .875–1 | S7 → S8 camera eases back; the device settles, alive. The gold threads that have run through every beat gather onto its screen and resolve into the NexusMark — the mark is what the product is *running*, not a stamp on its shell. The device then recedes and the mark holds alone on flat `#0F1E35`. S8 (mark alone) is the poster frame and the loop hinge. HTML beside it: wordmark, closing line, CTAs — no logo. | **RUNNING** · Your product. Our movement inside. At full speed. |

Caption placement: desktop — left column, replaces headline block after beat 1 (cross-fade at slice boundaries); mobile — directly below the square. Caption labels are the only words on screen during beats 2–7. The caliper measurement lands at the end of beat 1 while the hero headline is still up — it is the hook, not a captioned beat.

Brief-card sentence (in-film, post-composited, ≤ 7 words, owner may replace): `Every quote takes us three days.`

Beat 8 frame budget — 18 frames (126–143): roughly 8 for the ease-back and thread gather, 6 for the mark resolving on the screen, 4 for the device receding to the mark-alone hold. The hold is pure compositing over a flat field: no generation, and it encodes to almost nothing, which is why `f-143` also makes a better poster than a photograph of the device.

---

## 3. The stage — layout in the page

- Section: `min-height: 450vh` (tunable constant `HERO_SCRUB_VH`), inner wrapper `position: sticky; top: 0; height: 100svh`, same two-column grid as today's `HeroMovement`.
- Square slot: `240px` mobile (was 280 — shrunk so the beat-0 copy and both CTAs fit inside a pinned `100svh` on phones; `ponytail:` the ghost CTA may touch the bottom edge at 375×667 and is reachable again at the final beat), `440px` desktop (unchanged). Film canvas fills it. The `box-shadow: inset 0 0 24px 12px var(--nv-hero-bg)` feather stays as insurance only — with the whole frame already on `--nv-hero-bg` there is no edge to hide, and it can be reduced or dropped once real frames are in.
- At `p = 0` the hero reads as a normal hero: overline, H1 `Create your own Dimensions.`, subline, both CTAs. Nothing moves until scroll. CTAs are reachable without scrubbing.
- At `p ≥ .875` the left column shows: wordmark, the RUNNING caption and its line from §2, primary CTA `Book a consultation`, ghost `See the craft`. **No `MarkStatic`** — the mark is carried by the film at that moment, and two marks side by side halve the impact of each.
- Native scroll only (sticky pin, no scroll-jacking). A thin vertical progress rail with eight ticks sits at the square's right edge on desktop.

---

## 4. The scrub engine

**Assets** — `public/hero-film/dark/{900,600}/f-000.avif … f-143.avif` plus `.webp` siblings, and `poster.avif` (= f-143, S8). Mobile (`<768px`) loads the 600 set. Built by `scripts/hero-film/build.mjs` from `masters/*.png` (1080²) using `sharp` (devDependency).

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

**Mark legibility** — a mark composited onto a module measures roughly 22–25 px at the 240 px mobile size: a glint, not a read. On mobile the mark is carried by **beat 8's screen resolve**; the module mark is a 440 px desktop detail. Choose the screen rectangle once on the parent reference and reuse those exact coordinates for all eight composites, so the mark does not wander between keyframes.

**Performance gates** — poster ≤ 50 KB; 900-set ≤ 6 MB, 600-set ≤ 3 MB total; first interactive frame within 1 s on 4G; no layout shift (square has fixed dimensions).

**Animatic** — `scripts/hero-film/animatic.mjs` renders 144 SVG frames (parametric per beat, brand palette) through `sharp` into the *same* asset layout. The engine has no animatic-specific code; the AI frames replace files one-for-one.

---

## 5. Homepage ripples

- `MethodCTA.tsx`: remove pin/scrub, `MarkCanvas`, `useCan3D`; keep the four `METHOD_PHASES` rows with the existing fade-in (`AnimatedSection`) and the `Read the full method →` link; CTA block shows `MarkStatic` (assembled) with no motion.
- `MarkCanvas.tsx`, `MarkScene.tsx`, `useCan3D.ts`: delete if no consumer remains after the above (expected: none).
- Rhythm becomes: **film → calm → calm → gallery (wow) → calm → calm → resolution.** The `/method` page's sticky phase diagram is untouched and remains the deep dive.

---

## 6. Production pipeline (owner runbook)

| Step | Tool | Output | Cost |
|---|---|---|---|
| 1 Reference pack | Gemini (Nano Banana) or Draw Things | 3–4 stills: the device from three angles on the flat field, all 1:1. **No bench reference** — there is no set to establish. | $0 |
| 2 Keyframes | same, **edit mode** (derive from approved stills, never regenerate fresh) | S0–S8, 1:1, ≥ 1024² | $0 — **approval gate before any video** |
| 3 Clips | Kling Standard plan: all 8 beats, best of 3 takes | 8 clips, 1080p, 5–8 s, audio off | ≈ $7–16, cancel after |
| 4 Post | DaVinci Resolve (free) + ffmpeg | 144 PNG stills 1080² | $0 |
| 5 Ship | `scripts/hero-film/build.mjs` | AVIF/WebP sets, poster | — |
| 6 Loop file | one `ffmpeg` pass over the same 144 frames | seamless MP4 for social/decks/email | — |

Kling settings: Image-to-video, **Start & End frame** = Sn / Sn+1, Professional mode, 1080p, **duration 5 s for every beat**, sound off, creativity/relevance toward *relevance*. Output aspect follows the input stills (square).

> Beats 2 and 5 were previously specified at 8 s. Post retimes every beat to exactly 120 frames with Optical Flow off, and ffmpeg then decimates 960 → 144 — so an 8 s clip is nearest-neighbour crushed roughly 13:1, and the quarter-turn and the ink stroke are precisely the motions that strobe under that. Generating them at 5 s removes the double decimation and saves 48 credits a pass.

Beat 8 is generated only as far as the device settling and the threads gathering; the mark and the final recede are composited (§8).

---

## 7. Prompt kit

**Global style block** (prepend to every still and clip prompt):
> Luxury product cinematography, macro lens. A single subject floating in empty space against a completely flat, solid, uniform dark navy field (#0F1E35) that fills the entire frame edge to edge. No table, no bench, no surface, no floor, no ground plane, no horizon line, no cast shadow, no vignette, no gradient, no atmosphere, no depth haze — nothing behind the subject but flat colour. Single warm key light from upper-left. Materials: obsidian black glass, brushed gold (#C9A84C), dark machined metal. No people, no hands, no text, no logos, no watermarks. Square composition, subject centred with generous margin.

**Negative block:** `table, desk, bench, workbench, surface, floor, ground, horizon, shadow, cast shadow, reflection on surface, vignette, gradient background, fabric, velvet, carpet, texture, hands, fingers, person, text, letters, numbers, logo, watermark, lens flare streaks, bright white background, busy background, motion blur smear, extra objects`

The negative block does most of the work here. Image models default to putting objects *on* something; the flat field has to be asked for in the positive prompt and forbidden in the negative one, or the bench comes back.

**Device design brief (step 1) — settled, reference approved 2026-09-07** (`01-references/ref-device-front.png`): a laminated four-tier block floating in empty space with nothing supporting it and no shadow, seen isometrically from about 32° above. Top to bottom the tiers are **interface glass** (obsidian, carrying a large plain screen panel and the module bays), **workflow boards**, a **gold AI core** band, and an **infrastructure lattice** base. The top plate carries **three square bays: two holding brushed-gold modules, one empty** — a genuine dark recess with matte interior walls and gold contact pads on its floor, not a tray.

> Why a stepped stack and not a slab: four earlier attempts used a thin rounded rectangle, and at 240 px that silhouette is owned by phones, cards, tablets and drives. Six blind readers of the fourth attempt returned *memory card, payment card, SD card, smart-card chip, keypad, card reader* — none said software. The laminated stack killed that read outright and, more usefully, **pre-announces beat 5 while the device is still sealed**: six of six readers see it as layered, and six of six see the empty socket. It now reads as a microchip or semiconductor package — adjacent-wrong rather than wrong-brand, and the motion is what carries the meaning anyway.

**Keyframe stills (step 2)** — each begins with the global block, then:

- **S0** — a small ivory paper brief card floating at a slight angle, soft unreadable text blur on it, alone in the flat navy field. Nothing else in frame.
- **S1** — a fine steel vernier caliper floating beside the card, its jaws closed on one line of the blurred writing; a small glowing gold readout beside the jaws.
- **S2** — the card drifting to the edge of frame; a technical plan drawn in thin luminous **brushed-gold** ink hanging in the space where the card was: rectangles, dimension lines, annotation ticks. The lines must be gold, not white.
- **S3** — macro of one freshly machined brushed-gold module floating in the field, **the same size and proportion as the modules in the device's edge**; a few curled gold shavings drifting beside it; a milling head withdrawing at the top of frame.
- **S4** — the obsidian device floating at a slight angle, gold modules seated in its left edge, one recess still empty, precision tweezers withdrawing at the top of frame.
- **S5** — the device separated into four floating horizontal layers with **even gaps**: a clear glass plate on top carrying the modules, a dark board with fine gold traces, a small glowing gold core, a thin lattice frame below. The top plate keeps the obsidian body and the brushed-gold rim — it is the same object, opened.
- **S6** — the device reassembled and floating, glass closed, one empty recess in its edge; a small blank gold module gripped between both tweezer tines directly above the recess, not beside it.
- **S7** — the module seated in the recess with a single gold glint; the screen glowing softly with abstract light; thin gold threads beginning to stream outward from the device into the flat field.
- **S8** — **not generated.** The NexusMark in brushed gold, alone, centred on flat `#0F1E35`. Composited in Resolve from `docs/production/assets/mark-gold-512.png`. This is the poster frame and the loop hinge.

**Clip motion prompts (step 4)** — start frame Sn, end frame Sn+1, global block, then only the motion:

1. `Nothing moves but the light: a slow breath of the key light across the floating card; in the last second the caliper enters from the right and closes on one line.`
2. `The measured line lifts off the card as glowing gold ink and unfolds into the space beside it, drawing rectangles and dimension lines in one continuous stroke.`
3. `The milling head descends once, cuts in a slow pass, gold shavings curl away and drift off; camera pushes in to a macro of the finished module.`
4. `Tweezers lower the module into the device edge; it seats with a soft settle; two further modules arrive the same way in rhythm; tweezers withdraw upward out of frame.`
5. `The device separates into four layers with even spacing, rotating a slow quarter-turn; camera orbits slightly; everything stays in focus.`
6. `The layers glide back together and the glass closes; tweezers enter carrying a small blank gold module and hold it directly above the empty recess.`
7. `The module lowers and seats; one sharp gold glint; the screen blooms on from the centre outward; thin gold threads begin to stream outward into the dark.`
8. `Camera eases back slowly; the device settles; the gold threads curl inward and gather onto the screen. The scene comes to rest.` — the mark itself and the final recede are composited, not generated.

Retry rule: three takes per beat; reject any take where a surface, floor, horizon or cast shadow appears, or where the device geometry, module count or rim changes. Prefer the take whose last frame is closest to Sn+1.

## 8. Post checklist (Resolve)

1. Import clips in beat order; trim each to the steady motion (cut generator warm-up/wind-down frames).
2. Conform timeline to 1080×1080, 24 fps; retime each beat to **18 frames** of export (speed ramps, not frame drops, so scrub motion stays smooth).
3. **Flatten the field.** The generator will have left a low-frequency gradient or haze behind the subject even when the prompt forbade one. Duplicate the clip, blur the copy hard (radius ≈ 200 px), subtract it from the original and add back flat `#0F1E35`. This kills gradients without touching the subject, because the subject is high-frequency and the blur does not see it. Then verify with the colour picker: any point 200 px from the subject, on any frame, must read **15 / 30 / 53**.
4. Edge ring: `edge-ring-1080.png` on the top video track, full timeline. With step 3 done this is insurance, not the mechanism — and it still erases any corner watermark.
5. Grade: lift gold toward `#C9A84C`; leave the field alone, step 3 already fixed it.
6. **Mark, beat 7** — planar-track `mark-gold-512.png` onto the seated module (frames 108–125), Blend 0 → 1 across the six frames of the glint so it appears *with* the glint. Small: it is a signature, not a badge.
7. **Mark, beat 8** (frames 126–143) — the film's ending, in three moves:
   a. frames 126–133, the device eases back and the gold threads curl inward onto the screen (generated);
   b. frames 134–139, `mark-gold-512.png` resolves on the screen face — scale it to sit inside the glass, Blend 0 → 1, and let the screen's own glow fall as the mark rises, so the mark *is* the light rather than sitting on top of it;
   c. frames 140–143, the device scales down and fades to nothing while the mark scales up to its final size and holds, alone, on flat `#0F1E35`. No card, no panel, no border, no glow behind it — it must look like the mark simply arrived in the page.
8. **Brief-card sentence** (frames 0–35): planar-track a `Text+` node onto the card — `Every quote takes us three days.`, Inter, ivory `#EFE6D0`, ~60 % of the card width, Blur 0.4 so it sits *in* the paper. Fade out with the card in beat 2.
9. **Check the loop.** Put `f-143` and `f-000` side by side. Both are near-flat `#0F1E35` with one small subject; the cut between them must be invisible. If `f-143` carries any residual glow, flatten it — the loop is only as good as this one seam.
10. Export PNG image sequence `f-000 … f-143`; poster = `f-143` (the mark alone).
11. Run `scripts/hero-film/build.mjs`; check set sizes against §4 gates.
12. **Loop file, once, for off-site use only:**
    ```bash
    ffmpeg -framerate 24 -i 05-masters/f-%03d.png -vf "fps=30" \
      -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart nexxvantage-loop.mp4
    ```
    Never referenced by the site.

---

## 9. Acceptance

- Scrubbing both directions is frame-exact with no visible pop.
- **Background:** on three random frames, every point more than 200 px from the subject reads exactly `15 / 30 / 53`. No horizon, no surface, no cast shadow, no vignette anywhere in the film.
- **Loop:** `f-143` next to `f-000` shows no seam. The exported MP4 plays on repeat without a visible restart.
- At `p = 0` the hero passes the existing accessibility and LCP gates; CTAs are clickable without scrolling.
- Reduced-motion, save-data and no-JS each render the poster hero with CTAs. The poster is the mark alone on `#0F1E35`.
- Method section renders without WebGL; no `MarkCanvas` import remains.
- The film contains no wordmark and no CTA. The mark appears exactly twice: composited on the signature module in beat 7, and resolving on the screen and then alone in beat 8. No `<Logo />` in the closing HTML block.
- The device's module count and rim are identical in every still that shows the device.

## 10. Later (explicitly out of scope now)

600-set frame-count reduction if mobile memory proves tight; per-beat sound design (none — silent film). A light-theme sibling is no longer planned: `.nv-velvet` keeps the hero midnight in both themes, so one frame set serves both.
