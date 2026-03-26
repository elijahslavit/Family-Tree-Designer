import type {
  Account,
  ClaimRecord,
  CitationRecord,
  EventRecord,
  ExternalId,
  Family,
  FamilyChild,
  ImportJob,
  Lineage,
  LineageMember,
  Person,
  ReviewIssue,
  SourceRecord,
  Tree,
} from "@/lib/types";
import {
  accounts,
  claims,
  citations,
  events,
  externalIds,
  families,
  familyChildren,
  importJobs,
  lineageMembers,
  lineages,
  people,
  reviewIssues,
  sources,
  trees,
} from "@/db/schema";

function toIso(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

export function normalizeAccount(row: typeof accounts.$inferSelect): Account {
  return {
    ...row,
    avatarUrl: row.avatarUrl ?? null,
    createdAt: toIso(row.createdAt) ?? new Date(0).toISOString(),
    plan: row.plan as Account["plan"],
  };
}

export function normalizeTree(row: typeof trees.$inferSelect): Tree {
  return {
    ...row,
    description: row.description ?? null,
    themeLayout: row.themeLayout as Tree["themeLayout"],
    themeSkin: row.themeSkin as Tree["themeSkin"],
    createdAt: toIso(row.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIso(row.updatedAt) ?? new Date(0).toISOString(),
  };
}

export function normalizePerson(row: typeof people.$inferSelect): Person {
  return {
    ...row,
    suffix: row.suffix ?? null,
    gender: row.gender as Person["gender"],
    birthDateText: row.birthDateText ?? null,
    birthPlace: row.birthPlace ?? null,
    deathDateText: row.deathDateText ?? null,
    deathPlace: row.deathPlace ?? null,
    summary: row.summary ?? null,
    biographyMd: row.biographyMd ?? null,
    createdAt: toIso(row.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIso(row.updatedAt) ?? new Date(0).toISOString(),
  };
}

export function normalizeFamily(row: typeof families.$inferSelect): Family {
  return {
    ...row,
    spouse2Id: row.spouse2Id ?? null,
    marriageDateText: row.marriageDateText ?? null,
    marriageDateNormalized: row.marriageDateNormalized ?? null,
    marriagePlace: row.marriagePlace ?? null,
  };
}

export function normalizeFamilyChild(row: typeof familyChildren.$inferSelect): FamilyChild {
  return {
    ...row,
    order: row.order ?? null,
    relationshipType: row.relationshipType as FamilyChild["relationshipType"],
  };
}

export function normalizeEvent(row: typeof events.$inferSelect): EventRecord {
  return {
    ...row,
    dateText: row.dateText ?? null,
    dateNormalized: row.dateNormalized ?? null,
    place: row.place ?? null,
    description: row.description ?? null,
  };
}

export function normalizeLineage(row: typeof lineages.$inferSelect): Lineage {
  return {
    ...row,
    description: row.description ?? null,
  };
}

export function normalizeLineageMember(row: typeof lineageMembers.$inferSelect): LineageMember {
  return row;
}

export function normalizeSource(row: typeof sources.$inferSelect): SourceRecord {
  return {
    ...row,
    author: row.author ?? null,
    url: row.url ?? null,
    notes: row.notes ?? null,
    createdAt: toIso(row.createdAt) ?? new Date(0).toISOString(),
  };
}

export function normalizeClaim(row: typeof claims.$inferSelect): ClaimRecord {
  return {
    ...row,
    subjectType: row.subjectType as ClaimRecord["subjectType"],
    confidence: row.confidence as ClaimRecord["confidence"],
    notes: row.notes ?? null,
    createdAt: toIso(row.createdAt) ?? new Date(0).toISOString(),
  };
}

export function normalizeCitation(row: typeof citations.$inferSelect): CitationRecord {
  return {
    ...row,
    page: row.page ?? null,
    notes: row.notes ?? null,
  };
}

export function normalizeReviewIssue(row: typeof reviewIssues.$inferSelect): ReviewIssue {
  return {
    ...row,
    type: row.type as ReviewIssue["type"],
    subjectType: row.subjectType as ReviewIssue["subjectType"],
    status: row.status as ReviewIssue["status"],
    resolutionNote: row.resolutionNote ?? null,
    createdAt: toIso(row.createdAt) ?? new Date(0).toISOString(),
    resolvedAt: toIso(row.resolvedAt),
  };
}

export function normalizeExternalId(row: typeof externalIds.$inferSelect): ExternalId {
  return {
    ...row,
    subjectType: row.subjectType as ExternalId["subjectType"],
    system: row.system as ExternalId["system"],
  };
}

export function normalizeImportJob(row: typeof importJobs.$inferSelect): ImportJob {
  return {
    ...row,
    storagePath: row.storagePath ?? null,
    status: row.status as ImportJob["status"],
    payloadJson: row.payloadJson == null ? null : JSON.stringify(row.payloadJson),
    counts: row.counts as ImportJob["counts"],
    issues: row.issues as ReviewIssue[],
    createdAt: toIso(row.createdAt) ?? new Date(0).toISOString(),
    expiresAt: toIso(row.expiresAt) ?? new Date(0).toISOString(),
  };
}
