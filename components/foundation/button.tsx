import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    loading?: boolean;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-[var(--creator-border-strong)] bg-[var(--creator-text)] text-white hover:bg-[#3a342c]",
  secondary:
    "border border-[var(--creator-border)] bg-[var(--creator-surface)] text-[var(--creator-text)] hover:bg-[var(--creator-surface-muted)]",
  ghost: "border border-[var(--creator-border)] bg-transparent text-[var(--creator-text-muted)] hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]",
  danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
};

export function Button({
  children,
  className,
  variant = "primary",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium transition-colors duration-[var(--transition-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--creator-accent)] disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Working..." : children}
    </button>
  );
}
