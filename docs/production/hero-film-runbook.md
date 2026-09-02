# Hero Film — Production Runbook

**Companion to:** `docs/superpowers/specs/2026-07-23-hero-scrub-film-design.md` (the what) and `docs/superpowers/plans/2026-07-23-hero-scrub-film.md` (the code). This is the *how*, for one person, on a Mac, with a Gemini account and a Kling Standard plan.

**Output you are producing:** `hero-film-masters/dark/f-000.png … f-143.png` — 144 square 1080×1080 PNGs, 18 per beat, outer 54 px solid `#0F1E35`. Nothing else. The code session turns them into the website.

**Time budget:** ~5 evenings. Stills 1–2, Kling 2 (spread over the credit window), Resolve 1–2.

---

## 0 · Before you start (30 min)

**Tools**

| Tool | Use | Get it |
|---|---|---|
| Gemini app (Nano Banana image model) | reference stills + 9 keyframes | gemini.google.com — free tier is enough |
| Kling, Standard plan | all 8 beat clips | klingai.com — Standard, $10/mo (~30% off first month); cancel after |
| DaVinci Resolve (free) | assembly, edge matte, grade, mark/brief composites, PNG export | Mac App Store, "DaVinci Resolve" (not Studio) |
| ffmpeg | resample 960 frames → 144 | `brew install ffmpeg` |
| Digital Color Meter | verify corner pixels | already on your Mac: Applications → Utilities |

**Folders** — create once:

```bash
mkdir -p ~/NexxVantage-film/{01-references,02-keyframes,03-clips,04-resolve/export,05-masters}
```

**Assets from the repo** (already generated, in `docs/production/assets/`):

- `edge-ring-1080.png` — transparent centre, solid `#0F1E35` outer 54 px, feathered to clear by ~170 px. Drops onto the top video track in Resolve. It also erases any corner watermark.
- `mark-gold-512.png` — the NexusMark in brand gold on transparent, for the signature composite.

**Rules that apply to every step**

1. **Never ask the AI for text, letters, numbers, or logos.** All words are added in Resolve or live in HTML.
2. **Square, always.** 1:1 stills in → 1:1 video out (Kling's image-to-video follows the input aspect).
3. **Edges fall to solid dark navy.** Nothing important within the outer 10 % of the frame; the ring overlay will paint it anyway.
4. **The device stays simple:** one obsidian slab, gold rim, three flush gold modules, one empty recess. Fewer details = less drift across 8 regenerations.
5. **Keep a log.** Copy the sheet in Appendix C into Notes; one row per generation.

---

## 1 · Reference pack — Gemini (1 evening)

Goal: an approved *look* for the device and the bench before any motion exists. Iterate here freely; it is free.

**1.1 Device concept.** In Gemini, choose image generation (Nano Banana) and paste:

> *(GLOBAL STYLE BLOCK — Appendix A)* + *A slim obsidian glass slab with softly rounded corners, about the proportion of a closed notebook, standing at a slight resting angle on a low dark stand; a thin brushed-gold rim; three small rectangular gold modules set flush into its left edge; one empty recess beside them, the same size as a module. Square image.*

Generate 4–6. Pick the one whose geometry is the simplest and most legible at thumbnail size (zoom out — the hero is 240 px on phones). Save as `01-references/ref-device-front.png`.

**1.2 Turnaround — by editing, not regenerating.** Upload `ref-device-front.png` back into Gemini and ask, one at a time:

- *"Keep this exact device, materials and lighting. Show it from a three-quarter view from the left."* → `ref-device-3q.png`
- *"Same device. Macro close-up of the left edge with the three gold modules and the empty recess."* → `ref-device-edge.png`
- *"Same scene with the device removed: only the empty midnight velvet bench under the same warm key light."* → `ref-bench.png`

**1.3 Check each still** against: simple geometry ✓ · three modules + one recess ✓ · edges solid dark navy ✓ · nothing touching the frame edge ✓ · square ✓. If Gemini returned a non-square image, crop in Preview (⌘K after drag-selecting with the aspect locked to 1:1 in Tools → Adjust Size) and export PNG at ≥ 1024 px.

**Exit criterion:** four stills you would be happy to see on the homepage as-is.

---

## 2 · The nine keyframes — Gemini edit mode (1–2 evenings)

These nine stills are the skeleton of the film: every Kling clip starts on one and ends on the next, so the device *cannot* drift between beats. This is also your approval gate: no credits are spent until all nine sit in a row and look like one film.

**Method:** always attach the nearest previous approved still (and `ref-device-3q.png` as a second attachment if the device is in shot) and describe only the change. Phrase every prompt as *"Keep everything identical except…"*.

| Still | Attach | Ask for |
|---|---|---|
| **S0** | `ref-bench.png` | A small ivory paper brief card lying on the bench at a slight angle, soft unreadable text blur on it; the device faint in the background shadow. |
| **S1** | S0 | A fine steel vernier caliper closed around one line of the card; a small glowing gold readout beside it. |
| **S2** | S1 | The card now at the edge of frame; a technical plan drawn in thin luminous gold ink across the bench: rectangles, dimension lines, annotation ticks. |
| **S3** | S2 + `ref-device-edge.png` | Macro of a freshly machined brushed-gold module on the bench, a few curled gold shavings beside it, a milling head withdrawn at the top of frame. |
| **S4** | `ref-device-front.png` | The device standing on its stand, three gold modules seated in its edge, precision tweezers withdrawing at the top of frame. |
| **S5** | S4 | The device suspended mid-air, separated into four floating horizontal layers with even gaps: a clear glass plate on top, a dark board with fine gold traces, a small glowing gold core, a thin lattice frame below. |
| **S6** | S4 | The device reassembled and standing, glass closed, one empty recess on its edge; a small blank gold module held in tweezers just above the recess. |
| **S7** | S6 | The module seated in the recess with a single gold glint; the screen glowing softly with abstract light; thin gold threads of light beginning to flow across the bench. |
| **S8** | S7 | The device at rest, screen alive with soft light, gold threads streaming across the bench and into the dark. No tweezers. |

Save as `02-keyframes/S0.png … S8.png`, ≥ 1024 px square (export 1080 if you can; Kling accepts up to 10 MB).

**Consistency checklist per still:** same stand · same rim thickness · same module count · same lighting direction (key from upper-left) · same bench line height. When one drifts, regenerate *that still only* with the reference attached and the sentence *"Match the device in the attached image exactly."*

**Gate:** open all nine in Preview as a contact sheet (select all → Open → View → Thumbnails). Read them left to right as a story. Only continue when you would sign them off as a storyboard.

---

## 3 · Clips — Kling 3.0 Pro (2 evenings, spread across the credit window)

**3.1 One-time setup.** klingai.com → **Video** → **Image to Video**. Select model **Kling 3.0**, mode **Professional**, resolution **1080p**, **Sound off**. Find the **End frame** control next to the start-frame upload (a "+ End frame" button or toggle — it is the feature the whole pipeline relies on; if you cannot see it, switch model versions until it appears).

**3.2 Per beat** — the table is the whole job:

| Beat | Start → End | Duration | Motion prompt (paste after the GLOBAL STYLE BLOCK) |
|---|---|---|---|
| 1 | S0 → S1 | 5 s | Nothing moves but the light: a slow breath of the key light across the card; in the last second the caliper enters from the right and closes on one line. |
| 2 | S1 → S2 | 8 s | The measured line lifts off the card as glowing gold ink and flows onto the bench, drawing rectangles and dimension lines in one continuous stroke. |
| 3 | S2 → S3 | 5 s | The milling head descends once, cuts in a slow pass, gold shavings curl away and settle; camera pushes in to a macro of the finished module. |
| 4 | S3 → S4 | 5 s | Tweezers lower the module into the device edge; it seats with a soft settle; two further modules arrive the same way in rhythm; tweezers withdraw. |
| 5 | S4 → S5 | 8 s | The device lifts and its layers separate vertically with even spacing, rotating a slow quarter-turn; camera orbits slightly; everything stays in focus. |
| 6 | S5 → S6 | 5 s | The layers glide back together and the glass closes; tweezers enter carrying a small blank gold module and hold it above the recess. |
| 7 | S6 → S7 | 5 s | The module lowers and seats; one sharp gold glint; the screen blooms on from the centre outward; thin gold threads begin to flow across the bench. |
| 8 | S7 → S8 | 5 s | Camera eases back slowly; the device settles into its resting angle; light threads stream steadily; the scene comes to rest. |

Every generation: **Negative prompt** = the block in Appendix A. **Creativity / relevance slider** toward *relevance* (about 0.7 — we want obedience, not invention).

**3.3 Takes.** Generate **3 takes per beat** (queue them all; the Standard plan allows unlimited queued tasks). Download keepers as `03-clips/b3-t2.mp4` (beat 3, take 2).

Reject a take if: the device's stand, rim, or module count changes · hands or fingers appear · text appears · the camera cuts · the last frame is visibly far from the end still. Prefer the take whose final frame is closest to S(n+1) — Resolve can hide a small mismatch, not a large one.

**3.4 Credits.** Kling 3.0 at 1080p without audio burns 8 credits/s: 40 per 5 s beat, 64 per 8 s beat — one full pass = 368 credits, three takes ≈ 1,100. Standard's 660 covers ~1.8 passes; buy one ~$5 top-up pack (100 credits ≈ $1.06) when it runs dry rather than a bigger plan. Never enable audio — it rises to 12 credits/s for a film that ships silent. Stop generating when you have one keeper per beat — extra takes are for beats 2, 5, and 7 only (the hardest).

**3.5 If a beat keeps failing**

- Device morphs mid-clip → lower creativity further; shorten the prompt to one sentence; make S(n) and S(n+1) more obviously different (the model fills the gap, it needs a clear gap).
- Motion too fast / everything happens in the first second → increase duration to 8–10 s.
- Tweezers look like fingers → add *"metal precision tweezers only"* to the prompt; *"hands, fingers, skin"* is already in the negative.
- Flat, nothing happens → raise creativity one notch; try the opposite: describe the camera move explicitly (*"slow push-in"*).
- Stubborn beat after 5 takes → this is the one case for Veo 3.1 (Gemini app, limited free allowance): same start still, same prompt, crop to square later.

---

## 4 · Post — DaVinci Resolve (1–2 evenings)

**4.1 Project.** New project → **Project Settings → Master Settings → Timeline format**: resolution **Custom 1080 × 1080**, frame rate **24**. Import `03-clips/` keepers and the two assets from `docs/production/assets/`.

**4.2 Assembly.** One keeper per beat on **V1**, in order. Make each beat **exactly 120 frames** (5.000 s): right-click → **Change Clip Speed** → set **Frames = 120** → tick *Ripple Sequence*; leave *Optical Flow* **off** (pick *Nearest* — we want clean frames, not invented ones). Trim generator warm-up (the first ~6 frames of a take are often dead) before retiming. The timeline is now **960 frames = 40 s**, with beat boundaries every 120 frames.

**4.3 Edge ring.** Drag `edge-ring-1080.png` onto **V2**, stretch it over the full timeline. Done — every frame's outer 54 px is now exact `#0F1E35`, and any corner watermark is gone.

**4.4 Signature mark (beats 7–8, frames 720–959).** Select clip 7 → **Fusion** page:

1. Add a **Planar Tracker** between MediaIn and MediaOut; draw a polygon on the seated module; set the tracker's reference frame to the first frame where the module is fully seated; **Track Forward**.
2. Add **MediaIn** for `mark-gold-512.png` → **Transform** (scale ≈ 0.06, adjust until the mark sits inside the module face) → **Planar Transform** (drag from the Planar Tracker's output "Create Planar Transform") → **Merge** over the footage.
3. Keyframe the mark's **Blend** from 0 to 1 across the six frames of the glint so it appears *with* the glint.
4. Clip 8: the device is nearly still — copy the Fusion composition and re-track, or use a two-keyframe Transform.

**4.5 Brief-card sentence (beats 1–2, frames 0–239).** Same recipe with a **Text+** node instead of the PNG: text `Every quote takes us three days.` (or the line you lock), font **Inter**, ivory `#EFE6D0`, size so it spans ~60 % of the card, add a **Blur** (0.4) so it sits *in* the paper. Planar-track the card. Fade it out with the card in beat 2.

**4.6 Grade (Color page).** Small moves only: a touch of warmth in the highlights toward `#C9A84C`; crush the shadows so the bench falls off to navy. Verify: hover **Digital Color Meter** (set to *Display in sRGB*) over a corner of the viewer → it must read **15 / 30 / 53**. (The ring guarantees it; this check catches a colour-management mistake in the project.)

**4.7 Export.** **Deliver** page → Custom: Format **PNG**, Codec **RGB 8-bit**, Resolution **1080 × 1080**, *Export video* only (no audio). Filename `frame`, start at **0**. Location `04-resolve/export/`. Render. Expect **960 PNGs**.

**4.8 Resample 960 → 144.** Look at the actual filenames Resolve wrote (e.g. `frame0000.png` → `%04d`; eight digits → `%08d`), then:

```bash
cd ~/NexxVantage-film
ffmpeg -framerate 24 -start_number 0 -i 04-resolve/export/frame%04d.png \
  -vf "fps=3.6" -frames:v 144 -start_number 0 05-masters/f-%03d.png
ls 05-masters | wc -l   # → 144
```

`fps=3.6` = 144 frames ÷ 40 s: 18 evenly spaced frames per beat, and frame 0 / 18 / 36 … land on the beat boundaries.

**4.9 Copy into the repo and prove the edge pixel.**

```bash
mkdir -p /Users/mirza/Documents/codeLib/NexxVantage/NexxVantage/hero-film-masters/dark
cp 05-masters/f-*.png /Users/mirza/Documents/codeLib/NexxVantage/NexxVantage/hero-film-masters/dark/
cd /Users/mirza/Documents/codeLib/NexxVantage/NexxVantage
node -e 'import("sharp").then(async ({default: sharp}) => { const { data } = await sharp("hero-film-masters/dark/f-072.png").raw().toBuffer({ resolveWithObject: true }); console.log([data[0], data[1], data[2]]); })'
# → [ 15, 30, 53 ]
```

---

## 5 · Handoff to the code session

Open a new Claude Code session in the repo and say:

> Frames are in `hero-film-masters/dark/` (144 PNG, 1080²). Execute `docs/superpowers/plans/2026-07-23-hero-scrub-film.md` with subagent-driven development. Skip the animatic in Task 2 — real masters exist — but keep its tests.

Tasks 3–8 build the AVIF/WebP sets (with the size gates), the scrub engine, the fallbacks, and the Method simplification. If the 900-px AVIF set lands over the 6 MB gate with real footage, the plan says to lower AVIF quality to 45 and rebuild.

---

## Appendix A · Prompt kit (copy-paste)

**GLOBAL STYLE BLOCK** — prepend to every still and every clip prompt:

```
Luxury product cinematography, macro lens, shallow depth of field. Deep midnight navy velvet workbench (#0F1E35) under a single warm key light from upper-left; background falls to solid dark navy at all edges, no gradients touching the frame edge. Materials: obsidian black glass, brushed gold (#C9A84C), dark machined metal. No people, no hands, no text, no logos, no watermarks. Square composition, subject centred with generous margin.
```

**NEGATIVE PROMPT** — every Kling generation:

```
hands, fingers, skin, person, text, letters, numbers, logo, watermark, lens flare streaks, bright white background, busy background, motion blur smear, extra objects, camera cut
```

Still prompts: §2 table. Clip prompts: §3.2 table.

## Appendix B · Local video generation on the Mac mini — verdict

Not for this film. Verified July 2026: on Apple Silicon the LTX-2.3 FP8 weights fail (`Undefined type Float8_e4m3fn` — Metal has no FP8), so both the 22B model and the Gemma text encoder must be GGUF; the GGUF set is ~24 GB on its own, leaving no headroom on a 24 GB machine; the official two-stage sampler returns NaN on MPS; and a 64 GB M1 Max needed ~14 min for a 1.3 s 768×512 clip with near-static motion. Two extra Kling clips (beats 1 and 8) cost ~80 credits and none of that. The Mac's jobs are stills (Gemini, or Draw Things with Flux if you want a local image model), Resolve, and ffmpeg.

If you want to experiment anyway: ComfyUI + the **ComfyUI-GGUF** custom node, then `ltx-2-19b-distilled-Q4_K_M.gguf`, `gemma-3-12b-it-Q4_K_M.gguf`, the embeddings connector and VAE from `Kijai/LTXV2_comfy` / `unsloth`, the *First-Last Frame to Video* template, single-stage KSampler (10 steps, CFG 1.0), ≤ 768×512, ≤ 33 frames. Treat any result as a bonus.

## Appendix C · Log sheet

| Date | Phase | Item (S3 / beat 5 …) | Take | Settings / prompt change | Verdict | Note |
|---|---|---|---|---|---|---|
| | | | | | | |
