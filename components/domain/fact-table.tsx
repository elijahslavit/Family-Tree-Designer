import { Card } from "@/components/foundation/card";
import type { Person } from "@/lib/types";

const fields = [
  ["Birth", (person: Person) => person.birthDateText || person.birthPlace],
  ["Birth place", (person: Person) => person.birthPlace],
  ["Death", (person: Person) => person.deathDateText],
  ["Death place", (person: Person) => person.deathPlace],
] as const;

export function FactTable({ person }: { person: Person }) {
  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Accepted facts</h3>
      <dl className="space-y-3">
        {fields.map(([label, resolver]) => {
          const value = resolver(person);
          return (
            <div
              key={label}
              className="grid grid-cols-[120px_1fr] gap-3 border-b border-[var(--border-muted)] pb-3 last:border-b-0 last:pb-0"
            >
              <dt className="text-sm text-[var(--text-muted)]">{label}</dt>
              <dd className="text-sm text-[var(--text-secondary)]">{value || "Unknown"}</dd>
            </div>
          );
        })}
      </dl>
    </Card>
  );
}
