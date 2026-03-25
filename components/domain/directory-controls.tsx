import Link from "next/link";
import { Search } from "lucide-react";

import { Badge } from "@/components/foundation/badge";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { Input, Select } from "@/components/foundation/input";
import type { DirectoryFilters, Lineage } from "@/lib/types";

type DirectoryControlsProps = {
  actionPath: string;
  filters: DirectoryFilters;
  surnames: string[];
  lineages: Lineage[];
  total: number;
  totalPages: number;
  shareToken?: string | null;
};

export function buildDirectoryHref({
  actionPath,
  filters,
  shareToken,
  page,
}: {
  actionPath: string;
  filters: DirectoryFilters;
  shareToken?: string | null;
  page?: number;
}) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.surname) {
    params.set("surname", filters.surname);
  }

  if (filters.lineageId) {
    params.set("lineage", filters.lineageId);
  }

  if (filters.sort && filters.sort !== "name") {
    params.set("sort", filters.sort);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  if (shareToken) {
    params.set("share", shareToken);
  }

  const query = params.toString();
  return query ? `${actionPath}?${query}` : actionPath;
}

export function DirectoryControls({
  actionPath,
  filters,
  surnames,
  lineages,
  total,
  totalPages,
  shareToken,
}: DirectoryControlsProps) {
  const currentPage = Math.max(filters.page ?? 1, 1);
  const hasFilters = Boolean(
    filters.search || filters.surname || filters.lineageId || filters.sort !== "name",
  );
  const quickLineages = lineages.slice(0, 4);

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Directory controls
        </p>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Find the right branch fast</h2>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          {total} result{total === 1 ? "" : "s"} across {totalPages} page
          {totalPages === 1 ? "" : "s"}.
        </p>
      </div>
      <form className="grid gap-4" method="GET" action={actionPath}>
        {shareToken ? <input type="hidden" name="share" value={shareToken} /> : null}
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Search</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <Input
              name="search"
              defaultValue={filters.search ?? ""}
              placeholder="Search people"
              className="pl-9"
            />
          </span>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Surname</span>
            <Select name="surname" defaultValue={filters.surname ?? ""}>
              <option value="">All surnames</option>
              {surnames.map((surname) => (
                <option key={surname} value={surname}>
                  {surname}
                </option>
              ))}
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Sort</span>
            <Select name="sort" defaultValue={filters.sort ?? "name"}>
              <option value="name">Name</option>
              <option value="birth">Birth</option>
              <option value="death">Death</option>
            </Select>
          </label>
        </div>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Lineage</span>
          <Select name="lineage" defaultValue={filters.lineageId ?? ""}>
            <option value="">All lineages</option>
            {lineages.map((lineage) => (
              <option key={lineage.id} value={lineage.id}>
                {lineage.name}
              </option>
            ))}
          </Select>
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit">Apply filters</Button>
          {hasFilters ? (
            <Link
              href={buildDirectoryHref({
                actionPath,
                filters: {},
                shareToken,
              })}
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
      {quickLineages.length ? (
        <div className="space-y-3 border-t border-[var(--border-default)] pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Quick branches</p>
            {filters.lineageId ? (
              <Badge tone="accent">
                {lineages.find((lineage) => lineage.id === filters.lineageId)?.name ?? "Filtered"}
              </Badge>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {quickLineages.map((lineage) => (
              <Link
                key={lineage.id}
                href={buildDirectoryHref({
                  actionPath,
                  filters: {
                    ...filters,
                    lineageId: lineage.id,
                    page: 1,
                  },
                  shareToken,
                })}
                className="rounded-full border border-[var(--border-default)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              >
                {lineage.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-default)] pt-4 text-sm">
        <span className="text-[var(--text-muted)]">Page {currentPage}</span>
        <div className="flex items-center gap-3">
          {currentPage > 1 ? (
            <Link
              href={buildDirectoryHref({
                actionPath,
                filters,
                shareToken,
                page: currentPage - 1,
              })}
              className="font-semibold text-[var(--accent-text)]"
            >
              Previous
            </Link>
          ) : null}
          {currentPage < totalPages ? (
            <Link
              href={buildDirectoryHref({
                actionPath,
                filters,
                shareToken,
                page: currentPage + 1,
              })}
              className="font-semibold text-[var(--accent-text)]"
            >
              Next
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
