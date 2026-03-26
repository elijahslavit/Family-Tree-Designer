import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils/cn";

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    padded?: boolean;
  }
>;

export function Card({ children, className, padded = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-[var(--creator-border)] bg-[var(--creator-surface)]",
        padded && "p-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
