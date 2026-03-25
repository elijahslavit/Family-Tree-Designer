import { PersonEditor } from "@/components/domain/person-editor";
import { Card } from "@/components/foundation/card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator } from "@/lib/queries";

export default async function NewPersonPage() {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={<PersonEditor tree={tree} />}
        detail={
          <Card className="space-y-3">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Next steps</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              After you create the person record, the editor will reopen with relationship, event, and lineage tools.
            </p>
          </Card>
        }
      />
    </ThemeProvider>
  );
}
