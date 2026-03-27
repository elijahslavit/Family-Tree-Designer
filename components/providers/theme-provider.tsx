"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import type { ThemeLayout, ThemeSkin } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const darkSkins = new Set<ThemeSkin>(["dark-gold"]);

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
  const isDark = darkSkins.has(skin);

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

  useEffect(() => {
    const root = document.documentElement;
    root.style.colorScheme = isDark ? "dark" : "light";
    document.body.style.background = isDark
      ? "#0f0d0a"
      : "";

    return () => {
      root.style.colorScheme = "";
      document.body.style.background = "";
    };
  }, [isDark]);

  return (
    <div
      data-layout={layout}
      data-skin={skin}
      style={{ colorScheme: isDark ? "dark" : "light" }}
      className={cn(
        "min-h-screen bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
}
