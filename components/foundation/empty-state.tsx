import Link from "next/link";

import { Card } from "@/components/foundation/card";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed text-center">
      <div className="mx-auto max-w-xl space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Empty State
        </p>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
        {actionLabel && actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
