import Link from "next/link";

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
    <Link href={href}>
      <Card className="group h-full transition-transform hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <Avatar name={person.fullName} />
          <div className="space-y-2">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
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
            {person.summary ? (
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {person.summary}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {lineages.slice(0, 2).map((lineage) => (
                <LineageBadge key={lineage.id} lineage={lineage} />
              ))}
              {person.isLiving ? <Badge tone="warning">Living</Badge> : null}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
