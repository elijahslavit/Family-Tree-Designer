import Link from "next/link";

import { Card } from "@/components/foundation/card";

type LineageOverviewProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string | number;
    detail: string;
  }>;
  primaryAction?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
};

export function LineageOverview({
  eyebrow,
  title,
  description,
  stats,
  primaryAction,
  secondaryAction,
}: LineageOverviewProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--accent-primary)_18%,transparent),transparent_42%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_78%,transparent),transparent)]" />
      <div className="relative space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {eyebrow}
            </p>
            <h2 className="display-name text-4xl font-semibold text-[var(--text-primary)] md:text-5xl">
              {title}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              {description}
            </p>
          </div>
          {primaryAction || secondaryAction ? (
            <div className="flex flex-wrap gap-3">
              {primaryAction ? (
                <Link
                  href={primaryAction.href}
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)]"
                >
                  {primaryAction.label}
                </Link>
              ) : null}
              {secondaryAction ? (
                <Link
                  href={secondaryAction.href}
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--bg-surface)_86%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
                >
                  {secondaryAction.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-4 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
