import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  accounts,
  claims,
  events,
  externalIds,
  families,
  familyChildren,
  importJobs,
  lineageMembers,
  lineages,
  people,
  reviewIssues,
  trees,
} from "@/db/schema";
import {
  normalizeAccount,
  normalizeImportJob,
  normalizeTree,
} from "@/lib/data/db-normalize";
import { createShareToken, slugify } from "@/lib/utils/slugs";

type AccountProfileInput = {
  displayName: string;
  email: string;
};

type TreeThemeInput = {
  treeId: string;
  themeLayout: "classic" | "editorial" | "explorer";
  themeSkin:
    | "dark-gold"
    | "parchment"
    | "modern"
    | "botanical"
    | "inkwash"
    | "portrait-gallery";
};

type TreeDetailsInput = {
  treeId: string;
  name: string;
  slug?: string | null;
  description?: string | null;
};

type TreeSharingInput = {
  treeId: string;
  isPublic: boolean;
};

type PersonInput = {
  treeId: string;
  id?: string;
  givenName: string;
  surname: string;
  suffix?: string | null;
  gender: "male" | "female" | "unknown" | "other";
  birthDateText?: string | null;
  birthDateNormalized?: string | null;
  birthPlace?: string | null;
  deathDateText?: string | null;
  deathDateNormalized?: string | null;
  deathPlace?: string | null;
  summary?: string | null;
  biographyMd?: string | null;
  isLiving: boolean;
};

type FamilyInput = {
  treeId: string;
  spouse1Id: string;
  spouse2Id?: string | null;
  marriageDateText?: string | null;
  marriageDateNormalized?: string | null;
  marriagePlace?: string | null;
};

type ChildInput = {
  familyId: string;
  childId: string;
  order?: number;
};

type ParentsInput = {
  treeId: string;
  personId: string;
  fatherId?: string | null;
  motherId?: string | null;
};

type EventInput = {
  treeId: string;
  id?: string;
  personId: string;
  type: string;
  dateText?: string | null;
  dateNormalized?: string | null;
  place?: string | null;
  description?: string | null;
};

type LineageInput = {
  treeId: string;
  id?: string;
  name: string;
  description?: string | null;
};

type LineageMembersInput = {
  lineageId: string;
  memberIds: string[];
};

type ReviewIssueInput = {
  issueId: string;
  status: "open" | "resolved" | "dismissed";
  resolutionNote?: string | null;
};

function requireDb() {
  const db = getDb();

  if (!db) {
    throw new Error("Database is not configured");
  }

  return db;
}

async function requireOwnedTree(accountId: string, treeId: string) {
  const db = requireDb();
  const tree = await db.query.trees.findFirst({
    where: and(eq(trees.id, treeId), eq(trees.accountId, accountId)),
  });

  if (!tree) {
    throw new Error("Tree not found");
  }

  return tree;
}

async function requireOwnedFamily(accountId: string, familyId: string) {
  const db = requireDb();
  const family = await db.query.families.findFirst({
    where: eq(families.id, familyId),
  });

  if (!family) {
    throw new Error("Family not found");
  }

  await requireOwnedTree(accountId, family.treeId);
  return family;
}

async function requireOwnedPerson(accountId: string, personId: string) {
  const db = requireDb();
  const person = await db.query.people.findFirst({
    where: eq(people.id, personId),
  });

  if (!person) {
    throw new Error("Person not found");
  }

  await requireOwnedTree(accountId, person.treeId);
  return person;
}

async function requireOwnedLineage(accountId: string, lineageId: string) {
  const db = requireDb();
  const lineage = await db.query.lineages.findFirst({
    where: eq(lineages.id, lineageId),
  });

  if (!lineage) {
    throw new Error("Lineage not found");
  }

  await requireOwnedTree(accountId, lineage.treeId);
  return lineage;
}

async function requireOwnedEvent(accountId: string, eventId: string) {
  const db = requireDb();
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) {
    throw new Error("Event not found");
  }

  await requireOwnedTree(accountId, event.treeId);
  return event;
}

async function requireOwnedReviewIssue(accountId: string, issueId: string) {
  const db = requireDb();
  const issue = await db.query.reviewIssues.findFirst({
    where: eq(reviewIssues.id, issueId),
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  await requireOwnedTree(accountId, issue.treeId);
  return issue;
}

async function requireOwnedImportJob(accountId: string, jobId: string) {
  const db = requireDb();
  const job = await db.query.importJobs.findFirst({
    where: and(eq(importJobs.id, jobId), eq(importJobs.accountId, accountId)),
  });

  if (!job) {
    throw new Error("Import job not found");
  }

  await requireOwnedTree(accountId, job.treeId);
  return job;
}

export async function updateAccountProfileDb(accountId: string, data: AccountProfileInput) {
  const db = requireDb();

  await db
    .update(accounts)
    .set({
      displayName: data.displayName,
      email: data.email,
    })
    .where(eq(accounts.id, accountId));

  const updated = await db.query.accounts.findFirst({
    where: eq(accounts.id, accountId),
  });

  if (!updated) {
    throw new Error("Account not found");
  }

  return normalizeAccount(updated);
}

export async function updateTreeThemeDb(accountId: string, data: TreeThemeInput) {
  const db = requireDb();
  await requireOwnedTree(accountId, data.treeId);

  await db
    .update(trees)
    .set({
      themeLayout: data.themeLayout,
      themeSkin: data.themeSkin,
      updatedAt: new Date(),
    })
    .where(eq(trees.id, data.treeId));

  const updated = await db.query.trees.findFirst({
    where: eq(trees.id, data.treeId),
  });

  if (!updated) {
    throw new Error("Tree not found");
  }

  return normalizeTree(updated);
}

export async function updateTreeDetailsDb(accountId: string, data: TreeDetailsInput) {
  const db = requireDb();
  await requireOwnedTree(accountId, data.treeId);
  const nextSlug = slugify(data.slug?.trim() || data.name);

  await db
    .update(trees)
    .set({
      name: data.name,
      slug: nextSlug,
      description: data.description ?? null,
      updatedAt: new Date(),
    })
    .where(eq(trees.id, data.treeId));

  const updated = await db.query.trees.findFirst({
    where: eq(trees.id, data.treeId),
  });

  if (!updated) {
    throw new Error("Tree not found");
  }

  return normalizeTree(updated);
}

export async function toggleTreePublicDb(accountId: string, data: TreeSharingInput) {
  const db = requireDb();
  await requireOwnedTree(accountId, data.treeId);

  await db
    .update(trees)
    .set({
      isPublic: data.isPublic,
      updatedAt: new Date(),
    })
    .where(eq(trees.id, data.treeId));

  return data.isPublic;
}

export async function regenerateShareTokenDb(accountId: string, treeId: string) {
  const db = requireDb();
  await requireOwnedTree(accountId, treeId);
  const shareToken = createShareToken();

  await db
    .update(trees)
    .set({
      shareToken,
      updatedAt: new Date(),
    })
    .where(eq(trees.id, treeId));

  return shareToken;
}

export async function createPersonDb(accountId: string, data: PersonInput) {
  const db = requireDb();
  await requireOwnedTree(accountId, data.treeId);
  const id = crypto.randomUUID();
  const now = new Date();

  await db.insert(people).values({
    id,
    treeId: data.treeId,
    givenName: data.givenName,
    surname: data.surname,
    fullName: `${data.givenName} ${data.surname}`.trim(),
    suffix: data.suffix ?? null,
    gender: data.gender,
    birthDateText: data.birthDateText ?? null,
    birthDateNormalized: data.birthDateNormalized ?? null,
    birthPlace: data.birthPlace ?? null,
    deathDateText: data.deathDateText ?? null,
    deathDateNormalized: data.deathDateNormalized ?? null,
    deathPlace: data.deathPlace ?? null,
    summary: data.summary ?? null,
    biographyMd: data.biographyMd ?? null,
    isLiving: data.isLiving,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function updatePersonDb(accountId: string, data: PersonInput) {
  const db = requireDb();
  await requireOwnedTree(accountId, data.treeId);

  const existing = await db.query.people.findFirst({
    where: and(eq(people.id, data.id!), eq(people.treeId, data.treeId)),
  });

  if (!existing) {
    throw new Error("Person not found");
  }

  await db
    .update(people)
    .set({
      givenName: data.givenName,
      surname: data.surname,
      fullName: `${data.givenName} ${data.surname}`.trim(),
      suffix: data.suffix ?? null,
      gender: data.gender,
      birthDateText: data.birthDateText ?? null,
      birthDateNormalized: data.birthDateNormalized ?? null,
      birthPlace: data.birthPlace ?? null,
      deathDateText: data.deathDateText ?? null,
      deathDateNormalized: data.deathDateNormalized ?? null,
      deathPlace: data.deathPlace ?? null,
      summary: data.summary ?? null,
      biographyMd: data.biographyMd ?? null,
      isLiving: data.isLiving,
      updatedAt: new Date(),
    })
    .where(eq(people.id, existing.id));
}

export async function deletePersonDb(accountId: string, personId: string) {
  const db = requireDb();
  const person = await requireOwnedPerson(accountId, personId);

  await db.transaction(async (tx) => {
    await tx
      .delete(externalIds)
      .where(
        and(
          eq(externalIds.treeId, person.treeId),
          eq(externalIds.subjectType, "person"),
          eq(externalIds.subjectId, personId),
        ),
      );
    await tx
      .delete(reviewIssues)
      .where(
        and(
          eq(reviewIssues.treeId, person.treeId),
          eq(reviewIssues.subjectType, "person"),
          eq(reviewIssues.subjectId, personId),
        ),
      );
    await tx
      .delete(claims)
      .where(
        and(eq(claims.treeId, person.treeId), eq(claims.subjectType, "person"), eq(claims.subjectId, personId)),
      );
    await tx.delete(people).where(eq(people.id, personId));
  });
}

export async function createFamilyDb(accountId: string, data: FamilyInput) {
  const db = requireDb();
  await requireOwnedTree(accountId, data.treeId);
  const id = crypto.randomUUID();

  await db.insert(families).values({
    id,
    treeId: data.treeId,
    spouse1Id: data.spouse1Id,
    spouse2Id: data.spouse2Id ?? null,
    marriageDateText: data.marriageDateText ?? null,
    marriageDateNormalized: data.marriageDateNormalized ?? null,
    marriagePlace: data.marriagePlace ?? null,
  });

  return id;
}

export async function addChildDb(accountId: string, data: ChildInput) {
  const db = requireDb();
  const family = await requireOwnedFamily(accountId, data.familyId);
  const existing = await db.query.familyChildren.findFirst({
    where: and(eq(familyChildren.familyId, data.familyId), eq(familyChildren.childId, data.childId)),
  });

  if (existing) {
    return;
  }

  const siblingCount = await db.query.familyChildren.findMany({
    where: eq(familyChildren.familyId, data.familyId),
  });

  await db.insert(familyChildren).values({
    familyId: data.familyId,
    childId: data.childId,
    order: data.order ?? siblingCount.length + 1,
    relationshipType: "biological",
  });

  await db
    .update(trees)
    .set({ updatedAt: new Date() })
    .where(eq(trees.id, family.treeId));
}

export async function removeChildDb(accountId: string, familyId: string, childId: string) {
  const db = requireDb();
  await requireOwnedFamily(accountId, familyId);
  await db
    .delete(familyChildren)
    .where(and(eq(familyChildren.familyId, familyId), eq(familyChildren.childId, childId)));
}

export async function setParentsDb(accountId: string, data: ParentsInput) {
  const db = requireDb();
  const tree = await requireOwnedTree(accountId, data.treeId);
  const primaryParent = data.fatherId ?? data.motherId;
  const secondaryParent = primaryParent === data.fatherId ? data.motherId ?? null : data.fatherId ?? null;

  if (!primaryParent) {
    throw new Error("At least one parent is required");
  }

  const treeFamilies = await db.query.families.findMany({
    where: eq(families.treeId, data.treeId),
  });
  const existingFamily = treeFamilies.find((family) => {
    if (secondaryParent) {
      return (
        (family.spouse1Id === primaryParent && family.spouse2Id === secondaryParent) ||
        (family.spouse1Id === secondaryParent && family.spouse2Id === primaryParent)
      );
    }

    return (
      (family.spouse1Id === primaryParent && !family.spouse2Id) ||
      (family.spouse2Id === primaryParent && !family.spouse1Id)
    );
  });

  await db.transaction(async (tx) => {
    if (treeFamilies.length) {
      await tx
        .delete(familyChildren)
        .where(
          and(
            eq(familyChildren.childId, data.personId),
            inArray(
              familyChildren.familyId,
              treeFamilies.map((family) => family.id),
            ),
          ),
        );
    }

    const familyId =
      existingFamily?.id ??
      crypto.randomUUID();

    if (!existingFamily) {
      await tx.insert(families).values({
        id: familyId,
        treeId: data.treeId,
        spouse1Id: primaryParent,
        spouse2Id: secondaryParent,
        marriageDateText: null,
        marriageDateNormalized: null,
        marriagePlace: null,
      });
    }

    await tx.insert(familyChildren).values({
      familyId,
      childId: data.personId,
      order: 1,
      relationshipType: "biological",
    });

    await tx.update(trees).set({ updatedAt: new Date() }).where(eq(trees.id, tree.id));
  });
}

export async function createOrUpdateEventDb(accountId: string, data: EventInput) {
  const db = requireDb();
  await requireOwnedTree(accountId, data.treeId);

  if (data.id) {
    await requireOwnedEvent(accountId, data.id);
    await db
      .update(events)
      .set({
        personId: data.personId,
        type: data.type,
        dateText: data.dateText ?? null,
        dateNormalized: data.dateNormalized ?? null,
        place: data.place ?? null,
        description: data.description ?? null,
      })
      .where(eq(events.id, data.id));

    return data.id;
  }

  const id = crypto.randomUUID();
  await db.insert(events).values({
    id,
    treeId: data.treeId,
    personId: data.personId,
    type: data.type,
    dateText: data.dateText ?? null,
    dateNormalized: data.dateNormalized ?? null,
    place: data.place ?? null,
    description: data.description ?? null,
  });

  return id;
}

export async function deleteEventDb(accountId: string, eventId: string) {
  const db = requireDb();
  const event = await requireOwnedEvent(accountId, eventId);

  await db.transaction(async (tx) => {
    await tx
      .delete(externalIds)
      .where(
        and(
          eq(externalIds.treeId, event.treeId),
          eq(externalIds.subjectType, "event"),
          eq(externalIds.subjectId, eventId),
        ),
      );
    await tx
      .delete(reviewIssues)
      .where(
        and(
          eq(reviewIssues.treeId, event.treeId),
          eq(reviewIssues.subjectType, "event"),
          eq(reviewIssues.subjectId, eventId),
        ),
      );
    await tx.delete(events).where(eq(events.id, eventId));
  });
}

export async function createOrUpdateLineageDb(accountId: string, data: LineageInput) {
  const db = requireDb();
  await requireOwnedTree(accountId, data.treeId);

  if (data.id) {
    await requireOwnedLineage(accountId, data.id);
    await db
      .update(lineages)
      .set({
        name: data.name,
        description: data.description ?? null,
      })
      .where(eq(lineages.id, data.id));

    return data.id;
  }

  const id = crypto.randomUUID();
  await db.insert(lineages).values({
    id,
    treeId: data.treeId,
    name: data.name,
    description: data.description ?? null,
  });

  return id;
}

export async function updateLineageMembersDb(accountId: string, data: LineageMembersInput) {
  const db = requireDb();
  await requireOwnedLineage(accountId, data.lineageId);
  const uniqueMemberIds = [...new Set(data.memberIds)];

  await db.transaction(async (tx) => {
    await tx.delete(lineageMembers).where(eq(lineageMembers.lineageId, data.lineageId));

    if (uniqueMemberIds.length) {
      await tx.insert(lineageMembers).values(
        uniqueMemberIds.map((personId, index) => ({
          lineageId: data.lineageId,
          personId,
          order: index + 1,
        })),
      );
    }
  });
}

export async function deleteLineageDb(accountId: string, lineageId: string) {
  const db = requireDb();
  await requireOwnedLineage(accountId, lineageId);
  await db.delete(lineages).where(eq(lineages.id, lineageId));
}

export async function deleteFamilyDb(accountId: string, familyId: string) {
  const db = requireDb();
  const family = await requireOwnedFamily(accountId, familyId);

  await db.transaction(async (tx) => {
    await tx
      .delete(externalIds)
      .where(
        and(
          eq(externalIds.treeId, family.treeId),
          eq(externalIds.subjectType, "family"),
          eq(externalIds.subjectId, familyId),
        ),
      );
    await tx
      .delete(reviewIssues)
      .where(
        and(
          eq(reviewIssues.treeId, family.treeId),
          eq(reviewIssues.subjectType, "family"),
          eq(reviewIssues.subjectId, familyId),
        ),
      );
    await tx
      .delete(claims)
      .where(
        and(eq(claims.treeId, family.treeId), eq(claims.subjectType, "family"), eq(claims.subjectId, familyId)),
      );
    await tx.delete(families).where(eq(families.id, familyId));
  });
}

export async function resolveReviewIssueDb(accountId: string, data: ReviewIssueInput) {
  const db = requireDb();
  await requireOwnedReviewIssue(accountId, data.issueId);

  await db
    .update(reviewIssues)
    .set({
      status: data.status,
      resolutionNote: data.resolutionNote ?? null,
      resolvedAt: data.status === "resolved" ? new Date() : null,
    })
    .where(eq(reviewIssues.id, data.issueId));
}

export async function confirmGedcomImportDb(accountId: string, jobId: string) {
  const db = requireDb();
  const job = await requireOwnedImportJob(accountId, jobId);

  if (job.status === "confirmed") {
    return normalizeImportJob(job);
  }

  const payload = parseImportPayload(job.payloadJson);

  await db.transaction(async (tx) => {
    if (payload.people.length) {
      await tx.insert(people).values(payload.people);
    }

    if (payload.families.length) {
      await tx.insert(families).values(payload.families);
    }

    if (payload.familyChildren.length) {
      await tx.insert(familyChildren).values(payload.familyChildren);
    }

    if (payload.events.length) {
      await tx.insert(events).values(payload.events);
    }

    if (payload.externalIds.length) {
      await tx.insert(externalIds).values(payload.externalIds);
    }

    if (payload.issues.length) {
      await tx.insert(reviewIssues).values(payload.issues);
    }

    await tx
      .update(importJobs)
      .set({
        status: "confirmed",
        payloadJson: null,
      })
      .where(eq(importJobs.id, jobId));
  });

  const updated = await db.query.importJobs.findFirst({
    where: eq(importJobs.id, jobId),
  });

  if (!updated) {
    throw new Error("Import job not found");
  }

  return normalizeImportJob(updated);
}

function parseImportPayload(payloadJson: unknown) {
  if (!payloadJson) {
    return {
      people: [],
      families: [],
      familyChildren: [],
      events: [],
      externalIds: [],
      issues: [],
    };
  }

  if (typeof payloadJson === "string") {
    return JSON.parse(payloadJson) as {
      people: typeof people.$inferInsert[];
      families: typeof families.$inferInsert[];
      familyChildren: typeof familyChildren.$inferInsert[];
      events: typeof events.$inferInsert[];
      externalIds: typeof externalIds.$inferInsert[];
      issues: typeof reviewIssues.$inferInsert[];
    };
  }

  return payloadJson as {
    people: typeof people.$inferInsert[];
    families: typeof families.$inferInsert[];
    familyChildren: typeof familyChildren.$inferInsert[];
    events: typeof events.$inferInsert[];
    externalIds: typeof externalIds.$inferInsert[];
    issues: typeof reviewIssues.$inferInsert[];
  };
}
