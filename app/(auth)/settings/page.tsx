import { AccountSettingsPanel } from "@/components/domain/account-settings-panel";
import { DangerZonePanel } from "@/components/domain/danger-zone-panel";
import { SettingsAside } from "@/components/domain/settings-aside";
import { SettingsOverview } from "@/components/domain/settings-overview";
import { ShareSettings } from "@/components/domain/share-settings";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import {
  getAccountForCreator,
  getActiveTreeForCreator,
  getReviewIssuesByTree,
} from "@/lib/queries";
import { hasConfiguredBackend, isDemoMode } from "@/lib/runtime";
import { publicTreeHref } from "@/lib/utils/links";

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
  const publicHref = publicTreeHref(tree.slug, tree.shareToken);

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <SettingsOverview
              tree={tree}
              account={account}
              openIssues={openIssues.length}
              publicHref={publicHref}
              demoMode={demoMode}
              authConfigured={authConfigured}
            />
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
          <SettingsAside
            tree={tree}
            openIssues={openIssues.length}
            publicHref={publicHref}
            demoMode={demoMode}
            authConfigured={authConfigured}
          />
        }
      />
    </ThemeProvider>
  );
}
