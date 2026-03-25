import { ImportUploader } from "@/components/domain/import-uploader";
import { ImportReviewItem } from "@/components/domain/import-review-item";
import { Card } from "@/components/foundation/card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator, getImportJobsByTree } from "@/lib/queries";

export default async function ImportPage() {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const jobs = await getImportJobsByTree({
    treeSlug: tree.slug,
    viewer: { mode: "creator", accountId },
  });

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={<ImportUploader tree={tree} />}
        detail={
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Staged imports</h2>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{job.fileName}</p>
                  {job.issues.map((issue) => (
                    <ImportReviewItem key={issue.id} issue={issue} />
                  ))}
                </div>
              ))}
            </div>
          </Card>
        }
      />
    </ThemeProvider>
  );
}
