import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
};

export function Avatar({ name, className, ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--accent-muted)] text-sm font-semibold text-[var(--accent-text)]",
        className,
      )}
      aria-label={name}
      {...props}
    >
      {initials}
    </div>
  );
}
