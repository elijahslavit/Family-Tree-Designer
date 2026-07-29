/**
 * Write or refresh kit.json for a heritage frame kit using canonical slots.
 *
 *   node scripts/write-heritage-kit-json.js <slug> [--template layout-v1-masculine|layout-v2-feminine]
 *
 * Example:
 *   node scripts/write-heritage-kit-json.js england-heritage-masculine
 *   node scripts/write-heritage-kit-json.js france-heritage-feminine --template layout-v2-feminine
 */
const fs = require("fs");
const path = require("path");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/write-heritage-kit-json.js <slug> [--template layout-v1-masculine|layout-v2-feminine]");
  process.exit(1);
}

const templateFlag = process.argv.indexOf("--template");
const templateKey =
  templateFlag >= 0
    ? process.argv[templateFlag + 1]
    : slug.includes("feminine")
      ? "heritage-feminine-shared"
      : "heritage-masculine-shared";

const ROOT = path.resolve(__dirname, "..");
const canonPath = path.join(ROOT, "public/card-kits/_templates/canonical-slots.json");
const canon = JSON.parse(fs.readFileSync(canonPath, "utf8"));
const slots = canon[templateKey];
if (!slots) {
  console.error(`Unknown template key: ${templateKey}`);
  process.exit(1);
}

const kitDir = path.join(ROOT, "public/card-kits", slug);
const frameSlug = `${slug}-frame`;
const display = slug
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");

const kit = {
  name: display.replace(" Heritage ", " Heritage — "),
  slug,
  palette: ["#E2D4B4", "#F4EBDD", "#3B2B1E", "#7A5A3A", "#B08A3E"],
  mode: "light",
  cardAspect: "900 / 1500",
  source: "source-frame.webp",
  build: `node scripts/build-theme-frame.js ${slug}`,
  template: templateKey,
  cards: [
    {
      name: `${display} frame`,
      slug: frameSlug,
      front: `cards/${frameSlug}.png`,
      maps: {
        normal: `maps/${slug}-normal.png`,
        roughness: `maps/${slug}-roughness.png`,
        height: `maps/${slug}-height.png`,
      },
      slots: {
        window: { ...slots.window },
        plaque: { ...slots.plaque },
      },
    },
  ],
  notes: `Canonical slots from ${templateKey}. Rebuild: node scripts/build-theme-frame.js ${slug}`,
};

fs.mkdirSync(kitDir, { recursive: true });
const out = path.join(kitDir, "kit.json");
fs.writeFileSync(out, JSON.stringify(kit, null, 2) + "\n");
console.log("wrote", out);
