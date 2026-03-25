import Link from "next/link";

import { Badge } from "@/components/foundation/badge";
import type { DirectoryFilters, Lineage } from "@/lib/types";

export function DirectoryActiveFilters({
  filters,
  lineages,
  clearHref,
}: {
  filters: DirectoryFilters;
  lineages: Lineage[];
  clearHref: string;
}) {
  const activeLineage = lineages.find((lineage) => lineage.id === filters.lineageId);
  const items = [
    filters.search ? `Search: ${filters.search}` : null,
    filters.surname ? `Surname: ${filters.surname}` : null,
    activeLineage ? `Lineage: ${activeLineage.name}` : null,
    filters.sort && filters.sort !== "name" ? `Sort: ${filters.sort}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-[var(--text-primary)]">Active view</span>
        {items.length ? (
          items.map((item) => (
            <Badge key={item} tone="accent">
              {item}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-[var(--text-secondary)]">
            Showing the full directory with the default name sort.
          </span>
        )}
      </div>
      {items.length ? (
        <Link href={clearHref} className="text-sm font-semibold text-[var(--accent-text)]">
          Clear filters
        </Link>
      ) : null}
    </div>
  );
}
