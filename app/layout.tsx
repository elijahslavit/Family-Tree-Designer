import type { Metadata } from "next";
import {
  Cardo,
  Cormorant_Garamond,
  Crimson_Text,
  DM_Serif_Display,
  Libre_Baskerville,
  Manrope,
  Marcellus,
  Newsreader,
  Nunito_Sans,
  Source_Sans_3,
  Source_Serif_4,
  Space_Grotesk,
} from "next/font/google";

import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { ToastProvider } from "@/components/foundation/toast";
import "./globals.css";

const darkDisplay = Cormorant_Garamond({
  variable: "--font-display-dark",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const darkBody = Source_Sans_3({
  variable: "--font-body-dark",
  subsets: ["latin"],
});

const parchmentDisplay = Libre_Baskerville({
  variable: "--font-display-parchment",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const parchmentBody = Source_Serif_4({
  variable: "--font-body-parchment",
  subsets: ["latin"],
});

const modernDisplay = Space_Grotesk({
  variable: "--font-display-modern",
  subsets: ["latin"],
});

const modernBody = Manrope({
  variable: "--font-body-modern",
  subsets: ["latin"],
});

const botanicalDisplay = Marcellus({
  variable: "--font-display-botanical",
  subsets: ["latin"],
  weight: ["400"],
});

const botanicalBody = Crimson_Text({
  variable: "--font-body-botanical",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const inkwashDisplay = Cardo({
  variable: "--font-display-inkwash",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inkwashBody = Newsreader({
  variable: "--font-body-inkwash",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const portraitDisplay = DM_Serif_Display({
  variable: "--font-display-portrait",
  subsets: ["latin"],
  weight: ["400"],
});

const portraitBody = Nunito_Sans({
  variable: "--font-body-portrait",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Family Tree Designer",
  description:
    "A presentation-first family archive with themed layouts, timeline storytelling, and public sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        darkDisplay.variable,
        darkBody.variable,
        parchmentDisplay.variable,
        parchmentBody.variable,
        modernDisplay.variable,
        modernBody.variable,
        botanicalDisplay.variable,
        botanicalBody.variable,
        inkwashDisplay.variable,
        inkwashBody.variable,
        portraitDisplay.variable,
        portraitBody.variable,
      ].join(" ")}
    >
      <body>
        <AnalyticsProvider>
          <ToastProvider>{children}</ToastProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
