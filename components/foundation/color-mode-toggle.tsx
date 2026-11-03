"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils/cn";

type ColorMode = "light" | "dark";

const storageKey = "family-tree:color-mode";

function getDocumentMode(): ColorMode {
  return document.documentElement.dataset.colorMode === "dark" ? "dark" : "light";
}

export function ColorModeToggle({ className }: { className?: string }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystemPreference = (event: MediaQueryListEvent) => {
      try {
        if (window.localStorage.getItem(storageKey)) {
          return;
        }
      } catch {
        // A locked-down browser can still use the toggle for the current page.
      }

      const nextMode: ColorMode = event.matches ? "dark" : "light";
      document.documentElement.dataset.colorMode = nextMode;
    };

    media.addEventListener("change", followSystemPreference);
    return () => media.removeEventListener("change", followSystemPreference);
  }, []);

  function toggleMode() {
    const nextMode: ColorMode = getDocumentMode() === "dark" ? "light" : "dark";
    document.documentElement.dataset.colorMode = nextMode;

    try {
      window.localStorage.setItem(storageKey, nextMode);
    } catch {
      // The current page still changes even when storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={toggleMode}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-[var(--site-text-soft)] transition-colors duration-[var(--transition-normal)] hover:bg-[var(--site-surface-muted)] hover:text-[var(--site-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent)]",
        className,
      )}
    >
      <Sun aria-hidden="true" className="color-mode-icon-dark h-4 w-4" />
      <Moon aria-hidden="true" className="color-mode-icon-light h-4 w-4" />
    </button>
  );
}
