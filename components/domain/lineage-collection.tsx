import Link from "next/link";

import { LineageBadge } from "@/components/domain/lineage-badge";
import { Card } from "@/components/foundation/card";
import { EmptyState } from "@/components/foundation/empty-state";
import type { LineageViewModel } from "@/lib/types";

type LineageCollectionProps = {
  lineages: LineageViewModel[];
  buildPersonHref: (personId: string) => string;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
};

export function LineageCollection({
  lineages,
  buildPersonHref,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionHref,
}: LineageCollectionProps) {
  if (!lineages.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        actionHref={emptyActionHref}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {lineages.map((lineage) => (
        <Card key={lineage.id} className="space-y-4">
          <div className="space-y-2">
            <LineageBadge lineage={lineage} />
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{lineage.name}</h2>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {lineage.description || "No description recorded for this lineage yet."}
            </p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {lineage.members.map((member, index) => (
              <li key={`${lineage.id}:${member.id}`}>
                <Link
                  href={buildPersonHref(member.id)}
                  className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3 transition-colors hover:border-[var(--border-strong)]"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-muted)] text-sm font-semibold text-[var(--accent-text)]">
                    {index + 1}
                  </span>
                  <span className="space-y-1">
                    <span className="block font-semibold text-[var(--text-primary)]">
                      {member.fullName}
                    </span>
                    <span className="block text-sm text-[var(--text-secondary)]">
                      {member.summary || "No summary recorded."}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Card>
      ))}
    </div>
  );
}
