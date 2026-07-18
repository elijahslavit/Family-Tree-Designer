/**
 * Public commercial terms. These mirror docs/pilot/COMMERCIAL_PLAN.md — change
 * both together, and never let the marketing pages state a figure that the
 * operating plan does not.
 */
export const pricing = {
  foundingPilot: {
    name: "Founding pilot",
    priceUsd: 249,
    seatsTotal: 2,
    note: "Two projects only, at the founding rate.",
  },
  standard: {
    name: "Single archive",
    priceUsd: 399,
    note: "One family archive, delivered and hosted for a year.",
  },
  renewal: {
    name: "Hosting renewal",
    priceUsd: 79,
    cadence: "per year",
    note: "Optional, after the first twelve months.",
  },
} as const;

/** What one project includes. Drawn from PILOT_PROJECT_LIMITS. */
export const includedScope = [
  "Up to 500 people imported from your GEDCOM",
  "One presentation style, applied throughout",
  "Up to five featured stories you write or we set up",
  "Two consolidated rounds of corrections",
  "A private, invitation-only link — never indexed",
  "Twelve months of hosting",
] as const;

/** Work quoted separately rather than hidden in the base price. */
export const outOfScope = [
  "Original genealogical research",
  "Archives beyond 500 people",
  "More than two rounds of corrections",
  "Printed or bound editions",
] as const;
