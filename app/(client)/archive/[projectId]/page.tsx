import {
  CalendarDays,
  Clock3,
  FileCheck2,
  History,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";

import {
  cancelOwnerDeletionAction,
  extendOwnerSupportAction,
  issueOwnerViewerInviteAction,
  requestOwnerExportAction,
  revokeOwnerRecipientAction,
  scheduleOwnerDeletionAction,
} from "@/app/(client)/actions";
import {
  ClientAccessNotice,
  ClientAccessShell,
} from "@/components/pilot/client-access-shell";
import {
  OwnerAccessManager,
  OwnerDeletionControl,
  OwnerExportControl,
  OwnerSupportControl,
  type DeletionDisplay,
  type ExportDisplay,
  type OwnerInviteDisplay,
} from "@/components/pilot/owner-access-controls";
import { authorizePilotIdentity } from "@/lib/auth/pilot-authorization";
import { getPilotProject } from "@/lib/pilot/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private archive controls",
  description: "Authenticated owner controls for a private family archive.",
};

export default async function ArchiveOwnerPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const identity = await authorizePilotIdentity({
    projectRef: projectId,
    roles: ["archive_owner"],
  });

  if (!identity.ok) {
    return (
      <ClientAccessShell
        eyebrow="Archive controls"
        title="Verified owner access"
        description="Invitations, exports, support access, and deletion controls require the authenticated archive-owner identity."
      >
        <ClientAccessNotice
          state={identity.reason}
          signInHref={`/sign-in?next=${encodeURIComponent(`/archive/${projectId}`)}`}
        />
      </ClientAccessShell>
    );
  }

  const project = getPilotProject(projectId);
  if (!project.handoff || project.handoff.status !== "accepted") {
    return (
      <ClientAccessShell
        eyebrow="Archive controls"
        title={project.title}
        description="Owner controls become available only after the verified recipient explicitly accepts handoff."
        practiceName={project.branding.practiceName}
      >
        <ClientAccessNotice state="not_ready" />
      </ClientAccessShell>
    );
  }

  const now = new Date();
  const inviteRows: OwnerInviteDisplay[] = project.invites
    .filter((invite) => invite.purpose === "viewer")
    .map((invite) => ({
      id: invite.id,
      recipientId: invite.recipientId,
      recipientLabel: invite.recipientLabel,
      recipientEmail: invite.recipientEmail,
      purposeLabel: "Family viewer",
      status:
        invite.status === "issued" && new Date(invite.expiresAt) <= now
          ? "expired"
          : invite.status,
      expiresLabel:
        invite.status === "redeemed"
          ? `Redeemed ${formatOwnerDate(invite.redeemedAt)}`
          : `Link expires ${formatOwnerDate(invite.expiresAt)}`,
      sessionCount: project.sessions.filter(
        (session) =>
          session.recipientId === invite.recipientId &&
          !session.revokedAt &&
          new Date(session.idleExpiresAt) > now &&
          new Date(session.absoluteExpiresAt) > now,
      ).length,
    }));
  const latestExport = [...project.exports].sort((left, right) =>
    right.requestedAt.localeCompare(left.requestedAt),
  )[0];
  const exportDisplay: ExportDisplay = latestExport
    ? {
        status: latestExport.status,
        requestedLabel: formatOwnerDate(latestExport.requestedAt),
        expiresLabel: formatOwnerDate(latestExport.expiresAt),
        downloadHref:
          latestExport.status === "ready"
            ? `/archive/${project.id}/export/${latestExport.id}`
            : undefined,
      }
    : null;
  const deletionDisplay: DeletionDisplay = project.deletion
    ? {
        status: project.deletion.status,
        requestedLabel: formatOwnerDate(project.deletion.requestedAt),
        cancelUntilLabel: formatOwnerDate(project.deletion.cancelUntil),
        primaryDeletionDueLabel: formatOwnerDate(
          project.deletion.primaryDeletionDueAt,
        ),
        recoveryDeletionDueLabel: formatOwnerDate(
          project.deletion.recoveryDeletionDueAt,
        ),
        backupAgeOutTargetLabel: project.deletion.backupAgeOutTargetAt
          ? formatOwnerDate(project.deletion.backupAgeOutTargetAt)
          : undefined,
      }
    : null;
  const genealogist = project.roles.find((role) => role.role === "genealogist");
  const hostingEndsAt = addMonths(project.createdAt, project.scope.hostingMonths);
  const viewGraceEndsAt = addDays(hostingEndsAt, 30);
  const recoveryEndsAt = addMonths(viewGraceEndsAt, 12);

  const issueAction = issueOwnerViewerInviteAction.bind(null, project.id);
  const revokeAction = revokeOwnerRecipientAction.bind(null, project.id);
  const exportAction = requestOwnerExportAction.bind(null, project.id);
  const scheduleDeletionAction = scheduleOwnerDeletionAction.bind(
    null,
    project.id,
  );
  const cancelDeletionAction = cancelOwnerDeletionAction.bind(null, project.id);
  const extendSupportAction = extendOwnerSupportAction.bind(null, project.id);

  return (
    <ClientAccessShell
      eyebrow="Archive owner"
      title={project.title}
      description="Manage who can enter this private family archive, preserve a complete copy, and control professional support and deletion."
      practiceName={project.branding.practiceName}
      backHref={`/s/${project.slug}`}
      backLabel="Open the family showcase"
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OwnerDatum
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Archive owner"
          value={identity.identityLabel}
          detail={`Accepted ${formatOwnerDate(project.handoff.acceptedAt)}`}
        />
        <OwnerDatum
          icon={<LockKeyhole className="h-5 w-5" />}
          label="Presentation"
          value="Invite-only"
          detail="Noindex is defense in depth; authorization protects content"
        />
        <OwnerDatum
          icon={<UsersRound className="h-5 w-5" />}
          label="Active viewers"
          value={inviteRows.reduce((total, invite) => total + invite.sessionCount, 0).toString()}
          detail={`${inviteRows.length} recipient records`}
        />
        <OwnerDatum
          icon={<Clock3 className="h-5 w-5" />}
          label="Included hosting"
          value={formatOwnerDate(hostingEndsAt)}
          detail="Renewal notices are recorded manually during the pilot"
        />
      </section>

      <section className="rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-[#405447]" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#81786a]">Archive lifecycle</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold">Dates remain visible before any service change</h2>
            <p className="mt-2 text-sm leading-6 text-[#6c6459]">
              If hosting is not renewed, editing and new invitations stop first. Existing private viewers receive a 30-day grace period before the presentation goes offline; the archive then remains recoverable for 12 months.
            </p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 rounded-xl border border-black/10 bg-white p-4 text-sm sm:grid-cols-3">
          <OwnerDate label="Hosting term ends" value={formatOwnerDate(hostingEndsAt)} />
          <OwnerDate label="Viewer grace ends" value={formatOwnerDate(viewGraceEndsAt)} />
          <OwnerDate label="Recovery copy ends" value={formatOwnerDate(recoveryEndsAt)} />
        </dl>
      </section>

      <OwnerAccessManager
        invitations={inviteRows}
        issueAction={issueAction}
        revokeAction={revokeAction}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <OwnerExportControl
          currentExport={exportDisplay}
          requestAction={exportAction}
        />
        <OwnerSupportControl
          genealogistLabel={genealogist?.displayName ?? "The project genealogist"}
          expiresLabel={formatOwnerDate(
            project.handoff.professionalSupportExpiresAt,
          )}
          extensionCount={project.handoff.supportExtensionCount}
          extendAction={extendSupportAction}
        />
      </div>

      <section className="rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3">
          <History className="mt-1 h-5 w-5 shrink-0 text-[#405447]" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#81786a]">Accountability</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold">Recent owner-visible events</h2>
          </div>
        </div>
        <div className="mt-5 divide-y divide-black/[0.07] rounded-xl border border-black/10 bg-white">
          {[...project.audit]
            .reverse()
            .slice(0, 6)
            .map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-4">
                <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-[#536858]" />
                <div>
                  <p className="text-sm font-semibold">{event.summary}</p>
                  <p className="mt-1 text-xs text-[#756d61]">{formatOwnerDate(event.occurredAt)}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      <OwnerDeletionControl
        projectTitle={project.title}
        deletion={deletionDisplay}
        scheduleAction={scheduleDeletionAction}
        cancelAction={cancelDeletionAction}
      />
    </ClientAccessShell>
  );
}

function OwnerDatum({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[20px] border border-black/10 bg-[#fbf9f4] p-5 shadow-sm">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e8ede8] text-[#405447]">{icon}</span>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#81786a]">{label}</p>
      <p className="mt-1 font-serif text-xl font-semibold">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[#756d61]">{detail}</p>
    </div>
  );
}

function OwnerDate({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#81786a]">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function formatOwnerDate(value?: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

function addDays(value: string, days: number) {
  const date = new Date(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

function addMonths(value: string, months: number) {
  const date = new Date(value);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString();
}
