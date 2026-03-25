"use client";

import { X } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";

type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
}>;

export function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl bg-[var(--bg-elevated)]"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
          <Button aria-label="Close modal" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </Card>
    </div>
  );
}
