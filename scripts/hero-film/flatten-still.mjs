// Snap a keyframe's background to exactly #0F1E35 and reframe the subject, deterministically.
// Run: node scripts/hero-film/flatten-still.mjs <in> <out> [subjectFraction=0.58]
//
// Two jobs the image model should not be asked to do, because they can be done exactly:
//
//   1. Ground. Flood the frame from its border over near-target pixels and snap only that region to
//      #0F1E35, with a soft edge. The naive fix — subtract a hard blur of the frame — fails here,
//      because the bright subject bleeds into the blur and leaves a dark halo around it. The flood
//      never reaches the subject's interior: its own rim encloses it.
//   2. Framing. Pad the canvas rather than scaling the subject, so no original pixel is resampled.
import sharp from "sharp";

const TARGET = [15, 30, 53];
const NEAR = 34;      // a pixel this close to TARGET is candidate ground
const SUBJECT = 18;   // ...and this far from it counts as subject when measuring the bounding box

const [inFile, outFile, fracArg] = process.argv.slice(2);
if (!inFile || !outFile) {
  console.error("usage: node scripts/hero-film/flatten-still.mjs <in> <out> [subjectFraction=0.58]");
  process.exit(2);
}
const frac = Number(fracArg ?? 0.58);

const { data, info } = await sharp(inFile).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const px = new Uint8Array(data);
const dist = (i) => Math.max(Math.abs(px[i] - TARGET[0]), Math.abs(px[i + 1] - TARGET[1]), Math.abs(px[i + 2] - TARGET[2]));

// --- flood the ground in from the border ---
const ground = new Uint8Array(W * H);
const stack = [];
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const n = y * W + x;
  if (ground[n] || dist(n * C) >= NEAR) return;
  ground[n] = 1;
  stack.push(n);
};
for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
while (stack.length) {
  const n = stack.pop();
  const x = n % W, y = (n / W) | 0;
  push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
}

// --- soften the mask by one pass so the snap leaves no hard outline, then apply ---
const soft = new Float32Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  let s = 0, k = 0;
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const yy = y + dy, xx = x + dx;
    if (yy < 0 || xx < 0 || yy >= H || xx >= W) continue;
    s += ground[yy * W + xx]; k++;
  }
  soft[y * W + x] = s / k;
}
for (let n = 0; n < W * H; n++) {
  const a = soft[n];
  if (!a) continue;
  const i = n * C;
  for (let c = 0; c < 3; c++) px[i + c] = Math.round(px[i + c] * (1 - a) + TARGET[c] * a);
}

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
