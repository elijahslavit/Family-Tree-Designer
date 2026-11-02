import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CalendarClock,
  Check,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Eye,
  FileArchive,
  FileCheck2,
  FileText,
  Fingerprint,
  FolderKanban,
  HardDrive,
  ImageIcon,
  KeyRound,
  LockKeyhole,
  Mail,
  ScanSearch,
  ShieldCheck,
  ShieldQuestion,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import {
  ClientApprovalControl,
  CopyPrivatePath,
  CurationEditor,
  DeletionControl,
  ExportControl,
  HandoffControl,
  ImportIssueWorkbench,
  InviteIssuer,
  InviteRowActions,
  LocalDraftForm,
  PilotUploadControl,
  ReviewItemWorkbench,
  ReviewLifecycleControl,
} from "@/components/pilot/creator-pilot-controls";
import {
  GateRow,
  PilotPageHeader,
  PilotSection,
  PilotStat,
  PrivacyCallout,
  SyntheticCallout,
  WarningCallout,
} from "@/components/pilot/pilot-ui";
import {
  PILOT_WORKFLOW,
  PILOT_WORKFLOW_LABELS,
  type PilotChecklistItem,
  type PilotMediaAsset,
  type PilotProject,
  type PilotPublishGateResult,
  type PilotReviewVersion,
  type PilotWorkflowStatus,
  type PilotWorkspace,
} from "@/lib/pilot/types";
import { ColorModeToggle } from "@/components/foundation/color-mode-toggle";
import { brandStyle } from "@/lib/utils/brand-palette";
import { cn } from "@/lib/utils/cn";

const statusRoute: Record<PilotWorkflowStatus, string> = {
  intake: "intake",
  materials: "import",
  import_review: "import",
  curation: "curate",
  professional_preview: "review",
  client_review_round_1: "review",
  revision_round_2: "review",
  approval_publication: "review",
  handoff: "handoff",
  active_archive: "handoff",
};

function cleanLabel(value: string) {
  return value;
}

function formatDate(value?: string | null, withTime = false) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

function formatBytes(value: number) {
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / (1024 * 1024)).toFixed(value > 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

function projectProgress(project: PilotProject) {
  return Math.round(
    (project.workflow.filter((step) => step.state === "complete").length /
      PILOT_WORKFLOW.length) *
      100,
  );
}

function nextWorkflowStep(project: PilotProject) {
  return (
    project.workflow.find((step) => step.state === "current") ??
    project.workflow.find((step) => step.state === "up_next") ??
    project.workflow.at(-1)
  );
}

function checklistState(item: PilotChecklistItem) {
  if (item.status === "complete") return "complete" as const;
  if (item.status === "waived") return "override" as const;
  return item.requiredForPublish ? ("blocked" as const) : ("pending" as const);
}

function mediaPreviewPath(media: PilotMediaAsset) {
  return media.derivativePath ?? media.inertPreviewPath ?? null;
}

export function PilotPortfolioPage({ workspace }: { workspace: PilotWorkspace }) {
  const activeProjects = workspace.projects.filter((project) => project.status !== "active_archive");
  const blockedProjects = workspace.projects.filter((project) =>
    project.checklist.some((item) => item.requiredForPublish && item.status === "pending"),
  );

  return (
    <main className="min-h-screen bg-[#f1eee7] text-[#241f18]">
      <a href="#projects-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to projects
      </a>
      <header className="border-b border-black/10 bg-[#fbf9f4]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/projects" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#263a31] text-white">
              <Archive className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#746b5e]">Professional studio</span>
              <span className="block font-semibold">Family Tree Designer</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-[#746b5e] sm:inline">{workspace.portfolio.practitionerName}</span>
            <Badge tone="accent">Founding-pilot workspace</Badge>
            <ColorModeToggle />
          </div>
        </div>
      </header>

      <div id="projects-main" className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <PilotPageHeader
          eyebrow={workspace.portfolio.practiceName}
          title="Client delivery studio"
          description="Turn finished research into private, branded family presentations—from import to the family’s own archive."
          actions={
            <span className="inline-flex cursor-not-allowed items-center rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#8a8175]" title="During the founding pilot, new projects are set up with you">
              New project · set up with us
            </span>
          }
        />

        <SyntheticCallout>
          <strong>Demo studio.</strong> Every family, photograph, story, and record here is fictional, so you can explore freely.
        </SyntheticCallout>

        <section aria-label="Portfolio summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PilotStat label="Projects" value={workspace.projects.length} detail="Client projects in this studio." />
          <PilotStat label="In progress" value={activeProjects.length} detail="Not yet handed to the family." />
          <PilotStat label="Need attention" value={blockedProjects.length} detail="Something must be resolved before publishing." />
          <PilotStat label="Practice" value="Solo" detail="One genealogist, supported by our team during the pilot." />
        </section>

        <section aria-labelledby="projects-heading" className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#746b5e]">Portfolio</p>
              <h2 id="projects-heading" className="mt-1 text-2xl font-semibold">Client projects</h2>
            </div>
            <span className="text-xs text-[#746b5e]">Updated {formatDate(new Date().toISOString(), true)}</span>
          </div>

          {workspace.projects.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {workspace.projects.map((project) => {
                const next = nextWorkflowStep(project);
                const progress = projectProgress(project);
                return (
                  <article key={project.id} className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_32px_rgba(49,42,33,0.05)]">
                    <div className="h-2" style={{ backgroundColor: project.branding.primaryColor }} />
                    <div className="space-y-5 p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone="warning">Synthetic</Badge>
                            <Badge>{cleanLabel(PILOT_WORKFLOW_LABELS[project.status])}</Badge>
                          </div>
                          <h3 className="mt-3 text-2xl font-semibold">{project.title}</h3>
                          <p className="mt-1 text-sm text-[#746b5e]">Prepared for {project.clientLabel}</p>
                        </div>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eef2ed] text-[#4f6454]">
                          <FolderKanban className="h-5 w-5" />
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs text-[#746b5e]">
                          <span>Delivery workflow</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e9e4dc]" role="progressbar" aria-label={`${project.title} completion`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                          <div className="h-full rounded-full bg-[#637b68]" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <dl className="grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-xl bg-[#f7f4ee] p-3"><dt className="text-[10px] uppercase tracking-[0.14em] text-[#82796d]">People</dt><dd className="mt-1 text-lg font-semibold">{project.counts.people}</dd></div>
                        <div className="rounded-xl bg-[#f7f4ee] p-3"><dt className="text-[10px] uppercase tracking-[0.14em] text-[#82796d]">Media</dt><dd className="mt-1 text-lg font-semibold">{project.counts.mediaItems}</dd></div>
                        <div className="rounded-xl bg-[#f7f4ee] p-3"><dt className="text-[10px] uppercase tracking-[0.14em] text-[#82796d]">Stories</dt><dd className="mt-1 text-lg font-semibold">{project.counts.featuredStories}</dd></div>
                      </dl>

                      <div className="flex flex-col gap-3 rounded-xl border border-[#dce4dc] bg-[#f1f5f1] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6f776f]">Next controlled step</p>
                          <p className="mt-1 font-semibold text-[#2f4235]">{next ? cleanLabel(next.label) : "Archive active"}</p>
                        </div>
                        <Link href={`/projects/${project.id}/${statusRoute[next?.status ?? project.status]}`} style={{ color: "#ffffff" }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#263a31] px-4 py-2 text-sm font-semibold text-white hover:bg-[#334b3e]">
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <Card className="border-dashed bg-white py-14 text-center">
              <FolderKanban className="mx-auto h-8 w-8 text-[#82796d]" />
              <h3 className="mt-4 text-xl font-semibold">No pilot projects yet</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#746b5e]">An operator creates a project only after scope, authorization, and synthetic-or-legal-review status are recorded.</p>
            </Card>
          )}
        </section>

        <PilotSection eyebrow="Pilot scope" title="What each project includes" description="Clear limits keep every founding project focused and on schedule.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["500", "people"],
              ["25", "media items"],
              ["500 MB", "total media"],
              ["5", "featured stories"],
              ["2", "correction rounds"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-black/[0.07] bg-[#faf8f3] p-4">
                <p className="text-xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-[#746b5e]">{label}</p>
              </div>
            ))}
          </div>
        </PilotSection>
      </div>
    </main>
  );
}

export function PilotProjectOverview({
  project,
  gate,
}: {
  project: PilotProject;
  gate: PilotPublishGateResult;
}) {
  const next = nextWorkflowStep(project);
  const currentIndex = project.workflow.findIndex((step) => step.state === "current");
  const recentAudit = [...project.audit].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(0, 5);

  return (
    <>
      <PilotPageHeader
        eyebrow="Project overview"
        title={project.title}
        description={`A private family presentation for ${project.clientLabel}. Work through each step below; anything already delivered to the client never changes without a new review.`}
        actions={
          <>
            <Link href={`/projects/${project.id}/preview`} className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#302a23] hover:bg-[#f7f4ee]">
              <Eye className="h-4 w-4" /> Preview draft
            </Link>
            <Link href={`/projects/${project.id}/${statusRoute[next?.status ?? project.status]}`} style={{ color: "#ffffff" }} className="inline-flex items-center gap-2 rounded-lg bg-[#263a31] px-4 py-2 text-sm font-semibold text-white hover:bg-[#334b3e]">
              Continue {next ? cleanLabel(next.label) : "archive"}<ArrowRight className="h-4 w-4" />
            </Link>
          </>
        }
      />

      <SyntheticCallout>
        This is a demo project with a fictional family. The legal-review item stays open on purpose: it must be complete before any real family’s data is used.
      </SyntheticCallout>

      <section aria-label="Project summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PilotStat label="People" value={`${project.counts.people}/${project.scope.maxPeople}`} detail={`${project.importSummary.familyCount} family groups in the confirmed structure.`} />
        <PilotStat label="Media" value={`${project.media.filter((item) => item.quarantineStatus === "passed").length}/${project.scope.maxMediaItems}`} detail={`${formatBytes(project.counts.mediaBytes)} of ${formatBytes(project.scope.maxMediaBytes)} used.`} />
        <PilotStat label="Featured stories" value={`${project.counts.featuredStories}/${project.scope.maxFeaturedStories}`} detail={`At least ${project.scope.minFeaturedStories}, unless a reason is recorded.`} />
        <PilotStat label="Support time" value={`${Math.round(project.metrics.conciergeMinutes / 60 * 10) / 10}h`} detail={`Plus ${project.metrics.genealogistSetupMinutes} minutes of your own setup.`} />
      </section>

      <PilotSection eyebrow="Progress" title="Delivery steps" description="Ten steps from intake to the family’s own archive, each with a clear finish line.">
        <ol className="grid gap-2 md:grid-cols-2">
          {project.workflow.map((step, index) => {
            const Icon = step.state === "complete" ? Check : step.state === "current" ? CircleDashed : step.state === "blocked" ? LockKeyhole : Clock3;
            return (
              <li key={step.status} className={cn("flex items-center gap-3 rounded-xl border p-3", step.state === "current" ? "border-[#9eb09f] bg-[#eef3ee]" : step.state === "blocked" ? "border-red-200 bg-red-50" : "border-black/[0.07] bg-[#faf8f3]")}>
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold", step.state === "complete" ? "bg-emerald-100 text-emerald-800" : step.state === "current" ? "bg-[#263a31] text-white" : step.state === "blocked" ? "bg-red-100 text-red-700" : "bg-white text-[#746b5e]")}>
                  {step.state === "complete" ? <Icon className="h-4 w-4" /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[#302a23]">{cleanLabel(step.label)}</p>
                  <p className="mt-0.5 text-[11px] capitalize text-[#82796d]">{step.state.replace("_", " ")}{step.completedAt ? ` · ${formatDate(step.completedAt)}` : ""}</p>
                </div>
                {index === currentIndex ? <Badge tone="accent">Now</Badge> : null}
              </li>
            );
          })}
        </ol>
      </PilotSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <PilotSection eyebrow="Before publishing" title={gate.allowed ? "Ready to publish privately" : `${gate.blockers.length} ${gate.blockers.length === 1 ? "item" : "items"} left before publishing`} description="Everything here must be complete before the client is invited.">
          <div>
            {project.checklist.map((item) => (
              <GateRow
                key={item.key}
                label={item.label}
                detail={
                  item.key === "legal_review" && item.status !== "complete"
                    ? "Demo projects can continue without it. Real client data stays blocked until it is recorded."
                    : item.overrideReason ?? item.description
                }
                state={checklistState(item)}
              />
            ))}
          </div>
        </PilotSection>

        <PilotSection eyebrow="Activity" title="Recent activity" description="A permanent record of approvals, access changes, exports, and deletions.">
          {recentAudit.length ? (
            <ol className="space-y-4">
              {recentAudit.map((event) => (
                <li key={event.id} className="flex gap-3">
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eef2ed] text-[#4f6454]"><Activity className="h-3.5 w-3.5" /></span>
                  <div>
                    <p className="text-sm font-medium text-[#302a23]">{event.summary}</p>
                    <p className="mt-0.5 text-xs text-[#82796d]">{formatDate(event.occurredAt, true)} · {project.roles.find((role) => role.actorId === event.actorId)?.displayName ?? "System"}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-xl border border-dashed border-[#cbc3b8] p-6 text-center text-sm text-[#746b5e]">No project activity has been recorded yet.</p>
          )}
        </PilotSection>
      </div>
    </>
  );
}

export function PilotIntakePage({ project }: { project: PilotProject }) {
  const legalItems = project.checklist.filter((item) => ["legal_review", "rights_attestation", "living_person_consent"].includes(item.key));

  return (
    <>
      <PilotPageHeader eyebrow="Step 1 · Intake" title="Set up the engagement" description="Record who the client is, what’s included, and the permissions you hold—before any family files arrive." />
      <SyntheticCallout>
        Fictional demo material can move through every step. Real family data waits until the legal review is complete.
      </SyntheticCallout>

      <PilotSection eyebrow="Project" title="Client and scope" description="During the founding pilot, we set up each project together with you.">
        <LocalDraftForm project={project} />
      </PilotSection>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <PilotSection eyebrow="Permissions" title="Rights and consent" description="Publishing waits until each item is recorded. Consent is never assumed.">
          <div>{legalItems.map((item) => <GateRow key={item.key} label={item.label} detail={item.overrideReason ?? item.description} state={checklistState(item)} />)}</div>
        </PilotSection>

        <PilotSection eyebrow="Before real client data" title="Legal review" description="Required before any real family’s data is uploaded.">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">
              <div><p className="font-semibold text-red-900">Not completed</p><p className="mt-1 text-xs text-red-800">Target completion: day 35</p></div>
              <LockKeyhole className="h-6 w-6 text-red-700" />
            </div>
            <ul className="space-y-2 text-xs leading-5 text-[#665e53]">
              <li>• Obtain fixed-fee scope and quotes by day 21.</li>
              <li>• Require explicit founder approval before engaging or spending.</li>
              <li>• Review service order, privacy notice, DPA, consent, media rights, subprocessors, retention, incident response, and handoff.</li>
            </ul>
          </div>
        </PilotSection>
      </div>

      <PilotSection eyebrow="Suitable projects" title="What the pilot can take on" description="The founding pilot is deliberately focused while our privacy processes are proven.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 font-semibold text-emerald-900"><CheckCircle2 className="h-4 w-4" />Allowed</div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-900/80">
              <li>U.S.-based commissioned family-history and legacy projects</li>
              <li>Primarily deceased-person branches</li>
              <li>Living adults with documented consent and minimized fields</li>
              <li>Client-authorized, provenance-recorded media</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 font-semibold text-red-900"><AlertTriangle className="h-4 w-4" />Excluded</div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-red-900/80">
              <li>Forensic, probate, citizenship-evidence, and DNA-identification work</li>
              <li>Unknown-parentage and disputed-adoption engagements</li>
              <li>Living minors in the client presentation</li>
              <li>Exact addresses or full birth dates for living people</li>
            </ul>
          </div>
        </div>
      </PilotSection>

      <PilotSection eyebrow="Living relatives" title="Consent" description="Living adults can view, correct, hide, or remove their own profile. Living children stay hidden.">
        {project.consents.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead><tr className="border-b border-black/10 text-[10px] uppercase tracking-[0.14em] text-[#82796d]"><th className="pb-3 font-semibold">Subject</th><th className="pb-3 font-semibold">Kind</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 font-semibold">Allowed fields</th><th className="pb-3 font-semibold">Evidence</th></tr></thead>
              <tbody>{project.consents.map((consent) => <tr key={consent.id} className="border-b border-black/[0.06] last:border-0"><td className="py-4 font-medium text-[#302a23]">{consent.subjectLabel}</td><td className="py-4 capitalize text-[#665e53]">{consent.subjectKind.replaceAll("_", " ")}</td><td className="py-4"><Badge tone={consent.status === "granted" || consent.status === "not_required" ? "success" : consent.status === "declined" ? "danger" : "warning"}>{consent.status.replaceAll("_", " ")}</Badge></td><td className="py-4 text-[#665e53]">{consent.allowedFields.length ? consent.allowedFields.join(", ") : "None · hidden"}</td><td className="py-4 text-xs text-[#82796d]">{consent.evidenceReference ?? "Not recorded"}</td></tr>)}</tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-[#cbc3b8] p-6 text-center text-sm text-[#746b5e]">No living-person records are included. Keep this section empty rather than inventing consent.</p>
        )}
      </PilotSection>
    </>
  );
}

export function PilotImportPage({ project }: { project: PilotProject }) {
  const summary = project.importSummary;
  const safeMedia = project.media.filter((asset) => asset.quarantineStatus === "passed");
  const failedMedia = project.media.filter((asset) => asset.quarantineStatus === "failed");

  return (
    <>
      <PilotPageHeader eyebrow="Steps 2–3 · Materials" title="Bring in the research" description="Import the family tree, review anything uncertain, and add photographs and records. New files stay private until they pass safety checks." />
      <PrivacyCallout>
        Unconfirmed import staging expires on <strong>{formatDate(summary.stagingExpiresAt, true)}</strong>. Originals remain private; failed files are isolated and never parsed.
      </PrivacyCallout>

      <div className="grid gap-6 xl:grid-cols-2">
        <PilotSection eyebrow="Family tree file" title="Import a GEDCOM" description="In this demo, files are checked in your browser and never uploaded.">
          <PilotUploadControl kind="gedcom" />
        </PilotSection>
        <PilotSection eyebrow="Photographs and records" title="Add media" description="New files are held privately and appear nowhere until they pass a safety scan.">
          <PilotUploadControl kind="media" />
        </PilotSection>
      </div>

      <section aria-label="Import summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PilotStat label="People" value={`${summary.peopleCount}/${project.scope.maxPeople}`} detail={`${Math.max(0, project.scope.maxPeople - summary.peopleCount)} person slots remain in scope.`} />
        <PilotStat label="Family groups" value={summary.familyCount} detail={`Imported from ${summary.fileName}.`} />
        <PilotStat label="Sources" value={summary.sourceCount} detail="Source references are preserved with the normalized graph." />
        <PilotStat label="Review issues" value={summary.issues.filter((issue) => issue.status === "open").length} detail={`${summary.issues.filter((issue) => issue.severity === "blocking" && issue.status === "open").length} currently block confirmation.`} />
      </section>

      <PilotSection eyebrow="Import review" title="Check what needs attention" description="Resolve or acknowledge each item. Uncertain relationships stay labeled rather than being quietly changed.">
        <ImportIssueWorkbench issues={summary.issues} />
      </PilotSection>

      <PilotSection eyebrow="Safety checks" title="Media awaiting approval" description={`${safeMedia.length} passed · ${project.media.filter((asset) => asset.quarantineStatus === "pending").length} pending · ${failedMedia.length} isolated`}>
        {project.media.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {project.media.map((asset) => {
              const preview = mediaPreviewPath(asset);
              return (
                <article key={asset.id} className="grid gap-4 rounded-xl border border-black/[0.07] bg-[#faf8f3] p-4 sm:grid-cols-[104px_minmax(0,1fr)]">
                  <div className="relative h-28 overflow-hidden rounded-lg bg-[#e8e3da]">
                    {preview && asset.quarantineStatus === "passed" ? <Image src={preview} alt="" fill sizes="104px" className="object-cover" unoptimized /> : <span className="grid h-full place-items-center text-[#82796d]">{asset.kind === "pdf" ? <FileText className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}</span>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><p className="truncate font-semibold text-[#302a23]">{asset.fileName}</p><Badge tone={asset.quarantineStatus === "passed" ? "success" : asset.quarantineStatus === "failed" ? "danger" : "warning"}>{asset.quarantineStatus}</Badge></div>
                    <p className="mt-1 text-xs text-[#746b5e]">{asset.mimeType} · {formatBytes(asset.byteSize)}</p>
                    <dl className="mt-3 grid gap-1 text-xs leading-5 text-[#665e53]"><div><dt className="inline font-semibold">Signature: </dt><dd className="inline">{asset.signatureStatus}</dd></div><div><dt className="inline font-semibold">Malware scan: </dt><dd className="inline">{asset.malwareScanStatus}{asset.malwareScanProcedure ? ` · ${asset.malwareScanProcedure}` : ""}</dd></div><div><dt className="inline font-semibold">Accessibility: </dt><dd className="inline">{asset.decorative ? "Explicitly decorative" : asset.altText || "Missing alt text"}</dd></div></dl>
                    {asset.quarantineFailureReason ? <p role="alert" className="mt-2 rounded bg-red-50 px-2 py-1 text-xs text-red-800">Isolated: {asset.quarantineFailureReason}</p> : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#cbc3b8] p-8 text-center"><ScanSearch className="mx-auto h-7 w-7 text-[#82796d]" /><p className="mt-3 font-semibold">No media in quarantine</p><p className="mt-1 text-sm text-[#746b5e]">Upload only permission-cleared synthetic material until legal review passes.</p></div>
        )}
      </PilotSection>

      <WarningCallout>
        <strong>Unsupported files:</strong> Export HEIC and TIFF images as JPEG, PNG, or WebP and keep the original yourself. PDFs appear as a preview; the original file is available only to invited family.
      </WarningCallout>
    </>
  );
}

export function PilotCuratePage({ project, focalPersonName }: { project: PilotProject; focalPersonName?: string | null }) {
  const featuredStories = project.stories.filter((story) => story.featured).sort((a, b) => a.order - b.order);
  const passedMedia = project.media.filter((media) => media.quarantineStatus === "passed");

  return (
    <>
      <PilotPageHeader eyebrow="Step 4 · Curation" title="Shape the client’s first impression" description="Write the welcome, choose where the tree begins, and pick a few well-sourced stories." actions={<Link href={`/projects/${project.id}/review`} style={{ color: "#ffffff" }} className="inline-flex items-center gap-2 rounded-lg bg-[#263a31] px-4 py-2 text-sm font-semibold text-white">Open professional preview <ArrowRight className="h-4 w-4" /></Link>} />
      <PrivacyCallout>
        Only media with passed quarantine status may be selected. Living minors are hidden; living adults expose only consented, minimized fields.
      </PrivacyCallout>

      <PilotSection eyebrow="Welcome" title="The opening page" description="Changes stay private until you preview them and the client approves.">
        <CurationEditor welcome={project.welcome} branding={project.branding} />
      </PilotSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <PilotSection eyebrow="Stories" title={`${featuredStories.length} featured stories`} description={`Aim for ${project.scope.minFeaturedStories}–${project.scope.maxFeaturedStories} short stories. A project with fewer needs a recorded reason.`}>
          {featuredStories.length ? (
            <ol className="space-y-4">
              {featuredStories.map((story, index) => {
                const cover = passedMedia.find((media) => media.id === story.coverMediaId);
                const preview = cover ? mediaPreviewPath(cover) : null;
                return (
                  <li key={story.id} className="grid grid-cols-1 gap-4 rounded-xl border border-black/[0.07] p-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                    <div className="relative h-28 overflow-hidden rounded-lg bg-[#e8e3da]">{preview ? <Image src={preview} alt={cover?.altText ?? ""} fill sizes="120px" className="object-cover" unoptimized /> : <span className="grid h-full place-items-center"><BookOpenText className="h-6 w-6 text-[#82796d]" /></span>}</div>
                    <div><div className="flex flex-wrap items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#263a31] text-[11px] font-semibold text-white">{index + 1}</span><Badge tone={story.status === "ready" || story.status === "published" ? "success" : "warning"}>{story.status}</Badge><Badge>{story.visibility.replaceAll("_", " ")}</Badge></div><h3 className="mt-2 text-lg font-semibold">{story.title}</h3><p className="mt-1 text-sm leading-6 text-[#746b5e]">{story.dek}</p><p className="mt-2 text-xs text-[#82796d]">{story.personIds.length} linked people · {story.sourceIds.length} sources</p></div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="rounded-xl border border-dashed border-[#cbc3b8] p-8 text-center"><BookOpenText className="mx-auto h-7 w-7 text-[#82796d]" /><p className="mt-3 font-semibold">No featured stories yet</p><p className="mt-1 text-sm text-[#746b5e]">Do not invent content. Add a real, sourced short story or record an operator override for a deliberately sparse project.</p></div>
          )}
        </PilotSection>

        <div className="space-y-6">
          <PilotSection eyebrow="Tree" title="Where the tree begins" description="The whole family is always there; the opening view simply starts close to home.">
            <div className="space-y-3 text-sm text-[#665e53]"><div className="flex items-center justify-between rounded-lg bg-[#f7f4ee] p-3"><span>Focal person</span><strong className="text-[#302a23]">{focalPersonName ?? (project.focalPersonId ? "Selected" : "Not selected")}</strong></div><div className="flex items-center justify-between rounded-lg bg-[#f7f4ee] p-3"><span>Initial depth</span><strong className="text-[#302a23]">Nearest generations</strong></div><div className="flex items-center justify-between rounded-lg bg-[#f7f4ee] p-3"><span>Expansion</span><strong className="text-[#302a23]">On demand</strong></div></div>
          </PilotSection>
          <PilotSection eyebrow="Your brand" title={project.branding.practiceName} description="Your colours appear throughout the client’s presentation.">
            <BrandPreview branding={project.branding} familyName={project.welcome.familyName} tagline={project.welcome.headline} />
          </PilotSection>
          <PilotSection eyebrow="Image descriptions" title={`${passedMedia.length} safe assets`} description="Every image needs a description for screen-reader users, or must be marked decorative.">
            <div className="space-y-2">{passedMedia.slice(0, 4).map((media) => <div key={media.id} className="flex items-center justify-between gap-3 rounded-lg border border-black/[0.06] px-3 py-2 text-xs"><span className="truncate">{media.caption || media.fileName}</span>{media.altText || media.decorative ? <Badge tone="success">Accessible</Badge> : <Badge tone="danger">Alt required</Badge>}</div>)}</div>
          </PilotSection>
        </div>
      </div>
    </>
  );
}

export function PilotReviewPage({ project, gate }: { project: PilotProject; gate: PilotPublishGateResult }) {
  const currentReview = [...project.reviewVersions].sort((a, b) => b.round - a.round)[0];
  const currentItems = currentReview ? project.reviewItems.filter((item) => item.reviewVersionId === currentReview.id) : [];
  const unresolved = currentItems.filter((item) => item.status === "open").length;
  const clientApproved = project.checklist.find((item) => item.key === "client_approval")?.status === "complete";
  const draftRevision = [...project.revisions]
    .sort((a, b) => b.sequence - a.sequence)
    .find((revision) => revision.status === "draft");
  const nextReviewCandidate = [...project.reviewVersions]
    .sort((a, b) => b.round - a.round)
    .find(
      (version) =>
        version.status === "resolved" &&
        version.round < project.scope.includedCorrectionRounds &&
        !project.reviewVersions.some((candidate) => candidate.round === version.round + 1),
    );
  const canOpenRoundOne =
    project.reviewVersions.length === 0 &&
    Boolean(draftRevision) &&
    (project.status === "professional_preview" || project.status === "client_review_round_1");
  const reviewLifecycleMode = canOpenRoundOne
    ? "open_round_1"
    : nextReviewCandidate
      ? "create_next"
      : "read_only";

  return (
    <>
      <PilotPageHeader eyebrow="Steps 5–8 · Review" title="Review and approval" description="Preview the presentation yourself, then send it to your client. Each review round is locked to one version, so feedback never drifts, and every request gets a recorded response." actions={project.publication ? <CopyPrivatePath path={project.publication.privatePath} /> : undefined} />

      {project.publication ? <PrivacyCallout>Published privately on {formatDate(project.publication.publishedAt, true)}. Only invited people can open it.</PrivacyCallout> : <WarningCallout>Publishing opens once you’ve previewed the presentation, your client has reviewed and approved it, and every safety check is complete.</WarningCallout>}

      <PilotSection eyebrow="Versions" title="Drafts and review rounds" description="Editing after approval starts a new draft. What the client approved never changes underneath them.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#82796d]">Content revisions</p>
            {project.revisions.map((revision) => <div key={revision.id} className="flex items-center gap-3 rounded-xl border border-black/[0.07] bg-[#faf8f3] p-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-semibold">v{revision.sequence}</span><div className="min-w-0 flex-1"><p className="font-medium capitalize">{revision.status}</p><p className="mt-0.5 text-xs text-[#82796d]">Created {formatDate(revision.createdAt, true)}</p></div><Badge tone={revision.status === "approved" || revision.status === "published" ? "success" : revision.status === "superseded" ? "default" : "warning"}>{revision.status}</Badge></div>)}
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#82796d]">Client review versions</p>
            {project.reviewVersions.length ? project.reviewVersions.map((version) => <ReviewVersionCard key={version.id} version={version} />) : <div className="rounded-xl border border-dashed border-[#cbc3b8] p-6 text-center text-sm text-[#746b5e]">No client review version has been opened. Complete professional preview first.</div>}
          </div>
        </div>
      </PilotSection>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <PilotSection eyebrow={currentReview ? `Round ${currentReview.round} · ${currentReview.status}` : "Awaiting review"} title="Consolidated correction request" description={currentReview ? `Comments are bound to fingerprint ${currentReview.contentFingerprint.slice(0, 16)}…` : "A role-scoped reviewer may view the pending version and submit one structured request per round."}>
          <ReviewItemWorkbench projectRef={project.id} items={currentItems} reviewLocked={!currentReview?.frozenAt || currentReview.status === "approved"} />
        </PilotSection>

        <div className="space-y-6">
          <PilotSection eyebrow="Next round" title="Open a review round" description="Locks the current draft so your client comments on exactly what you see.">
            <ReviewLifecycleControl
              projectRef={project.id}
              mode={reviewLifecycleMode}
              revisionId={draftRevision?.id}
              previousReviewVersionId={nextReviewCandidate?.id}
              contentFingerprint={nextReviewCandidate?.contentFingerprint}
            />
          </PilotSection>
          <PilotSection eyebrow="Approval" title={clientApproved ? "Delivery approved" : "Client sign-off required"} description="Approval locks the delivery. Ownership of the archive is handed over separately.">
            <ClientApprovalControl blocked={unresolved > 0} approved={clientApproved} />
          </PilotSection>
          <PilotSection eyebrow="Before publishing" title={gate.allowed ? "Everything is in place" : `${gate.blockers.length} ${gate.blockers.length === 1 ? "item" : "items"} left before publishing`} description="A project with fewer stories needs a recorded reason—content is never invented to pass a check.">
            <div className="space-y-2">{gate.blockers.length ? gate.blockers.slice(0, 6).map((blocker) => <div key={`${blocker.code}-${blocker.message}`} className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-900"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{blocker.message}</span></div>) : <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"><BadgeCheck className="h-4 w-4" />Ready for private publication</div>}</div>
          </PilotSection>
        </div>
      </div>

      <PilotSection eyebrow="Preview" title="See exactly what your client sees" description="The preview follows the same privacy rules as the delivered presentation, so hidden details stay hidden here too.">
        <div className="grid gap-4 rounded-2xl border border-black/10 bg-[#263a31] p-5 text-white md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Pending private version</p><h3 className="mt-2 font-serif text-3xl text-white">{project.welcome.headline}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Review the exact client permissions, hidden living-person details, story order, sources, responsive layout, and noindex response before opening round one.</p></div><Link href={`/projects/${project.id}/preview`} style={{ color: "#263a31" }} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#263a31]">Open preview <Eye className="h-4 w-4" /></Link></div>
      </PilotSection>
    </>
  );
}

function ReviewVersionCard({ version }: { version: PilotReviewVersion }) {
  return (
    <div className="rounded-xl border border-black/[0.07] bg-[#faf8f3] p-3">
      <div className="flex items-center justify-between gap-3"><p className="font-medium">{cleanLabel(version.label)}</p><Badge tone={version.status === "approved" ? "success" : version.status === "submitted" ? "accent" : "warning"}>{version.status}</Badge></div>
      <div className="mt-2 flex items-center gap-2 text-xs text-[#82796d]"><Fingerprint className="h-3.5 w-3.5" /><code>{version.contentFingerprint.slice(0, 18)}…</code></div>
      <p className="mt-2 text-xs text-[#82796d]">Frozen {formatDate(version.frozenAt, true)}</p>
    </div>
  );
}

export function PilotAccessPage({ project }: { project: PilotProject }) {
  const liveSessions = project.sessions.filter((session) => !session.revokedAt);
  const professionalCanManageAccess = project.handoff?.status !== "accepted";
  return (
    <>
      <PilotPageHeader eyebrow="Access" title="Invite people, not links" description="Each person gets their own single-use invitation. Opening it starts a private session you can revoke at any time." />
      <PrivacyCallout>
        Unused invites expire after seven days. Production stores only cryptographic token hashes; sessions use HTTP-only, Secure, SameSite cookies with a 30-day absolute lifetime and shorter idle timeout.
      </PrivacyCallout>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <PilotSection eyebrow="New invitation" title="Invite someone" description="Copy the link and send it yourself—it’s shown only once.">
          <InviteIssuer
            projectRef={project.id}
            reviewVersions={project.reviewVersions.map((version) => ({
              id: version.id,
              label: version.label,
              round: version.round,
              status: version.status,
            }))}
            canManage={professionalCanManageAccess}
          />
        </PilotSection>
        <PilotSection eyebrow="Roles" title="What each invitation allows" description="Viewers explore, reviewers comment, and the archive owner takes over the archive.">
          <div className="space-y-3 text-sm"><AccessRole icon={Eye} title="Family viewer" detail="View permitted archive content only; no account or control-plane access." /><AccessRole icon={FileCheck2} title="Client reviewer" detail="View one pending version and submit one consolidated request for the assigned round." /><AccessRole icon={BadgeCheck} title="Owner candidate" detail="Must accept through a verified identity before access, export, deletion, and invitation powers activate." /></div>
        </PilotSection>
      </div>

      <PilotSection eyebrow="Invitations" title="Sent and accepted invitations" description="Revoking someone cancels their invitations and signs them out everywhere.">
        {project.invites.length ? (
          <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm"><thead><tr className="border-b border-black/10 text-[10px] uppercase tracking-[0.14em] text-[#82796d]"><th className="pb-3 font-semibold">Recipient</th><th className="pb-3 font-semibold">Purpose / version</th><th className="pb-3 font-semibold">Issued / expires</th><th className="pb-3 font-semibold">Token hint</th><th className="pb-3 text-right font-semibold">Access</th></tr></thead><tbody>{project.invites.map((invite) => <tr key={invite.id} className="border-b border-black/[0.06] last:border-0"><td className="py-4"><p className="font-medium text-[#302a23]">{invite.recipientLabel}</p><p className="mt-0.5 text-xs text-[#82796d]">{invite.recipientEmail}</p></td><td className="py-4 capitalize text-[#665e53]">{invite.purpose.replaceAll("_", " ")}{invite.reviewRound ? <span className="mt-1 block text-xs normal-case text-[#82796d]">Round {invite.reviewRound} · {invite.reviewVersionId}</span> : null}</td><td className="py-4 text-xs leading-5 text-[#665e53]">{formatDate(invite.issuedAt, true)}<br />{formatDate(invite.expiresAt, true)}</td><td className="py-4"><code className="rounded bg-[#f2eee7] px-2 py-1 text-xs">{invite.tokenHint}</code></td><td className="py-4"><InviteRowActions projectRef={project.id} invite={invite} canManage={professionalCanManageAccess} /></td></tr>)}</tbody></table></div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#cbc3b8] p-8 text-center"><KeyRound className="mx-auto h-7 w-7 text-[#82796d]" /><p className="mt-3 font-semibold">No invitations issued</p><p className="mt-1 text-sm text-[#746b5e]">The showcase remains private and inaccessible until an operator issues the first link.</p></div>
        )}
      </PilotSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <PilotSection eyebrow="Active sessions" title={`${liveSessions.length} revocable session${liveSessions.length === 1 ? "" : "s"}`} description="Reissue a lost link, or revoke one person’s access without affecting anyone else.">
          {liveSessions.length ? <div className="space-y-3">{liveSessions.map((session) => { const invite = project.invites.find((item) => item.id === session.inviteId); return <div key={session.id} className="flex items-center gap-3 rounded-xl border border-black/[0.07] p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700"><ShieldCheck className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate font-medium">{invite?.recipientLabel ?? session.recipientId}</p><p className="mt-0.5 text-xs text-[#82796d]">Idle expiry {formatDate(session.idleExpiresAt, true)} · absolute {formatDate(session.absoluteExpiresAt, true)}</p></div><Badge tone="success">Active</Badge></div>; })}</div> : <p className="rounded-xl border border-dashed border-[#cbc3b8] p-6 text-center text-sm text-[#746b5e]">No active client sessions.</p>}
        </PilotSection>
        <PilotSection eyebrow="Privacy" title="How the presentation stays private" description="It’s hidden from search engines, and only invited people can ever open it.">
          <div className="space-y-3"><ControlRow icon={LockKeyhole} label="Unauthenticated content" value="Blocked" /><ControlRow icon={ScanSearch} label="Robots metadata / headers" value="Noindex" /><ControlRow icon={Eye} label="Genealogist preview" value="Same auth logic" /><ControlRow icon={Mail} label="Invitation delivery" value="Manual" /></div>
        </PilotSection>
      </div>
    </>
  );
}

function AccessRole({ icon: Icon, title, detail }: { icon: typeof Eye; title: string; detail: string }) {
  return <div className="flex items-start gap-3 rounded-xl border border-black/[0.07] p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eef2ed] text-[#4f6454]"><Icon className="h-4 w-4" /></span><div><p className="font-semibold text-[#302a23]">{title}</p><p className="mt-1 text-xs leading-5 text-[#746b5e]">{detail}</p></div></div>;
}

function ControlRow({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-xl bg-[#f7f4ee] p-3"><Icon className="h-4 w-4 text-[#637b68]" /><span className="min-w-0 flex-1 text-sm text-[#665e53]">{label}</span><strong className="text-sm text-[#302a23]">{value}</strong></div>;
}

export function PilotHandoffPage({ project }: { project: PilotProject }) {
  const handoff = project.handoff;
  const ownerRole = project.roles.find((role) => role.role === "archive_owner" || role.role === "owner_candidate");
  const professionalRole = project.roles.find((role) => role.role === "genealogist");
  const latestExport = [...project.exports].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))[0];

  return (
    <>
      <PilotPageHeader eyebrow="Steps 9–10 · Handoff" title="Hand the archive to the family" description="Your client takes ownership with a verified account. Your support access then ends automatically after 30 days unless they extend it." />

      {!project.publication ? <WarningCallout>Handoff cannot complete before explicit client approval and private publication. Prepare the owner identity now, but do not transfer authority early.</WarningCallout> : <PrivacyCallout>The family owns and can export its content. The genealogist’s curated work remains governed by the service agreement; access powers transfer to the verified archive owner.</PrivacyCallout>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <PilotSection eyebrow="Ownership" title="The archive owner" description="Family viewers never need an account. Managing invitations, exports, and deletion requires the owner’s verified account.">
          <div className="grid gap-4 sm:grid-cols-2">
            <ControlRow icon={Fingerprint} label="Owner candidate" value={ownerRole?.displayName ?? "Not assigned"} />
            <ControlRow icon={BadgeCheck} label="Identity verification" value={handoff?.identityVerifiedAt ? formatDate(handoff.identityVerifiedAt) : "Pending"} />
            <ControlRow icon={CalendarClock} label="Invited" value={formatDate(handoff?.invitedAt)} />
            <ControlRow icon={ShieldCheck} label="Accepted" value={formatDate(handoff?.acceptedAt)} />
          </div>
          <div className="mt-5"><HandoffControl status={handoff?.status ?? "not_started"} /></div>
        </PilotSection>

        <PilotSection eyebrow="Your access" title="Support access ends by default" description="The owner can extend it 30 days at a time. Emergency access is limited, disclosed, and time-boxed.">
          <div className="space-y-3"><ControlRow icon={Users} label="Genealogist" value={professionalRole?.displayName ?? project.branding.practiceName} /><ControlRow icon={Clock3} label="Support expiry" value={formatDate(handoff?.professionalSupportExpiresAt ?? professionalRole?.expiresAt)} /><ControlRow icon={CalendarClock} label="Extensions" value={`${handoff?.supportExtensionCount ?? 0} recorded`} /><ControlRow icon={ShieldQuestion} label="Platform routine access" value="None" /></div>
        </PilotSection>
      </div>

      <PilotSection eyebrow="Owner controls" title="Access, export, deletion, and renewal" description="Every sensitive change is recorded in the activity log.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[{ icon: KeyRound, title: "Manage invitations", detail: "Issue and revoke recipient access." },{ icon: FileArchive, title: "Export everything", detail: "Data, originals, stories, sources, and durable presentation." },{ icon: HardDrive, title: "Choose preservation", detail: "Renew active hosting or later select preservation-only service." },{ icon: ShieldCheck, title: "Request deletion", detail: "Typed confirmation and a clear cancellation window." }].map(({ icon: Icon, title, detail }) => <div key={title} className="rounded-xl border border-black/[0.07] bg-[#faf8f3] p-4"><Icon className="h-5 w-5 text-[#637b68]" /><p className="mt-3 font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-[#746b5e]">{detail}</p></div>)}</div>
      </PilotSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <PilotSection eyebrow="Export" title="A complete copy of the archive" description="Downloads are logged and deleted automatically after 24 hours.">
          <div className="space-y-4"><ul className="grid gap-2 text-sm leading-6 text-[#665e53] sm:grid-cols-2"><li>✓ Original GEDCOM and normalized data</li><li>✓ Original media and provenance</li><li>✓ Stories and source references</li><li>✓ Durable static or printable presentation</li><li>✓ Privacy and opening instructions</li><li>✓ No secrets, tokens, or internal security logs</li></ul><ExportControl projectRef={project.id} existingStatus={latestExport?.status} professionalCanRequest={handoff?.status !== "accepted"} /></div>
        </PilotSection>
        <PilotSection eyebrow="Deletion" title="A family’s history is never held hostage" description="Exact dates are shown before the owner confirms anything.">
          <DeletionControl existingStatus={project.deletion?.status} />
        </PilotSection>
      </div>

      <PilotSection eyebrow="Retention" title="What happens if nobody renews" description="The timeline if the archive’s hosting isn’t renewed.">
        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><TimelineCard index="01" title="Expiration" detail="Editing, contributions, and new invitations stop. Existing viewers keep access during a 30-day grace period." /><TimelineCard index="02" title="Grace ends" detail="Presentation goes offline. The private archive remains recoverable for 12 months." /><TimelineCard index="03" title="Recovery ends" detail="Primary data is queued for permanent deletion after the published recovery period." /><TimelineCard index="04" title="Backups age out" detail="Target no more than 35 days where the verified provider schedule permits." /></ol>
      </PilotSection>

      {project.deletion ? <WarningCallout>Deletion requested {formatDate(project.deletion.requestedAt, true)}. Cancellation ends {formatDate(project.deletion.cancelUntil, true)}; primary deletion is due {formatDate(project.deletion.primaryDeletionDueAt)} and recovery deletion {formatDate(project.deletion.recoveryDeletionDueAt)}.</WarningCallout> : null}
    </>
  );
}

function TimelineCard({ index, title, detail }: { index: string; title: string; detail: string }) {
  return <li className="rounded-xl border border-black/[0.07] bg-[#faf8f3] p-4"><span className="text-xs font-semibold text-[#637b68]">{index}</span><p className="mt-2 font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-[#746b5e]">{detail}</p></li>;
}

function BrandPreview({
  branding,
  familyName,
  tagline,
}: {
  branding: PilotProject["branding"];
  familyName: string;
  tagline: string;
}) {
  return (
    <div className="space-y-4" style={brandStyle(branding)}>
      <div
        aria-label={`Preview of the client welcome in ${branding.practiceName} colours`}
        role="img"
        className="overflow-hidden rounded-xl bg-[var(--brand-deep)] px-5 py-6 text-center text-[var(--brand-on-deep)] shadow-inner"
      >
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-on-deep)]">
          Prepared by {branding.practiceName}
        </p>
        <p className="mt-3 font-serif text-2xl font-semibold leading-tight">{familyName}</p>
        <span className="mx-auto mt-3 block h-px w-10 bg-[var(--brand-accent-on-deep)]" />
        <p className="mt-3 font-serif text-sm italic opacity-90">{tagline}</p>
        <span className="mt-4 inline-flex rounded-full bg-[var(--brand-on-deep)] px-3.5 py-1.5 text-[11px] font-semibold text-[var(--brand-deep)]">
          Explore your family
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-[var(--brand-on-primary)]">
          Discover an ancestor
        </span>
        <span className="text-xs font-semibold text-[var(--brand-primary-ink)]">Link colour</span>
        <span className="text-xs font-semibold text-[var(--brand-accent-ink)]">Accent</span>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-xs">
        {[
          ["Primary", branding.primaryColor],
          ["Accent", branding.accentColor],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center gap-2 rounded-lg border border-black/[0.06] px-2.5 py-2">
            <span className="h-5 w-5 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: value }} />
            <div className="min-w-0">
              <dt className="text-[10px] uppercase tracking-[0.12em] text-[#82796d]">{label}</dt>
              <dd className="font-mono text-[11px] text-[#302a23]">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
      <p className="text-xs leading-5 text-[#746b5e]">
        Text shades are adjusted automatically so every label stays readable.
      </p>
    </div>
  );
}
