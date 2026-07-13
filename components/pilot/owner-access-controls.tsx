"use client";

import {
  Archive,
  Ban,
  CalendarClock,
  Check,
  Clipboard,
  Download,
  FileArchive,
  KeyRound,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserRoundCheck,
} from "lucide-react";
import { useActionState, useMemo, useState } from "react";

export type OwnerInviteDisplay = {
  id: string;
  recipientId: string;
  recipientLabel: string;
  recipientEmail: string;
  purposeLabel: string;
  status: "issued" | "redeemed" | "expired" | "revoked";
  expiresLabel: string;
  sessionCount: number;
};

export type InviteIssueState = {
  status: "idle" | "success" | "error";
  message?: string;
  rawInvitationUrl?: string;
  expiresLabel?: string;
};

export const initialInviteIssueState: InviteIssueState = { status: "idle" };

export function OwnerAccessManager({
  invitations,
  issueAction,
  revokeAction,
}: {
  invitations: OwnerInviteDisplay[];
  issueAction: (
    state: InviteIssueState,
    formData: FormData,
  ) => Promise<InviteIssueState>;
  revokeAction: (formData: FormData) => Promise<void>;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [state, formAction, pending] = useActionState(
    issueAction,
    initialInviteIssueState,
  );

  return (
    <section className="space-y-5 rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#81786a]">
            Access management
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold">Family invitations</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6c6459]">
            Every link belongs to one recipient. Revoking a recipient invalidates both outstanding
            invitations and active sessions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding((current) => !current)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#293a31] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Invite a relative
        </button>
      </div>

      {isAdding || state.status === "success" || state.status === "error" ? (
        <form action={formAction} className="space-y-4 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#5f584e]">
              Recipient name
              <input
                name="recipientLabel"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm"
                placeholder="Example: Jordan Hart"
              />
            </label>
            <label className="text-xs font-semibold text-[#5f584e]">
              Recipient email
              <input
                name="recipientEmail"
                required
                type="email"
                maxLength={254}
                autoComplete="email"
                className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm"
                placeholder="relative@example.com"
              />
            </label>
          </div>
          <input type="hidden" name="purpose" value="viewer" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#756d61]">
              The unused link expires in seven days. Delivery is manual during the founding pilot.
            </p>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" /> {pending ? "Issuing…" : "Create private link"}
            </button>
          </div>

          {state.status === "error" ? (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              {state.message ?? "The invitation could not be issued."}
            </p>
          ) : null}
          {state.status === "success" && state.rawInvitationUrl ? (
            <OneTimeInvitation
              rawInvitationUrl={state.rawInvitationUrl}
              expiresLabel={state.expiresLabel}
            />
          ) : null}
        </form>
      ) : null}

      {invitations.length ? (
        <div className="divide-y divide-black/[0.07] rounded-2xl border border-black/10 bg-white">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{invitation.recipientLabel}</p>
                  <AccessStatus status={invitation.status} />
                </div>
                <p className="mt-1 truncate text-xs text-[#766e62]">{invitation.recipientEmail}</p>
                <p className="mt-2 text-xs leading-5 text-[#625b51]">
                  {invitation.purposeLabel} · {invitation.expiresLabel} · {invitation.sessionCount}{" "}
                  active {invitation.sessionCount === 1 ? "session" : "sessions"}
                </p>
              </div>
              {invitation.status === "issued" || invitation.status === "redeemed" ? (
                <form action={revokeAction}>
                  <input type="hidden" name="recipientId" value={invitation.recipientId} />
                  <input type="hidden" name="reason" value="Archive owner revoked access" />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-900 sm:w-auto"
                  >
                    <Ban className="h-3.5 w-3.5" /> Revoke recipient
                  </button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center">
          <UserRoundCheck className="mx-auto h-6 w-6 text-[#81786a]" />
          <p className="mt-3 font-semibold">No family invitations yet</p>
          <p className="mt-1 text-sm text-[#756d61]">Invite the first relative when you are ready to share.</p>
        </div>
      )}
    </section>
  );
}

function OneTimeInvitation({
  rawInvitationUrl,
  expiresLabel,
}: {
  rawInvitationUrl: string;
  expiresLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyInvitation() {
    await navigator.clipboard.writeText(rawInvitationUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Copy this link now—it is shown once.</p>
          <p className="mt-1 text-xs leading-5">
            Only its cryptographic hash is stored. Send it to the named recipient through your agreed
            private channel. {expiresLabel ? `Unused access expires ${expiresLabel}.` : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs">
          {rawInvitationUrl}
        </code>
        <button
          type="button"
          onClick={copyInvitation}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-950 px-4 py-2 text-xs font-semibold text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function AccessStatus({ status }: { status: OwnerInviteDisplay["status"] }) {
  const styles = {
    issued: "bg-blue-50 text-blue-800",
    redeemed: "bg-emerald-50 text-emerald-800",
    expired: "bg-stone-100 text-stone-700",
    revoked: "bg-red-50 text-red-800",
  }[status];

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${styles}`}>
      {status}
    </span>
  );
}

export type ExportDisplay = {
  status: "queued" | "processing" | "ready" | "expired" | "failed";
  requestedLabel: string;
  expiresLabel: string;
  downloadHref?: string;
} | null;

export function OwnerExportControl({
  currentExport,
  requestAction,
}: {
  currentExport: ExportDisplay;
  requestAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <section className="space-y-4 rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 shadow-sm sm:p-7">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8ede8] text-[#405447]">
          <FileArchive className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#81786a]">Portability</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold">Export the family archive</h2>
          <p className="mt-2 text-sm leading-6 text-[#6c6459]">
            The owner export includes source data, original media, stories, provenance, and a durable static presentation. It excludes invitation tokens, sessions, secrets, and internal security logs.
          </p>
        </div>
      </div>

      {currentExport ? (
        <div className="rounded-xl border border-black/10 bg-white p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold capitalize">Export {currentExport.status}</p>
              <p className="mt-1 text-xs leading-5 text-[#756d61]">
                Requested {currentExport.requestedLabel}. {currentExport.status === "ready" ? `Download expires ${currentExport.expiresLabel}.` : ""}
              </p>
            </div>
            {currentExport.status === "ready" && currentExport.downloadHref ? (
              <a
                href={currentExport.downloadHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#293a31] px-4 py-2.5 text-xs font-semibold text-white"
              >
                <Download className="h-3.5 w-3.5" /> Download archive
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <form action={requestAction}>
        <button
          type="submit"
          disabled={currentExport?.status === "queued" || currentExport?.status === "processing"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-4 py-3 text-sm font-semibold disabled:opacity-50 sm:w-auto"
        >
          {currentExport ? <RefreshCw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          {currentExport ? "Generate a fresh export" : "Generate owner export"}
        </button>
      </form>
      <p className="text-xs leading-5 text-[#756d61]">
        Generated downloads require this authenticated owner session, are audit-logged, and are automatically unavailable after 24 hours.
      </p>
    </section>
  );
}

export type DeletionDisplay = {
  status: "scheduled" | "cancelled" | "processing" | "complete";
  requestedLabel: string;
  cancelUntilLabel: string;
  primaryDeletionDueLabel: string;
  recoveryDeletionDueLabel: string;
  backupAgeOutTargetLabel?: string;
} | null;

export function OwnerDeletionControl({
  projectTitle,
  deletion,
  scheduleAction,
  cancelAction,
}: {
  projectTitle: string;
  deletion: DeletionDisplay;
  scheduleAction: (formData: FormData) => Promise<void>;
  cancelAction: (formData: FormData) => Promise<void>;
}) {
  const [confirmation, setConfirmation] = useState("");
  const expectedConfirmation = `DELETE ${projectTitle}`;
  const isMatch = confirmation === expectedConfirmation;

  if (deletion?.status === "scheduled") {
    return (
      <section className="space-y-5 rounded-[22px] border border-red-200 bg-red-50 p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3">
          <CalendarClock className="mt-1 h-5 w-5 shrink-0 text-red-800" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-700">Deletion scheduled</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-red-950">The seven-day cancellation window is open</h2>
            <p className="mt-2 text-sm leading-6 text-red-900">
              Private access was disabled when deletion was requested. Cancellation restores the archive workflow; after the window closes, deletion processing cannot be cancelled here.
            </p>
          </div>
        </div>
        <dl className="grid gap-3 rounded-xl border border-red-200 bg-white p-4 text-sm sm:grid-cols-2">
          <DateDatum label="Cancellation available until" value={deletion.cancelUntilLabel} />
          <DateDatum label="Primary purge due" value={deletion.primaryDeletionDueLabel} />
          <DateDatum label="Recovery copy deletion" value={deletion.recoveryDeletionDueLabel} />
          <DateDatum label="Backup age-out target" value={deletion.backupAgeOutTargetLabel ?? "Pending provider verification"} />
        </dl>
        <form action={cancelAction}>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-red-950 px-5 py-3 text-sm font-semibold text-white">
            <RefreshCw className="h-4 w-4" /> Cancel deletion request
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-[22px] border border-red-200 bg-[#fffafa] p-5 shadow-sm sm:p-7">
      <div className="flex items-start gap-3">
        <Trash2 className="mt-1 h-5 w-5 shrink-0 text-red-800" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-700">Owner-only danger zone</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-red-950">Request archive deletion</h2>
          <p className="mt-2 text-sm leading-6 text-red-900">
            Access is disabled immediately. You then have seven days to cancel. Primary data is purged within 30 days; provider backup timing is shown only after it has been verified.
          </p>
        </div>
      </div>

      <form action={scheduleAction} className="space-y-4 rounded-xl border border-red-200 bg-white p-4">
        <label className="block text-xs font-semibold text-red-950">
          Type <strong>{expectedConfirmation}</strong> to confirm
          <input
            name="confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="off"
            className="mt-2 w-full rounded-lg border border-red-200 px-3 py-2.5 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={!isMatch}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Trash2 className="h-4 w-4" /> Schedule deletion
        </button>
      </form>
    </section>
  );
}

export function OwnerSupportControl({
  genealogistLabel,
  expiresLabel,
  extensionCount,
  extendAction,
}: {
  genealogistLabel: string;
  expiresLabel: string;
  extensionCount: number;
  extendAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <section className="space-y-4 rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 shadow-sm sm:p-7">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#405447]" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#81786a]">Professional support access</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold">Time-limited by default</h2>
          <p className="mt-2 text-sm leading-6 text-[#6c6459]">
            {genealogistLabel} can support this delivery until {expiresLabel}. Access expires automatically unless you approve another explicit 30-day period.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#756d61]">{extensionCount} owner-approved {extensionCount === 1 ? "extension" : "extensions"} recorded</p>
        <form action={extendAction}>
          <input type="hidden" name="days" value="30" />
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs font-semibold sm:w-auto">
            <CalendarClock className="h-3.5 w-3.5" /> Approve 30 more days
          </button>
        </form>
      </div>
    </section>
  );
}

export function HandoffAcceptance({
  ownerLabel,
  projectTitle,
  practiceName,
  identityLabel,
  acceptAction,
}: {
  ownerLabel: string;
  projectTitle: string;
  practiceName: string;
  identityLabel: string;
  acceptAction: (formData: FormData) => Promise<void>;
}) {
  const responsibilities = useMemo(
    () => [
      "Manage and revoke recipient invitations",
      "Export the complete family-owned archive",
      "Approve time-limited professional support",
      "Request or cancel archive deletion",
    ],
    [],
  );

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
      <div className="rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 shadow-sm sm:p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#81786a]">Authority transfer</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Accept stewardship of {projectTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-[#6c6459]">
          {ownerLabel}, accepting records the role transfer from {practiceName} to your verified control-plane identity. Passive family viewers remain accountless.
        </p>
        <ul className="mt-5 space-y-3">
          {responsibilities.map((responsibility) => (
            <li key={responsibility} className="flex items-start gap-3 text-sm leading-6">
              <Check className="mt-1 h-4 w-4 shrink-0 text-[#405447]" /> {responsibility}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4 rounded-[22px] border border-[#bfcbbf] bg-[#edf2ed] p-5 shadow-sm sm:p-7">
        <ShieldCheck className="h-7 w-7 text-[#405447]" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5f7565]">Verified identity</p>
          <p className="mt-2 font-semibold text-[#27392d]">{identityLabel}</p>
          <p className="mt-2 text-xs leading-5 text-[#496050]">
            The acceptance, role transfer, professional support expiry, and future owner actions are written to the audit record.
          </p>
        </div>
        <form action={acceptAction}>
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white">
            <UserRoundCheck className="h-4 w-4" /> Accept archive ownership
          </button>
        </form>
      </div>
    </section>
  );
}

function DateDatum({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#81786a]">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
