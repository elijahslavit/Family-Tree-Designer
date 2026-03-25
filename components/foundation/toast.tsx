"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";

type ToastItem = {
  id: string;
  message: string;
  tone?: "default" | "success" | "danger";
};

const ToastContext = createContext<{
  pushToast: (message: string, tone?: ToastItem["tone"]) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const value = useMemo(
    () => ({
      pushToast(message: string, tone: ToastItem["tone"] = "default") {
        const id = crypto.randomUUID();
        setItems((current) => [...current, { id, message, tone }]);
        window.setTimeout(() => {
          setItems((current) => current.filter((item) => item.id !== id));
        }, 3000);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-[var(--radius-md)] border px-4 py-3 text-sm shadow-[var(--shadow-lg)]",
              item.tone === "success" && "border-[var(--color-success)] bg-[var(--bg-elevated)] text-[var(--text-primary)]",
              item.tone === "danger" && "border-[var(--color-danger)] bg-[var(--bg-elevated)] text-[var(--text-primary)]",
              item.tone === "default" && "border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)]",
            )}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
