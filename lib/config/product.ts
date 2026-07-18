export const productConfig = {
  name: process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "Hearth & Heir",
  tagline: "Private genealogy delivery",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.invalid",
  foundingPilot: {
    peopleCap: 500,
    mediaItemCap: 25,
    mediaBytesCap: 500 * 1024 * 1024,
    mediaFileBytesCap: 20 * 1024 * 1024,
    featuredStoryCap: 5,
    includedCorrectionRounds: 2,
  },
} as const;

export function isPlaceholderSupportEmail() {
  return productConfig.supportEmail.endsWith(".invalid");
}
