import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional studio",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
