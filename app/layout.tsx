import type { Metadata } from "next";

import { AnalyticsProvider } from "@/components/providers/analytics-provider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          <ToastProvider>{children}</ToastProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
