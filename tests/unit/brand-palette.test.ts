import { describe, expect, it } from "vitest";

import {
  brandCssVariables,
  brandStyle,
  buildBrandPalette,
  contrastRatio,
  ensureContrast,
  normalizeHex,
} from "@/lib/utils/brand-palette";

const PAPER = "#f8f4ea";

const brands: Array<[string, string]> = [
  ["#163a35", "#b9874f"], // demo practice: deep green + gold
  ["#6b3e36", "#c9a36a"], // oxblood
  ["#f5e663", "#ffd400"], // pale yellow brand (hard case)
  ["#ffffff", "#ffffff"], // white everywhere (hard case)
  ["#000000", "#222222"], // black
  ["#1e6fd9", "#e85d75"], // saturated blue + pink
];

describe("buildBrandPalette", () => {
  it.each(brands)("keeps every text pairing at WCAG AA for %s / %s", (primary, accent) => {
    const palette = buildBrandPalette({ primary, accent });

    expect(contrastRatio(palette.onPrimary, palette.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.primaryInk, PAPER)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.accentInk, PAPER)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.onDeep, palette.deep)).toBeGreaterThanOrEqual(10);
    expect(contrastRatio(palette.accentOnDeep, palette.deep)).toBeGreaterThanOrEqual(4.5);
  });

  it("preserves a brand colour that is already legible", () => {
    const palette = buildBrandPalette({ primary: "#163a35", accent: "#b9874f" });
    expect(palette.primary).toBe("#163a35");
    expect(palette.primaryInk).toBe("#163a35");
    // Gold on parchment is too faint for text, so the ink is darkened.
    expect(palette.accent).toBe("#b9874f");
    expect(palette.accentInk).not.toBe("#b9874f");
  });

  it("falls back safely on missing or malformed colours", () => {
    const palette = buildBrandPalette({ primary: "not-a-colour", accent: undefined });
    expect(normalizeHex(palette.primary)).toBe(palette.primary);
    expect(contrastRatio(palette.onPrimary, palette.primary)).toBeGreaterThanOrEqual(4.5);
  });

  it("normalises shorthand and uppercase hex", () => {
    expect(normalizeHex("#ABC")).toBe("#aabbcc");
    expect(normalizeHex("163A35")).toBe("#163a35");
    expect(normalizeHex("rgb(0,0,0)")).toBeNull();
  });
});

describe("ensureContrast", () => {
  it("moves toward whichever extreme can actually reach the target on mid-grey backgrounds", () => {
    // White reaches only ~4.48:1 on #777777; black reaches ~4.69:1.
    const result = ensureContrast("#777777", "#777777", 4.5);
    expect(contrastRatio(result, "#777777")).toBeGreaterThanOrEqual(4.5);
  });
});

describe("brand CSS variables", () => {
  it("exposes the full token set", () => {
    const variables = brandCssVariables(buildBrandPalette({ primary: "#163a35", accent: "#b9874f" }));
    expect(Object.keys(variables)).toEqual([
      "--brand-primary",
      "--brand-primary-hover",
      "--brand-on-primary",
      "--brand-primary-ink",
      "--brand-accent",
      "--brand-accent-ink",
      "--brand-accent-soft",
      "--brand-deep",
      "--brand-on-deep",
      "--brand-accent-on-deep",
    ]);
  });

  it("scopes nothing when no brand is supplied", () => {
    expect(brandStyle(null)).toBeUndefined();
    expect(brandStyle({ primaryColor: "#163a35", accentColor: "#b9874f" })?.["--brand-primary"]).toBe("#163a35");
  });
});
