import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Avatar } from "@/components/foundation/avatar";
import { Badge } from "@/components/foundation/badge";
import { LineageBadge } from "@/components/domain/lineage-badge";
import type { Lineage, Person } from "@/lib/types";
import { formatLifespan } from "@/lib/utils/dates";

type PersonRowProps = {
  person: Person;
  href: string;
  lineages?: Lineage[];
};

export function PersonRow({ person, href, lineages = [] }: PersonRowProps) {
  return (
    <Link
      href={href}
      className="group grid gap-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-4 transition-all duration-[var(--transition-normal)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] lg:grid-cols-[minmax(0,1.5fr)_220px_220px_auto]"
    >
      <div className="flex items-start gap-4">
        <Avatar name={person.fullName} />
        <div className="space-y-2">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-text)]">
              {person.fullName}
            </p>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {person.summary || "No summary has been recorded for this person yet."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:hidden">
            {lineages.slice(0, 2).map((lineage) => (
              <LineageBadge key={lineage.id} lineage={lineage} />
            ))}
            {person.isLiving ? <Badge tone="warning">Living</Badge> : null}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Lifespan</p>
        <p className="text-sm text-[var(--text-primary)]">
          {formatLifespan(person.birthDateText, person.deathDateText, person.isLiving)}
        </p>
      </div>
      <div className="hidden flex-wrap gap-2 lg:flex">
        {lineages.slice(0, 2).map((lineage) => (
          <LineageBadge key={lineage.id} lineage={lineage} />
        ))}
        {person.isLiving ? <Badge tone="warning">Living</Badge> : null}
      </div>
      <div className="hidden items-center justify-end lg:flex">
        <span className="rounded-full border border-[var(--border-default)] p-2 text-[var(--text-muted)] transition-colors group-hover:border-[var(--border-strong)] group-hover:text-[var(--accent-text)]">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
