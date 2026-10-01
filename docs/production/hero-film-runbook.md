# Hero Film — Production Runbook

> **SUPERSEDED 2026-10-01** by `docs/superpowers/specs/2026-09-30-hero-hologram-film-design.md` and `docs/superpowers/plans/2026-10-01-hero-hologram-film.md`. Kept for history; the Kling settings and pricing notes still apply.

**Companion to:** `docs/superpowers/specs/2026-07-23-hero-scrub-film-design.md` (the what) and `docs/superpowers/plans/2026-07-23-hero-scrub-film.md` (the code). This is the *how*, for one person, on a Mac, with a Gemini account and a Kling Standard plan.

**Output you are producing:** `hero-film-masters/dark/f-000.png … f-143.png` — 144 square 1080×1080 PNGs, 18 per beat, **every frame's background flat `#0F1E35` edge to edge**, subject floating. Frame 143 is the NexxVantage mark alone on that flat field, and it must sit next to frame 0 without a seam — the film loops. Nothing else. The code session turns them into the website.

**Time budget:** ~5 evenings. Stills 1–2, Kling 2 (spread over the credit window), Resolve 1–2.

**The one rule that matters most:** there is no set. Nothing sits on anything. Every subject floats in flat `#0F1E35`, so that on the page the film has no visible rectangle — the device looks like it is in the hero, not in a video embedded in the hero. Image models fight this hard; §1 and Appendix A are built around beating them.

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
mkdir -p ~/NexxVantage-film/{01-references,02-keyframes,03-clips,04-resolve/export,05-masters,06-loop}
```

**Assets from the repo** (already generated, in `docs/production/assets/`):

- `edge-ring-1080.png` — transparent centre, solid `#0F1E35` outer 54 px, feathered to clear by ~170 px. Drops onto the top video track in Resolve. It also erases any corner watermark.
- `mark-gold-512.png` — the NexusMark in brand gold on transparent, for the signature composite.

**Rules that apply to every step**

1. **Never ask the AI for text, letters, numbers, or logos.** All words are added in Resolve or live in HTML.
2. **Square, always.** 1:1 stills in → 1:1 video out (Kling's image-to-video follows the input aspect).
3. **The whole background is solid `#0F1E35`, not just the edges.** No table, bench, floor, horizon, cast shadow, vignette or gradient — anywhere. If you can see where the subject is standing, the take is rejected. Nothing important within the outer 10 % either.
4. **The device stays simple:** one obsidian slab, gold rim, a row of gold modules set flush into its **left edge**, one empty recess, **no stand**. Fewer details = less drift across 8 regenerations. Whatever module count the approved reference lands on is then fixed for every still — drift is what kills the film.
5. **The mark is composited, never generated.** It appears twice: on the signature module in beat 7, and on the screen then alone in beat 8.
5. **Keep a log.** Copy the sheet in Appendix C into Notes; one row per generation.

---

## 1 · Reference pack — Gemini (1 evening)

Goal: an approved *look* for the device, floating, before any motion exists. Iterate freely; it is free. There is **no bench reference** — there is no set.

**1.1 Device concept.** In Gemini, choose image generation (Nano Banana) and paste:

> *(GLOBAL STYLE BLOCK — Appendix A)* + *A slim obsidian glass slab with softly rounded corners, about the proportion of a closed notebook, floating at a slight angle in empty space with nothing supporting it and nothing beneath it; a thin brushed-gold rim; a row of small rectangular gold modules set flush into its left edge, seen from a three-quarter view so that edge is visible; one empty recess at the end of the row. Square image.*

Generate 4–6. Two things to judge, in this order: **does it float** (no floor, no shadow, no gradient), and **does the silhouette read at thumbnail size** — zoom out to about 240 px, since that is the hero on a phone. The gold rim is the only thing separating an obsidian slab from a midnight background, so it has to carry the shape on its own. Save the winner as `01-references/ref-device-front.png`.

> **Why the modules are on the edge and not the face.** The first attempt at this film put them on the face, and at 240 px a rounded slab with a row of gold rectangles across its front reads unmistakably as a smart card, a SIM, or a gang light-switch plate. Edge-mounted bars read as ports — mechanical, tooled, right. If a generation puts them on the face, reject it; this is the single most expensive mistake in the pipeline, because every later still inherits it.

**1.2 Turnaround — by editing, not regenerating.** Upload `ref-device-front.png` back into Gemini and ask, one at a time:

- *"Keep this exact object, its four tiers, materials and lighting, still floating with nothing beneath it. Show it from a three-quarter view rotated further to the left."* → `ref-device-3q.png`
- *"Same object. Macro close-up of the top plate showing the two seated gold modules and the empty socket."* → `ref-device-edge.png`

> **Lesson from the eight generations this reference took.** Narrow edits land; compound ones get partially applied. Ask for one change at a time and check between. When the model refuses the same change three or four times — it would not produce a straight row or a 2×2 grid of bays — stop asking and change the requirement instead. Every edit pass in that chain fixed one thing and drifted another, with gold coverage creeping 8.4% → 10.1% → 12.2% before it came back down.

**1.3 Check each still** against: floats with no surface, shadow or gradient ✓ · simple geometry ✓ · consistent module count + one recess ✓ · modules on the edge, not the face ✓ · square ✓ · silhouette reads at 240 px ✓. If Gemini returned a non-square image, crop in Preview and export PNG at ≥ 1024 px.

**Exit criterion:** three stills you would be happy to see on the homepage as-is, and a background you cannot distinguish from a flat swatch.

---

## 2 · The nine keyframes — Gemini edit mode (1–2 evenings)

These nine stills are the skeleton of the film: every Kling clip starts on one and ends on the next, so the device *cannot* drift between beats. This is also your approval gate: no credits are spent until all nine sit in a row and look like one film.

**Method:** always attach the nearest previous approved still (and `ref-device-3q.png` as a second attachment if the device is in shot) and describe only the change. Phrase every prompt as *"Keep everything identical except…"*, and add *"the background stays a completely flat solid dark navy field with nothing in it"* every single time — it is the instruction the model forgets first.

| Still | Attach | Ask for |
|---|---|---|
| **S0** | — | A small ivory paper brief card floating at a slight angle in empty space, soft unreadable text blur on it, nothing else in frame, flat dark navy background. |
| **S1** | S0 | A fine steel vernier caliper floating beside the card with its jaws closed on one line of the blurred writing; a small glowing gold readout beside the jaws. |
| **S2** | S1 | The card drifted to the edge of frame; a technical plan hanging in the space where it was, drawn in thin luminous **brushed-gold** ink: rectangles, dimension lines, annotation ticks. Insist on gold — the first attempt produced warm white. |
| **S3** | S2 + `ref-device-edge.png` | Macro of one freshly machined brushed-gold module floating in frame, **the same proportion as the modules in the device's edge** — a slim bar, not an ingot; a few curled gold shavings drifting beside it; a milling head withdrawing at the top of frame. |
| **S4** | `ref-device-front.png` | The device floating at a slight angle, gold modules seated in its left edge, one recess still empty, precision tweezers withdrawing at the top of frame. |
| **S5** | S4 | The device separated into four floating horizontal layers with **even gaps**: a clear glass plate on top carrying the modules, a dark board with fine gold traces, a small glowing gold core, a thin lattice frame below. The top plate keeps the obsidian body and the brushed-gold rim — same object, opened. |
| **S6** | S4 | The device reassembled and floating, glass closed, one empty recess in its edge; a small blank gold module gripped between **both** tweezer tines directly **above** the recess. |
| **S7** | S6 | The module seated in the recess with a single gold glint; the screen glowing softly with abstract light; thin gold threads beginning to stream outward into the field. |
| **S8** | — | **Do not generate this one.** It is the NexxVantage mark alone, in brushed gold, centred on flat `#0F1E35` — built in Resolve from `docs/production/assets/mark-gold-512.png` (§4.7). Leave the slot empty here. |

Save as `02-keyframes/S0.png … S7.png`, ≥ 1024 px square.

**Consistency checklist per still:** same rim thickness · same module count · same lighting direction (key from upper-left) · **background indistinguishable from a flat swatch** · nothing resting on anything. When one drifts, regenerate *that still only* with the reference attached and the sentence *"Match the device in the attached image exactly."*

**Gate — run all three checks, not just the eyeball one:**

1. Open all eight in Preview as a contact sheet and read them left to right as a story.
2. Look at them at **240 px**. That is the size most visitors get. If a beat stops communicating there, it stops communicating.
3. Check it numerically, from the repo. Run the flatten first — background and framing are **not** the model's job, they are exact and free:

   ```bash
   for f in ~/NexxVantage-film/02-keyframes/S*.png; do
     node scripts/hero-film/flatten-still.mjs "$f" "$f"
   done
   node scripts/hero-film/check-still.mjs ~/NexxVantage-film/02-keyframes/S*.png \
     --ref ~/NexxVantage-film/01-references/ref-device-front.png
   ```

   Four gates per still: square and ≥ 1024; the flat field covers enough of the frame; that field sits within 6 levels of `#0F1E35`; and the subject floats clear of every edge. It also reports each still's gold hue and its distance from the reference. A uniform offset from `#C9A84C` is fine — §4.5 fixes it in one node — but any still more than 3° from the others has left the family and must be regenerated, because no global grade can pull it back without breaking the rest.

Only continue when you would sign the set off as a storyboard.

---

## 3 · Clips — Kling 3.0 Pro (2 evenings, spread across the credit window)

**3.1 One-time setup.** klingai.com → **Video** → **Image to Video**. Select model **Kling 3.0**, mode **Professional**, resolution **1080p**, **Sound off**. Find the **End frame** control next to the start-frame upload (a "+ End frame" button or toggle — it is the feature the whole pipeline relies on; if you cannot see it, switch model versions until it appears).

**3.2 Per beat** — the table is the whole job:

| Beat | Start → End | Duration | Motion prompt (paste after the GLOBAL STYLE BLOCK) |
|---|---|---|---|
| 1 | S0 → S1 | 5 s | Nothing moves but the light: a slow breath of the key light across the floating card; in the last second the caliper enters from the right and closes on one line. |
| 2 | S1 → S2 | 5 s | The measured line lifts off the card as glowing gold ink and unfolds into the space beside it, drawing rectangles and dimension lines in one continuous stroke. |
| 3 | S2 → S3 | 5 s | The milling head descends once, cuts in a slow pass, gold shavings curl away and drift off; camera pushes in to a macro of the finished module. |
| 4 | S3 → S4 | 5 s | Tweezers lower the module into the device edge; it seats with a soft settle; two further modules arrive the same way in rhythm; tweezers withdraw upward out of frame. |
| 5 | S4 → S5 | 5 s | The device separates into four layers with even spacing, rotating a slow quarter-turn; camera orbits slightly; everything stays in focus. |
| 6 | S5 → S6 | 5 s | The layers glide back together and the glass closes; tweezers enter carrying a small blank gold module and hold it directly above the empty recess. |
| 7 | S6 → S7 | 5 s | The module lowers and seats; one sharp gold glint; the screen blooms on from the centre outward; thin gold threads begin to stream outward into the dark. |
| 8 | S7 → *(no end frame)* | 5 s | Camera eases back slowly; the device settles; the gold threads curl inward and gather onto the screen; the scene comes to rest. **Start frame only** — there is no S8 to aim at, because the mark and the final recede are composited in §4.7. |

> Beats 2 and 5 used to be 8 s. Don't. §4.2 retimes every beat to exactly 120 frames with Optical Flow off, and §4.10 then decimates 960 → 144 — so an 8 s clip gets nearest-neighbour crushed about 13:1, and the quarter-turn and the ink stroke are exactly the motions that strobe under that. Five seconds removes the double decimation and saves 48 credits a pass.

Every generation: **Negative prompt** = the block in Appendix A. **Creativity / relevance slider** toward *relevance* (about 0.7 — we want obedience, not invention).

**3.3 Takes.** Generate **3 takes per beat** (queue them all; the Standard plan allows unlimited queued tasks). Download keepers as `03-clips/b3-t2.mp4` (beat 3, take 2).

Reject a take if: **a surface, floor, horizon, cast shadow or background gradient appears** · the device's rim or module count changes · hands or fingers appear · text appears · the camera cuts · the last frame is visibly far from the end still. Prefer the take whose final frame is closest to S(n+1) — Resolve can hide a small mismatch, not a large one.

The background is the failure mode to watch. Video models reintroduce a ground plane and a soft vignette even when the start and end stills have neither, because almost everything they were trained on has one. §4.3 can flatten a gentle gradient; it cannot remove a table.

**3.4 Credits.** Kling 3.0 at 1080p without audio burns 8 credits/s: 40 per 5 s beat. Every beat is now 5 s, so one full pass = **320 credits**, three takes ≈ 960. Standard's 660 covers just over two passes; buy one ~$5 top-up pack (100 credits ≈ $1.06) if it runs dry rather than a bigger plan. Never enable audio — it rises to 12 credits/s for a film that ships silent. Stop generating when you have one keeper per beat — extra takes are for beats 2, 5 and 7 only (the hardest).

**3.5 If a beat keeps failing**

- Device morphs mid-clip → lower creativity further; shorten the prompt to one sentence; make S(n) and S(n+1) more obviously different (the model fills the gap, it needs a clear gap).
- Motion too fast / everything happens in the first second → increase duration to 8–10 s.
- Tweezers look like fingers → add *"metal precision tweezers only"* to the prompt; *"hands, fingers, skin"* is already in the negative.
- Flat, nothing happens → raise creativity one notch; try the opposite: describe the camera move explicitly (*"slow push-in"*).
- A floor or shadow keeps appearing → put `table, floor, ground, surface, shadow, vignette` at the *front* of the negative prompt, and add *"the subject is floating in empty space, nothing beneath it"* to the motion prompt itself, not just the style block.
- Stubborn beat after 5 takes → this is the one case for Veo 3.1 (Gemini app, limited free allowance): same start still, same prompt, crop to square later.

---

## 4 · Post — DaVinci Resolve (1–2 evenings)

**4.1 Project.** New project → **Project Settings → Master Settings → Timeline format**: resolution **Custom 1080 × 1080**, frame rate **24**. Import `03-clips/` keepers and the two assets from `docs/production/assets/`.

**4.2 Assembly.** One keeper per beat on **V1**, in order. Make each beat **exactly 120 frames** (5.000 s): right-click → **Change Clip Speed** → set **Frames = 120** → tick *Ripple Sequence*; leave *Optical Flow* **off** (pick *Nearest* — we want clean frames, not invented ones). Trim generator warm-up (the first ~6 frames of a take are often dead) before retiming. The timeline is now **960 frames = 40 s**, with beat boundaries every 120 frames.

**4.3 Flatten the field — do this before anything else touches colour.** Kling will have left a soft gradient or haze behind the subject even when the prompt forbade one.

The obvious recipe — duplicate, blur hard, subtract, add back `#0F1E35` — **does not work here, and it was wrong in an earlier version of this runbook.** The subject is bright and bleeds into the blur, so subtracting it darkens the ground immediately around the object and leaves a visible halo. Measured on a real keyframe it made things worse: p95 drift from the target went from 10.9 to 13.0.

What works is to flood the ground in from the frame border and snap only that region, because the background is by definition the part that touches the edge, and the object's own gold rim encloses its interior so the flood never reaches it. On the same keyframe that gets p95 drift **0.0**.

- **On the stills**, before Kling ever sees them, run the script — it also reframes by padding, so no pixel is resampled:
  ```bash
  node scripts/hero-film/flatten-still.mjs in.png out.png 0.58
  ```
- **In Resolve**, on the rendered frames, use a **Luma Qualifier** picking the dark ground, feather it a few pixels, and flat-fill `#0F1E35` — the same idea, tracked over time. Do not use blur-subtract.

Then verify with `check-still.mjs` (below) rather than by eye. This step, not the edge ring, is what makes the film blend into the page.

> **Watch the top glass under motion.** Semi-random specular mottle on a glossy face is what image-to-video models boil and crawl on, and it reads as artifacting. Generate **beat 1 first** — it is the cheapest clip at 40 credits — and look specifically at whether the highlights on the glass wobble between frames before committing to the other seven. Budget one extra retry on beat 5 (the lattice is fine, high-frequency detail) and beat 7 (the bloom).

**4.4 Edge ring.** Drag `edge-ring-1080.png` onto **V2**, stretch it over the full timeline. With 4.3 done this is insurance rather than the mechanism — and it still erases any corner watermark.

**4.5 Grade (Color page) — one hue rotation, measured.** Gemini will not output `#C9A84C`. On the first attempt every still's gold sat at hue **35.5–36.2°** against brand gold's **44.2°**, and at saturation **0.35–0.40** against **0.62**. That is fine, and it is what this step exists for: a single Hue-vs-Hue rotation of about **+8°** on the yellows, plus a saturation lift, corrects the whole film at once.

What it cannot correct is a still that has left the family. On that same attempt S3 sat at 43.3°, about 7.5° away from the other four — pulling S3 into line would push them out. So:

1. Confirm with `check-still.mjs --ref` that every still is within 3° of the device reference **before** grading.
2. Then one qualifier on the golds: rotate hue to land near 44°, raise saturation toward 0.62, leave luminance alone.
3. Leave the background alone entirely — 4.3 already fixed it, and a global lift or curve will undo it.

**4.6 Signature mark, beat 7 (frames 630–749 on the 960-frame timeline).** Select clip 7 → **Fusion** page:

1. Add a **Planar Tracker** between MediaIn and MediaOut; draw a polygon on the seated module; set the reference frame to the first frame where the module is fully seated; **Track Forward**.
2. Add **MediaIn** for `mark-gold-512.png` → **Transform** (scale ≈ 0.06) → **Planar Transform** (drag from the tracker's "Create Planar Transform") → **Merge** over the footage.
3. Keyframe the mark's **Blend** 0 → 1 across the six frames of the glint so it appears *with* the glint.

Keep it small. It is a signature, not a badge.

**4.7 The ending — beat 8 (frames 750–959), in three moves.** This is the part that carries "we are your partner throughout", and none of it is generated.

- **750–839 · gather.** The Kling clip plays as shot: the camera eases back, the device settles, the gold threads curl inward onto the screen.
- **840–899 · the mark arrives as light.** `mark-gold-512.png`, scaled to sit *inside* the glass rather than on it, **Blend** 0 → 1 over these frames. At the same time bring the screen's own glow down as the mark comes up, so the mark reads as what the device is running, not as a decal on its surface. Two-keyframe Transform is enough — the device is nearly still by now, so no planar tracking is needed.
- **900–959 · the hold.** Scale the device down and fade it to nothing while the mark scales up to its final size and holds, alone, centred on flat `#0F1E35`. **No card, no panel, no border, no glow behind it.** It must look like the mark simply arrived in the page — this is the frame that has to blend into the site background, and the site's `.nv-velvet` hero is `#0F1E35` in both light and dark themes, so one version serves both.

**4.8 Brief-card sentence (frames 0–239).** Same recipe as 4.6 with a **Text+** node instead of the PNG: text `Every quote takes us three days.`, font **Inter**, ivory `#EFE6D0`, sized to span ~60 % of the card, add a **Blur** (0.4) so it sits *in* the paper. Planar-track the card. Fade it out with the card in beat 2.

**4.9 Export.** **Deliver** page → Custom: Format **PNG**, Codec **RGB 8-bit**, Resolution **1080 × 1080**, *Export video* only (no audio). Filename `frame`, start at **0**. Location `04-resolve/export/`. Render. Expect **960 PNGs**.

**4.10 Resample 960 → 144.** Look at the actual filenames Resolve wrote (e.g. `frame0000.png` → `%04d`), then:

```bash
cd ~/NexxVantage-film
ffmpeg -framerate 24 -start_number 0 -i 04-resolve/export/frame%04d.png \
  -vf "fps=3.6" -frames:v 144 -start_number 0 05-masters/f-%03d.png
ls 05-masters | wc -l   # → 144
```

`fps=3.6` = 144 frames ÷ 40 s: 18 evenly spaced frames per beat, and frame 0 / 18 / 36 … land on the beat boundaries.

**4.11 Check the loop — the last gate.** Open `05-masters/f-143.png` and `f-000.png` side by side. `f-143` is the mark alone on flat navy; `f-000` is the brief card alone on flat navy. The cut between them has to be invisible: same background value, no residual glow around the mark, no leftover vignette. If `f-143` still carries a halo, go back to 4.7 and flatten it. The loop is only as good as this one seam, and every visitor who scrolls back up crosses it.

**4.12 Copy into the repo and prove the background pixel.**

```bash
mkdir -p /Users/mirza/Documents/codeLib/NexxVantage/NexxVantage/hero-film-masters/dark
cp 05-masters/f-*.png /Users/mirza/Documents/codeLib/NexxVantage/NexxVantage/hero-film-masters/dark/
cd /Users/mirza/Documents/codeLib/NexxVantage/NexxVantage
node -e 'import("sharp").then(async ({default: sharp}) => {
  for (const f of ["f-000","f-036","f-072","f-108","f-143"]) {
    const { data, info } = await sharp(`hero-film-masters/dark/${f}.png`).raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => { const i = (y * info.width + x) * info.channels; return [data[i], data[i+1], data[i+2]]; };
    console.log(f, "corner", px(0, 0), "· 200px in", px(200, 200));
  }
})'
# → every line: corner [ 15, 30, 53 ] · 200px in [ 15, 30, 53 ]
```

The second sample is the one that matters — the corner was always going to be right because of the ring. If `200px in` is off, §4.3 did not take.

**4.13 The loop file, once, for off-site use only.** Social, decks, email. The site never loads this — it uses the frame sets.

```bash
cd ~/NexxVantage-film
ffmpeg -framerate 24 -i 05-masters/f-%03d.png -vf "fps=30" \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
  06-loop/nexxvantage-loop.mp4
```

---

## 5 · Handoff to the code session

Open a new Claude Code session in the repo and say:

> Frames are in `hero-film-masters/dark/` (144 PNG, 1080², flat `#0F1E35` background, `f-143` is the mark alone). Execute `docs/superpowers/plans/2026-07-23-hero-scrub-film.md` with subagent-driven development. Skip the animatic in Task 2 — real masters exist — but keep its tests. Note the spec changes since the plan was written: the whole frame background is the hero hex (not just the outer 5 %), the closing HTML block has no `<Logo />`, and the poster is the mark.

Tasks 3–8 build the AVIF/WebP sets (with the size gates), the scrub engine, the fallbacks, and the Method simplification. If the 900-px AVIF set lands over the 6 MB gate with real footage, the plan says to lower AVIF quality to 45 and rebuild.

---

## Appendix A · Prompt kit (copy-paste)

**GLOBAL STYLE BLOCK** — prepend to every still and every clip prompt:

```
Luxury product cinematography, macro lens. A single subject floating in empty space against a completely flat, solid, uniform dark navy field (#0F1E35) that fills the entire frame edge to edge. No table, no bench, no surface, no floor, no ground plane, no horizon line, no cast shadow, no vignette, no gradient, no atmosphere, no depth haze — nothing behind the subject but flat colour. Single warm key light from upper-left. Materials: obsidian black glass, brushed gold (#C9A84C), dark machined metal. No people, no hands, no text, no logos, no watermarks. Square composition, subject centred with generous margin.
```

**NEGATIVE PROMPT** — every Kling generation:

```
table, desk, bench, workbench, surface, floor, ground, horizon, shadow, cast shadow, reflection on surface, vignette, gradient background, fabric, velvet, carpet, texture, hands, fingers, skin, person, text, letters, numbers, logo, watermark, lens flare streaks, bright white background, busy background, motion blur smear, extra objects, camera cut
```

The surface terms lead the list on purpose. Image and video models default to putting objects *on* something; the flat field has to be demanded in the positive prompt and forbidden in the negative one, or the bench comes back.

Still prompts: §2 table. Clip prompts: §3.2 table.

## Appendix B · Local video generation on the Mac mini — verdict

Not for this film. Verified July 2026: on Apple Silicon the LTX-2.3 FP8 weights fail (`Undefined type Float8_e4m3fn` — Metal has no FP8), so both the 22B model and the Gemma text encoder must be GGUF; the GGUF set is ~24 GB on its own, leaving no headroom on a 24 GB machine; the official two-stage sampler returns NaN on MPS; and a 64 GB M1 Max needed ~14 min for a 1.3 s 768×512 clip with near-static motion. Two extra Kling clips (beats 1 and 8) cost ~80 credits and none of that. The Mac's jobs are stills (Gemini, or Draw Things with Flux if you want a local image model), Resolve, and ffmpeg.

If you want to experiment anyway: ComfyUI + the **ComfyUI-GGUF** custom node, then `ltx-2-19b-distilled-Q4_K_M.gguf`, `gemma-3-12b-it-Q4_K_M.gguf`, the embeddings connector and VAE from `Kijai/LTXV2_comfy` / `unsloth`, the *First-Last Frame to Video* template, single-stage KSampler (10 steps, CFG 1.0), ≤ 768×512, ≤ 33 frames. Treat any result as a bonus.

## Appendix C · Log sheet

| Date | Phase | Item (S3 / beat 5 …) | Take | Settings / prompt change | Verdict | Note |
|---|---|---|---|---|---|---|
| | | | | | | |
