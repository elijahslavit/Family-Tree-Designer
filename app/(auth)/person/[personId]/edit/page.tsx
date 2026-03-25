import { PersonEditor } from "@/components/domain/person-editor";
import { PersonEventsManager } from "@/components/domain/person-events-manager";
import { PersonLineageManager } from "@/components/domain/person-lineage-manager";
import { PersonRelationshipManager } from "@/components/domain/person-relationship-manager";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import {
  getActiveTreeForCreator,
  getEventsByPerson,
  getFamiliesByTree,
  getFamilyChildrenByTree,
  getLineagesByTree,
  getPeopleByTree,
  getPersonById,
} from "@/lib/queries";

type EditPageProps = {
  params: Promise<{ personId: string }>;
};

export default async function EditPersonPage({ params }: EditPageProps) {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const { personId } = await params;
  const viewer = { mode: "creator" as const, accountId };
  const [person, peopleDirectory, families, familyChildren, events, lineages] = await Promise.all([
    getPersonById({
      treeSlug: tree.slug,
      personId,
      viewer,
    }),
    getPeopleByTree({
      treeSlug: tree.slug,
      viewer,
      filters: {
        pageSize: 5000,
      },
    }),
    getFamiliesByTree({
      treeSlug: tree.slug,
      viewer,
    }),
    getFamilyChildrenByTree({
      treeSlug: tree.slug,
      viewer,
    }),
    getEventsByPerson({
      treeSlug: tree.slug,
      personId,
      viewer,
    }),
    getLineagesByTree({
      treeSlug: tree.slug,
      viewer,
    }),
  ]);

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={<PersonEditor tree={tree} person={person} />}
        detail={
          <div className="space-y-4">
            <PersonRelationshipManager
              tree={tree}
              person={person}
              people={peopleDirectory.items}
              families={families}
              familyChildren={familyChildren}
            />
            <PersonEventsManager tree={tree} person={person} events={events} />
            <PersonLineageManager tree={tree} person={person} lineages={lineages} />
          </div>
        }
      />
    </ThemeProvider>
  );
}
