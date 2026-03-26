"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import type { ThemeLayout, ThemeSkin } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

type ThemeProviderProps = PropsWithChildren<{
  layout: ThemeLayout;
  skin: ThemeSkin;
  className?: string;
}>;

export function ThemeProvider({
  children,
  layout,
  skin,
  className,
}: ThemeProviderProps) {
  useEffect(() => {
    try {
      window.localStorage.setItem(
        "family-tree:last-theme",
        JSON.stringify({ layout, skin }),
      );
    } catch {
      // Ignore storage access failures in private browsing or locked-down environments.
    }
  }, [layout, skin]);

  return (
    <div
      data-layout={layout}
      data-skin={skin}
      className={cn(
        "min-h-screen bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
}
