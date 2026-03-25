import { DashboardActivityFeed } from "@/components/domain/dashboard-activity-feed";
import { DashboardAside } from "@/components/domain/dashboard-aside";
import { DashboardOverview } from "@/components/domain/dashboard-overview";
import { DashboardQuickActions } from "@/components/domain/dashboard-quick-actions";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/queries";
import { publicTreeHref } from "@/lib/utils/links";

export default async function DashboardPage() {
  const accountId = await requireAccountSession();
  const {
    tree,
    stats,
    topSurnames,
    recentPeople,
    openIssues,
    latestImportJob,
    lineages,
  } = await getDashboardData(accountId);
  const publicHref = publicTreeHref(tree.slug, tree.shareToken);

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <DashboardOverview
              tree={tree}
              stats={stats}
              topSurnames={topSurnames}
              publicHref={publicHref}
            />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <DashboardActivityFeed recentPeople={recentPeople} />
              <DashboardQuickActions
                tree={tree}
                latestImportJob={latestImportJob}
                openIssues={openIssues}
                publicHref={publicHref}
              />
            </div>
          </div>
        }
        detail={
          <DashboardAside
            tree={tree}
            lineages={lineages}
            openIssues={openIssues}
            publicHref={publicHref}
          />
        }
      />
    </ThemeProvider>
  );
}
