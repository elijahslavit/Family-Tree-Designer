"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clipboard,
  FileArchive,
  FileCheck2,
  FileUp,
  KeyRound,
  LoaderCircle,
  MailPlus,
  RefreshCw,
  Save,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";

import { Badge } from "@/components/foundation/badge";
import { Button } from "@/components/foundation/button";
import { Input, Select, Textarea } from "@/components/foundation/input";
import {
  createNextPilotReviewVersionAction,
  dispositionPilotReviewItemAction,
  issuePilotInviteAction,
  openPilotReviewVersionAction,
  requestPilotExportAction,
  revokePilotRecipientAccessAction,
} from "@/lib/pilot/actions";
import {
  importPilotGedcomAction,
  updatePilotCurationAction,
  updatePilotProjectDetailsAction,
} from "@/lib/pilot/presentation-actions";
import type {
  PilotBranding,
  PilotImportIssue,
  PilotInviteRecord,
  PilotInvitePurpose,
  PilotProject,
  PilotReviewItem,
  PilotReviewVersion,
  PilotWelcome,
} from "@/lib/pilot/types";
import {
  getShowcaseTheme,
  showcaseThemeStyle,
} from "@/lib/themes/showcase-themes";
import { cn } from "@/lib/utils/cn";

function InlineNotice({
  tone = "success",
  children,
}: {
  tone?: "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-5",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
        tone === "danger" && "border-red-200 bg-red-50 text-red-900",
      )}
    >
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function LocalDraftForm({ project }: { project: PilotProject }) {
  const [draft, setDraft] = useState({
    title: project.title,
    clientLabel: project.clientLabel,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  function save(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    startSaving(async () => {
      const result = await updatePilotProjectDetailsAction({
        projectRef: project.id,
        ...draft,
      });

      if (result.ok) {
        setSaved(true);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form className="space-y-5" onSubmit={save}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-[#40382f]">
          Project title
          <Input
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
            required
            maxLength={120}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-[#40382f]">
          Client label
          <Input
            value={draft.clientLabel}
            onChange={(event) =>
              setDraft((current) => ({ ...current, clientLabel: event.target.value }))
            }
            required
            maxLength={120}
          />
        </label>
      </div>

      {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
      {saved ? <InlineNotice>Project details saved.</InlineNotice> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving…" : "Save project details"}
        </Button>
      </div>
    </form>
  );
}

type UploadState =
  | { status: "idle" }
  | { status: "valid"; message: string }
  | { status: "invalid"; message: string };

export function PilotUploadControl({
  kind,
  projectRef,
}: {
  kind: "gedcom" | "media";
  /** Required for GEDCOM, which writes into the project on selection. */
  projectRef?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });
  const [isImporting, startImport] = useTransition();
  const accept = kind === "gedcom" ? ".ged,.gedcom" : ".jpg,.jpeg,.png,.webp,.pdf";

  function importGedcom(file: File) {
    if (!projectRef) {
      setUpload({
        status: "invalid",
        message: "This import control is not attached to a project.",
      });
      return;
    }

    startImport(async () => {
      const formData = new FormData();
      formData.set("projectRef", projectRef);
      formData.set("file", file);

      const result = await importPilotGedcomAction(formData);

      if (!result.ok) {
        setUpload({ status: "invalid", message: result.error });
        return;
      }

      const hidden = result.hiddenLivingCount
        ? ` ${result.hiddenLivingCount} living ${result.hiddenLivingCount === 1 ? "person is" : "people are"} hidden from the family presentation.`
        : "";
      const issues = result.issueCount
        ? ` ${result.issueCount} ${result.issueCount === 1 ? "item needs" : "items need"} review below.`
        : "";

      setUpload({
        status: "valid",
        message: `Imported ${result.presentablePeopleCount} presentable people from ${result.familyCount} family groups.${hidden}${issues}`,
      });
    });
  }

  function inspectFile(file?: File) {
    if (!file) return;

    if (kind === "gedcom") {
      if (!/\.(ged|gedcom)$/i.test(file.name)) {
        setUpload({
          status: "invalid",
          message: "Choose a GEDCOM file ending in .ged or .gedcom.",
        });
        return;
      }

      importGedcom(file);
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    const supported = ["jpg", "jpeg", "png", "webp", "pdf"].includes(extension ?? "");
    if (!supported) {
      setUpload({
        status: "invalid",
        message:
          extension === "heic" || extension === "tif" || extension === "tiff"
            ? "This format is not accepted. Export a copy as JPEG, PNG, or WebP and preserve your original separately."
            : "Use JPEG, PNG, WebP, or PDF. ZIP, office files, audio, and video are outside the founding pilot.",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUpload({ status: "invalid", message: "This file exceeds the 20 MB per-file cap." });
      return;
    }

    setUpload({
      status: "valid",
      message: `${file.name} passes the browser format checks. Media intake is not built yet — the file was not uploaded or stored, and photographs cannot appear in a presentation in this build.`,
    });
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => inspectFile(event.target.files?.[0])}
      />
      <button
        type="button"
        disabled={isImporting}
        onClick={() => inputRef.current?.click()}
        className="group flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#bcb3a6] bg-[#faf8f3] p-6 text-center transition hover:border-[#637b68] hover:bg-[#f3f6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#637b68] disabled:cursor-wait disabled:opacity-70"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#4f6454] shadow-sm">
          {isImporting ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <FileUp className="h-5 w-5" />
          )}
        </span>
        <span className="mt-3 font-semibold text-[#302a23]">
          {kind === "gedcom"
            ? isImporting
              ? "Reading the file…"
              : "Choose a GEDCOM"
            : "Choose media for quarantine"}
        </span>
        <span className="mt-1 max-w-lg text-xs leading-5 text-[#746b5e]">
          {kind === "gedcom"
            ? "The file is read in memory on this machine and replaces the working archive."
            : "JPEG, PNG, WebP, or PDF · 20 MB each · 25 items / 500 MB per project"}
        </span>
      </button>

      {upload.status !== "idle" ? (
        <InlineNotice tone={upload.status === "valid" ? "success" : "danger"}>
          {upload.message}
        </InlineNotice>
      ) : null}
    </div>
  );
}

export function ImportIssueWorkbench({ issues }: { issues: PilotImportIssue[] }) {
  if (!issues.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#cbc3b8] p-7 text-center">
        <FileCheck2 className="mx-auto h-6 w-6 text-emerald-700" />
        <p className="mt-3 font-semibold text-[#302a23]">No import issues</p>
        <p className="mt-1 text-sm text-[#746b5e]">The confirmed import is ready for curation.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-black/[0.06]">
      {issues.map((issue) => (
          <div key={issue.id} className="grid gap-3 py-4 first:pt-0 last:pb-0 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[#302a23]">{issue.title}</p>
                <Badge tone={issue.severity === "blocking" ? "danger" : issue.severity === "warning" ? "warning" : "default"}>
                  {issue.severity}
                </Badge>
                <Badge tone={issue.status === "resolved" ? "success" : "default"}>{issue.status}</Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-[#746b5e]">{issue.description}</p>
              {issue.disposition ? (
                <p className="mt-1 text-xs text-[#82796d]">Recorded disposition: {issue.disposition}</p>
              ) : null}
            </div>
            <p className="max-w-xs text-xs leading-5 text-[#82796d]">
              Read-only seeded import record. This synthetic build does not persist import dispositions.
            </p>
          </div>
        ))}
    </div>
  );
}

export function CurationEditor({
  projectRef,
  welcome,
  branding,
}: {
  projectRef: string;
  welcome: PilotWelcome;
  branding: PilotBranding;
}) {
  const [draft, setDraft] = useState(welcome);
  const [practice, setPractice] = useState({
    practiceName: branding.practiceName,
    byline: branding.byline,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const theme = getShowcaseTheme(branding.themeId);

  function save(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    startSaving(async () => {
      const result = await updatePilotCurationAction({
        projectRef,
        welcome: {
          eyebrow: draft.eyebrow,
          familyName: draft.familyName,
          headline: draft.headline,
          introduction: draft.introduction,
          primaryActionLabel: draft.primaryActionLabel,
        },
        branding: practice,
      });

      if (result.ok) {
        setSaved(true);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
      <form className="space-y-4" onSubmit={save}>
        <label className="block space-y-2 text-sm font-medium text-[#40382f]">
          Family name
          <Input
            value={draft.familyName}
            onChange={(event) => setDraft((current) => ({ ...current, familyName: event.target.value }))}
            required
          />
        </label>
        <label className="block space-y-2 text-sm font-medium text-[#40382f]">
          Welcome headline
          <Input
            value={draft.headline}
            onChange={(event) => setDraft((current) => ({ ...current, headline: event.target.value }))}
            required
            maxLength={90}
          />
          <span className="block text-right text-[11px] font-normal text-[#82796d]">{draft.headline.length}/90</span>
        </label>
        <label className="block space-y-2 text-sm font-medium text-[#40382f]">
          Introduction
          <Textarea
            value={draft.introduction}
            onChange={(event) => setDraft((current) => ({ ...current, introduction: event.target.value }))}
            required
          />
        </label>

        <fieldset className="space-y-4 rounded-xl border border-black/10 bg-[#faf8f3] p-4">
          <legend className="px-1 text-sm font-medium text-[#40382f]">
            Your credit on this archive
          </legend>
          <label className="block space-y-2 text-sm font-medium text-[#40382f]">
            Practice name
            <Input
              value={practice.practiceName}
              onChange={(event) =>
                setPractice((current) => ({ ...current, practiceName: event.target.value }))
              }
              required
              maxLength={90}
            />
            <span className="block text-[11px] font-normal text-[#82796d]">
              Appears to the family as “Curated by {practice.practiceName || "…"}”.
            </span>
          </label>
          <label className="block space-y-2 text-sm font-medium text-[#40382f]">
            Byline
            <Input
              value={practice.byline}
              onChange={(event) =>
                setPractice((current) => ({ ...current, byline: event.target.value }))
              }
              required
              maxLength={140}
            />
          </label>
        </fieldset>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-[#faf8f3] px-4 py-3">
          <span className="text-sm text-[#40382f]">
            Theme: <strong className="font-semibold">{theme.name}</strong>
          </span>
          <Link
            href={`/projects/${projectRef}/theme`}
            className="text-sm font-semibold text-[#3d5a49] underline underline-offset-2"
          >
            Change theme
          </Link>
        </div>

        {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
        {saved ? (
          <InlineNotice>
            Saved. The preview and any invited family members now see these details.
          </InlineNotice>
        ) : null}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving…" : "Save presentation details"}
        </Button>
      </form>

      {/* Live in the selected theme, so the words are judged where they land. */}
      <div
        // data-skin is required as well as the tokens: global rules colour
        // headings from --text-primary, which would otherwise come from the
        // surrounding workspace and render dark on a dark theme.
        data-skin={theme.skin}
        style={showcaseThemeStyle(theme)}
        className="overflow-hidden rounded-2xl border border-black/10 shadow-sm"
      >
        <div className="flex h-full min-h-[420px] flex-col justify-end bg-[var(--sc-surface)] p-6 text-[var(--sc-ink)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sc-ink-muted)]">
            Curated by {practice.practiceName || "your practice"}
          </p>
          <p className="mt-3 text-sm text-[var(--sc-ink-secondary)]">{draft.eyebrow}</p>
          <h3 className="mt-2 max-w-md font-serif text-4xl leading-tight">
            {draft.familyName || "Untitled family"}
          </h3>
          <p className="mt-2 max-w-md font-serif text-xl leading-snug text-[var(--sc-ink-secondary)]">
            {draft.headline || "Untitled welcome"}
          </p>
          <p className="mt-3 line-clamp-3 max-w-md text-sm leading-6 text-[var(--sc-ink-secondary)]">
            {draft.introduction}
          </p>
          <span className="mt-5 inline-flex w-fit rounded-lg bg-[var(--sc-accent)] px-4 py-2 text-sm font-semibold text-[var(--sc-accent-contrast)]">
            {draft.primaryActionLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ReviewItemWorkbench({
  projectRef,
  items,
  reviewLocked,
}: {
  projectRef: string;
  items: PilotReviewItem[];
  reviewLocked: boolean;
}) {
  const [dispositions, setDispositions] = useState<Record<string, PilotReviewItem["status"]>>(
    Object.fromEntries(items.map((item) => [item.id, item.status])),
  );
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function disposition(item: PilotReviewItem, decision: "accepted" | "declined") {
    const note = notes[item.id]?.trim() ?? "";
    if (note.length < 8) {
      setError("Add a disposition note of at least eight characters before deciding the request.");
      return;
    }

    setPendingItemId(item.id);
    setError(null);
    startTransition(async () => {
      try {
        const result = await dispositionPilotReviewItemAction({
          projectRef,
          reviewItemId: item.id,
          decision,
          disposition: note,
        });
        setDispositions((current) => ({ ...current, [item.id]: result.status }));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "The review disposition could not be recorded.");
      } finally {
        setPendingItemId(null);
      }
    });
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#cbc3b8] p-7 text-center">
        <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-700" />
        <p className="mt-3 font-semibold text-[#302a23]">No correction requests in this version</p>
        <p className="mt-1 text-sm text-[#746b5e]">Only the designated reviewer can approve the frozen version.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-black/[0.06]">
      {items.map((item) => {
        const state = dispositions[item.id];
        return (
          <article key={item.id} className="grid gap-3 py-4 first:pt-0 last:pb-0 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{item.subjectType}</Badge>
                <Badge tone={state === "resolved" ? "success" : state === "declined" ? "warning" : "default"}>{state}</Badge>
              </div>
              <p className="mt-2 font-medium text-[#302a23]">{item.request}</p>
              {item.disposition ? <p className="mt-1 text-xs leading-5 text-[#746b5e]">Disposition: {item.disposition}</p> : null}
              {state === "open" ? (
                <label className="mt-3 block space-y-1 text-xs font-semibold text-[#665e53]">
                  Professional disposition note
                  <Textarea
                    value={notes[item.id] ?? ""}
                    onChange={(event) =>
                      setNotes((current) => ({ ...current, [item.id]: event.target.value }))
                    }
                    placeholder="Explain what changed, or why the request is declined."
                  />
                </label>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 self-center">
              <Button
                type="button"
                variant="secondary"
                disabled={reviewLocked || state !== "open" || isPending}
                onClick={() => disposition(item, "declined")}
              >
                Decline with note
              </Button>
              <Button
                type="button"
                disabled={reviewLocked || state !== "open" || isPending}
                onClick={() => disposition(item, "accepted")}
              >
                {pendingItemId === item.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Accept request
              </Button>
            </div>
          </article>
        );
      })}
      {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
    </div>
  );
}

export function ClientApprovalControl({ blocked, approved }: { blocked: boolean; approved: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#faf8f3] p-3 text-sm font-semibold text-[#302a23]">
        <UserCheck className="h-4 w-4" />
        {approved ? "Final client approval is recorded" : "Awaiting designated client reviewer"}
      </div>
      {approved ? (
        <InlineNotice>
          The approved delivery is frozen. Any later content change must begin a new unpublished revision.
        </InlineNotice>
      ) : blocked ? (
        <InlineNotice tone="warning">Resolve every item in the current frozen review before approval.</InlineNotice>
      ) : (
        <InlineNotice tone="warning">Approval is reviewer-only and must be submitted from the version-bound private review link.</InlineNotice>
      )}
    </div>
  );
}

export function ReviewLifecycleControl({
  projectRef,
  mode,
  revisionId,
  previousReviewVersionId,
  contentFingerprint,
}: {
  projectRef: string;
  mode: "open_round_1" | "create_next" | "read_only";
  revisionId?: string;
  previousReviewVersionId?: string;
  contentFingerprint?: string;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (mode === "read_only") {
    return (
      <InlineNotice tone="warning">
        No professional review transition is currently available. Open reviews await the client; approved or published versions are immutable.
      </InlineNotice>
    );
  }

  function runTransition() {
    setError(null);
    startTransition(async () => {
      try {
        if (mode === "open_round_1") {
          if (!revisionId) throw new Error("A draft revision is required to open round one.");
          const result = await openPilotReviewVersionAction({ projectRef, revisionId });
          setNotice(`Round one opened and bound to ${result.contentFingerprint.slice(0, 16)}…`);
          return;
        }

        if (!previousReviewVersionId || !contentFingerprint) {
          throw new Error("The resolved review version is missing its immutable identifiers.");
        }
        const result = await createNextPilotReviewVersionAction({
          projectRef,
          previousReviewVersionId,
          contentFingerprint,
        });
        setNotice(`Next review version ${result.reviewVersionId.slice(0, 8)}… opened.`);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "The review transition could not be completed.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <Button type="button" className="w-full" disabled={isPending || Boolean(notice)} onClick={runTransition}>
        {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />}
        {mode === "open_round_1" ? "Open client review · Round 1" : "Create final review version"}
      </Button>
      {notice ? <InlineNotice>{notice}</InlineNotice> : null}
      {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
    </div>
  );
}

export function InviteIssuer({
  projectRef,
  reviewVersions,
  canManage,
}: {
  projectRef: string;
  reviewVersions: Array<Pick<PilotReviewVersion, "id" | "label" | "round" | "status">>;
  canManage: boolean;
}) {
  const [recipient, setRecipient] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState<PilotInvitePurpose>("viewer");
  const [reviewVersionId, setReviewVersionId] = useState(reviewVersions[0]?.id ?? "");
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [issuedRecipient, setIssuedRecipient] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!canManage) {
    return <InlineNotice tone="warning">Archive access has transferred. Invitation management is now owner-only.</InlineNotice>;
  }

  function issue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (purpose === "client_review" && !reviewVersionId) {
      setError("Open a frozen review version before issuing client-review access.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const result = await issuePilotInviteAction({
          projectRef,
          recipientLabel: recipient,
          recipientEmail: email,
          purpose,
          reviewVersionId: purpose === "client_review" ? reviewVersionId : null,
        });
        setRawToken(result.rawToken);
        setIssuedRecipient(result.invite.recipientLabel);
        setCopied(false);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "The invitation could not be issued.");
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={issue}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-[#40382f]">
          Recipient name
          <Input value={recipient} onChange={(event) => setRecipient(event.target.value)} required />
        </label>
        <label className="space-y-2 text-sm font-medium text-[#40382f]">
          Recipient email
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
      </div>
      <label className="block space-y-2 text-sm font-medium text-[#40382f]">
        Access purpose
        <Select value={purpose} onChange={(event) => setPurpose(event.target.value as PilotInvitePurpose)}>
          <option value="viewer">Passive family viewer</option>
          <option value="client_review">Client review · one consolidated round</option>
          <option value="owner_handoff">Archive owner handoff · verified identity required</option>
        </Select>
      </label>
      {purpose === "client_review" ? (
        <label className="block space-y-2 text-sm font-medium text-[#40382f]">
          Frozen review capability
          <Select
            value={reviewVersionId}
            onChange={(event) => setReviewVersionId(event.target.value)}
            required
          >
            <option value="">Select an exact version</option>
            {reviewVersions.map((version) => (
              <option key={version.id} value={version.id}>
                Round {version.round} · {version.label} · {version.status}
              </option>
            ))}
          </Select>
          <span className="block text-xs font-normal leading-5 text-[#746b5e]">
            The resulting invite and session cannot drift to another review version.
          </span>
        </label>
      ) : null}

      {rawToken ? (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-2 text-sm leading-6 text-amber-950">
            <ShieldAlert className="mt-1 h-4 w-4 shrink-0" />
            <p>
              This server-generated, single-use bearer token is shown once. Send it manually to {issuedRecipient}; only its cryptographic hash remains in the project store. It expires unused after seven days.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <code className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-white px-3 py-2 text-xs text-[#302a23]">{rawToken}</code>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                await navigator.clipboard?.writeText(rawToken);
                setCopied(true);
              }}
            >
              <Clipboard className="h-4 w-4" />
              {copied ? "Copied" : "Copy once"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setRawToken(null);
                setIssuedRecipient(null);
                setCopied(false);
              }}
            >
              Dismiss token
            </Button>
          </div>
        </div>
      ) : null}

      {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
      <Button type="submit" disabled={isPending || Boolean(rawToken)}>
        {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MailPlus className="h-4 w-4" />}
        Issue invitation
      </Button>
    </form>
  );
}

export function InviteRowActions({
  projectRef,
  invite,
  canManage,
}: {
  projectRef: string;
  invite: Pick<
    PilotInviteRecord,
    | "id"
    | "recipientId"
    | "recipientLabel"
    | "recipientEmail"
    | "purpose"
    | "reviewVersionId"
    | "status"
  >;
  canManage: boolean;
}) {
  const [status, setStatus] = useState(invite.status);
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revokedNotice, setRevokedNotice] = useState(false);
  const [isPending, startTransition] = useTransition();

  function reissue() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await issuePilotInviteAction({
          projectRef,
          recipientId: invite.recipientId,
          recipientLabel: invite.recipientLabel,
          recipientEmail: invite.recipientEmail,
          purpose: invite.purpose,
          reviewVersionId: invite.reviewVersionId ?? null,
          reissuedFromInviteId: invite.id,
        });
        // Reissue revokes this historical record and creates a separate issued row.
        setStatus("revoked");
        setRawToken(result.rawToken);
        setCopied(false);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "The invitation could not be reissued.");
      }
    });
  }

  function revoke() {
    setError(null);
    startTransition(async () => {
      try {
        await revokePilotRecipientAccessAction({
          projectRef,
          recipientId: invite.recipientId,
          reason: "Professional revoked recipient access from the creator ledger.",
        });
        if (status === "issued") setStatus("revoked");
        setRevokedNotice(true);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Recipient access could not be revoked.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Badge tone={status === "redeemed" ? "success" : status === "expired" || status === "revoked" ? "warning" : "accent"}>{status}</Badge>
        {canManage && (status === "expired" || status === "revoked") && !rawToken ? (
          <Button type="button" variant="secondary" disabled={isPending} onClick={reissue}>
            {isPending ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Reissue
          </Button>
        ) : null}
        {canManage && (status === "issued" || status === "redeemed") && !rawToken ? (
          <Button type="button" variant="danger" disabled={isPending} onClick={revoke}>
            Revoke recipient
          </Button>
        ) : null}
      </div>
      {!canManage ? <p className="text-right text-[11px] text-[#82796d]">Owner-managed after handoff</p> : null}
      {rawToken ? (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-left">
          <p className="text-[11px] leading-4 text-amber-950">Replacement token · shown once</p>
          <code className="block max-w-64 overflow-x-auto rounded bg-white p-2 text-[10px]">{rawToken}</code>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={async () => { await navigator.clipboard?.writeText(rawToken); setCopied(true); }}>
              <Clipboard className="h-3.5 w-3.5" />{copied ? "Copied" : "Copy"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setRawToken(null)}>Dismiss</Button>
          </div>
        </div>
      ) : null}
      {revokedNotice ? <InlineNotice>Outstanding links and active sessions for this recipient were revoked. Redeemed invitations remain immutable history.</InlineNotice> : null}
      {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
    </div>
  );
}

export function HandoffControl({ status }: { status: "pending" | "accepted" | "revoked" | "not_started" }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#faf8f3] p-3 text-sm font-semibold text-[#302a23]">
        <UserCheck className="h-4 w-4" />
        Handoff status: {status.replaceAll("_", " ")}
      </div>
      <InlineNotice tone={status === "accepted" ? "success" : "warning"}>
        {status === "accepted"
          ? "The verified owner accepted in the owner control plane. Only that owner may extend support or run routine archive controls."
          : "Acceptance is owner-only and must occur through the verified owner invitation. The professional studio cannot simulate or record it."}
      </InlineNotice>
    </div>
  );
}

export function ExportControl({
  projectRef,
  existingStatus,
  professionalCanRequest,
}: {
  projectRef: string;
  existingStatus?: "queued" | "processing" | "ready" | "expired" | "failed";
  professionalCanRequest: boolean;
}) {
  const [status, setStatus] = useState(existingStatus ?? "idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function requestExport() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await requestPilotExportAction({ projectRef });
        setStatus(result.status);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "The export could not be queued.");
      }
    });
  }

  return (
    <div className="space-y-3">
      {professionalCanRequest ? (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isPending || status === "queued" || status === "processing"}
          onClick={requestExport}
        >
          {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileArchive className="h-4 w-4" />}
          {status === "idle" || status === "expired" || status === "failed" ? "Queue pre-handoff export" : `Export ${status}`}
        </Button>
      ) : (
        <InlineNotice tone="warning">After handoff, only the archive owner can request or download exports.</InlineNotice>
      )}
      {status !== "idle" ? <InlineNotice>Authenticated export status: {status}. This is an audited lifecycle record, not a simulated ZIP.</InlineNotice> : null}
      {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
    </div>
  );
}

export function DeletionControl({ existingStatus }: { existingStatus?: string }) {
  return (
    <InlineNotice tone={existingStatus ? "danger" : "warning"}>
      {existingStatus
        ? `Owner deletion status: ${existingStatus}. The professional studio is read-only for this operation.`
        : "Deletion is owner-only. It requires the accepted owner identity and typed confirmation in the owner control plane; the professional studio cannot request or cancel it."}
    </InlineNotice>
  );
}

export function CopyPrivatePath({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={async () => {
        await navigator.clipboard?.writeText(path);
        setCopied(true);
      }}
    >
      <KeyRound className="h-4 w-4" />
      {copied ? "Private path copied" : "Copy private path"}
    </Button>
  );
}
