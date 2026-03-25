import { Card } from "@/components/foundation/card";
import { RelativeChip } from "@/components/domain/relative-chip";
import type { PersonViewModel } from "@/lib/types";

type RelativeGroupProps = {
  person: PersonViewModel;
  buildHref: (personId: string) => string;
};

export function RelativeGroup({ person, buildHref }: RelativeGroupProps) {
  const groups = [
    ["Parents", person.relatives.parents, "accent"] as const,
    ["Siblings", person.relatives.siblings, "default"] as const,
    ["Spouses", person.relatives.spouses, "success"] as const,
    ["Children", person.relatives.children, "warning"] as const,
  ];

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Relatives</h3>
      <div className="space-y-4">
        {groups.map(([label, items, tone]) => (
          <div key={label} className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.length ? (
                items.map((relative) => (
                  <RelativeChip
                    key={relative.id}
                    person={relative}
                    href={buildHref(relative.id)}
                    tone={tone}
                  />
                ))
              ) : (
                <span className="text-sm text-[var(--text-muted)]">None recorded</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
