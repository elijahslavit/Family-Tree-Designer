import Image from "next/image";

import { cn } from "@/lib/utils/cn";

/**
 * A portrait when one exists, an initial when one does not. Imported archives
 * usually arrive without photographs, and a monogram reads as a deliberate
 * choice where a placeholder image reads as a fault.
 */
export function PersonPortrait({
  name,
  src,
  sizes,
  className,
  monogramClassName,
}: {
  name: string;
  src?: string | null;
  sizes: string;
  className?: string;
  monogramClassName?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={`Portrait of ${name}`}
        fill
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex h-full w-full items-center justify-center bg-[var(--sc-accent-wash)] font-serif text-[var(--sc-ink-muted)]",
        monogramClassName ?? "text-3xl",
      )}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
