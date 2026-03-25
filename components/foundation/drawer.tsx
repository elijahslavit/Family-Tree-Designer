"use client";

import { X } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/foundation/button";
import { cn } from "@/lib/utils/cn";

type DrawerProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
  side?: "right" | "bottom";
}>;

export function Drawer({
  open,
  title,
  onClose,
  side = "right",
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 bg-black/35"
      role="presentation"
      onClick={onClose}
    >
      <aside
        ref={panelRef}
        className={cn(
          "absolute border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)] transition-transform duration-[var(--transition-normal)]",
          side === "right"
            ? "right-0 top-0 h-full w-full max-w-md p-5"
            : "bottom-0 left-0 right-0 rounded-t-[var(--radius-lg)] p-5",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          <Button variant="ghost" aria-label="Close drawer" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </aside>
    </div>
  );
}
