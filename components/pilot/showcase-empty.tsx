import { GitBranch } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Shared empty state for archive sections that have nothing to show yet.
 * Reads as "not ready" rather than "broken", because an un-imported project is
 * a normal stage of the work.
 */
export function ShowcaseEmpty({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full border border-[var(--sc-border-strong)] bg-[var(--sc-accent-wash)] text-[var(--sc-accent)]">
        {icon ?? <GitBranch className="h-5 w-5" />}
      </span>
      <h1 className="mt-5 font-serif text-3xl font-semibold">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--sc-ink-secondary)]">{description}</p>
    </section>
  );
}
