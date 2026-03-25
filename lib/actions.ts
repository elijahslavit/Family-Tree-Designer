"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAccountSession } from "@/lib/auth/session";
import { getDemoStore } from "@/lib/data/demo-store";
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
  themeSkin: z.enum(["dark-gold", "parchment", "modern"]),
});

const treeSharingSchema = z.object({
  treeId: z.string(),
  isPublic: z.boolean(),
});

const treeDetailsSchema = z.object({
  treeId: z.string(),
  name: z.string().min(2),
  description: z.string().nullable().optional(),
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

function revalidateTree(slug: string) {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/directory");
  revalidatePath("/canvas");
  revalidatePath("/theme");
  revalidatePath("/settings");
  revalidatePath(`/t/${slug}`);
  revalidatePath(`/t/${slug}/canvas`);
}

export async function updateTreeTheme(input: z.input<typeof treeThemeSchema>) {
  const accountId = await requireAccountSession();
  const data = treeThemeSchema.parse(input);
  const store = getEditableTree(accountId);

  if (store.tree.id !== data.treeId) {
    throw new Error("Tree not found");
  }

  store.tree.themeLayout = data.themeLayout;
  store.tree.themeSkin = data.themeSkin;
  store.tree.updatedAt = new Date().toISOString();
  revalidateTree(store.tree.slug);
}

export async function updateTreeDetails(input: z.input<typeof treeDetailsSchema>) {
  const accountId = await requireAccountSession();
  const data = treeDetailsSchema.parse(input);
  const store = getEditableTree(accountId);

  if (store.tree.id !== data.treeId) {
    throw new Error("Tree not found");
  }

  store.tree.name = data.name;
  store.tree.description = data.description;
  store.tree.slug = slugify(data.name);
  store.tree.updatedAt = new Date().toISOString();
  revalidateTree(store.tree.slug);
}

export async function toggleTreePublic(input: z.input<typeof treeSharingSchema>) {
  const accountId = await requireAccountSession();
  const data = treeSharingSchema.parse(input);
  const store = getEditableTree(accountId);

  if (store.tree.id !== data.treeId) {
    throw new Error("Tree not found");
  }

  store.tree.isPublic = data.isPublic;
  store.tree.updatedAt = new Date().toISOString();
  revalidateTree(store.tree.slug);
}

export async function regenerateShareToken(treeId: string) {
  const accountId = await requireAccountSession();
  const store = getEditableTree(accountId);

  if (store.tree.id !== treeId) {
    throw new Error("Tree not found");
  }

  store.tree.shareToken = createShareToken();
  store.tree.updatedAt = new Date().toISOString();
  revalidateTree(store.tree.slug);
  return store.tree.shareToken;
}

export async function createPerson(input: z.input<typeof personSchema>) {
  const accountId = await requireAccountSession();
  const data = personSchema.parse(input);
  const store = getEditableTree(accountId);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

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
  const store = getEditableTree(accountId);

  const person = store.people.find((item) => item.id === data.id);

  if (!person) {
    throw new Error("Person not found");
  }

  Object.assign(person, {
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
    updatedAt: new Date().toISOString(),
  });

  revalidateTree(store.tree.slug);
}

export async function deletePerson(personId: string) {
  const accountId = await requireAccountSession();
  const store = getEditableTree(accountId);

  store.people = store.people.filter((person) => person.id !== personId);
  store.events = store.events.filter((event) => event.personId !== personId);
  store.lineageMembers = store.lineageMembers.filter((member) => member.personId !== personId);
  store.externalIds = store.externalIds.filter((record) => record.subjectId !== personId);
  store.families = store.families.filter(
    (family) => family.spouse1Id !== personId && family.spouse2Id !== personId,
  );
  store.familyChildren = store.familyChildren.filter((child) => child.childId !== personId);
  revalidateTree(store.tree.slug);
}

export async function createFamily(input: z.input<typeof familySchema>) {
  const accountId = await requireAccountSession();
  const data = familySchema.parse(input);
  const store = getEditableTree(accountId);
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
  const store = getEditableTree(accountId);

  store.familyChildren.push({
    familyId: data.familyId,
    childId: data.childId,
    order: data.order ?? store.familyChildren.filter((item) => item.familyId === data.familyId).length + 1,
    relationshipType: "biological",
  });

  revalidateTree(store.tree.slug);
}

export async function setParents(input: z.input<typeof parentsSchema>) {
  const accountId = await requireAccountSession();
  const data = parentsSchema.parse(input);
  const store = getEditableTree(accountId);

  const existingFamily = store.families.find(
    (family) =>
      family.spouse1Id === data.fatherId &&
      family.spouse2Id === data.motherId,
  );

  const primaryParent = data.fatherId ?? data.motherId;
  const secondaryParent =
    primaryParent === data.fatherId ? data.motherId : data.fatherId;

  if (!primaryParent) {
    throw new Error("At least one parent is required");
  }

  const familyId =
    existingFamily?.id ??
    (await createFamily({
      treeId: data.treeId,
      spouse1Id: primaryParent,
      spouse2Id: secondaryParent ?? null,
    }));

  store.familyChildren.push({
    familyId,
    childId: data.personId,
    order: store.familyChildren.filter((item) => item.familyId === familyId).length + 1,
    relationshipType: "biological",
  });

  revalidateTree(store.tree.slug);
}

export async function createOrUpdateEvent(input: z.input<typeof eventSchema>) {
  const accountId = await requireAccountSession();
  const data = eventSchema.parse(input);
  const store = getEditableTree(accountId);

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
  } else {
    store.events.push({
      id: crypto.randomUUID(),
      treeId: data.treeId,
      personId: data.personId,
      type: data.type,
      dateText: data.dateText ?? null,
      dateNormalized: data.dateNormalized ?? null,
      place: data.place ?? null,
      description: data.description ?? null,
    });
  }

  revalidateTree(store.tree.slug);
}

export async function deleteEvent(eventId: string) {
  const accountId = await requireAccountSession();
  const store = getEditableTree(accountId);
  store.events = store.events.filter((event) => event.id !== eventId);
  revalidateTree(store.tree.slug);
}

export async function createOrUpdateLineage(input: z.input<typeof lineageSchema>) {
  const accountId = await requireAccountSession();
  const data = lineageSchema.parse(input);
  const store = getEditableTree(accountId);

  const existing = store.lineages.find((lineage) => lineage.id === data.id);

  if (existing) {
    existing.name = data.name;
    existing.description = data.description ?? null;
  } else {
    store.lineages.push({
      id: crypto.randomUUID(),
      treeId: data.treeId,
      name: data.name,
      description: data.description ?? null,
    });
  }

  revalidateTree(store.tree.slug);
}

export async function updateLineageMembers(input: z.input<typeof lineageMembersSchema>) {
  const accountId = await requireAccountSession();
  const data = lineageMembersSchema.parse(input);
  const store = getEditableTree(accountId);

  store.lineageMembers = store.lineageMembers.filter(
    (member) => member.lineageId !== data.lineageId,
  );

  data.memberIds.forEach((personId, index) => {
    store.lineageMembers.push({
      lineageId: data.lineageId,
      personId,
      order: index + 1,
    });
  });

  revalidateTree(store.tree.slug);
}

export async function resolveReviewIssue(input: z.input<typeof issueSchema>) {
  const accountId = await requireAccountSession();
  const data = issueSchema.parse(input);
  const store = getEditableTree(accountId);
  const issue = store.reviewIssues.find((item) => item.id === data.issueId);

  if (!issue) {
    throw new Error("Issue not found");
  }

  issue.status = data.status;
  issue.resolutionNote = data.resolutionNote ?? null;
  issue.resolvedAt = data.status === "resolved" ? new Date().toISOString() : null;
  revalidateTree(store.tree.slug);
}

export async function confirmGedcomImport(input: z.input<typeof importConfirmSchema>) {
  const accountId = await requireAccountSession();
  const data = importConfirmSchema.parse(input);
  const store = getEditableTree(accountId);
  const job = store.importJobs.find((item) => item.id === data.jobId);

  if (!job) {
    throw new Error("Import job not found");
  }

  if (job.payloadJson) {
    const payload = JSON.parse(job.payloadJson) as {
      people: typeof store.people;
      families: typeof store.families;
      familyChildren: typeof store.familyChildren;
      events: typeof store.events;
      externalIds: typeof store.externalIds;
      issues: typeof store.reviewIssues;
    };

    store.people.push(...payload.people);
    store.families.push(...payload.families);
    store.familyChildren.push(...payload.familyChildren);
    store.events.push(...payload.events);
    store.externalIds.push(...payload.externalIds);
    store.reviewIssues.push(...payload.issues);
  }

  job.status = "confirmed";
  revalidateTree(store.tree.slug);
}
