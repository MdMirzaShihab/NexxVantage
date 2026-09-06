// Gate a hero-film keyframe: flat #0F1E35 field, square, brand gold present, nothing at the edges.
// Run: node scripts/hero-film/check-still.mjs <file.png> [more.png ...]
import sharp from "sharp";

const TARGET = [15, 30, 53];          // --nv-hero-bg
const TILE = 32;
const FLAT_STD = 3;                    // a tile with less variation than this is featureless
const FIELD_NEAR = 45;                 // ...and this close to TARGET to count as field, not a flat subject
const MAX_DRIFT = 6;                   // how far a field tile may sit from TARGET
const MIN_FIELD = 0.55;                // field must cover at least this much of the frame

const d3 = (a, b) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));

async function check(file) {
  const { data, info } = await sharp(file).raw().toColourspace("srgb").toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const at = (x, y) => { const i = (y * W + x) * C; return [data[i], data[i + 1], data[i + 2]]; };

  // Tile the frame, then keep only the featureless near-navy tiles REACHABLE FROM THE BORDER.
  // Colour alone cannot separate an obsidian device from a midnight background — they are the
  // same navy. What separates them is that the background touches the frame edge and the
  // device's interior does not, because the gold rim encloses it.
  const cols = Math.floor(W / TILE), rows = Math.floor(H / TILE);
  const grid = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const tx = c * TILE, ty = r * TILE;
    let n = 0, s = [0, 0, 0], sq = 0;
    for (let y = ty; y < ty + TILE; y += 2) for (let x = tx; x < tx + TILE; x += 2) {
      const p = at(x, y); const l = (p[0] + p[1] + p[2]) / 3;
      s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; sq += l * l; n++;
    }
    const mean = s.map((v) => v / n);
    const std = Math.sqrt(Math.max(0, sq / n - ((mean[0] + mean[1] + mean[2]) / 3) ** 2));
    grid[r * cols + c] = { tx, ty, mean, std, drift: d3(mean, TARGET) };
  }
  const eligible = (t) => t.std < FLAT_STD && t.drift <= FIELD_NEAR;
  const seen = new Uint8Array(rows * cols);
  const queue = [];
  for (let c = 0; c < cols; c++) { queue.push([0, c], [rows - 1, c]); }
  for (let r = 0; r < rows; r++) { queue.push([r, 0], [r, cols - 1]); }
  const flat = [];
  while (queue.length) {
    const [r, c] = queue.pop();
    if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
    const i = r * cols + c;
    if (seen[i]) continue;
    seen[i] = 1;
    if (!eligible(grid[i])) continue;
    flat.push(grid[i]);
    queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }
  const flatPx = flat.length * TILE * TILE;

  // Everything not reached by the flood is subject. A subject that floats is one compact blob
  // with a margin all round; a bench or a floor runs to the frame edge. This is the check that
  // catches a TEXTURED set, which the colour test above cannot see — texture is simply excluded
  // from the field rather than failing it.
  let touches = false, subjectTiles = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (seen[r * cols + c] && eligible(grid[r * cols + c])) continue;
    subjectTiles++;
    if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) touches = true;
  }
  const subjectPct = subjectTiles / (rows * cols);

  let gold = 0;
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) {
    const [r, g, b] = at(x, y);
    if (r > 90 && g > 70 && b < r * 0.75) gold++;
  }

  const field = flatPx / (W * H);
  const drifts = flat.map((t) => t.drift).sort((a, b) => a - b);
  const worst = flat.length ? flat.reduce((a, t) => (t.drift > a.drift ? t : a)) : null;
  const p95 = drifts.length ? drifts[Math.floor(drifts.length * 0.95)] : Infinity;
  const goldPct = (100 * gold) / ((W / 3) * (H / 3));

  // content in the outer 15% — the post ring covers it
  let edge = 0, edgeTot = 0;
  const m = Math.round(W * 0.15);
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) {
    if (x >= m && x < W - m && y >= m && y < H - m) continue;
    edgeTot++;
    if (d3(at(x, y), TARGET) > 16) edge++;
  }

  const ok = {
    square: W === H && Math.min(W, H) >= 1024,
    field: field >= MIN_FIELD,
    drift: p95 <= MAX_DRIFT,
    floats: !touches && subjectPct <= 0.45,
  };
  const mark = (b) => (b ? "PASS" : "FAIL");
  console.log(`\n${file}  ${W}x${H}`);
  console.log(`  square + >=1024 ....... ${mark(ok.square)}`);
  console.log(`  flat field coverage ... ${mark(ok.field)}  ${(field * 100).toFixed(1)}% of frame (need >=${MIN_FIELD * 100}%)`);
  console.log(`  field colour .......... ${mark(ok.drift)}  p95 drift ${p95.toFixed(1)} from [15,30,53] (need <=${MAX_DRIFT})`);
  if (!ok.drift && worst) {
    console.log(`      worst tile at ${worst.tx},${worst.ty} reads [${worst.mean.map((v) => v.toFixed(0))}] — drift ${worst.drift.toFixed(1)}`);
  }
  console.log(`  subject floats ........ ${mark(ok.floats)}  ${(subjectPct * 100).toFixed(1)}% of frame${touches ? ", TOUCHING THE FRAME EDGE <- a surface or floor is in shot" : ", clear of every edge"}`);
  console.log(`  brand gold ............ ${goldPct.toFixed(2)}% of pixels${goldPct < 0.3 ? "  <- low, is the gold actually gold?" : ""}`);
  console.log(`  content in outer 15% .. ${((100 * edge) / edgeTot).toFixed(1)}%${edge / edgeTot > 0.02 ? "  <- the post ring will cover it" : ""}`);
  console.log(`  VERDICT ............... ${Object.values(ok).every(Boolean) ? "ACCEPT" : "REGENERATE"}`);
  return Object.values(ok).every(Boolean);
}

const files = process.argv.slice(2);
if (!files.length) { console.error("usage: node scripts/hero-film/check-still.mjs <file.png> ..."); process.exit(2); }
let allOk = true;
for (const f of files) allOk = (await check(f)) && allOk;
process.exitCode = allOk ? 0 : 1;
