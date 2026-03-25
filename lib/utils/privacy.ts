import type { Person, ViewerContext } from "@/lib/types";

export function isViewerSuppressed(person: Person, viewer: ViewerContext) {
  return viewer.mode === "viewer" && person.isLiving;
}

export function maskPersonForViewer(person: Person): Person {
  return {
    ...person,
    birthDateText: null,
    birthDateNormalized: null,
    birthPlace: null,
    deathDateText: null,
    deathDateNormalized: null,
    deathPlace: null,
    summary: "Details private",
    biographyMd: "Details private",
  };
}
