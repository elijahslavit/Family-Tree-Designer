import {
  acceptPilotHandoff,
  cancelPilotDeletion,
  createNextPilotReviewVersion,
  dispositionPilotReviewItem,
  extendPilotSupport,
  getPilotInviteContext,
  getPilotProject,
  getPilotReviewSnapshotHash,
  getPilotSessionContext,
  issuePilotInvite,
  openPilotReviewVersion,
  PilotDomainError,
  publishPilotProject,
  redeemPilotInvite,
  requestPilotExport,
  resetPilotWorkspace,
  resolvePilotActorForIdentity,
  revokePilotRecipientAccess,
  schedulePilotDeletion,
  submitPilotReview,
} from "@/lib/pilot/store";

describe("pilot lifecycle capability boundaries", () => {
  beforeEach(() => {
    resetPilotWorkspace();
  });

  it("fails closed instead of servicing process-global state outside demo mode", () => {
    const originalDemoMode = process.env.DEMO_MODE;
    const inviteCount = getPilotProject("pilot-hart-001").invites.length;

    try {
      process.env.DEMO_MODE = "false";
      expectDomainError(() => getPilotProject("pilot-hart-001"), "NOT_READY");
      expectDomainError(
        () =>
          issuePilotInvite({
            projectRef: "pilot-hart-001",
            actorId: "actor-operator",
            recipientLabel: "Must not be created",
            recipientEmail: "disabled@example.family",
            purpose: "viewer",
          }),
        "NOT_READY",
      );
      expectDomainError(
        () => getPilotInviteContext("pilot-review-invite"),
        "NOT_READY",
      );
      expectDomainError(
        () => getPilotSessionContext("synthetic-session-token"),
        "NOT_READY",
      );
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
                request: "This mutation must never reach process-global state.",
              },
            ],
          }),
        "NOT_READY",
      );
      expectDomainError(
        () =>
          requestPilotExport({
            projectRef: "pilot-hart-001",
            actorId: "actor-operator",
          }),
        "NOT_READY",
      );
      expectDomainError(
        () =>
          schedulePilotDeletion({
            projectRef: "pilot-hart-001",
            actorId: "actor-owner",
            confirmation: "DELETE The Hart Family Legacy",
          }),
        "NOT_READY",
      );
      expectDomainError(() => resetPilotWorkspace(), "NOT_READY");
    } finally {
      if (originalDemoMode === undefined) {
        delete process.env.DEMO_MODE;
      } else {
        process.env.DEMO_MODE = originalDemoMode;
      }
    }

    expect(getPilotProject("pilot-hart-001").invites).toHaveLength(inviteCount);
  });

  it("opens round one from a draft and records a server-derived immutable snapshot hash", () => {
    const project = mutableProject("pilot-vale-002");
    project.status = "professional_preview";

    const opened = openPilotReviewVersion({
      projectRef: project.id,
      actorId: "actor-genealogist",
      now: "2026-07-12T16:00:00.000Z",
    });

    expect(opened.version.round).toBe(1);
    expect(opened.version.status).toBe("open");
    expect(opened.revision.contentSnapshotVersion).toBe("pilot-review-v1");
    expect(opened.revision.contentSnapshotHash).toBe(opened.version.contentFingerprint);
    expect(opened.version.contentFingerprint).toBe(getPilotReviewSnapshotHash(project.id));
    expect(getPilotProject(project.id).status).toBe("client_review_round_1");
    expectDomainError(
      () =>
        openPilotReviewVersion({
          projectRef: project.id,
          actorId: "actor-genealogist",
          now: "2026-07-12T16:01:00.000Z",
        }),
      "INVALID_STATE",
    );
  });

  it("binds both a client-review invitation and its session to one version and round", () => {
    const issued = issuePilotInvite({
      projectRef: "pilot-brooks-003",
      actorId: "actor-genealogist",
      recipientLabel: "Brooks client reviewer",
      recipientEmail: "brooks-reviewer@example.family",
      purpose: "client_review",
      reviewVersionId: "review-brooks-round-1",
      now: "2026-07-12T16:00:00.000Z",
    });

    expect(issued.invite.reviewVersionId).toBe("review-brooks-round-1");
    expect(issued.invite.reviewRound).toBe(1);
    expect(getPilotInviteContext(issued.rawToken).reviewVersionId).toBe(
      "review-brooks-round-1",
    );

    const redeemed = redeemPilotInvite({
      rawToken: issued.rawToken,
      now: "2026-07-12T16:05:00.000Z",
    });
    expect(redeemed.session.reviewVersionId).toBe("review-brooks-round-1");
    expect(redeemed.session.reviewRound).toBe(1);
    expect(getPilotSessionContext(redeemed.rawSessionToken).reviewVersionId).toBe(
      "review-brooks-round-1",
    );

    const automaticallyBound = issuePilotInvite({
      projectRef: "pilot-brooks-003",
      actorId: "actor-genealogist",
      recipientLabel: "Second Brooks reviewer",
      recipientEmail: "second-brooks-reviewer@example.family",
      purpose: "client_review",
      now: "2026-07-12T16:06:00.000Z",
    });
    expect(automaticallyBound.invite.reviewVersionId).toBe("review-brooks-round-1");
    expect(automaticallyBound.invite.reviewRound).toBe(1);

    expectDomainError(
      () =>
        issuePilotInvite({
          projectRef: "pilot-vale-002",
          actorId: "actor-genealogist",
          recipientLabel: "Unbound reviewer",
          recipientEmail: "unbound@example.family",
          purpose: "client_review",
          now: "2026-07-12T16:10:00.000Z",
        }),
      "VALIDATION",
    );
  });

  it("reissues only the same capability and revokes every session from its parent invite", () => {
    const first = issuePilotInvite({
      projectRef: "pilot-brooks-003",
      actorId: "actor-genealogist",
      recipientLabel: "Brooks client reviewer",
      recipientEmail: "brooks-reviewer@example.family",
      purpose: "client_review",
      reviewVersionId: "review-brooks-round-1",
      now: "2026-07-12T16:00:00.000Z",
    });
    const redeemed = redeemPilotInvite({
      rawToken: first.rawToken,
      now: "2026-07-12T16:02:00.000Z",
    });

    expectDomainError(
      () =>
        issuePilotInvite({
          projectRef: "pilot-brooks-003",
          actorId: "actor-genealogist",
          recipientLabel: "Brooks client reviewer",
          recipientEmail: "different@example.family",
          purpose: "client_review",
          reviewVersionId: "review-brooks-round-1",
          reissuedFromInviteId: first.invite.id,
          now: "2026-07-12T16:03:00.000Z",
        }),
      "VALIDATION",
    );

    const reissued = issuePilotInvite({
      projectRef: "pilot-brooks-003",
      actorId: "actor-genealogist",
      recipientLabel: "Brooks client reviewer",
      recipientEmail: "brooks-reviewer@example.family",
      purpose: "client_review",
      reviewVersionId: "review-brooks-round-1",
      reissuedFromInviteId: first.invite.id,
      now: "2026-07-12T16:04:00.000Z",
    });

    expect(reissued.invite.recipientId).toBe(first.invite.recipientId);
    expect(reissued.invite.purpose).toBe(first.invite.purpose);
    expect(reissued.invite.reviewVersionId).toBe(first.invite.reviewVersionId);
    expect(getPilotSessionContext(redeemed.rawSessionToken).status).toBe("revoked");

    // Parent revocation remains authoritative even if a stored session flag is
    // accidentally cleared by a later persistence bug.
    mutableProject("pilot-brooks-003").sessions.find(
      (session) => session.id === redeemed.session.id,
    )!.revokedAt = null;
    expect(getPilotSessionContext(redeemed.rawSessionToken).status).toBe("revoked");
  });

  it("supports direct round-two approval but rejects approval after presentation drift", () => {
    const first = submitRoundOneAndOpenRoundTwo();
    expect(first.revision.contentSnapshotHash).toBe(first.version.contentFingerprint);

    const approval = submitPilotReview({
      projectRef: "pilot-brooks-003",
      actorId: "actor-brooks-reviewer",
      reviewVersionId: first.version.id,
      approved: true,
      now: "2026-07-12T16:20:00.000Z",
    });
    expect(approval.version.status).toBe("approved");
    expect(approval.version.frozenAt).toBe("2026-07-12T16:20:00.000Z");

    resetPilotWorkspace();
    const drifted = submitRoundOneAndOpenRoundTwo();
    mutableProject("pilot-brooks-003").welcome.headline =
      "A changed headline that was never in the frozen review";
    expectDomainError(
      () =>
        submitPilotReview({
          projectRef: "pilot-brooks-003",
          actorId: "actor-brooks-reviewer",
          reviewVersionId: drifted.version.id,
          approved: true,
          now: "2026-07-12T16:20:00.000Z",
        }),
      "INVALID_STATE",
    );
  });

  it("enforces role expiration in actor, identity, and bearer-context resolution", () => {
    expectDomainError(
      () =>
        issuePilotInvite({
          projectRef: "pilot-hart-001",
          actorId: "actor-genealogist",
          recipientLabel: "Late viewer",
          recipientEmail: "late@example.family",
          purpose: "viewer",
          now: "2026-08-10T16:00:00.000Z",
        }),
      "UNAUTHORIZED",
    );
    expectDomainError(
      () =>
        resolvePilotActorForIdentity(
          "pilot-hart-001",
          "identity-genealogist",
          ["genealogist"],
          "2026-08-10T16:00:00.000Z",
        ),
      "UNAUTHORIZED",
    );

    mutableProject("pilot-brooks-003").roles.find(
      (role) => role.actorId === "actor-brooks-reviewer",
    )!.expiresAt = "2026-07-14T00:00:00.000Z";
    const issued = issuePilotInvite({
      projectRef: "pilot-brooks-003",
      actorId: "actor-genealogist",
      recipientLabel: "Brooks client reviewer",
      recipientEmail: "brooks-reviewer@example.family",
      purpose: "client_review",
      reviewVersionId: "review-brooks-round-1",
      now: "2026-07-13T00:00:00.000Z",
    });
    const redeemed = redeemPilotInvite({
      rawToken: issued.rawToken,
      now: "2026-07-13T00:05:00.000Z",
    });
    expect(getPilotSessionContext(redeemed.rawSessionToken, "2026-07-14T00:01:00.000Z").status)
      .toBe("expired");
  });

  it("transfers routine invite, revoke, and export authority exclusively to the owner", () => {
    acceptPilotHandoff({
      projectRef: "pilot-hart-001",
      actorId: "actor-owner",
      now: "2026-07-12T17:00:00.000Z",
    });

    for (const actorId of ["actor-operator", "actor-genealogist"]) {
      expectDomainError(
        () =>
          issuePilotInvite({
            projectRef: "pilot-hart-001",
            actorId,
            recipientLabel: "Post-handoff viewer",
            recipientEmail: `${actorId}@example.family`,
            purpose: "viewer",
            now: "2026-07-12T17:01:00.000Z",
          }),
        "UNAUTHORIZED",
      );
      expectDomainError(
        () =>
          requestPilotExport({
            projectRef: "pilot-hart-001",
            actorId,
            now: "2026-07-12T17:01:00.000Z",
          }),
        "UNAUTHORIZED",
      );
    }
    expectDomainError(
      () =>
        revokePilotRecipientAccess({
          projectRef: "pilot-hart-001",
          actorId: "actor-operator",
          recipientId: "recipient-cousin-jon",
          reason: "Operator emergency access is not modeled or granted.",
          now: "2026-07-12T17:02:00.000Z",
        }),
      "UNAUTHORIZED",
    );

    expect(
      issuePilotInvite({
        projectRef: "pilot-hart-001",
        actorId: "actor-owner",
        recipientLabel: "Owner-approved viewer",
        recipientEmail: "owner-approved@example.family",
        purpose: "viewer",
        now: "2026-07-12T17:03:00.000Z",
      }).invite.status,
    ).toBe("issued");
    expect(
      requestPilotExport({
        projectRef: "pilot-hart-001",
        actorId: "actor-owner",
        now: "2026-07-12T17:04:00.000Z",
      }).status,
    ).toBe("queued");
  });

  it("takes a scheduled-deletion archive offline until the owner cancels", () => {
    acceptPilotHandoff({
      projectRef: "pilot-hart-001",
      actorId: "actor-owner",
      now: "2026-07-12T18:00:00.000Z",
    });
    const access = issuePilotInvite({
      projectRef: "pilot-hart-001",
      actorId: "actor-owner",
      recipientLabel: "Temporary viewer",
      recipientEmail: "temporary@example.family",
      purpose: "viewer",
      now: "2026-07-12T18:01:00.000Z",
    });
    const session = redeemPilotInvite({
      rawToken: access.rawToken,
      now: "2026-07-12T18:02:00.000Z",
    });
    const project = getPilotProject("pilot-hart-001");
    schedulePilotDeletion({
      projectRef: project.id,
      actorId: "actor-owner",
      confirmation: `DELETE ${project.title}`,
      now: "2026-07-12T18:03:00.000Z",
    });

    expect(getPilotInviteContext(access.rawToken).status).toBe("revoked");
    expect(getPilotSessionContext(session.rawSessionToken).status).toBe("revoked");
    expectDomainError(
      () =>
        issuePilotInvite({
          projectRef: project.id,
          actorId: "actor-owner",
          recipientLabel: "Blocked viewer",
          recipientEmail: "blocked@example.family",
          purpose: "viewer",
          now: "2026-07-12T18:04:00.000Z",
        }),
      "INVALID_STATE",
    );
    expectDomainError(
      () =>
        requestPilotExport({
          projectRef: project.id,
          actorId: "actor-owner",
          now: "2026-07-12T18:04:00.000Z",
        }),
      "INVALID_STATE",
    );
    expectDomainError(
      () =>
        revokePilotRecipientAccess({
          projectRef: project.id,
          actorId: "actor-owner",
          recipientId: access.invite.recipientId,
          reason: "Routine access controls stay offline during deletion.",
          now: "2026-07-12T18:04:00.000Z",
        }),
      "INVALID_STATE",
    );
    expectDomainError(
      () =>
        extendPilotSupport({
          projectRef: project.id,
          actorId: "actor-owner",
          now: "2026-07-12T18:04:00.000Z",
        }),
      "INVALID_STATE",
    );
    expectDomainError(
      () =>
        publishPilotProject({
          projectRef: project.id,
          actorId: "actor-operator",
          now: "2026-07-12T18:04:00.000Z",
        }),
      "INVALID_STATE",
    );

    cancelPilotDeletion({
      projectRef: project.id,
      actorId: "actor-owner",
      now: "2026-07-13T18:03:00.000Z",
    });
    expect(
      issuePilotInvite({
        projectRef: project.id,
        actorId: "actor-owner",
        recipientLabel: "Replacement viewer",
        recipientEmail: "replacement@example.family",
        purpose: "viewer",
        now: "2026-07-13T18:04:00.000Z",
      }).invite.status,
    ).toBe("issued");
  });
});

function submitRoundOneAndOpenRoundTwo() {
  const submitted = submitPilotReview({
    projectRef: "pilot-brooks-003",
    actorId: "actor-brooks-reviewer",
    reviewVersionId: "review-brooks-round-1",
    approved: false,
    items: [
      {
        subjectType: "story",
        subjectId: "synthetic-story",
        request: "Clarify the date in this synthetic story.",
      },
    ],
    now: "2026-07-12T16:00:00.000Z",
  });
  dispositionPilotReviewItem({
    projectRef: "pilot-brooks-003",
    actorId: "actor-genealogist",
    reviewItemId: submitted.items[0]!.id,
    decision: "accepted",
    disposition: "Accepted and corrected in the next unpublished revision.",
    now: "2026-07-12T16:10:00.000Z",
  });
  return createNextPilotReviewVersion({
    projectRef: "pilot-brooks-003",
    actorId: "actor-genealogist",
    previousReviewVersionId: submitted.version.id,
    contentFingerprint: "0".repeat(64),
    now: "2026-07-12T16:15:00.000Z",
  });
}

function mutableProject(projectId: string) {
  const project = globalThis.__familyTreePilotWorkspace?.projects.find(
    (candidate) => candidate.id === projectId,
  );
  if (!project) throw new Error(`Missing mutable test project ${projectId}.`);
  return project;
}

function expectDomainError(action: () => unknown, code: PilotDomainError["code"]) {
  try {
    action();
    throw new Error(`Expected PilotDomainError ${code}.`);
  } catch (error) {
    expect(error).toBeInstanceOf(PilotDomainError);
    expect((error as PilotDomainError).code).toBe(code);
  }
}
