import type { Metadata } from "next";
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
};

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
    <html lang="en" suppressHydrationWarning>
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
