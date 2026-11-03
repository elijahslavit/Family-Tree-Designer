import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
};

export default function ClientAccessLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Client-facing pages are composed as fixed light, printed-archive surfaces.
  return <div data-light-only>{children}</div>;
}
