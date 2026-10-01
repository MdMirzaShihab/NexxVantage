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
  console.error("usage: node scripts/hero-film/flatten-still.mjs <in> <out> [subjectFraction=0.58 | keep]");
  process.exit(2);
}
const keep = fracArg === "keep";   // chained keyframes: snap the ground, never move the framing
const frac = keep ? 1 : Number(fracArg ?? 0.58);

const { data, info } = await sharp(inFile).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const px = new Uint8Array(data);
const dist = (i) => Math.max(Math.abs(px[i] - TARGET[0]), Math.abs(px[i + 1] - TARGET[1]), Math.abs(px[i + 2] - TARGET[2]));

// --- a keep-out region the flood may never enter ---
// The flood alone is not safe. It travels through ANY dark path connected to the frame edge, and a
// dark screen panel that reaches the object's outline is exactly such a path — on the first real
// reference it leaked in and erased a third of the screen. So bound it: take the pixels that are
// unambiguously subject, hull them, dilate, and treat that whole area as untouchable.
// The keep-out is the subject's bounding RECTANGLE plus a margin — deliberately blunt.
//
// A cleverer boundary was tried and was wrong twice. A plain border flood walked into the dark screen
// panel through the object's outline and erased a third of it. An orthogonal row/column hull failed the
// same way, because a dark screen is not "solid" enough to anchor the hull where it meets the outline,
// so the columns above it hulled to the gold rim far below and left the screen exposed. Obsidian glass
// and a midnight ground are the same colour; no colour rule separates them reliably.
//
// So: snap only OUTSIDE the rectangle. That is provably incapable of touching the subject. What it
// gives up is the background inside the rectangle — four corner regions hugging the object, where a
// residual gradient is both tiny and visually hidden against the object, and where the post edge-ring
// lands anyway.
const SOLID = 45;   // this far from TARGET is unambiguously subject
const KEEPOUT = 12; // px of margin around the subject's bounding rectangle
let bx0 = W, bx1 = -1, by0 = H, by1 = -1;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (dist((y * W + x) * C) < SOLID) continue;
  if (x < bx0) bx0 = x; if (x > bx1) bx1 = x;
  if (y < by0) by0 = y; if (y > by1) by1 = y;
}
bx0 -= KEEPOUT; bx1 += KEEPOUT; by0 -= KEEPOUT; by1 += KEEPOUT;
const inside = (x, y) => x >= bx0 && x <= bx1 && y >= by0 && y <= by1;

// --- flat-field correction: model the gradient, subtract it, touch nothing structurally ---
// Sample the ground only OUTSIDE the keep-out rectangle, where every pixel is provably background,
// and least-squares fit a quadratic surface per channel. Subtracting that surface from the WHOLE
// frame removes the lighting drift everywhere — including the corners hugging the object, which a
// mask can never reach safely. It shifts the subject by the same handful of levels, which is correct:
// the drift came from the render's lighting, not from the object.
{
  const basis = (x, y) => {
    const u = (2 * x) / W - 1, v = (2 * y) / H - 1;
    return [1, u, v, u * u, u * v, v * v];
  };
  const K = 6;
  let samples = 0;
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (!inside(x, y) && dist((y * W + x) * C) < NEAR) samples++;
  if (samples < 300) {
    console.error(`subject reaches every edge (${samples} ground samples); regenerate with more margin`);
    process.exit(1);
  }
  for (let c = 0; c < 3; c++) {
    const A = Array.from({ length: K }, () => new Float64Array(K));
    const b = new Float64Array(K);
    for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) {
      if (inside(x, y)) continue;
      const i = (y * W + x) * C;
      if (dist(i) >= NEAR) continue;
      const f = basis(x, y), val = px[i + c];
      for (let a = 0; a < K; a++) { for (let d2 = 0; d2 < K; d2++) A[a][d2] += f[a] * f[d2]; b[a] += f[a] * val; }
    }
    // Gaussian elimination with partial pivoting
    const M = A.map((r, i) => Float64Array.from([...r, b[i]]));
    for (let col = 0; col < K; col++) {
      let piv = col;
      for (let r = col + 1; r < K; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
      if (Math.abs(M[piv][col]) < 1e-9) continue;
      [M[col], M[piv]] = [M[piv], M[col]];
      for (let r = 0; r < K; r++) {
        if (r === col) continue;
        const f = M[r][col] / M[col][col];
        for (let k = col; k <= K; k++) M[r][k] -= f * M[col][k];
      }
    }
    const coef = new Float64Array(K);
    for (let k = 0; k < K; k++) coef[k] = Math.abs(M[k][k]) < 1e-9 ? 0 : M[k][K] / M[k][k];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const f = basis(x, y);
        let model = 0;
        for (let k = 0; k < K; k++) model += coef[k] * f[k];
        const i = (y * W + x) * C + c;
        px[i] = Math.max(0, Math.min(255, Math.round(px[i] - model + TARGET[c])));
      }
    }
  }
}

// --- then snap the residual outside the keep-out to exactly TARGET ---
const ground = new Uint8Array(W * H);
const stack = [];
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const n = y * W + x;
  if (ground[n] || dist(n * C) >= NEAR || inside(x, y)) return;
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
