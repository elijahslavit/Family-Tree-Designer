import Link from "next/link";

import { Card } from "@/components/foundation/card";
import { StatCard } from "@/components/domain/stat-card";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getDemoStore } from "@/lib/data/demo-store";
import { publicTreeHref } from "@/lib/utils/links";

export default async function HomePage() {
  const { tree, people, families, events } = getDemoStore();

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="space-y-6 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-text)]">
              Family Tree Designer
            </p>
            <div className="space-y-4">
              <h1 className="display-name text-5xl font-semibold leading-tight text-[var(--text-primary)]">
                Build a family archive that feels like it belongs on a bookshelf.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
                Import your tree, shape it with editorial, classic, or explorer layouts, and
                share a polished archive link that relatives can browse without signing in.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-[var(--text-inverse)]"
              >
                Open creator mode
              </Link>
              <Link
                href={publicTreeHref(tree.slug, tree.shareToken)}
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)]"
              >
                Browse the shared archive
              </Link>
            </div>
          </Card>
          <div className="grid gap-4">
            <StatCard
              label="People"
              value={people.length}
              detail="Sample archive seeded for directory, profile, and canvas QA."
            />
            <StatCard
              label="Families"
              value={families.length}
              detail="Structured parent, spouse, and child links ready for graph browsing."
            />
            <StatCard
              label="Events"
              value={events.length}
              detail="Timeline-ready historical and occupational milestones."
            />
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Three distinct layouts",
              body: "Classic, Editorial, and Explorer all use the same data model but change how the archive feels.",
            },
            {
              title: "Query-layer privacy",
              body: "Living people stay visible in the tree without leaking dates, places, or biography in shared mode.",
            },
            {
              title: "Import-first workflow",
              body: "GEDCOM parsing, issue review, and confirmation are built into the creator surface instead of bolted on.",
            },
          ].map((item) => (
            <Card key={item.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">{item.title}</h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">{item.body}</p>
            </Card>
          ))}
        </section>
      </main>
    </ThemeProvider>
  );
}
