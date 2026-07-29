/**
 * Themed ancestor-card frame kit builder (reusable across heritage themes).
 *
 *   node scripts/build-theme-frame.js <slug>   # default: italian-heritage
 *
 * Reads public/card-kits/<slug>/source-frame.webp — a chromolithograph card
 * photographed on a DARK backdrop — and emits a shippable kit: a transparent
 * cutout plus relief-aware height / normal / roughness maps, and auto-measured
 * window + plaque slots written into kit.json.
 *
 * Quality choices that differ from the original cream-on-white builder:
 *  - Dark-backdrop silhouette: the card is LIGHTER than its surround, and the
 *    longest bright run per row rejects stray velvet highlights.
 *  - Relief-aware height: a HIGH-PASS of luminance, not raw luminance. The
 *    engraved corner vignettes are printed flat — raw luminance would sink them
 *    into craters. High-pass keeps broad printed tone at the paper plane and
 *    lifts only true grooves and emboss edges.
 *  - Hue-gated gold: brass foil is selected by hue (~gold), so the terracotta,
 *    olive and teal enamel are NOT mistaken for metal (a warm-saturation test
 *    would grab the terracotta) and stay matte with no false specular.
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const slugArg = process.argv[2] || "italian-heritage";
// Nested kit paths are allowed (e.g. `_templates/layout-v1-masculine`); file
// basenames always use the leaf slug so Windows/posix path separators never
// leak into output filenames.
const fileSlug = path.basename(slugArg);
// Canonical output box so every theme in the set is the SAME pixel width AND
// height. Each card is scaled to fit (aspect preserved) and the remainder is
// padded — transparent on the cutout, neutral on the maps — so nothing is
// distorted. Override: node …/build-theme-frame.js <slug> <height> <width>.
// Default is a deliberately long/skinny card (~0.6 aspect) per house preference.
const TARGET_H = Number(process.argv[3]) || 1500;
const TARGET_W = Number(process.argv[4]) || 900;
const ROOT = path.resolve(__dirname, "..", "public", "card-kits", slugArg);
const SRC = path.join(ROOT, "source-frame.webp");

// Dark surround: pixels brighter than this are card, dimmer are backdrop.
// The charcoal velvet tops out near luminance 23; the card's cream edge is far
// brighter, so 34 clears the velvet (incl. its faint sheen) without clipping the
// card. Dark border detail below it is bridged by the per-row span fill.
const CARD_LUM = 34;
// Gold/brass hue window (deg) + minimum saturation/value to be raised metal.
const GOLD_HUE = [30, 56];
const GOLD_SAT = 0.30;
const GOLD_VAL = 0.34;

const PAPER = 120; // paper plane in the height map
const PLATEAU = 186; // raised gold-metal plateau (brass is darker than paper, so lift it)
const GROOVE_GAIN = 2.0; // how hard high-pass relief lifts the emboss
const HP_SIGMA = 30; // high-pass radius: wide enough to keep ornament relief, flatten vignettes

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function hsv(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const v = max / 255, s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;
  }
  return [h, s, v];
}

/** Blur a 1-channel buffer, collapse sharp's sRGB promotion back to 1 channel. */
async function blur1(buf, W, H, sigma) {
  const { data, info } = await sharp(buf, { raw: { width: W, height: H, channels: 1 } })
    .blur(sigma).raw().toBuffer({ resolveWithObject: true });
  if (info.channels === 1) return data;
  const out = Buffer.alloc(W * H);
  for (let p = 0; p < W * H; p++) out[p] = data[p * info.channels];
  return out;
}

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`missing ${SRC}`);
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // ---- silhouette (light card on dark backdrop) -------------------------
  // Flood the connected bright region containing the card centre. A plain
  // luminance threshold cannot reject velvet: a lit fold can hit near-white
  // (catching warm bounce light off the gold foil, sometimes landing in the
  // SAME hue/saturation range as the card's own gold — no per-pixel color rule
  // separates them) while staying connected to the card through a bright seam,
  // and the flood then swallows the whole fold.
  //
  // Fix: every generation is composed with the card inset from the frame edge
  // (velvet visible all around by prompt), so force a margin ring at the image
  // border to read as non-card regardless of brightness. A fold that bled
  // through always touches that outer ring (observed: a leaked silhouette's
  // bbox reached x=0/y=0 exactly); blocking the ring severs the connection at
  // the border no matter how wide the bridge is inside, without touching any
  // interior engraving. An erosion/adaptive-radius approach was tried first and
  // discarded: fine gold linework erodes away in its own sharp "cliff" almost
  // indistinguishable from a severed velvet bridge, so that heuristic false-
  // positived on clean images and false-negatived on the actual leak.
  const MARGIN = Math.round(0.02 * Math.min(W, H));
  const bright = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    bright[p] = lum(data[i], data[i + 1], data[i + 2]) > CARD_LUM ? 1 : 0;
  }
  const brightInset = new Uint8Array(bright); // copy
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (x < MARGIN || x >= W - MARGIN || y < MARGIN || y >= H - MARGIN) brightInset[y * W + x] = 0;
    }
  }
  const inCore = new Uint8Array(W * H);
  const stack = new Int32Array(W * H);
  let sp = 0;
  const seed = (H >> 1) * W + (W >> 1);
  if (brightInset[seed]) { stack[sp++] = seed; inCore[seed] = 1; }
  let coreMinX = W, coreMaxX = 0, coreMinY = H, coreMaxY = 0;
  while (sp > 0) {
    const p = stack[--sp], x = p % W, y = (p / W) | 0;
    if (x < coreMinX) coreMinX = x; if (x > coreMaxX) coreMaxX = x;
    if (y < coreMinY) coreMinY = y; if (y > coreMaxY) coreMaxY = y;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const n = ny * W + nx;
      if (brightInset[n] && !inCore[n]) { inCore[n] = 1; stack[sp++] = n; }
    }
  }
  if (coreMinX > coreMaxX) throw new Error("silhouette: no card found — lower CARD_LUM or check the source image");
  console.log(`silhouette: margin-excluded ${MARGIN}px ring; core ${coreMaxX - coreMinX + 1}x${coreMaxY - coreMinY + 1}`);
  // Small pad to recover true deckled-edge antialiasing just outside the core —
  // deliberately much smaller than MARGIN, or padding back out would re-admit
  // exactly the excluded ring the fold lives in and reopen the same leak.
  const PAD = 6;
  const fence = {
    left: Math.max(0, coreMinX - PAD), right: Math.min(W - 1, coreMaxX + PAD),
    top: Math.max(0, coreMinY - PAD), bottom: Math.min(H - 1, coreMaxY + PAD),
  };

  // Per-row convex span fill of the ORIGINAL (non-inset) bright mask, fenced to
  // the core's padded box — recovers the true deckled edge without any chance
  // of re-leaking past the fence into a fold just outside it.
  const mask = Buffer.alloc(W * H, 0);
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = fence.top; y <= fence.bottom; y++) {
    let first = -1, last = -1;
    for (let x = fence.left; x <= fence.right; x++) if (bright[y * W + x]) { if (first < 0) first = x; last = x; }
    if (first < 0) continue;
    mask.fill(255, y * W + first, y * W + last + 1);
    if (first < minX) minX = first;
    if (last > maxX) maxX = last;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  console.log("card bounds:", JSON.stringify(box));
  const alpha = await blur1(mask, W, H, 0.8);

  fs.mkdirSync(path.join(ROOT, "maps"), { recursive: true });
  fs.mkdirSync(path.join(ROOT, "cards"), { recursive: true });

  // ---- gold mask + luminance --------------------------------------------
  const gold = Buffer.alloc(W * H, 0);
  const L = Buffer.alloc(W * H);
  for (let p = 0; p < W * H; p++) {
    const i = p * C, r = data[i], g = data[i + 1], b = data[i + 2];
    L[p] = Math.round(lum(r, g, b));
    if (!alpha[p]) continue;
    const [h, s, v] = hsv(r, g, b);
    if (h >= GOLD_HUE[0] && h <= GOLD_HUE[1] && s > GOLD_SAT && v > GOLD_VAL) gold[p] = 255;
  }
  const goldSoft = await blur1(gold, W, H, 1.5);

  // ---- relief-aware height ----------------------------------------------
  // Empty panels are the largest SMOOTH bright regions — separate them from the
  // similarly-cream parchment by local flatness (|L - lowpass|), not colour.
  const lowIvory = await blur1(L, W, H, 12);
  const ivory = Buffer.alloc(W * H, 0);
  for (let p = 0; p < W * H; p++) {
    if (alpha[p] && L[p] > 188 && Math.abs(L[p] - lowIvory[p]) < 7) ivory[p] = 255;
  }

  // A WIDE high-pass keeps ornament-scale relief while flattening the big printed
  // vignettes (whose darkness is low-frequency and would otherwise crater). Gold
  // rides a raised plateau — brass is darker than the paper, so raw luminance
  // would sink it — but keeps its own groove relief added on top of the plateau.
  const lowH = await blur1(L, W, H, HP_SIGMA);
  const height = Buffer.alloc(W * H, 0);
  for (let p = 0; p < W * H; p++) {
    if (!alpha[p]) { height[p] = 0; continue; }
    const hp = (L[p] - lowH[p]) * GROOVE_GAIN; // local emboss relief, not broad print tone
    const gw = goldSoft[p] / 255;
    const base = PAPER * (1 - gw) + PLATEAU * gw;
    height[p] = Math.max(0, Math.min(255, Math.round(base + hp)));
  }
  const heightBuf = await blur1(height, W, H, 1.4);
  await sharp(heightBuf, { raw: { width: W, height: H, channels: 1 } })
    .extract(box).resize(TARGET_W, TARGET_H, { fit: "contain", background: { r: 0, g: 0, b: 0 } })
    .png().toFile(path.join(ROOT, "maps", `${fileSlug}-height.png`));

  // ---- normal (Sobel over height) ---------------------------------------
  const STRENGTH = 2.2;
  const normal = Buffer.alloc(W * H * 3);
  const at = (x, y) => heightBuf[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1) -
        (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1));
      const dy = at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1) -
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
    .extract(box).resize(TARGET_W, TARGET_H, { fit: "contain", background: { r: 128, g: 128, b: 255 } })
    .png().toFile(path.join(ROOT, "maps", `${fileSlug}-normal.png`));

  // ---- roughness (gold smooth, everything else matte) -------------------
  const rough = Buffer.alloc(W * H, 255);
  for (let p = 0; p < W * H; p++) rough[p] = alpha[p] ? Math.round(235 - (goldSoft[p] / 255) * 190) : 255;
  await sharp(rough, { raw: { width: W, height: H, channels: 1 } })
    .extract(box).resize(TARGET_W, TARGET_H, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .png().toFile(path.join(ROOT, "maps", `${fileSlug}-roughness.png`));

  // ---- transparent front cutout -----------------------------------------
  fs.mkdirSync(path.join(ROOT, "cards"), { recursive: true });
  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    rgba[p * 4] = data[p * C]; rgba[p * 4 + 1] = data[p * C + 1];
    rgba[p * 4 + 2] = data[p * C + 2]; rgba[p * 4 + 3] = alpha[p];
  }
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .extract(box).resize(TARGET_W, TARGET_H, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toFile(path.join(ROOT, "cards", `${fileSlug}-frame.png`));

  // ---- slots: the two ivory panels, as % of the card box -----------------
  // Connected-component flood fill on the ivory mask, not a per-row coverage
  // threshold: row-band scanning breaks on tall Gothic tracery, where isolated
  // bright rose petals beside the window widen the "coverage" per row and pull
  // the detected box outward. Flood fill only follows pixels that are actually
  // touching, so a petal a few pixels from the window (separated by dark gold
  // bar or border ground) can never merge into it.
  //
  // Close (dilate then erode) the ivory mask first: some frames render the
  // portrait window as a twin-lancet opening with a thin gold mullion down the
  // middle, which splits one visual window into two disconnected components —
  // closing bridges a gap that thin without merging the window into the plaque
  // below (that gap is a full sill bar, much wider than the closing radius).
  function dilate(src, R) {
    const h = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let v = 0;
      for (let dx = -R; dx <= R && !v; dx++) { const nx = x + dx; if (nx >= 0 && nx < W && src[y * W + nx]) v = 1; }
      h[y * W + x] = v;
    }
    const out = new Uint8Array(W * H);
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) {
      let v = 0;
      for (let dy = -R; dy <= R && !v; dy++) { const ny = y + dy; if (ny >= 0 && ny < H && h[ny * W + x]) v = 1; }
      out[y * W + x] = v;
    }
    return out;
  }
  function erodeMask(src, R) {
    const h = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      let run = 0;
      for (let x = 0; x < W + R; x++) {
        run = (x < W && src[y * W + x]) ? run + 1 : 0;
        const cx = x - R;
        if (cx >= 0 && cx < W) h[y * W + cx] = run >= 2 * R + 1 ? 1 : 0;
      }
    }
    const out = new Uint8Array(W * H);
    for (let x = 0; x < W; x++) {
      let run = 0;
      for (let y = 0; y < H + R; y++) {
        run = (y < H && h[y * W + x]) ? run + 1 : 0;
        const cy = y - R;
        if (cy >= 0 && cy < H) out[cy * W + x] = run >= 2 * R + 1 ? 1 : 0;
      }
    }
    return out;
  }
  const CLOSE_R = 5;
  const ivoryClosed = erodeMask(dilate(ivory, CLOSE_R), CLOSE_R);
  console.log("ivory px:", ivory.reduce((n, v) => n + (v ? 1 : 0), 0));
  const seenSlot = new Uint8Array(W * H);
  const slotStack = new Int32Array(W * H);
  const components = [];
  for (let sy = box.top; sy <= box.top + box.height; sy++) {
    for (let sx = box.left; sx <= box.left + box.width; sx++) {
      const s = sy * W + sx;
      if (!ivoryClosed[s] || seenSlot[s]) continue;
      let sp = 0, minCx = sx, maxCx = sx, minCy = sy, maxCy = sy, count = 0;
      slotStack[sp++] = s; seenSlot[s] = 1;
      while (sp > 0) {
        const p = slotStack[--sp], x = p % W, y = (p / W) | 0;
        count++;
        if (x < minCx) minCx = x; if (x > maxCx) maxCx = x;
        if (y < minCy) minCy = y; if (y > maxCy) maxCy = y;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < box.left || ny < box.top || nx > box.left + box.width || ny > box.top + box.height) continue;
          const n = ny * W + nx;
          if (ivoryClosed[n] && !seenSlot[n]) { seenSlot[n] = 1; slotStack[sp++] = n; }
        }
      }
      if (count > 400) components.push({ x0: minCx, y0: minCy, x1: maxCx, y1: maxCy, count });
    }
  }
  components.sort((a, b) => b.count - a.count);
  const top2c = components.slice(0, 2).sort((a, b) => a.y0 - b.y0);
  const pct = (v, base, span) => +(((v - base) / span) * 100).toFixed(1);
  const slotFor = (c) => ({
    left: pct(c.x0, box.left, box.width), top: pct(c.y0, box.top, box.height),
    width: pct(c.x1 - c.x0, 0, box.width), height: pct(c.y1 - c.y0, 0, box.height),
  });
  const window = top2c[0] ? { ...slotFor(top2c[0]), archRadiusY: 26 } : null;
  const plaque = top2c[1] ? slotFor(top2c[1]) : null;
  console.log("window slot:", JSON.stringify(window));
  console.log("plaque slot:", JSON.stringify(plaque));

  // ---- debug overlay: draw the detected slots to eyeball geometry -------
  const dbg = Buffer.from(rgba);
  const T = 4; // debug line thickness in px — thin lines vanish against similarly-colored gold ornament
  const drawRect = (s, col) => {
    if (!s) return;
    const x0 = box.left + Math.round((s.left / 100) * box.width);
    const y0 = box.top + Math.round((s.top / 100) * box.height);
    const x1 = x0 + Math.round((s.width / 100) * box.width);
    const y1 = y0 + Math.round((s.height / 100) * box.height);
    const put = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const p = (y * W + x) * 4; dbg[p] = col[0]; dbg[p + 1] = col[1]; dbg[p + 2] = col[2]; dbg[p + 3] = 255; };
    for (let x = x0; x <= x1; x++) for (let t = -T; t <= T; t++) { put(x, y0 + t); put(x, y1 + t); }
    for (let y = y0; y <= y1; y++) for (let t = -T; t <= T; t++) { put(x0 + t, y); put(x1 + t, y); }
  };
  drawRect(window, [0, 200, 255]);
  drawRect(plaque, [255, 80, 200]);
  await sharp(dbg, { raw: { width: W, height: H, channels: 4 } })
    .extract(box).png().toFile(path.join(ROOT, `${fileSlug}-slots-debug.png`));

  // Remap slots from the tight card box onto the padded canonical canvas, so the
  // percentages in kit.json match the resized, uniformly-sized output.
  const scale = Math.min(TARGET_W / box.width, TARGET_H / box.height);
  const sW = box.width * scale, sH = box.height * scale;
  const padL = (TARGET_W - sW) / 2, padT = (TARGET_H - sH) / 2;
  const remap = (s) => s && {
    left: +(((padL + (s.left / 100) * sW) / TARGET_W) * 100).toFixed(1),
    top: +(((padT + (s.top / 100) * sH) / TARGET_H) * 100).toFixed(1),
    width: +((((s.width / 100) * sW) / TARGET_W) * 100).toFixed(1),
    height: +((((s.height / 100) * sH) / TARGET_H) * 100).toFixed(1),
    ...(s.archRadiusY != null ? { archRadiusY: s.archRadiusY } : {}),
  };
  console.log(`canvas: ${TARGET_W}x${TARGET_H}  aspect ${(TARGET_W / TARGET_H).toFixed(4)}`);
  console.log("window slot (kit.json):", JSON.stringify(remap(window)));
  console.log("plaque slot (kit.json):", JSON.stringify(remap(plaque)));

  const goldPct = ((gold.reduce((n, v) => n + (v ? 1 : 0), 0) / (W * H)) * 100).toFixed(1);
  console.log("gold coverage:", goldPct + "%");
  console.log("wrote kit to", ROOT);
}

main().catch((e) => { console.error(e); process.exit(1); });
