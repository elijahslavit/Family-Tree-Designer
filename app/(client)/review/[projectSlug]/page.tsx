import { CheckCircle2, Clock3, FileLock2 } from "lucide-react";
import type { Metadata } from "next";

import {
  approveClientReviewAction,
  submitClientReviewAction,
} from "@/app/(client)/actions";
import {
  ClientAccessNotice,
  ClientAccessShell,
} from "@/components/pilot/client-access-shell";
import { ClientReviewForm } from "@/components/pilot/client-review-form";
import { authorizePilotBearer } from "@/lib/auth/pilot-authorization";
import { getPilotProject } from "@/lib/pilot/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private client review",
  description: "Review a frozen private family-history delivery.",
};

export default async function ClientReviewPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const authorization = await authorizePilotBearer({
    projectRef: projectSlug,
    purposes: ["client_review"],
  });

  if (!authorization.ok) {
    return (
      <ClientAccessShell
        eyebrow="Client review"
        title="Private delivery review"
        description="A recipient-specific review session is required before any pending family content is loaded."
      >
        <ClientAccessNotice state={authorization.reason} />
      </ClientAccessShell>
    );
  }

  const project = getPilotProject(projectSlug);
  const version = project.reviewVersions.find(
    (candidate) => candidate.id === authorization.context.reviewVersionId,
  );

  if (!version || version.round !== authorization.context.reviewRound) {
    return (
      <ClientAccessShell
        eyebrow="Client review"
        title={project.title}
        description="Your secure session is not bound to an available frozen review version."
        practiceName={project.branding.practiceName}
      >
        <ClientAccessNotice state="wrong_role" />
      </ClientAccessShell>
    );
  }

  const items = project.reviewItems
    .filter((item) => item.reviewVersionId === version.id)
    .map((item) => ({
      id: item.id,
      subjectLabel: item.subjectId,
      request: item.request,
      status: item.status,
      disposition: item.disposition,
    }));
  const submitAction = submitClientReviewAction.bind(null, project.slug);
  const approveAction = approveClientReviewAction.bind(null, project.slug);

  return (
    <ClientAccessShell
      eyebrow="Client review"
      title={project.title}
      description="Review the exact frozen delivery below. Submit one consolidated correction request for the round; every item receives a recorded disposition."
      practiceName={project.branding.practiceName}
      backHref={`/s/${project.slug}`}
      backLabel="Preview the family showcase"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <ReviewStatusCard
          icon={<FileLock2 className="h-5 w-5" />}
          label="Frozen review"
          value={version.label}
          detail={`Revision fingerprint ${version.contentFingerprint.slice(0, 12)}`}
        />
        <ReviewStatusCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Secure session"
          value={`Round ${version.round} of 2`}
          detail={`Absolute access ends ${formatReviewDate(authorization.context.absoluteExpiresAt)}`}
        />
        <ReviewStatusCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Review state"
          value={version.status.replaceAll("_", " ")}
          detail={
            version.frozenAt
              ? `Frozen ${formatReviewDate(version.frozenAt)}`
              : "Open for one consolidated submission"
          }
        />
      </section>

      <section className="rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 shadow-sm sm:p-7">
        <ClientReviewForm
          round={version.round}
          versionLabel={version.label}
          fingerprint={version.contentFingerprint}
          status={version.status}
          existingItems={items}
          submitAction={submitAction}
          approveAction={approveAction}
        />
      </section>
    </ClientAccessShell>
  );
}

function ReviewStatusCard({
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
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e8ede8] text-[#405447]">
        {icon}
      </span>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#81786a]">{label}</p>
      <p className="mt-1 font-serif text-xl font-semibold capitalize">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[#756d61]">{detail}</p>
    </div>
  );
}

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}
