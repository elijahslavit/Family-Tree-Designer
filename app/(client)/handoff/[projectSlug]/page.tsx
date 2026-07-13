import { CheckCircle2, Clock3, FileArchive, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { acceptOwnerHandoffAction } from "@/app/(client)/actions";
import {
  ClientAccessNotice,
  ClientAccessShell,
} from "@/components/pilot/client-access-shell";
import { HandoffAcceptance } from "@/components/pilot/owner-access-controls";
import {
  authorizePilotBearer,
  authorizePilotIdentity,
} from "@/lib/auth/pilot-authorization";
import { getPilotProject } from "@/lib/pilot/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private archive handoff",
  description: "Verified transfer of a private family archive.",
};

export default async function OwnerHandoffPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const bearer = await authorizePilotBearer({
    projectRef: projectSlug,
    purposes: ["owner_handoff"],
  });

  if (!bearer.ok) {
    return (
      <ClientAccessShell
        eyebrow="Archive handoff"
        title="Verified owner transfer"
        description="The designated owner invitation is required before handoff details are loaded."
      >
        <ClientAccessNotice state={bearer.reason} />
      </ClientAccessShell>
    );
  }

  const project = getPilotProject(projectSlug);
  if (!project.publication || !project.handoff) {
    return (
      <ClientAccessShell
        eyebrow="Archive handoff"
        title={project.title}
        description="Your secure handoff session is active, but the approved delivery has not been published for transfer."
        practiceName={project.branding.practiceName}
      >
        <ClientAccessNotice state="not_ready" />
      </ClientAccessShell>
    );
  }

  const identity = await authorizePilotIdentity({
    projectRef: projectSlug,
    roles: ["owner_candidate", "archive_owner"],
  });
  if (!identity.ok) {
    const nextPath = `/handoff/${project.slug}`;
    return (
      <ClientAccessShell
        eyebrow="Archive handoff"
        title={project.title}
        description="The invitation proves possession of the handoff link. A separate verified identity is required before owner powers transfer."
        practiceName={project.branding.practiceName}
      >
        <ClientAccessNotice
          state={identity.reason}
          signInHref={`/sign-in?next=${encodeURIComponent(nextPath)}`}
        />
      </ClientAccessShell>
    );
  }

  if (!bearer.context.actorId || bearer.context.actorId !== identity.actorId) {
    return (
      <ClientAccessShell
        eyebrow="Archive handoff"
        title={project.title}
        description="Both the invitation and verified identity must name the same designated archive owner."
        practiceName={project.branding.practiceName}
      >
        <ClientAccessNotice state="identity_mismatch" />
      </ClientAccessShell>
    );
  }

  if (project.handoff.status === "accepted") {
    return (
      <ClientAccessShell
        eyebrow="Archive handoff complete"
        title={`${project.title} is now family-controlled.`}
        description="The verified owner accepted stewardship. Invitation, export, support, and deletion controls are available in the owner archive."
        practiceName={project.branding.practiceName}
      >
        <section className="rounded-[22px] border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-sm sm:p-8">
          <CheckCircle2 className="h-8 w-8" />
          <h2 className="mt-4 font-serif text-3xl font-semibold">Authority transfer recorded</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6">
            Accepted {formatHandoffDate(project.handoff.acceptedAt)}. Professional support expires {formatHandoffDate(project.handoff.professionalSupportExpiresAt)} unless the owner approves an explicit 30-day extension.
          </p>
          <Link
            href={`/archive/${project.id}`}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white"
          >
            <FileArchive className="h-4 w-4" /> Open owner controls
          </Link>
        </section>
      </ClientAccessShell>
    );
  }

  const acceptAction = acceptOwnerHandoffAction.bind(null, project.slug);
  const ownerAssignment = project.roles.find(
    (role) => role.actorId === project.handoff?.ownerActorId,
  );

  return (
    <ClientAccessShell
      eyebrow="Archive handoff"
      title={project.title}
      description="Review the authority transfer below. Acceptance is recorded against the verified owner identity and begins the 30-day professional support period."
      practiceName={project.branding.practiceName}
      backHref={`/s/${project.slug}`}
      backLabel="View the approved delivery"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <HandoffDatum
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Identity verified"
          value={formatHandoffDate(project.handoff.identityVerifiedAt)}
        />
        <HandoffDatum
          icon={<FileArchive className="h-5 w-5" />}
          label="Delivery published"
          value={formatHandoffDate(project.publication.publishedAt)}
        />
        <HandoffDatum
          icon={<Clock3 className="h-5 w-5" />}
          label="Support after acceptance"
          value="30 days"
        />
      </section>
      <HandoffAcceptance
        ownerLabel={ownerAssignment?.displayName ?? bearer.context.recipientLabel}
        projectTitle={project.title}
        practiceName={project.branding.practiceName}
        identityLabel={identity.identityLabel}
        acceptAction={acceptAction}
      />
    </ClientAccessShell>
  );
}

function HandoffDatum({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-black/10 bg-[#fbf9f4] p-5 shadow-sm">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e8ede8] text-[#405447]">{icon}</span>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#81786a]">{label}</p>
      <p className="mt-1 font-serif text-xl font-semibold">{value}</p>
    </div>
  );
}

function formatHandoffDate(value?: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}
