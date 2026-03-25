import { PersonEditor } from "@/components/domain/person-editor";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator, getPersonById } from "@/lib/queries";

type EditPageProps = {
  params: Promise<{ personId: string }>;
};

export default async function EditPersonPage({ params }: EditPageProps) {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const { personId } = await params;
  const person = await getPersonById({
    treeSlug: tree.slug,
    personId,
    viewer: { mode: "creator", accountId },
  });

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={<PersonEditor tree={tree} person={person} />}
        detail={null}
      />
    </ThemeProvider>
  );
}
