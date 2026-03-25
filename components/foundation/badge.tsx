import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeProps = PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    tone?: "default" | "accent" | "success" | "warning" | "danger";
  }
>;

const toneClasses = {
  default: "bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
  accent: "bg-[var(--accent-muted)] text-[var(--accent-text)]",
  success: "bg-[color-mix(in_oklab,var(--color-success)_20%,transparent)] text-[var(--color-success)]",
  warning: "bg-[color-mix(in_oklab,var(--color-warning)_20%,transparent)] text-[var(--color-warning)]",
  danger: "bg-[color-mix(in_oklab,var(--color-danger)_18%,transparent)] text-[var(--color-danger)]",
};

export function Badge({ children, className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
