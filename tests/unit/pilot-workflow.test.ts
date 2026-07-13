import {
  acceptPilotHandoff,
  cancelPilotDeletion,
  createNextPilotReviewVersion,
  dispositionPilotReviewItem,
  evaluatePilotPublishGate,
  getPilotProject,
  getPilotSessionContext,
  issuePilotInvite,
  PilotDomainError,
  publishPilotProject,
  recordPilotMediaQuarantine,
  redeemPilotInvite,
  requestPilotExport,
  resetPilotWorkspace,
  revokePilotRecipientAccess,
  schedulePilotDeletion,
  submitPilotReview,
} from "@/lib/pilot/store";
import { PILOT_DEMO_INVITE_TOKENS } from "@/lib/pilot/demo";
import { buildPilotShowcase } from "@/lib/showcase/pilot-showcase";

describe("founding-pilot workflow", () => {
  beforeEach(() => {
    resetPilotWorkspace();
  });

  it("stores only invite hashes and invalidates the recipient session on revocation", () => {
    const issued = issuePilotInvite({
      projectRef: "pilot-hart-001",
      actorId: "actor-genealogist",
      recipientLabel: "Synthetic Viewer",
      recipientEmail: "viewer@example.family",
      purpose: "viewer",
      now: "2026-07-12T16:00:00.000Z",
    });

    expect(issued.rawToken).toHaveLength(43);
    expect(issued.invite.tokenHash).not.toBe(issued.rawToken);
    expect(JSON.stringify(getPilotProject("pilot-hart-001"))).not.toContain(issued.rawToken);

    const redeemed = redeemPilotInvite({
      rawToken: issued.rawToken,
      now: "2026-07-12T16:05:00.000Z",
    });
    expect(redeemed.session.idleExpiresAt).toBe("2026-07-19T16:05:00.000Z");
    expect(redeemed.session.absoluteExpiresAt).toBe("2026-08-11T16:05:00.000Z");
    expect(
      getPilotSessionContext(redeemed.rawSessionToken, "2026-07-13T16:00:00.000Z").status,
    ).toBe("valid");

    revokePilotRecipientAccess({
      projectRef: "pilot-hart-001",
      actorId: "actor-genealogist",
      recipientId: issued.invite.recipientId,
      reason: "Recipient asked for access to be removed.",
      now: "2026-07-13T16:01:00.000Z",
    });
    expect(getPilotSessionContext(redeemed.rawSessionToken).status).toBe("revoked");
    expectDomainError(
      () => redeemPilotInvite({ rawToken: issued.rawToken }),
      "INVITE_USED",
    );
  });

  it("rejects expired and revoked links without creating sessions", () => {
    expectDomainError(
      () =>
        redeemPilotInvite({
          rawToken: PILOT_DEMO_INVITE_TOKENS.expired,
          now: "2026-07-12T16:00:00.000Z",
        }),
      "INVITE_EXPIRED",
    );
    expectDomainError(
      () =>
        redeemPilotInvite({
          rawToken: PILOT_DEMO_INVITE_TOKENS.revoked,
          now: "2026-07-12T16:00:00.000Z",
        }),
      "INVITE_REVOKED",
    );

    const project = getPilotProject("pilot-hart-001");
    expect(project.sessions).toHaveLength(1);
  });

  it("enforces project roles and blocks incomplete projects from publication", () => {
    expectDomainError(
      () =>
        issuePilotInvite({
          projectRef: "pilot-hart-001",
          actorId: "actor-reviewer",
          recipientLabel: "Unauthorized invite target",
          recipientEmail: "target@example.family",
          purpose: "viewer",
        }),
      "UNAUTHORIZED",
    );

    const incomplete = getPilotProject("pilot-vale-002");
    const gate = evaluatePilotPublishGate(incomplete);
    expect(gate.allowed).toBe(false);
    expect(gate.blockers.map((blocker) => blocker.code)).toContain("legal_review");
    expect(gate.blockers.map((blocker) => blocker.code)).toContain(
      "import_review_acknowledged",
    );
    expectDomainError(
      () =>
        publishPilotProject({
          projectRef: incomplete.id,
          actorId: "actor-genealogist",
          now: "2026-07-12T16:00:00.000Z",
        }),
      "PUBLISH_BLOCKED",
    );
  });

  it("includes only privacy-cleared living people in the showcase", () => {
    const project = getPilotProject("pilot-hart-001");
    const showcase = buildPilotShowcase(project, "/s/hart-family-legacy");
    const visibleIds = showcase.people.map((person) => person.id);

    expect(visibleIds).toContain("p06");
    expect(visibleIds).not.toContain("p14");
    expect(visibleIds).not.toContain("p19");
  });

  it("freezes consolidated feedback and creates a distinct second review version", () => {
    const submission = submitPilotReview({
      projectRef: "pilot-brooks-003",
      actorId: "actor-brooks-reviewer",
      reviewVersionId: "review-brooks-round-1",
      approved: false,
      items: [
        {
          subjectType: "story",
          subjectId: "synthetic-story",
          fieldPath: "dek",
          request: "Clarify the date in this synthetic story.",
        },
      ],
      now: "2026-07-12T19:00:00.000Z",
    });

    expect(submission.version.status).toBe("submitted");
    expect(submission.version.frozenAt).toBe("2026-07-12T19:00:00.000Z");
    expect(submission.items).toHaveLength(1);
    expectDomainError(
      () =>
        submitPilotReview({
          projectRef: "pilot-brooks-003",
          actorId: "actor-brooks-reviewer",
          reviewVersionId: "review-brooks-round-1",
          approved: false,
          items: [
            {
              subjectType: "story",
              subjectId: "synthetic-story",
              request: "Attempt to drift comments after the version froze.",
            },
          ],
        }),
      "INVALID_STATE",
    );

    dispositionPilotReviewItem({
      projectRef: "pilot-brooks-003",
      actorId: "actor-genealogist",
      reviewItemId: submission.items[0]!.id,
      decision: "accepted",
      disposition: "Accepted and corrected in the next unpublished revision.",
      now: "2026-07-12T20:00:00.000Z",
    });
    const next = createNextPilotReviewVersion({
      projectRef: "pilot-brooks-003",
      actorId: "actor-genealogist",
      previousReviewVersionId: submission.version.id,
      contentFingerprint: "a".repeat(64),
      now: "2026-07-12T20:05:00.000Z",
    });

    expect(next.version.round).toBe(2);
    expect(next.version.status).toBe("open");
    expect(next.revision.basedOnRevisionId).toBe("pilot-brooks-003-revision-001");
    expect(next.revision.status).toBe("draft");
    expect(getPilotProject("pilot-brooks-003").reviewVersions).toHaveLength(2);
  });

  it("isolates failed media so it cannot be previewed or exported", () => {
    const project = getPilotProject("pilot-hart-001");
    const media = project.media.find((asset) => asset.quarantineStatus === "passed");
    expect(media).toBeDefined();

    const failed = recordPilotMediaQuarantine({
      projectRef: project.id,
      actorId: "actor-operator",
      mediaId: media!.id,
      outcome: "failed",
      signaturePassed: false,
      malwarePassed: false,
      failureReason: "Synthetic signature mismatch during verification.",
      now: "2026-07-12T17:00:00.000Z",
    });

    expect(failed.quarantineStatus).toBe("failed");
    expect(failed.derivativePath).toBeNull();
    expect(failed.inertPreviewPath).toBeNull();
    expect(failed.visibility).toBe("private");
    expect(failed.featured).toBe(false);
  });

  it("transfers authority and gives the owner audited export and deletion controls", () => {
    const handoff = acceptPilotHandoff({
      projectRef: "pilot-hart-001",
      actorId: "actor-owner",
      now: "2026-07-12T18:00:00.000Z",
    });
    expect(handoff.status).toBe("accepted");
    expect(handoff.professionalSupportExpiresAt).toBe("2026-08-11T18:00:00.000Z");

    const archive = getPilotProject("pilot-hart-001");
    expect(archive.roles.find((role) => role.actorId === "actor-owner")?.role).toBe("archive_owner");
    expect(archive.roles.find((role) => role.actorId === "actor-genealogist")?.expiresAt).toBe(
      "2026-08-11T18:00:00.000Z",
    );

    const exportRequest = requestPilotExport({
      projectRef: archive.id,
      actorId: "actor-owner",
      now: "2026-07-12T18:05:00.000Z",
    });
    expect(exportRequest.expiresAt).toBe("2026-07-13T18:05:00.000Z");

    const deletion = schedulePilotDeletion({
      projectRef: archive.id,
      actorId: "actor-owner",
      confirmation: `DELETE ${archive.title}`,
      now: "2026-07-12T18:10:00.000Z",
    });
    expect(deletion.cancelUntil).toBe("2026-07-19T18:10:00.000Z");

    const cancelled = cancelPilotDeletion({
      projectRef: archive.id,
      actorId: "actor-owner",
      now: "2026-07-13T18:10:00.000Z",
    });
    expect(cancelled.status).toBe("cancelled");

    const updated = getPilotProject(archive.id);
    expect(updated.audit.some((event) => event.type === "handoff_accepted")).toBe(true);
    expect(updated.audit.some((event) => event.type === "export_requested")).toBe(true);
    expect(updated.audit.some((event) => event.type === "deletion_cancelled")).toBe(true);
  });
});

function expectDomainError(action: () => unknown, code: PilotDomainError["code"]) {
  try {
    action();
    throw new Error(`Expected PilotDomainError ${code}.`);
  } catch (error) {
    expect(error).toBeInstanceOf(PilotDomainError);
    expect((error as PilotDomainError).code).toBe(code);
  }
}
