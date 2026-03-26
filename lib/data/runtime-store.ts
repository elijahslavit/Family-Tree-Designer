import { and, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  accounts,
  claims,
  events,
  externalIds,
  families,
  importJobs,
  lineages,
  people,
  reviewIssues,
  sources,
  trees,
} from "@/db/schema";
import {
  normalizeAccount,
  normalizeClaim,
  normalizeCitation,
  normalizeEvent,
  normalizeExternalId,
  normalizeFamily,
  normalizeFamilyChild,
  normalizeImportJob,
  normalizeLineage,
  normalizeLineageMember,
  normalizePerson,
  normalizeReviewIssue,
  normalizeSource,
  normalizeTree,
} from "@/lib/data/db-normalize";
import { getDemoStore } from "@/lib/data/demo-store";
import { hasConfiguredBackend, isDemoMode } from "@/lib/runtime";
import { createShareToken, slugify } from "@/lib/utils/slugs";
import type { TreeBundle } from "@/lib/types";

type AuthAccountSeed = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
};

export function usesDatabaseRuntime() {
  return hasConfiguredBackend() && !isDemoMode();
}

export async function ensureAccountRecord(input: AuthAccountSeed) {
  if (!usesDatabaseRuntime()) {
    return null;
  }

  const db = getDb();

  if (!db) {
    return null;
  }

  const existing = await db.query.accounts.findFirst({
    where: eq(accounts.id, input.id),
  });

  if (existing) {
    const needsUpdate =
      existing.email !== input.email ||
      existing.displayName !== input.displayName ||
      (existing.avatarUrl ?? null) !== (input.avatarUrl ?? null);

    if (needsUpdate) {
      await db
        .update(accounts)
        .set({
          email: input.email,
          displayName: input.displayName,
          avatarUrl: input.avatarUrl ?? null,
        })
        .where(eq(accounts.id, input.id));
    }

    await ensureStarterTree(input.id, input.displayName);

    return existing;
  }

  await db.insert(accounts).values({
    id: input.id,
    email: input.email,
    displayName: input.displayName,
    avatarUrl: input.avatarUrl ?? null,
    plan: "free",
  });

  await ensureStarterTree(input.id, input.displayName);

  return db.query.accounts.findFirst({
    where: eq(accounts.id, input.id),
  });
}

export async function getRuntimeBundleForCreator(accountId: string): Promise<TreeBundle | null> {
  if (!usesDatabaseRuntime()) {
    return getDemoStore();
  }

  const db = getDb();

  if (!db) {
    return getDemoStore();
  }

  const [account, tree] = await Promise.all([
    db.query.accounts.findFirst({
      where: eq(accounts.id, accountId),
    }),
    db.query.trees.findFirst({
      where: eq(trees.accountId, accountId),
    }),
  ]);

  if (!account || !tree) {
    return null;
  }

  return loadTreeBundle(account, tree);
}

export async function getRuntimeBundleBySlug(slug: string): Promise<TreeBundle | null> {
  if (!usesDatabaseRuntime()) {
    const store = getDemoStore();
    return store.tree.slug === slug ? store : null;
  }

  const db = getDb();

  if (!db) {
    return null;
  }

  const tree = await db.query.trees.findFirst({
    where: eq(trees.slug, slug),
  });

  if (!tree) {
    return null;
  }

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, tree.accountId),
  });

  if (!account) {
    return null;
  }

  return loadTreeBundle(account, tree);
}

export async function getRuntimeBundleByTreeId(treeId: string): Promise<TreeBundle | null> {
  if (!usesDatabaseRuntime()) {
    const store = getDemoStore();
    return store.tree.id === treeId ? store : null;
  }

  const db = getDb();

  if (!db) {
    return null;
  }

  const tree = await db.query.trees.findFirst({
    where: eq(trees.id, treeId),
  });

  if (!tree) {
    return null;
  }

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, tree.accountId),
  });

  if (!account) {
    return null;
  }

  return loadTreeBundle(account, tree);
}

async function loadTreeBundle(
  account: typeof accounts.$inferSelect,
  tree: typeof trees.$inferSelect,
): Promise<TreeBundle> {
  const db = getDb();

  if (!db) {
    return getDemoStore();
  }

  const treeId = tree.id;
  const [treePeople, treeFamilies, treeFamilyChildren, treeEvents, treeLineages, treeLineageMembers, treeSources, treeClaims, treeReviewIssues, treeExternalIds, treeImportJobs] =
    await Promise.all([
      db.query.people.findMany({
        where: eq(people.treeId, treeId),
      }),
      db.query.families.findMany({
        where: eq(families.treeId, treeId),
      }),
      db.query.familyChildren.findMany(),
      db.query.events.findMany({
        where: eq(events.treeId, treeId),
      }),
      db.query.lineages.findMany({
        where: eq(lineages.treeId, treeId),
      }),
      db.query.lineageMembers.findMany(),
      db.query.sources.findMany({
        where: eq(sources.treeId, treeId),
      }),
      db.query.claims.findMany({
        where: eq(claims.treeId, treeId),
      }),
      db.query.reviewIssues.findMany({
        where: eq(reviewIssues.treeId, treeId),
      }),
      db.query.externalIds.findMany({
        where: eq(externalIds.treeId, treeId),
      }),
      db.query.importJobs.findMany({
        where: eq(importJobs.treeId, treeId),
      }),
    ]);

  const familyIds = new Set(treeFamilies.map((family) => family.id));
  const lineageIds = new Set(treeLineages.map((lineage) => lineage.id));
  const claimIds = new Set(treeClaims.map((claim) => claim.id));
  const sourceIds = new Set(treeSources.map((source) => source.id));

  const [treeCitations] = await Promise.all([
    db.query.citations.findMany(),
  ]);

  return {
    account: normalizeAccount(account),
    tree: normalizeTree(tree),
    people: treePeople.map(normalizePerson),
    families: treeFamilies.map(normalizeFamily),
    familyChildren: treeFamilyChildren
      .filter((item) => familyIds.has(item.familyId))
      .map(normalizeFamilyChild),
    events: treeEvents.map(normalizeEvent),
    lineages: treeLineages.map(normalizeLineage),
    lineageMembers: treeLineageMembers
      .filter((item) => lineageIds.has(item.lineageId))
      .map(normalizeLineageMember),
    sources: treeSources.map(normalizeSource),
    claims: treeClaims.map(normalizeClaim),
    citations: treeCitations
      .filter(
      (citation) => claimIds.has(citation.claimId) || sourceIds.has(citation.sourceId),
    )
      .map(normalizeCitation),
    reviewIssues: treeReviewIssues.map(normalizeReviewIssue),
    externalIds: treeExternalIds.map(normalizeExternalId),
    importJobs: treeImportJobs.map(normalizeImportJob),
  };
}

export async function getOwnedTreeRecord(accountId: string, treeId: string) {
  const db = getDb();

  if (!db) {
    return null;
  }

  return db.query.trees.findFirst({
    where: and(eq(trees.id, treeId), eq(trees.accountId, accountId)),
  });
}

async function ensureStarterTree(accountId: string, displayName: string) {
  const db = getDb();

  if (!db) {
    return null;
  }

  const existingTree = await db.query.trees.findFirst({
    where: eq(trees.accountId, accountId),
  });

  if (existingTree) {
    return existingTree;
  }

  const baseName = createStarterTreeName(displayName);
  const baseSlug = slugify(baseName) || "family-tree";
  const slug = await getUniqueTreeSlug(baseSlug);

  await db.insert(trees).values({
    accountId,
    name: baseName,
    slug,
    description: "A new family archive ready for people, stories, and lineages.",
    themeLayout: "editorial",
    themeSkin: "dark-gold",
    isPublic: false,
    shareToken: createShareToken(),
  });

  return db.query.trees.findFirst({
    where: and(eq(trees.accountId, accountId), eq(trees.slug, slug)),
  });
}

function createStarterTreeName(displayName: string) {
  const trimmed = displayName.trim();

  if (!trimmed) {
    return "Family Tree";
  }

  return trimmed.endsWith("s")
    ? `${trimmed}' Family Tree`
    : `${trimmed}'s Family Tree`;
}

async function getUniqueTreeSlug(baseSlug: string) {
  const db = getDb();

  if (!db) {
    return baseSlug;
  }

  let slug = baseSlug;
  let attempt = 2;

  while (true) {
    const existingTree = await db.query.trees.findFirst({
      where: eq(trees.slug, slug),
    });

    if (!existingTree) {
      return slug;
    }

    slug = `${baseSlug}-${attempt}`;
    attempt += 1;
  }
}
