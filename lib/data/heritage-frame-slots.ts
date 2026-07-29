/**
 * Heritage frame slot registry.
 *
 * Masculine: one shared spacing master (Italy v5 D measured from cutout).
 * Feminine: one shared spacing master (Italy feminine measured from cutout).
 *
 * All countries in a row use the same overlay slots so portrait/name placement
 * is consistent. Art must be derived onto these geometries to align visually.
 *
 * Re-measure masters: node scripts/sync-heritage-slots.js
 */
const MASCULINE_MASTER = {
  window: { left: 22.8, top: 15.9, width: 54.6, height: 45.1, archRadiusY: 26 },
  plaque: { left: 17.1, top: 66.1, width: 65.8, height: 11.3 },
} as const;

const FEMININE_MASTER = {
  window: { left: 29.2, top: 26.5, width: 41.1, height: 30.6, shape: "oval" as const },
  plaque: { left: 31.1, top: 57.7, width: 37.7, height: 11.4 },
} as const;

const MASCULINE_SLUGS = [
  "italian-heritage-masculine",
  "england-heritage-masculine",
  "germany-heritage-masculine",
  "france-heritage-masculine",
  "ireland-heritage-masculine",
  "mexico-heritage-masculine",
  "african-american-heritage-masculine",
] as const;

const FEMININE_SLUGS = [
  "italian-heritage-feminine",
  "england-heritage-feminine",
  "germany-heritage-feminine",
  "france-heritage-feminine",
  "ireland-heritage-feminine",
  "mexico-heritage-feminine",
  "african-american-heritage-feminine",
] as const;

function mapSlots<T extends readonly string[]>(slugs: T, slots: typeof MASCULINE_MASTER | typeof FEMININE_MASTER) {
  return Object.fromEntries(slugs.map((slug) => [slug, slots])) as Record<T[number], typeof slots>;
}

export const HERITAGE_FRAME_SLOTS = {
  ...mapSlots(MASCULINE_SLUGS, MASCULINE_MASTER),
  ...mapSlots(FEMININE_SLUGS, FEMININE_MASTER),
} as const;

export type HeritageKitSlug = keyof typeof HERITAGE_FRAME_SLOTS;

export const MASCULINE_HERITAGE_MASTER = MASCULINE_MASTER;
export const FEMININE_HERITAGE_MASTER = FEMININE_MASTER;

export function heritageSlots(slug: HeritageKitSlug) {
  return HERITAGE_FRAME_SLOTS[slug];
}
