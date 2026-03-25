import { ShareSettings } from "@/components/domain/share-settings";
import { ImportReviewItem } from "@/components/domain/import-review-item";
import { Card } from "@/components/foundation/card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator } from "@/lib/queries";
import { getDemoStore } from "@/lib/data/demo-store";

export default async function SettingsPage() {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const issues = getDemoStore().reviewIssues;

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={<ShareSettings tree={tree} />}
        detail={
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Open review issues</h2>
            <div className="space-y-3">
              {issues.map((issue) => (
                <ImportReviewItem key={issue.id} issue={issue} />
              ))}
            </div>
          </Card>
        }
      />
    </ThemeProvider>
  );
}
