import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Avatar } from "@/components/foundation/avatar";
import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import { LineageBadge } from "@/components/domain/lineage-badge";
import type { Lineage, Person } from "@/lib/types";
import { formatLifespan } from "@/lib/utils/dates";

type PersonCardProps = {
  person: Person;
  href: string;
  lineages?: Lineage[];
};

export function PersonCard({ person, href, lineages = [] }: PersonCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="relative h-full overflow-hidden transition-all duration-[var(--transition-normal)] hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent-primary)_12%,transparent),transparent)]" />
        <div className="relative flex h-full flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar
                name={person.fullName}
                className="h-12 w-12 bg-[color-mix(in_oklab,var(--accent-muted)_72%,white)]"
              />
              <div className="space-y-2">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-text)]">
                    {person.fullName}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {formatLifespan(
                      person.birthDateText,
                      person.deathDateText,
                      person.isLiving,
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lineages.slice(0, 2).map((lineage) => (
                    <LineageBadge key={lineage.id} lineage={lineage} />
                  ))}
                  {person.isLiving ? <Badge tone="warning">Living</Badge> : null}
                </div>
              </div>
            </div>
            <span className="rounded-full border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-2 text-[var(--text-muted)] transition-colors group-hover:border-[var(--border-strong)] group-hover:text-[var(--accent-text)]">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          {person.summary ? (
            <p className="text-sm leading-7 text-[var(--text-secondary)]">{person.summary}</p>
          ) : (
            <p className="text-sm italic text-[var(--text-muted)]">
              No summary has been recorded for this person yet.
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
