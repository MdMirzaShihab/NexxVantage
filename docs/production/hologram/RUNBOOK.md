# Hero Hologram Film: Owner Runbook

Everything you need to produce the hero film from any computer: setup, every prompt to paste, every setting, and the checks that run before credits are spent.

- **Spec (the why):** `docs/superpowers/specs/2026-09-30-hero-hologram-film-design.md`
- **Plan (the full technical version):** `docs/superpowers/plans/2026-10-01-hero-hologram-film.md`
- **Concept boards:** [opening motion](https://claude.ai/artifact/534SbVsk7byyiWCnknCnB9) · [robot looks](https://claude.ai/artifact/FC2dYresHim2uTLxyBsuMk) · [approved screens](https://claude.ai/artifact/Vi2yXJ8aGsJR6he8eU5TLQ)

## Where things stand (2026-10-01)

| Step | Status |
|---|---|
| Story, robot (R4 "The Halo"), client, screens | Approved |
| K0 gold point, K1 logo (made from the real logo code) | Done, in `reference-pack/keyframes/` |
| Seven film screens | Done and approved, in `reference-pack/screens/` |
| Client reference | Done, `reference-pack/client-ref.jpeg` |
| **1. Robot sheet** | **Next: you** |
| 2. Keyframes K2–K7 | You, with a check after each one |
| 3. Kling clips 1–8 | You |
| 4. Resolve edit | You |
| 5. Encode and put it on the site | Claude (plan Tasks 7–8) |

---

## 0. Set up a computer

You need: Git, Node.js 20+, and, for the later steps, ffmpeg and DaVinci Resolve (free).

```bash
git clone git@github.com:MdMirzaShihab/NexxVantage.git   # or: git pull, if you already have it
cd NexxVantage
npm install
```

Create the film folder outside the repo and copy the reference pack into it:

```bash
mkdir -p ~/NexxVantage-film/{01-references/screens,02-keyframes/raw,03-clips,04-master}
cp docs/production/hologram/reference-pack/client-ref.jpeg ~/NexxVantage-film/01-references/
cp docs/production/hologram/reference-pack/screens/*.png   ~/NexxVantage-film/01-references/screens/
cp docs/production/hologram/reference-pack/keyframes/*.png ~/NexxVantage-film/02-keyframes/
```

**Keeping two computers in step.** Large working files (raw Gemini outputs, Kling clips, the master) stay in `~/NexxVantage-film/` and are **not** in git. Once an image is **approved**, also copy it into `docs/production/hologram/reference-pack/`, then commit and push. The other computer then gets it with `git pull`:

```bash
cp ~/NexxVantage-film/02-keyframes/K2.png docs/production/hologram/reference-pack/keyframes/
git add docs/production/hologram/reference-pack && git commit -m "film: K2 approved" && git push
```

---

## The style block (append to EVERY Gemini prompt below)

```
Futuristic holographic scene, premium cinematic render. Everything floats in empty space against a completely flat, solid, uniform dark navy background (#0F1E35) filling the entire frame edge to edge — no floor, no surface, no horizon, no cast shadow, no vignette, no gradient, no haze. Holograms are warm gold (#C9A84C) and soft white light with fine horizontal scanlines and glowing gold edges; no blue or cyan light. Square composition with a generous empty margin at the edges. No text, no logos, no watermarks.
```

The robot sheet in Step 1 is the only exception, because its prompt already sets its own background.

---

## 1. Robot reference sheet (Gemini)

Generate 3–4 images, then keep the one where all three views are clearly **the same robot**.

```
Character design sheet of a friendly floating AI assistant robot, shown three times side by side: front view, three-quarter view, side view — the identical robot in each. Body: a smooth glossy pearl-white sphere, soft rounded forms, no sharp edges, no square parts. Face: a rounded dark navy glass visor screen with two small glowing warm-gold dot eyes and a small gold smile line. A thin polished gold ring orbits the sphere at a slight tilt, like a planet's ring. Two small floating pearl-white sphere hands hover beside the body, not attached. Soft warm-gold glow beneath it. Premium, calm, friendly; high-end product render with realistic materials. Background: perfectly flat solid color #0F1E35 midnight navy — no gradient, no floor, no shadow, no vignette. No text, no logos.
```

Save it as `~/NexxVantage-film/01-references/robot-sheet.png`. If Gemini gives you a JPEG, convert it: `sips -s format png in.jpeg --out robot-sheet.png` (Mac), or simply save it as PNG.

**Check before moving on:** all three views show the same robot, with a ring, a dark visor, gold eyes, a smile, two floating hands and no hard edges. Once you're happy, copy it into `reference-pack/` and push.

---

## 2. Keyframes K2–K7 (Gemini, edit mode)

**Rules for every keyframe:**
- **Edit** the previous approved keyframe; never start a keyframe from scratch. Attach the files listed for each step.
- Ask for a **square** image. If Gemini returns a non-square image, regenerate it; never crop.
- Make one keyframe at a time and check it before making the next.
- Save Gemini's output as `~/NexxVantage-film/02-keyframes/raw/Kn.png`.

**The check after each keyframe.** Run this from the repo root, or ask Claude to run it and look at the result:

```bash
K=~/NexxVantage-film/02-keyframes
node scripts/hero-film/flatten-still.mjs $K/raw/K2.png $K/K2.png keep         # snaps the background to exactly #0F1E35
node scripts/hero-film/check-still.mjs $K/K2.png                              # for K3 onwards add:  --ref $K/K2.png
```

- **The verdict must be `ACCEPT`.** `REGENERATE` names what is wrong, for example "TOUCHING THE FRAME EDGE", which means something reaches the border.
- **Also read the "content in outer 5%" line.** The website softly fades the outer 5% of the square, so nothing important should sit there.
- **If flatten-still says "subject reaches every edge",** regenerate with more empty margin.
- **Look at the result small, too.** Phones show the film at 280 px. The logo, the robot, the client's smile and (in K7) the tick must still be recognisable at that size.

### K2: the screens orbit the logo
Attach: `K1.png`, plus `hotel-desktop.png`, `legal-desktop.png`, `retail-desktop.png`, `guest-mobile.png`, `shop-mobile.png`, `call-mobile.png`
```
Edit the first attached image. Keep the glowing emblem exactly as it is — same shape, size, position and colours. Add six floating holographic screens orbiting the emblem in a loose ring at different depths: three wide desktop screens and three tall phone screens, each showing one of the other attached screen designs exactly. Each screen is a sheet of glass with glowing gold edges and fine scanlines. Thin straight gold light rays run from the emblem's gold centre to the middle of each screen, as if the emblem is projecting them. Screens nearer the viewer are larger; the ring tilts slightly toward the viewer. The whole ring stays inside the central 85% of the frame.
```

### K3: the robot takes the phone
Attach: `K2.png`, `robot-sheet.png`
```
Edit the first attached image. Keep the emblem, the rays and five of the screens exactly where they are. The tall phone screen showing the incoming call has left the ring and its ray is gone: it now floats at about 72% across and 45% down, beside the friendly floating robot from the second attached image (match it exactly), which has drifted in from the right. The robot is at about 82% across and 60% down, facing the phone, one floating sphere hand raised near it.
```

### K4: the call
Attach: `K3.png`, `client-ref.jpeg`
```
Edit the first attached image. Replace the phone screen beside the robot with the woman from the second attached image, as a hologram showing head and shoulders, at the same spot, about 22% of the frame tall, turned toward the robot and talking. Keep her exactly as in the reference: face, navy hijab with gold border, scanlines, gold sparkles dissolving at the shoulders. Everything else stays unchanged.
```

### K5: the stack (the camera has moved)
Attach: `K4.png`, `hotel-wireframe.png`
```
Recompose the first attached image as if the camera has moved. The glowing emblem now sits on the left at about 22% across and 55% down, the same size. One wide screen showing the second attached wireframe design floats in the centre at about 50% across and 45% down, about 36% of the frame wide, turned slightly toward the emblem; the other four screens are stacked in layers behind it, each slightly smaller and dimmer. Gold rays run from the emblem's centre into the stack. The robot floats on the right at about 80% across and 60% down. The woman's hologram floats above the robot at about 76% across and 24% down, turned toward the robot. Keep the robot and the woman exactly as they are.
```

### K6: the finished app
Attach: `K5.png`, `hotel-desktop.png`
```
Edit the first attached image. The front screen now shows the second attached app design instead of the wireframe — same position, size and angle. The robot's nearer sphere hand is raised toward the screen. The woman leans slightly forward, smiling, pointing at the screen. Nothing else changes.
```

### K7: approved
Attach: `K6.png`
```
Edit the attached image. The woman is gone. In her place, at the same size, is a large glowing gold check mark (a tick) made of dense gold light particles, with a few loose sparkles drifting around it. No words or letters anywhere. Nothing else changes.
```

**Gate before spending any Kling credits:** put K0–K7 side by side (ask Claude for a review page at 280 px and 440 px) and approve the whole sequence. Then push the approved keyframes in `reference-pack/keyframes/`.

---

## 3. Kling clips 1–8

**Settings for every clip:**
- Image to Video → **Start & End frame**
- Kling 3.0 Pro (professional mode), 1080p, **5 s**
- Sound off, relevance high
- Make up to 3 takes per clip and keep the best

**Negative prompt for every clip:**
```
text, letters, words, distorted emblem, blue light, cyan light, floor, ground, shadow, vignette, gradient background, extra hands, distorted face, flicker, fast motion, camera shake
```

**The chain rule (this is what makes the film one continuous shot):**
- Clip 1 starts at `K0.png`.
- **Every later clip starts at the real last frame of the clip before it,** not the designed keyframe.
- The end frame is always the designed keyframe.

Export a clip's last frame with:

```bash
C=~/NexxVantage-film/03-clips
ffmpeg -sseof -0.05 -i $C/clip-1.mp4 -frames:v 1 -update 1 $C/clip-1-last.png
```

Save each approved clip as `~/NexxVantage-film/03-clips/clip-N.mp4`. After each one, compare its last frame with the next keyframe, or ask Claude to. If the robot, the client or the logo has drifted, fix it before making the next clip.

**Cost:** 8 clips × 5 s ≈ 320 credits per full pass. Budget for 2–3 passes, because of retakes.

| Clip | Start frame | End frame | Prompt |
|---|---|---|---|
| 1 | `K0.png` | `K1.png` | A tiny glowing gold point pulses twice in a flat dark navy void, then lines of white and gold light draw outward from it, tracing a geometric emblem stroke by stroke until the emblem is complete and glows softly. Static camera. Slow, smooth, elegant. |
| 2 | `clip-1-last.png` | `K2.png` | Thin gold light rays shoot out from the emblem's gold centre. At the end of each ray a holographic glass screen flickers into existence, then the screens drift outward and settle into a slow orbit around the emblem. Static camera. Slow, smooth motion; the screens' content stays steady. |
| 3 | `clip-2-last.png` | `K3.png` | The screens keep orbiting slowly. A friendly round pearl-white robot with an orbiting gold ring floats gently in from the right, reaches out with a floating sphere hand and draws one phone screen out of the orbit to hover beside it. Gentle floating motion. Static camera. |
| 4 | `clip-3-last.png` | `K4.png` | The robot taps the phone screen twice with its sphere hand. The screen ripples like water, glows, and unfolds into a hologram of a smiling woman's head and shoulders made of gold light, who begins talking warmly to the robot. Static camera. Smooth. |
| 5 | `clip-4-last.png` | `K5.png` | The robot gestures toward the orbiting screens. One wide screen glides forward and the others slide into a neat layered stack behind it, while the camera slowly drifts so the emblem moves to the left side of the frame, the stack settles in the centre and the robot and the woman end on the right. Slow, smooth camera move. |
| 6 | `clip-5-last.png` | `K6.png` | The robot makes small precise gestures toward the front screen. The gold wireframe on the screen fills in section by section into a finished app interface, and a chat panel slides in on its right side. The woman leans in, points at the screen and smiles. Static camera. Smooth, deliberate. |
| 7 | `clip-6-last.png` | `K7.png` | The woman nods happily, then dissolves into glowing gold particles that swirl together into a large gold check mark in the same place. Static camera. Smooth, restrained. |
| 8 | `clip-7-last.png` | `K1.png` | The robot gives a small friendly wave. The check mark, the stacked screens and the robot fold back along the gold rays and are absorbed into the emblem, while the camera drifts back so the emblem returns to the centre of the frame, alone and glowing. Slow, smooth. |

Clip 9 is **not generated**. It is clip 1 played backwards, done in Resolve.

---

## 4. Edit in DaVinci Resolve

1. **Timeline:** start a new project with a timeline at **1080 × 1080, 30 fps**. Import `clip-1.mp4` … `clip-8.mp4` and lay them end to end.
2. **Closing clip:** add `clip-1.mp4` again at the end. Right-click it → Change Clip Speed → **Reverse**, speed **167%** (about 3 s).
3. **Joins:** put a **4-frame cross-dissolve** on every cut.
4. **Length:** use speed-ramps (Retime Controls) on the orbit in clip 2 and the stack in clip 5 so the total lands at **37–39 s**.
5. **Colour:** on the Color page, add one node across the whole timeline. Adjust lift/offset until the colour picker reads the background as **R15 G30 B53** in several corners of several clips.
6. **"Approved" title:** during clip 7, add a Text+ title "Approved" in **Space Grotesk Medium**, colour `#C9A84C`, centred about 8% below the tick. Fade it in over 0.4 s as the tick forms, and fade it out as clip 8 starts.
7. **Export:** Deliver as QuickTime, **Apple ProRes 422 HQ**, 1080 × 1080, 30 fps, no audio, to `~/NexxVantage-film/04-master/hero-master.mov`.
8. **Note one timecode:** in seconds, the moment K6 is fully visible (finished app, client smiling). Claude needs it for the still shown to people who turn off motion.

The master is too big for git. Hand it over on the same computer, or by Drive or AirDrop.

---

## 5. Hand over to Claude

Tell Claude: *"The master is at `~/NexxVantage-film/04-master/hero-master.mov`, K6 is at N seconds. Run Tasks 7–8 of `docs/superpowers/plans/2026-10-01-hero-hologram-film.md`."*

Claude then:
- encodes the AV1 and H.264 videos and the two still images;
- checks the decoded background colour, the loop seam and the file sizes;
- puts the film in the hero square;
- tests it in the browser: reduced motion, blocked autoplay, mobile size and light theme.

Your last check: open the site in **Safari** on the Mac and on an iPhone, and confirm the film plays with no visible square edge.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Gemini adds text or a watermark | Regenerate; the style block already says "no text". A corner watermark fails the edge check. |
| The background has a gradient or vignette | Usually `flatten-still … keep` fixes it. If the check still fails, regenerate. |
| The robot or client looks different between keyframes | Always attach `robot-sheet.png` / `client-ref.jpeg` again, and say "match it exactly". |
| Kling distorts the face or hands | Retake with "slow, smooth" emphasised; fast motion is where Kling breaks. |
| A Kling clip drifts far from its end keyframe | Retake. If it still drifts, start the next clip from the drifted frame anyway; the chain rule keeps the film continuous. |
| The film shows a faint square on the site | The background is off: redo Resolve step 5. Do not try to fix it in the encoder. |
| You want to change a screen design | Edit `docs/production/hologram/screens/<name>.html`, then `scripts/hero-film/render-html.sh <html> <png> 2560 1600` (phones: `780 1640`). Needs Google Chrome and an internet connection for the fonts. |
