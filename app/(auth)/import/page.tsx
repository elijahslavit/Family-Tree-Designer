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
        activePath="/import"
        main={<ImportUploader tree={tree} />}
        detail={
          <Card className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
                Review
              </p>
              <h2 className="text-xl font-semibold text-[var(--creator-text)]">
                Staged imports
              </h2>
            </div>
            <div className="space-y-3">
              {jobs.length ? (
                jobs.map((job) => (
                  <div key={job.id} className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--creator-text)]">{job.fileName}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
                        {job.status}
                      </p>
                    </div>
                    {job.issues.length ? (
                      job.issues.map((issue) => (
                        <ImportReviewItem key={issue.id} issue={issue} editable />
                      ))
                    ) : (
                      <p className="text-sm text-[var(--creator-text-muted)]">No issues detected.</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-4 text-sm text-[var(--creator-text-muted)]">
                  No staged imports yet. Upload a GEDCOM file to review counts and confirm the write.
                </div>
              )}
            </div>
          </Card>
        }
      />
    </ThemeProvider>
  );
}
