import { PersonCard } from "@/components/domain/person-card";
import { PersonRow } from "@/components/domain/person-row";
import type { Lineage, Person, ThemeLayout } from "@/lib/types";

export function DirectoryResults({
  people,
  layout,
  buildHref,
  lineagesByPerson,
}: {
  people: Person[];
  layout: ThemeLayout;
  buildHref: (personId: string) => string;
  lineagesByPerson: Map<string, Lineage[]>;
}) {
  if (layout === "classic") {
    return (
      <div className="grid gap-3">
        {people.map((person) => (
          <PersonRow
            key={person.id}
            person={person}
            href={buildHref(person.id)}
            lineages={lineagesByPerson.get(person.id) ?? []}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={
        layout === "explorer"
          ? "grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
          : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      }
    >
      {people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          href={buildHref(person.id)}
          lineages={lineagesByPerson.get(person.id) ?? []}
        />
      ))}
    </div>
  );
}
