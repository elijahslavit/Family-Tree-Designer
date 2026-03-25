import Link from "next/link";

import { Card } from "@/components/foundation/card";
import type { PersonViewModel } from "@/lib/types";

export function CanvasSidebar({
  person,
  profileHref,
}: {
  person: PersonViewModel;
  profileHref: string;
}) {
  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Focus person
        </p>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{person.fullName}</h2>
        <p className="text-sm text-[var(--text-secondary)]">{person.summary}</p>
      </div>
      <Link
        href={profileHref}
        className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-muted)]"
      >
        Open full profile
      </Link>
    </Card>
  );
}
