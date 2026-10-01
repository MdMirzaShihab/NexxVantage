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
