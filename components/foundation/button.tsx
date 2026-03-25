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
    "bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--accent-muted)]",
  ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--accent-muted)]",
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
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold transition-all duration-[var(--transition-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-50",
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
