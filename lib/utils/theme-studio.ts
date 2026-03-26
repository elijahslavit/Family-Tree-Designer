import type { ThemeLayout, ThemeSkin } from "@/lib/types";

export type ThemeStudioScene = "landing" | "profile" | "canvas";

export const themeLayoutProfiles: Record<
  ThemeLayout,
  {
    title: string;
    strap: string;
    description: string;
    emphasis: string;
  }
> = {
  classic: {
    title: "Classic",
    strap: "Reference-first structure",
    description: "Library-like navigation, denser browsing, and a dependable companion detail rail.",
    emphasis: "Best when the archive should be fast to browse and steady to scan.",
  },
  editorial: {
    title: "Editorial",
    strap: "Story-led presentation",
    description: "Large reading surfaces and elegant profile rhythm for heirloom storytelling.",
    emphasis: "Best when biographies and lineage reading should feel ceremonial.",
  },
  explorer: {
    title: "Explorer",
    strap: "Canvas-led experience",
    description: "Spatial browsing with immersive graph space and a guided detail workbench.",
    emphasis: "Best when relationships and movement through the graph are the main attraction.",
  },
};

export const themeSkinProfiles: Record<
  ThemeSkin,
  {
    title: string;
    mood: string;
    strap: string;
    description: string;
    material: string;
    bestFor: string;
    signature: string;
    cueWords: string[];
    recommendedLayouts: ThemeLayout[];
  }
> = {
  "dark-gold": {
    title: "Dark Gold",
    mood: "Heirloom book",
    strap: "Candlelit depth with restrained gilding",
    description: "Leather-bound warmth, deep contrast, and ceremonial reading-room drama.",
    material: "Leather, gilt edges, and family bible margins",
    bestFor: "Branches meant to feel precious, formal, and quietly dramatic.",
    signature: "Warm heirloom contrast",
    cueWords: ["gilded", "candlelit", "ceremonial"],
    recommendedLayouts: ["editorial", "classic"],
  },
  parchment: {
    title: "Parchment",
    mood: "Library register",
    strap: "Paper, ink, and reading-room calm",
    description: "Cream paper, softened ink, and dignified genealogy-book steadiness.",
    material: "Vellum paper, annotations, and stitched registers",
    bestFor: "Archives that should feel scholarly, readable, and timeworn without being dark.",
    signature: "Paper-and-ink archive",
    cueWords: ["vellum", "annotated", "scholarly"],
    recommendedLayouts: ["classic", "editorial"],
  },
  modern: {
    title: "Modern",
    mood: "Clean atlas",
    strap: "Airy geometry with a calm digital finish",
    description: "Refined geometry, generous spacing, and a contemporary publishing polish.",
    material: "Gallery signage and product-grade editorial UI",
    bestFor: "Public archives meant for modern sharing, clarity, and graph-first exploration.",
    signature: "Calm modern atlas",
    cueWords: ["precise", "airy", "polished"],
    recommendedLayouts: ["explorer", "classic"],
  },
  botanical: {
    title: "Botanical Wall",
    mood: "Conservatory poster",
    strap: "Tree silhouettes, pressed greens, and atlas-paper softness",
    description: "Verdant paper tones and organic branchwork inspired by tree-wall family art.",
    material: "Pressed leaves, botanical plates, and map-backed poster stock",
    bestFor: "Family trees that should look displayed, handmade, and rooted in place.",
    signature: "Verdant heirloom poster",
    cueWords: ["leaf-script", "organic", "cartographic"],
    recommendedLayouts: ["editorial", "classic"],
  },
  inkwash: {
    title: "Ink Chronicle",
    mood: "Hand-drawn register",
    strap: "Engraved blacks, ivory paper, and authored linework",
    description: "Monochrome contrast and sketched structure inspired by illustrated family charts.",
    material: "India ink, cotton rag paper, and engraved lineage diagrams",
    bestFor: "Trees that should feel historical, authored, and visually closer to illustration than UI.",
    signature: "Illustrated lineage manuscript",
    cueWords: ["engraved", "calligraphic", "monochrome"],
    recommendedLayouts: ["editorial", "explorer"],
  },
  "portrait-gallery": {
    title: "Portrait Gallery",
    mood: "Salon keepsake",
    strap: "Cameo framing and photo-fan celebration",
    description: "Dusty color, framed medallions, and celebratory ancestry-poster warmth.",
    material: "Tinted portraits, velvet walls, and framed medallion fan charts",
    bestFor: "Families who want the archive to feel festive, portrait-led, and display-ready.",
    signature: "Salon fan-chart keepsake",
    cueWords: ["cameo", "framed", "celebratory"],
    recommendedLayouts: ["classic", "explorer"],
  },
};

export const themeStudioPresets: Array<{
  title: string;
  description: string;
  layout: ThemeLayout;
  skin: ThemeSkin;
}> = [
  {
    title: "Heirloom Book",
    description: "Editorial storytelling with warm, archival contrast.",
    layout: "editorial",
    skin: "dark-gold",
  },
  {
    title: "Library Register",
    description: "Classic browsing with paper-and-ink dignity.",
    layout: "classic",
    skin: "parchment",
  },
  {
    title: "Modern Atlas",
    description: "Explorer mapping with a calm contemporary finish.",
    layout: "explorer",
    skin: "modern",
  },
  {
    title: "Conservatory Wall",
    description: "Editorial reading with botanical poster warmth and place-driven atmosphere.",
    layout: "editorial",
    skin: "botanical",
  },
  {
    title: "Illustrated Chronicle",
    description: "Story-led profiles with the feel of a hand-inked lineage manuscript.",
    layout: "editorial",
    skin: "inkwash",
  },
  {
    title: "Portrait Salon",
    description: "Classic browsing shaped like a framed ancestry keepsake.",
    layout: "classic",
    skin: "portrait-gallery",
  },
];

export const themeSceneOptions: Array<{
  value: ThemeStudioScene;
  label: string;
}> = [
  { value: "landing", label: "Landing" },
  { value: "profile", label: "Profile" },
  { value: "canvas", label: "Canvas" },
];

export const sceneCopy: Record<
  ThemeStudioScene,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  landing: {
    eyebrow: "Viewer landing",
    title: "First impression",
    description: "Tree introduction, family tone, and the invitation to browse.",
  },
  profile: {
    eyebrow: "Person profile",
    title: "Reading rhythm",
    description: "Biography, facts, relatives, and lineage markers in context.",
  },
  canvas: {
    eyebrow: "Canvas explorer",
    title: "Relationship map",
    description: "The spatial family tree with detail guidance and branch identity.",
  },
};

export function labelizeTheme(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
