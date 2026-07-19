import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond, Instrument_Sans, Libre_Baskerville } from "next/font/google";
import Script from "next/script";

import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { ColorModeToggle } from "@/components/foundation/color-mode-toggle";
import { ToastProvider } from "@/components/foundation/toast";
import { productConfig } from "@/lib/config/product";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(productConfig.appUrl),
  title: {
    default: productConfig.name,
    template: `%s | ${productConfig.name}`,
  },
  description:
    "Private, presentation-first family archives for professional genealogists and their clients.",
  openGraph: {
    type: "website",
    siteName: productConfig.name,
    title: `${productConfig.name} — ${productConfig.tagline}`,
    description:
      "We turn a genealogist's finished research into a private family archive worth handing over.",
  },
  twitter: { card: "summary_large_image" },
};

/**
 * Self-hosted at build time, so the deployed site makes no external font request
 * and nothing reflows once the page paints.
 *
 * EB Garamond carries the archive: a genuine old-style face with the warmth of a
 * printed book. Cormorant is the Heirloom theme's display voice — higher
 * contrast and more ceremonial, but too delicate for body text at any size.
 * Spectral was drawn for reading on screens and holds up small, which matters on
 * pages that are mostly dates and short biographies.
 */
const displayFont = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const ceremonialFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
});

/**
 * The reading serif. Baskerville is the English book face of Austen's era — a
 * Jane Austen novel today is most often reprinted in it — so the archive's prose
 * reads like a classic novel rather than a web page. Libre Baskerville is the
 * screen-tuned cut: a large x-height and sturdier hairlines keep it easy to read
 * at body sizes, where the original Baskerville would shimmer.
 */
const bodyFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-baskerville",
});

/**
 * The interface sans. The family-facing archive reads entirely in serif, but the
 * genealogist's workspace is a working tool — its dense labels, badges, dates,
 * and controls want a clean humanist sans, with the serif kept for display
 * headings. Instrument Sans pairs quietly with Garamond and stays legible small.
 */
const uiFont = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const fontVariables = [
  displayFont.variable,
  ceremonialFont.variable,
  bodyFont.variable,
  uiFont.variable,
].join(" ");

const colorModeScript = `
  try {
    const stored = window.localStorage.getItem("family-tree:color-mode");
    const mode = stored === "light" || stored === "dark"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    document.documentElement.dataset.colorMode = mode;
  } catch {
    document.documentElement.dataset.colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <AnalyticsProvider>
          <ToastProvider>{children}</ToastProvider>
        </AnalyticsProvider>
        <ColorModeToggle />
        <Script id="color-mode" strategy="beforeInteractive">
          {colorModeScript}
        </Script>
      </body>
    </html>
  );
}
