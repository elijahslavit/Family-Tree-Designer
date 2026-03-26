"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAccountSession } from "@/lib/auth/session";
import {
  addChildDb,
  confirmGedcomImportDb,
  createFamilyDb,
  createOrUpdateEventDb,
  createOrUpdateLineageDb,
  createPersonDb,
  deleteEventDb,
  deleteFamilyDb,
  deleteLineageDb,
  deletePersonDb,
  regenerateShareTokenDb,
  removeChildDb,
  resolveReviewIssueDb,
  setParentsDb,
  toggleTreePublicDb,
  updateAccountProfileDb,
  updateLineageMembersDb,
  updatePersonDb,
  updateTreeDetailsDb,
  updateTreeThemeDb,
} from "@/lib/data/database-actions";
import { getDemoStore, resetDemoStore } from "@/lib/data/demo-store";
import { usesDatabaseRuntime } from "@/lib/data/runtime-store";
import { createShareToken, slugify } from "@/lib/utils/slugs";

const personSchema = z.object({
  treeId: z.string(),
  id: z.string().optional(),
  givenName: z.string().min(1),
  surname: z.string().min(1),
  suffix: z.string().optional().nullable(),
  gender: z.enum(["male", "female", "unknown", "other"]).default("unknown"),
  birthDateText: z.string().optional().nullable(),
  birthDateNormalized: z.string().optional().nullable(),
  birthPlace: z.string().optional().nullable(),
  deathDateText: z.string().optional().nullable(),
  deathDateNormalized: z.string().optional().nullable(),
  deathPlace: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  biographyMd: z.string().optional().nullable(),
  isLiving: z.boolean().default(false),
});

const treeThemeSchema = z.object({
  treeId: z.string(),
  themeLayout: z.enum(["classic", "editorial", "explorer"]),
  themeSkin: z.enum([
    "dark-gold",
    "parchment",
    "modern",
    "botanical",
    "inkwash",
    "portrait-gallery",
  ]),
});

const treeSharingSchema = z.object({
  treeId: z.string(),
  isPublic: z.boolean(),
});

const treeDetailsSchema = z.object({
  treeId: z.string(),
  name: z.string().min(2),
  slug: z.string().trim().min(2).nullable().optional(),
  description: z.string().nullable().optional(),
});

const accountProfileSchema = z.object({
  displayName: z.string().trim().min(2),
  email: z.string().trim().email(),
});

const familySchema = z.object({
  treeId: z.string(),
  spouse1Id: z.string(),
  spouse2Id: z.string().nullable().optional(),
  marriageDateText: z.string().nullable().optional(),
  marriageDateNormalized: z.string().nullable().optional(),
  marriagePlace: z.string().nullable().optional(),
});

const childSchema = z.object({
  familyId: z.string(),
  childId: z.string(),
  order: z.number().optional(),
});

const familyChildRemovalSchema = z.object({
  familyId: z.string(),
  childId: z.string(),
});

const parentsSchema = z.object({
  treeId: z.string(),
  personId: z.string(),
  fatherId: z.string().nullable().optional(),
  motherId: z.string().nullable().optional(),
});

const eventSchema = z.object({
  treeId: z.string(),
  id: z.string().optional(),
  personId: z.string(),
  type: z.string().min(1),
  dateText: z.string().nullable().optional(),
  dateNormalized: z.string().nullable().optional(),
  place: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

const lineageSchema = z.object({
  treeId: z.string(),
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

const lineageMembersSchema = z.object({
  lineageId: z.string(),
  memberIds: z.array(z.string()),
});

const issueSchema = z.object({
  issueId: z.string(),
  status: z.enum(["open", "resolved", "dismissed"]),
  resolutionNote: z.string().nullable().optional(),
});

const importConfirmSchema = z.object({
  jobId: z.string(),
});

function getEditableTree(accountId: string) {
  const store = getDemoStore();

  if (store.tree.accountId !== accountId) {
    throw new Error("Unauthorized");
  }

  return store;
}

function assertTreeId(treeId: string, currentTreeId: string) {
  if (treeId !== currentTreeId) {
    throw new Error("Tree not found");
  }
}

function revalidateTree(slug: string, oldSlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/directory");
  revalidatePath("/canvas");
  revalidatePath("/lineages");
  revalidatePath("/import");
  revalidatePath("/theme");
  revalidatePath("/settings");
  revalidatePath(`/t/${slug}`);
  revalidatePath(`/t/${slug}/canvas`);
  revalidatePath(`/t/${slug}/lineages`);

  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/t/${oldSlug}`);
    revalidatePath(`/t/${oldSlug}/canvas`);
    revalidatePath(`/t/${oldSlug}/lineages`);
  }
}

function getTreeUpdateStamp() {
  return new Date().toISOString();
}

function parseImportPayload(payloadJson: unknown) {
  type DemoStoreShape = ReturnType<typeof getDemoStore>;

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
      people: DemoStoreShape["people"];
      families: DemoStoreShape["families"];
      familyChildren: DemoStoreShape["familyChildren"];
      events: DemoStoreShape["events"];
      externalIds: DemoStoreShape["externalIds"];
      issues: DemoStoreShape["reviewIssues"];
    };
  }

  return payloadJson as {
    people: DemoStoreShape["people"];
    families: DemoStoreShape["families"];
    familyChildren: DemoStoreShape["familyChildren"];
    events: DemoStoreShape["events"];
    externalIds: DemoStoreShape["externalIds"];
    issues: DemoStoreShape["reviewIssues"];
  };
}

export async function updateAccountProfile(input: z.input<typeof accountProfileSchema>) {
  const accountId = await requireAccountSession();
  const data = accountProfileSchema.parse(input);

  if (usesDatabaseRuntime()) {
    revalidatePath("/dashboard");
    revalidatePath("/settings");
    return updateAccountProfileDb(accountId, data);
  }

  const store = getEditableTree(accountId);
  store.account.displayName = data.displayName;
  store.account.email = data.email;

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return store.account;
}

export async function updateTreeTheme(input: z.input<typeof treeThemeSchema>) {
  const accountId = await requireAccountSession();
  const data = treeThemeSchema.parse(input);

  if (usesDatabaseRuntime()) {
    const tree = await updateTreeThemeDb(accountId, data);
    revalidateTree(tree.slug);
    return;
  }

  const store = getEditableTree(accountId);
  assertTreeId(data.treeId, store.tree.id);

  store.tree.themeLayout = data.themeLayout;
  store.tree.themeSkin = data.themeSkin;
  store.tree.updatedAt = getTreeUpdateStamp();
  revalidateTree(store.tree.slug);
}

export async function updateTreeDetails(input: z.input<typeof treeDetailsSchema>) {
  const accountId = await requireAccountSession();
  const data = treeDetailsSchema.parse(input);

  if (usesDatabaseRuntime()) {
    const updated = await updateTreeDetailsDb(accountId, data);
    revalidateTree(updated.slug);
    return updated;
  }

  const store = getEditableTree(accountId);
  const oldSlug = store.tree.slug;
  const nextSlug = slugify(data.slug?.trim() || data.name);

  assertTreeId(data.treeId, store.tree.id);

  store.tree.name = data.name;
  store.tree.description = data.description ?? null;
  store.tree.slug = nextSlug;
  store.tree.updatedAt = getTreeUpdateStamp();
  revalidateTree(store.tree.slug, oldSlug);
  return store.tree;
}

export async function toggleTreePublic(input: z.input<typeof treeSharingSchema>) {
  const accountId = await requireAccountSession();
  const data = treeSharingSchema.parse(input);

  if (usesDatabaseRuntime()) {
    const nextState = await toggleTreePublicDb(accountId, data);
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return nextState;
  }

  const store = getEditableTree(accountId);
  assertTreeId(data.treeId, store.tree.id);

  store.tree.isPublic = data.isPublic;
  store.tree.updatedAt = getTreeUpdateStamp();
  revalidateTree(store.tree.slug);
  return store.tree.isPublic;
}

export async function regenerateShareToken(treeId: string) {
  const accountId = await requireAccountSession();

  if (usesDatabaseRuntime()) {
    const token = await regenerateShareTokenDb(accountId, treeId);
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return token;
  }

  const store = getEditableTree(accountId);
  assertTreeId(treeId, store.tree.id);

  store.tree.shareToken = createShareToken();
  store.tree.updatedAt = getTreeUpdateStamp();
  revalidateTree(store.tree.slug);
  return store.tree.shareToken;
}

export async function createPerson(input: z.input<typeof personSchema>) {
  const accountId = await requireAccountSession();
  const data = personSchema.parse(input);

  if (usesDatabaseRuntime()) {
    const personId = await createPersonDb(accountId, data);
    revalidatePath("/directory");
    revalidatePath("/dashboard");
    return personId;
  }

  const store = getEditableTree(accountId);
  assertTreeId(data.treeId, store.tree.id);
  const id = crypto.randomUUID();
  const now = getTreeUpdateStamp();

  store.people.push({
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

  revalidateTree(store.tree.slug);
  return id;
}

export async function updatePerson(input: z.input<typeof personSchema>) {
  const accountId = await requireAccountSession();
  const data = personSchema.parse(input);

  if (usesDatabaseRuntime()) {
    await updatePersonDb(accountId, data);
    revalidatePath(`/person/${data.id}`);
    revalidatePath(`/person/${data.id}/edit`);
    revalidatePath("/directory");
    return;
  }

  const store = getEditableTree(accountId);
  assertTreeId(data.treeId, store.tree.id);

  const person = store.people.find((item) => item.id === data.id);

  if (!person) {
    throw new Error("Person not found");
  }

  Object.assign(person, {
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
    updatedAt: getTreeUpdateStamp(),
  });

  revalidateTree(store.tree.slug);
}

export async function deletePerson(personId: string) {
  const accountId = await requireAccountSession();

  if (usesDatabaseRuntime()) {
    await deletePersonDb(accountId, personId);
    revalidatePath("/directory");
    revalidatePath("/dashboard");
    revalidatePath("/canvas");
    return;
  }

  const store = getEditableTree(accountId);

  store.people = store.people.filter((person) => person.id !== personId);
  store.events = store.events.filter((event) => event.personId !== personId);
  store.lineageMembers = store.lineageMembers.filter((member) => member.personId !== personId);
  store.externalIds = store.externalIds.filter(
    (record) => !(record.subjectType === "person" && record.subjectId === personId),
  );
  const removedClaimIds = store.claims
    .filter((claim) => claim.subjectType === "person" && claim.subjectId === personId)
    .map((claim) => claim.id);
  store.claims = store.claims.filter(
    (claim) => !(claim.subjectType === "person" && claim.subjectId === personId),
  );
  store.citations = store.citations.filter((citation) => !removedClaimIds.includes(citation.claimId));
  store.reviewIssues = store.reviewIssues.filter(
    (issue) => !(issue.subjectType === "person" && issue.subjectId === personId),
  );
  store.families = store.families.filter(
    (family) => family.spouse1Id !== personId && family.spouse2Id !== personId,
  );
  store.familyChildren = store.familyChildren.filter((child) => child.childId !== personId);
  revalidateTree(store.tree.slug);
}

export async function createFamily(input: z.input<typeof familySchema>) {
  const accountId = await requireAccountSession();
  const data = familySchema.parse(input);

  if (usesDatabaseRuntime()) {
    const familyId = await createFamilyDb(accountId, data);
    revalidatePath("/canvas");
    revalidatePath("/directory");
    return familyId;
  }

  const store = getEditableTree(accountId);
  assertTreeId(data.treeId, store.tree.id);
  const id = crypto.randomUUID();

  store.families.push({
    id,
    treeId: data.treeId,
    spouse1Id: data.spouse1Id,
    spouse2Id: data.spouse2Id ?? null,
    marriageDateText: data.marriageDateText ?? null,
    marriageDateNormalized: data.marriageDateNormalized ?? null,
    marriagePlace: data.marriagePlace ?? null,
  });

  revalidateTree(store.tree.slug);
  return id;
}

export async function addChild(input: z.input<typeof childSchema>) {
  const accountId = await requireAccountSession();
  const data = childSchema.parse(input);

  if (usesDatabaseRuntime()) {
    await addChildDb(accountId, data);
    revalidatePath("/canvas");
    revalidatePath("/directory");
    return;
  }

  const store = getEditableTree(accountId);
  const family = store.families.find((item) => item.id === data.familyId);

  if (!family) {
    throw new Error("Family not found");
  }

  const existing = store.familyChildren.find(
    (item) => item.familyId === data.familyId && item.childId === data.childId,
  );

  if (existing) {
    return;
  }

  store.familyChildren.push({
    familyId: data.familyId,
    childId: data.childId,
    order:
      data.order ??
      store.familyChildren.filter((item) => item.familyId === data.familyId).length + 1,
    relationshipType: "biological",
  });

  revalidateTree(store.tree.slug);
}

export async function removeChild(input: z.input<typeof familyChildRemovalSchema>) {
  const accountId = await requireAccountSession();
  const data = familyChildRemovalSchema.parse(input);

  if (usesDatabaseRuntime()) {
    await removeChildDb(accountId, data.familyId, data.childId);
    revalidatePath("/canvas");
    revalidatePath("/directory");
    return;
  }

  const store = getEditableTree(accountId);

  store.familyChildren = store.familyChildren.filter(
    (item) => !(item.familyId === data.familyId && item.childId === data.childId),
  );
  revalidateTree(store.tree.slug);
}

export async function setParents(input: z.input<typeof parentsSchema>) {
  const accountId = await requireAccountSession();
  const data = parentsSchema.parse(input);

  if (usesDatabaseRuntime()) {
    await setParentsDb(accountId, data);
    revalidatePath("/canvas");
    revalidatePath("/directory");
    return;
  }

  const store = getEditableTree(accountId);
  assertTreeId(data.treeId, store.tree.id);

  const primaryParent = data.fatherId ?? data.motherId;
  const secondaryParent =
    primaryParent === data.fatherId ? data.motherId ?? null : data.fatherId ?? null;

  if (!primaryParent) {
    throw new Error("At least one parent is required");
  }

  const existingFamily = store.families.find((family) => {
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

  store.familyChildren = store.familyChildren.filter((item) => item.childId !== data.personId);

  const familyId =
    existingFamily?.id ??
    (await createFamily({
      treeId: data.treeId,
      spouse1Id: primaryParent,
      spouse2Id: secondaryParent,
    }));

  const alreadyLinked = store.familyChildren.some(
    (item) => item.familyId === familyId && item.childId === data.personId,
  );

  if (!alreadyLinked) {
    store.familyChildren.push({
      familyId,
      childId: data.personId,
      order: 1,
      relationshipType: "biological",
    });
  }

  revalidateTree(store.tree.slug);
}

export async function createOrUpdateEvent(input: z.input<typeof eventSchema>) {
  const accountId = await requireAccountSession();
  const data = eventSchema.parse(input);

  if (usesDatabaseRuntime()) {
    const eventId = await createOrUpdateEventDb(accountId, data);
    revalidatePath(`/person/${data.personId}`);
    revalidatePath(`/person/${data.personId}/edit`);
    revalidatePath("/canvas");
    return eventId;
  }

  const store = getEditableTree(accountId);
  assertTreeId(data.treeId, store.tree.id);

  const existing = store.events.find((event) => event.id === data.id);

  if (existing) {
    Object.assign(existing, {
      personId: data.personId,
      type: data.type,
      dateText: data.dateText ?? null,
      dateNormalized: data.dateNormalized ?? null,
      place: data.place ?? null,
      description: data.description ?? null,
    });
    revalidateTree(store.tree.slug);
    return existing.id;
  }

  const eventId = crypto.randomUUID();

  store.events.push({
    id: eventId,
    treeId: data.treeId,
    personId: data.personId,
    type: data.type,
    dateText: data.dateText ?? null,
    dateNormalized: data.dateNormalized ?? null,
    place: data.place ?? null,
    description: data.description ?? null,
  });

  revalidateTree(store.tree.slug);
  return eventId;
}

export async function deleteEvent(eventId: string) {
  const accountId = await requireAccountSession();

  if (usesDatabaseRuntime()) {
    await deleteEventDb(accountId, eventId);
    revalidatePath("/canvas");
    revalidatePath("/directory");
    return;
  }

  const store = getEditableTree(accountId);
  store.events = store.events.filter((event) => event.id !== eventId);
  store.reviewIssues = store.reviewIssues.filter(
    (issue) => !(issue.subjectType === "event" && issue.subjectId === eventId),
  );
  revalidateTree(store.tree.slug);
}

export async function createOrUpdateLineage(input: z.input<typeof lineageSchema>) {
  const accountId = await requireAccountSession();
  const data = lineageSchema.parse(input);

  if (usesDatabaseRuntime()) {
    const lineageId = await createOrUpdateLineageDb(accountId, data);
    revalidatePath("/lineages");
    revalidatePath("/directory");
    revalidatePath("/canvas");
    return lineageId;
  }

  const store = getEditableTree(accountId);
  assertTreeId(data.treeId, store.tree.id);

  const existing = store.lineages.find((lineage) => lineage.id === data.id);

  if (existing) {
    existing.name = data.name;
    existing.description = data.description ?? null;
    revalidateTree(store.tree.slug);
    return existing.id;
  }

  const lineageId = crypto.randomUUID();

  store.lineages.push({
    id: lineageId,
    treeId: data.treeId,
    name: data.name,
    description: data.description ?? null,
  });

  revalidateTree(store.tree.slug);
  return lineageId;
}

export async function updateLineageMembers(input: z.input<typeof lineageMembersSchema>) {
  const accountId = await requireAccountSession();
  const data = lineageMembersSchema.parse(input);

  if (usesDatabaseRuntime()) {
    await updateLineageMembersDb(accountId, data);
    revalidatePath("/lineages");
    revalidatePath("/directory");
    revalidatePath("/canvas");
    return;
  }

  const store = getEditableTree(accountId);
  const lineage = store.lineages.find((item) => item.id === data.lineageId);

  if (!lineage) {
    throw new Error("Lineage not found");
  }

  const uniqueMemberIds = [...new Set(data.memberIds)];
  store.lineageMembers = store.lineageMembers.filter(
    (member) => member.lineageId !== data.lineageId,
  );

  uniqueMemberIds.forEach((personId, index) => {
    store.lineageMembers.push({
      lineageId: data.lineageId,
      personId,
      order: index + 1,
    });
  });

  revalidateTree(store.tree.slug);
}

export async function deleteLineage(lineageId: string) {
  const accountId = await requireAccountSession();

  if (usesDatabaseRuntime()) {
    await deleteLineageDb(accountId, lineageId);
    revalidatePath("/lineages");
    revalidatePath("/directory");
    revalidatePath("/canvas");
    return;
  }

  const store = getEditableTree(accountId);

  store.lineages = store.lineages.filter((lineage) => lineage.id !== lineageId);
  store.lineageMembers = store.lineageMembers.filter((member) => member.lineageId !== lineageId);
  revalidateTree(store.tree.slug);
}

export async function deleteFamily(familyId: string) {
  const accountId = await requireAccountSession();

  if (usesDatabaseRuntime()) {
    await deleteFamilyDb(accountId, familyId);
    revalidatePath("/canvas");
    revalidatePath("/directory");
    return;
  }

  const store = getEditableTree(accountId);

  store.families = store.families.filter((family) => family.id !== familyId);
  store.familyChildren = store.familyChildren.filter((child) => child.familyId !== familyId);
  store.externalIds = store.externalIds.filter(
    (record) => !(record.subjectType === "family" && record.subjectId === familyId),
  );
  const removedClaimIds = store.claims
    .filter((claim) => claim.subjectType === "family" && claim.subjectId === familyId)
    .map((claim) => claim.id);
  store.claims = store.claims.filter(
    (claim) => !(claim.subjectType === "family" && claim.subjectId === familyId),
  );
  store.citations = store.citations.filter((citation) => !removedClaimIds.includes(citation.claimId));
  store.reviewIssues = store.reviewIssues.filter(
    (issue) => !(issue.subjectType === "family" && issue.subjectId === familyId),
  );
  revalidateTree(store.tree.slug);
}

export async function resolveReviewIssue(input: z.input<typeof issueSchema>) {
  const accountId = await requireAccountSession();
  const data = issueSchema.parse(input);

  if (usesDatabaseRuntime()) {
    await resolveReviewIssueDb(accountId, data);
    revalidatePath("/import");
    revalidatePath("/settings");
    return;
  }

  const store = getEditableTree(accountId);
  const issue = store.reviewIssues.find((item) => item.id === data.issueId);

  if (!issue) {
    throw new Error("Issue not found");
  }

  issue.status = data.status;
  issue.resolutionNote = data.resolutionNote ?? null;
  issue.resolvedAt = data.status === "resolved" ? getTreeUpdateStamp() : null;
  revalidateTree(store.tree.slug);
}

export async function confirmGedcomImport(input: z.input<typeof importConfirmSchema>) {
  const accountId = await requireAccountSession();
  const data = importConfirmSchema.parse(input);

  if (usesDatabaseRuntime()) {
    const job = await confirmGedcomImportDb(accountId, data.jobId);
    revalidatePath("/import");
    revalidatePath("/directory");
    revalidatePath("/canvas");
    return job;
  }

  const store = getEditableTree(accountId);
  const job = store.importJobs.find((item) => item.id === data.jobId);

  if (!job) {
    throw new Error("Import job not found");
  }

  if (job.status === "confirmed") {
    return job;
  }

  const payload = parseImportPayload(job.payloadJson);

  store.people.push(...payload.people);
  store.families.push(...payload.families);
  store.familyChildren.push(...payload.familyChildren);
  store.events.push(...payload.events);
  store.externalIds.push(...payload.externalIds);
  store.reviewIssues.push(...payload.issues);

  job.status = "confirmed";
  job.payloadJson = null;
  revalidateTree(store.tree.slug);
  return job;
}

export async function resetDemoArchive() {
  const accountId = await requireAccountSession();

  if (usesDatabaseRuntime()) {
    throw new Error("Demo reset is unavailable when the live backend is active.");
  }

  getEditableTree(accountId);

  const store = resetDemoStore();
  revalidateTree(store.tree.slug);
}
