import type { CSSProperties } from "react";

export type ShowcaseThemeId = "heirloom" | "linen";

/**
 * The token contract every showcase surface renders from. Adding a theme means
 * filling this in — no surface should reach for a literal colour.
 */
export type ShowcaseThemeTokens = {
  "--sc-bg": string;
  "--sc-surface": string;
  "--sc-elevated": string;
  "--sc-header": string;
  "--sc-footer": string;
  "--sc-ink": string;
  "--sc-ink-secondary": string;
  "--sc-ink-muted": string;
  "--sc-accent": string;
  "--sc-accent-hover": string;
  "--sc-accent-contrast": string;
  "--sc-accent-wash": string;
  "--sc-border": string;
  "--sc-border-strong": string;
  "--sc-display-font": string;
  "--sc-shadow": string;
  /** Full-bleed tint over the hero photograph, so one image serves both themes. */
  "--sc-hero-tint": string;
  /** Gradient that clears space for the hero copy. */
  "--sc-hero-scrim": string;
  /** Inverted band used by the closing section. */
  "--sc-band": string;
  "--sc-band-ink": string;
  "--sc-band-accent": string;
};

export type ShowcaseTheme = {
  id: ShowcaseThemeId;
  name: string;
  tagline: string;
  /** Written for the genealogist choosing on a client's behalf. */
  description: string;
  bestFor: string;
  colorScheme: "light" | "dark";
  /**
   * Existing skin token set to apply alongside the theme. Global rules colour
   * headings and canvas nodes from these, so it must match the theme's mood.
   */
  skin: "archive" | "dark-gold";
  /** Three colours that carry the theme's character in a picker swatch. */
  swatch: [string, string, string];
  tokens: ShowcaseThemeTokens;
};

export const SHOWCASE_THEMES: Record<ShowcaseThemeId, ShowcaseTheme> = {
  heirloom: {
    id: "heirloom",
    name: "Heirloom",
    tagline: "Candlelit depth and restrained gilding",
    description:
      "A dark, ceremonial reading room. Leather-bound warmth, gilt edges, and high contrast that makes portraits glow.",
    bestFor: "Families who want the archive to feel precious and formal.",
    colorScheme: "dark",
    skin: "dark-gold",
    swatch: ["#191411", "#d4af5a", "#f2e8da"],
    tokens: {
      "--sc-bg": "#191411",
      "--sc-surface": "#221b16",
      "--sc-elevated": "#2b221b",
      "--sc-header": "rgba(25, 20, 17, 0.94)",
      "--sc-footer": "#14100d",
      "--sc-ink": "#f4ebdd",
      "--sc-ink-secondary": "#d9c9b3",
      "--sc-ink-muted": "#a3907a",
      "--sc-accent": "#d4af5a",
      "--sc-accent-hover": "#e2c076",
      "--sc-accent-contrast": "#191411",
      "--sc-accent-wash": "rgba(212, 175, 90, 0.14)",
      "--sc-border": "rgba(212, 175, 90, 0.22)",
      "--sc-border-strong": "rgba(212, 175, 90, 0.46)",
      "--sc-display-font": "var(--font-serif, Georgia, 'Times New Roman', serif)",
      "--sc-shadow": "0 24px 60px -32px rgba(0, 0, 0, 0.9)",
      "--sc-hero-tint": "rgba(17, 13, 10, 0.68)",
      "--sc-hero-scrim":
        "linear-gradient(90deg, rgba(17,13,10,0) 0%, rgba(17,13,10,0.15) 38%, rgba(17,13,10,0.72) 58%, rgba(17,13,10,0.92) 100%)",
      "--sc-band": "#100c0a",
      "--sc-band-ink": "#efe3d0",
      "--sc-band-accent": "#d4af5a",
    },
  },
  linen: {
    id: "linen",
    name: "Linen",
    tagline: "Paper, ink, and reading-room calm",
    description:
      "A light archival world of cream paper and softened ink. Scholarly and timeworn without ever feeling dim.",
    bestFor: "Families who want the archive to feel like a published book.",
    colorScheme: "light",
    skin: "archive",
    swatch: ["#f4efe3", "#6b3e36", "#2a221c"],
    tokens: {
      "--sc-bg": "#f1eadc",
      "--sc-surface": "#f8f3e8",
      "--sc-elevated": "#fdfaf3",
      "--sc-header": "rgba(251, 248, 240, 0.94)",
      "--sc-footer": "#ebe3d3",
      "--sc-ink": "#2a221c",
      "--sc-ink-secondary": "#4c4137",
      "--sc-ink-muted": "#7a6f63",
      "--sc-accent": "#6b3e36",
      "--sc-accent-hover": "#7d4a40",
      "--sc-accent-contrast": "#f8f3e8",
      "--sc-accent-wash": "rgba(107, 62, 54, 0.1)",
      "--sc-border": "rgba(74, 56, 40, 0.16)",
      "--sc-border-strong": "rgba(107, 62, 54, 0.34)",
      "--sc-display-font": "var(--font-serif, Georgia, 'Times New Roman', serif)",
      "--sc-shadow": "0 22px 50px -34px rgba(58, 44, 30, 0.55)",
      "--sc-hero-tint": "rgba(242, 233, 216, 0.12)",
      "--sc-hero-scrim":
        "linear-gradient(90deg, rgba(242,233,216,0) 0%, rgba(242,233,216,0) 38%, rgba(242,233,216,0.62) 58%, rgba(242,233,216,0.86) 100%)",
      "--sc-band": "#2b332d",
      "--sc-band-ink": "#f2ece0",
      "--sc-band-accent": "#dac69e",
    },
  },
};

export const SHOWCASE_THEME_LIST: ShowcaseTheme[] = [
  SHOWCASE_THEMES.linen,
  SHOWCASE_THEMES.heirloom,
];

export function getShowcaseTheme(id: string | null | undefined): ShowcaseTheme {
  return id === "heirloom" ? SHOWCASE_THEMES.heirloom : SHOWCASE_THEMES.linen;
}

/** Spread onto a wrapper element to scope a theme to everything inside it. */
export function showcaseThemeStyle(theme: ShowcaseTheme): CSSProperties {
  return theme.tokens as unknown as CSSProperties;
}
