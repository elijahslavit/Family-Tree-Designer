"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

type ColorMode = "light" | "dark";

const storageKey = "family-tree:color-mode";

function getDocumentMode(): ColorMode {
  return document.documentElement.dataset.colorMode === "dark" ? "dark" : "light";
}

export function ColorModeToggle() {
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
      aria-label="Toggle color mode"
      title="Toggle color mode"
      onClick={toggleMode}
      className="fixed bottom-20 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--site-border-strong)] bg-[var(--site-surface-raised)] text-[var(--site-text)] shadow-[var(--site-shadow)] transition-[background-color,color,border-color,transform] duration-[var(--transition-normal)] hover:-translate-y-0.5 hover:bg-[var(--site-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent)] lg:bottom-5 lg:right-5"
    >
      <Sun aria-hidden="true" className="color-mode-icon-dark h-[18px] w-[18px]" />
      <Moon aria-hidden="true" className="color-mode-icon-light h-[18px] w-[18px]" />
    </button>
  );
}
