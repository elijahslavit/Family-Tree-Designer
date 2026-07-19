/**
 * Ancestor card kit builder.
 *
 * Turns the locked diffui frame (cream card on white) into a shippable kit:
 * a geometrically-masked transparent cutout plus height/normal/roughness maps.
 *
 * Colour keying is deliberately avoided — the card's cream paper sits only a
 * few percent off the white surround, which is what destroyed the diffui
 * cutout. The silhouette is convex, so a per-row span fill recovers it exactly.
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const OUT_ROOT = path.resolve(__dirname, "../public/card-kits/ancestor-card");
const SRC = path.join(OUT_ROOT, "source-frame.webp");

/**
 * Blur a single-channel buffer and get a single channel back.
 * sharp promotes 1-channel raw input to 3-channel sRGB on output; reading that
 * back as 1 channel shears the image, so collapse it explicitly.
 */
async function blur1(buf, W, H, sigma) {
  const { data, info } = await sharp(buf, { raw: { width: W, height: H, channels: 1 } })
    .blur(sigma)
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels === 1) return data;
  const out = Buffer.alloc(W * H);
  for (let p = 0; p < W * H; p++) out[p] = data[p * info.channels];
  return out;
}
const OUT = OUT_ROOT;

/** Pixels at or above this luminance are the white surround, not the card. */
const WHITE = 250;
/** Saturation above this reads as gold leaf rather than cream paper. */
const GOLD_SAT = 0.26;

async function main() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // ---- silhouette -------------------------------------------------------
  // Mark every pixel darker than the surround, then fill each row between its
  // first and last mark. The card is a convex rounded rectangle, so this
  // recovers the exact shape and closes any near-white specks inside it.
  const mask = Buffer.alloc(W * H, 0);
  let minX = W, maxX = 0, minY = H, maxY = 0;

  for (let y = 0; y < H; y++) {
    let first = -1, last = -1;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (lum < WHITE) {
        if (first < 0) first = x;
        last = x;
      }
    }
    if (first < 0) continue;
    mask.fill(255, y * W + first, y * W + last + 1);
    if (first < minX) minX = first;
    if (last > maxX) maxX = last;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  console.log("card bounds:", JSON.stringify(box));

  // Soften the hard 1px stair-step into a real antialiased edge.
  const alpha = await blur1(mask, W, H, 0.8);

  fs.mkdirSync(path.join(OUT, "cards"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "maps"), { recursive: true });

  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    rgba[p * 4] = data[p * C];
    rgba[p * 4 + 1] = data[p * C + 1];
    rgba[p * 4 + 2] = data[p * C + 2];
    rgba[p * 4 + 3] = alpha[p];
  }

  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .extract(box)
    .png()
    .toFile(path.join(OUT, "cards", "ancestor-frame.png"));

  // ---- height -----------------------------------------------------------
  // The embossed contour relief carries the height signal. Gold ornament is
  // pinned to flat mid-grey: it is raised metal, not terrain, and letting it
  // take real height smears it under displacement.
  const height = Buffer.alloc(W * H, 128);
  const gold = Buffer.alloc(W * H, 0);
  const hist = new Uint32Array(256);
  let inside = 0;

  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    if (sat > GOLD_SAT && r > g && g > b) gold[p] = 255;
    if (!alpha[p]) continue;
    hist[Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b)]++;
    inside++;
  }

  // Percentile clip: min/max would be set by a single ink pixel and a single
  // specular highlight, which flattens the contour relief to nothing.
  const pct = (target) => {
    let acc = 0;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= target) return v; }
    return 255;
  };
  const lo = pct(inside * 0.02), hi = pct(inside * 0.98);
  console.log("paper luminance p2-p98:", lo, "-", hi);

  const goldSoft = await blur1(gold, W, H, 1.5);

  const span = hi - lo || 1;
  // Gold sits as a flat plateau just proud of the paper. Pinning it to mid-grey
  // would make the ornament a trench and sink it under displacement.
  const PLATEAU = Math.min(245, Math.round(((pct(inside * 0.75) - lo) / span) * 255) + 12);
  console.log("gold plateau:", PLATEAU);

  for (let p = 0; p < W * H; p++) {
    if (!alpha[p]) { height[p] = 0; continue; }
    const i = p * C;
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    const norm = Math.max(0, Math.min(255, ((lum - lo) / span) * 255));
    const gw = goldSoft[p] / 255;
    height[p] = Math.round(norm * (1 - gw) + PLATEAU * gw);
  }

  // Pre-blur before Sobel: the source is webp, and its compression noise is
  // the same amplitude as the finest contour lines. Without this the normal
  // map is scanline noise rather than terrain.
  const heightBuf = await blur1(height, W, H, 1.4);
  await sharp(heightBuf, { raw: { width: W, height: H, channels: 1 } })
    .extract(box)
    .png()
    .toFile(path.join(OUT, "maps", "ancestor-frame-height.png"));

  // ---- normal (Sobel over height) ---------------------------------------
  const STRENGTH = 2.4;
  const normal = Buffer.alloc(W * H * 3);
  const at = (x, y) =>
    heightBuf[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx =
        at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1) -
        (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1));
      const dy =
        at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1) -
        (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1));
      let nx = (dx / 1020) * STRENGTH, ny = (dy / 1020) * STRENGTH, nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      const p = (y * W + x) * 3;
      normal[p] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
      normal[p + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255);
      normal[p + 2] = Math.round(((nz / len) * 0.5 + 0.5) * 255);
    }
  }
  await sharp(normal, { raw: { width: W, height: H, channels: 3 } })
    .extract(box)
    .png()
    .toFile(path.join(OUT, "maps", "ancestor-frame-normal.png"));

  // ---- roughness --------------------------------------------------------
  // Paper is rough and scatters; gold leaf is smooth and takes the specular.
  const rough = Buffer.alloc(W * H, 255);
  for (let p = 0; p < W * H; p++) {
    if (!alpha[p]) { rough[p] = 255; continue; }
    rough[p] = Math.round(235 - (goldSoft[p] / 255) * 190);
  }
  await sharp(rough, { raw: { width: W, height: H, channels: 1 } })
    .extract(box)
    .png()
    .toFile(path.join(OUT, "maps", "ancestor-frame-roughness.png"));

  const goldPixels = gold.reduce((n, v) => n + (v ? 1 : 0), 0);
  console.log("gold coverage:", ((goldPixels / (W * H)) * 100).toFixed(1) + "%");
  console.log("wrote kit to", OUT);
  console.log(JSON.stringify(box));
}

main().catch((e) => { console.error(e); process.exit(1); });
