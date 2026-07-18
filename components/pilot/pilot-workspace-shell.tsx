import {
  Archive,
  BookOpenText,
  CheckCircle2,
  ClipboardCheck,
  FileUp,
  FolderKanban,
  Handshake,
  Images,
  KeyRound,
  LayoutDashboard,
  Palette,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/foundation/badge";
import { cn } from "@/lib/utils/cn";

export type PilotWorkspaceProject = {
  id: string;
  name: string;
  clientName: string;
  statusLabel: string;
  progress: number;
  synthetic?: boolean;
};

const navigation = [
  { segment: "", label: "Overview", icon: LayoutDashboard },
  { segment: "intake", label: "Intake", icon: ClipboardCheck },
  { segment: "theme", label: "Theme", icon: Palette },
  { segment: "import", label: "Import", icon: FileUp },
  { segment: "curate", label: "Curate", icon: Images },
  { segment: "review", label: "Review", icon: BookOpenText },
  { segment: "access", label: "Access", icon: KeyRound },
  { segment: "handoff", label: "Handoff", icon: Handshake },
] as const;

export function PilotWorkspaceShell({
  project,
  activeSegment,
  children,
  aside,
}: {
  project: PilotWorkspaceProject;
  activeSegment: (typeof navigation)[number]["segment"];
  children: ReactNode;
  aside?: ReactNode;
}) {
  const projectBase = `/projects/${project.id}`;

  return (
    <div className="min-h-screen bg-[#f1eee7] text-[#241f18]">
      <a
        href="#pilot-main"
        className="sr-only z-50 rounded bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to project content
      </a>
      <header className="border-b border-black/10 bg-[#fbf9f4] lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#746b5e]">
              Family Tree Designer
            </p>
            <p className="truncate font-semibold">{project.name}</p>
          </div>
          <Badge tone="accent">{project.statusLabel}</Badge>
        </div>
        <nav aria-label="Project workflow" className="flex gap-1 overflow-x-auto px-3 pb-3">
          {navigation.map((item) => {
            const href = item.segment ? `${projectBase}/${item.segment}` : projectBase;
            return (
              <Link
                key={item.segment}
                href={href}
                aria-current={activeSegment === item.segment ? "page" : undefined}
                style={activeSegment === item.segment ? { color: "#ffffff" } : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold",
                  activeSegment === item.segment
                    ? "bg-[#263a31] text-white"
                    : "bg-white text-[#665e53]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="hidden border-r border-black/10 bg-[#fbf9f4] lg:flex lg:flex-col">
          <div className="border-b border-black/10 px-6 py-6">
            <Link href="/projects" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#263a31] text-white">
                <Archive className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#746b5e]">
                  Professional studio
                </span>
                <span className="block font-semibold">Family Tree Designer</span>
              </span>
            </Link>
          </div>

          <div className="space-y-4 px-4 py-5">
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{project.name}</p>
                  <p className="mt-1 truncate text-xs text-[#746b5e]">{project.clientName}</p>
                </div>
                {project.synthetic ? <Badge tone="warning">Synthetic</Badge> : null}
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e7e1d7]">
                <div
                  className="h-full rounded-full bg-[#637b68]"
                  style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#746b5e]">
                <span>{project.statusLabel}</span>
                <span>{project.progress}%</span>
              </div>
            </div>

            <nav aria-label="Project workflow" className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const href = item.segment ? `${projectBase}/${item.segment}` : projectBase;
                return (
                  <Link
                    key={item.segment}
                    href={href}
                    aria-current={activeSegment === item.segment ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      activeSegment === item.segment
                        ? "bg-[#e4ebe5] text-[#20342a]"
                        : "text-[#665e53] hover:bg-black/[0.035] hover:text-[#241f18]",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {activeSegment === item.segment ? (
                      <CheckCircle2 className="ml-auto h-3.5 w-3.5" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto space-y-3 border-t border-black/10 p-4">
            <div className="flex items-start gap-3 rounded-lg bg-[#eef2ed] p-3 text-xs leading-5 text-[#4e6254]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Private by default. Publication gates are enforced before client delivery.</span>
            </div>
            <Link
              href="/projects"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#665e53] hover:text-[#241f18]"
            >
              <FolderKanban className="h-4 w-4" />
              All projects
            </Link>
          </div>
        </aside>

        <main id="pilot-main" className="min-w-0">
          <div
            className={cn(
              "mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8",
              aside && "xl:grid-cols-[minmax(0,1fr)_320px]",
            )}
          >
            <div className="min-w-0 space-y-6">{children}</div>
            {aside ? <aside className="space-y-5">{aside}</aside> : null}
          </div>
        </main>
      </div>
    </div>
  );
}
