/**
 * Derives a legible presentation palette from a practice's two brand colours.
 *
 * The private showcase keeps a constant archival "paper" palette; the brand
 * colours act as the ink: primary actions, links, the dark feature band, and
 * accent details. Every derived text colour is pushed toward black or white
 * until it meets WCAG AA contrast against the surface it is drawn on, so any
 * brand a genealogist supplies stays readable.
 */

export type BrandPalette = {
  primary: string;
  primaryHover: string;
  onPrimary: string;
  primaryInk: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
  deep: string;
  onDeep: string;
  accentOnDeep: string;
};

type Rgb = [number, number, number];

// Ink colours are checked against the darkest parchment surface the showcase
// uses, so they stay legible on every lighter paper tone as well.
const PAPER = "#ebe3d3";
const LIGHT_TEXT = "#fbf7ee";
const DARK_TEXT = "#1f1b16";
const FALLBACK_PRIMARY = "#3f4f45";
const FALLBACK_ACCENT = "#9a7442";

export function normalizeHex(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = value.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const hex = match[1]!.length === 3 ? match[1]!.replace(/./g, (digit) => digit + digit) : match[1]!;
  return `#${hex.toLowerCase()}`;
}

function toRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toHex([red, green, blue]: Rgb) {
  return `#${[red, green, blue]
    .map((channel) => Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, "0"))
    .join("")}`;
}

/** Linear blend in sRGB; `amount` is the share of `target`. */
export function mixHex(base: string, target: string, amount: number) {
  const from = toRgb(base);
  const to = toRgb(target);
  return toHex([0, 1, 2].map((index) => from[index]! + (to[index]! - from[index]!) * amount) as Rgb);
}

function relativeLuminance(hex: string) {
  const [red, green, blue] = toRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }) as Rgb;
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (left, right) => right - left,
  ) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}

/** Moves `color` toward black or white in small steps until it reaches `minimum` contrast. */
export function ensureContrast(color: string, background: string, minimum: number) {
  if (contrastRatio(color, background) >= minimum) return color;
  const target = relativeLuminance(background) > 0.4 ? "#000000" : "#ffffff";
  for (let step = 1; step <= 20; step += 1) {
    const candidate = mixHex(color, target, step * 0.05);
    if (contrastRatio(candidate, background) >= minimum) return candidate;
  }
  return target;
}

function readableOn(background: string) {
  return contrastRatio(LIGHT_TEXT, background) >= contrastRatio(DARK_TEXT, background)
    ? LIGHT_TEXT
    : DARK_TEXT;
}

export function buildBrandPalette({
  primary,
  accent,
  paper = PAPER,
}: {
  primary: string | null | undefined;
  accent: string | null | undefined;
  paper?: string;
}): BrandPalette {
  const base = normalizeHex(primary) ?? FALLBACK_PRIMARY;
  const highlight = normalizeHex(accent) ?? FALLBACK_ACCENT;
  // Primary buttons carry body-size text, so they need AA against their label.
  const buttonFill = ensureContrast(base, LIGHT_TEXT, 4.5);
  const onPrimary = readableOn(buttonFill);
  // The feature band hosts large headings and long-form copy on a dark field.
  const deep = ensureContrast(mixHex(base, "#000000", 0.18), LIGHT_TEXT, 10);

  return {
    primary: buttonFill,
    primaryHover: mixHex(buttonFill, onPrimary === LIGHT_TEXT ? "#000000" : "#ffffff", 0.14),
    onPrimary,
    primaryInk: ensureContrast(base, paper, 4.5),
    accent: highlight,
    accentInk: ensureContrast(highlight, paper, 4.5),
    accentSoft: mixHex(highlight, paper, 0.74),
    deep,
    onDeep: LIGHT_TEXT,
    accentOnDeep: ensureContrast(highlight, deep, 4.5),
  };
}

export function brandCssVariables(palette: BrandPalette): Record<string, string> {
  return {
    "--brand-primary": palette.primary,
    "--brand-primary-hover": palette.primaryHover,
    "--brand-on-primary": palette.onPrimary,
    "--brand-primary-ink": palette.primaryInk,
    "--brand-accent": palette.accent,
    "--brand-accent-ink": palette.accentInk,
    "--brand-accent-soft": palette.accentSoft,
    "--brand-deep": palette.deep,
    "--brand-on-deep": palette.onDeep,
    "--brand-accent-on-deep": palette.accentOnDeep,
  };
}

/** Inline style that scopes a practice brand to a subtree; undefined when no brand. */
export function brandStyle(
  brand: { primaryColor: string; accentColor: string } | null | undefined,
): Record<string, string> | undefined {
  if (!brand) return undefined;
  return brandCssVariables(buildBrandPalette({ primary: brand.primaryColor, accent: brand.accentColor }));
}
