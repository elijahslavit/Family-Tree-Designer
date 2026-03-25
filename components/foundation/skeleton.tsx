import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-md)] bg-[color-mix(in_oklab,var(--text-muted)_20%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}
