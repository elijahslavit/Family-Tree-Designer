import Link from "next/link";

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
      className="grid gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 transition-colors hover:border-[var(--border-strong)] sm:grid-cols-[1.5fr_1fr_auto]"
    >
      <div>
        <p className="font-semibold text-[var(--text-primary)]">{person.fullName}</p>
        <p className="text-sm text-[var(--text-muted)]">{person.summary}</p>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">
        {formatLifespan(person.birthDateText, person.deathDateText, person.isLiving)}
      </p>
      <div className="flex flex-wrap gap-2">
        {lineages.slice(0, 1).map((lineage) => (
          <LineageBadge key={lineage.id} lineage={lineage} />
        ))}
      </div>
    </Link>
  );
}
