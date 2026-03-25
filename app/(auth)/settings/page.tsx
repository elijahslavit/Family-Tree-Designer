import Link from "next/link";

import { AccountSettingsPanel } from "@/components/domain/account-settings-panel";
import { DangerZonePanel } from "@/components/domain/danger-zone-panel";
import { ShareSettings } from "@/components/domain/share-settings";
import { Card } from "@/components/foundation/card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import {
  getAccountForCreator,
  getActiveTreeForCreator,
  getReviewIssuesByTree,
} from "@/lib/queries";
import { hasConfiguredBackend, isDemoMode } from "@/lib/runtime";

export default async function SettingsPage() {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const account = await getAccountForCreator(accountId);
  const openIssues = await getReviewIssuesByTree({
    treeSlug: tree.slug,
    viewer: { mode: "creator", accountId },
    status: "open",
  });
  const demoMode = isDemoMode();
  const authConfigured = hasConfiguredBackend();

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <ShareSettings tree={tree} />
            <AccountSettingsPanel
              account={account}
              demoMode={demoMode}
              authConfigured={authConfigured}
            />
            <DangerZonePanel demoMode={demoMode} />
          </div>
        }
        detail={
          <div className="space-y-4">
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Theme shortcut
              </p>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Layout and skin</h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                The current archive is using the {tree.themeLayout} layout with the {tree.themeSkin} skin. Open the theme studio for live previews.
              </p>
              <Link
                href="/theme"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Open theme studio
              </Link>
            </Card>
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Import review
              </p>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {openIssues.length} open issue{openIssues.length === 1 ? "" : "s"}
              </h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                GEDCOM conflicts and missing-data checks stay on the dedicated import screen so settings can stay focused on tree configuration.
              </p>
              <Link
                href="/import"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Review imports
              </Link>
            </Card>
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Runtime
              </p>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Auth and persistence status</h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {demoMode
                  ? "The app is running in demo mode, so creator edits are stored in the seeded in-memory archive."
                  : authConfigured
                    ? "Supabase and the backend environment are configured for the live auth path."
                    : "Supabase auth is not configured yet, so only the demo runtime is available."}
              </p>
            </Card>
          </div>
        }
      />
    </ThemeProvider>
  );
}
