import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  accounts,
  citations,
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
  sources,
  trees,
} from "@/db/schema";
import { demoBundle } from "@/lib/data/demo-tree";
import { resetDemoStore } from "@/lib/data/demo-store";
import { hasConfiguredBackend } from "@/lib/runtime";

export async function seedDemoData() {
  resetDemoStore();

  if (!hasConfiguredBackend()) {
    return demoBundle;
  }

  const db = getDb();

  if (!db) {
    return demoBundle;
  }

  const existingTree = await db.query.trees.findFirst({
    where: eq(trees.id, demoBundle.tree.id),
  });

  if (existingTree) {
    await db.delete(trees).where(eq(trees.id, demoBundle.tree.id));
  }

  const existingAccount = await db.query.accounts.findFirst({
    where: eq(accounts.id, demoBundle.account.id),
  });

  if (existingAccount) {
    await db
      .update(accounts)
      .set({
        email: demoBundle.account.email,
        displayName: demoBundle.account.displayName,
        avatarUrl: demoBundle.account.avatarUrl ?? null,
        plan: demoBundle.account.plan,
      })
      .where(eq(accounts.id, demoBundle.account.id));
  } else {
    await db.insert(accounts).values({
      id: demoBundle.account.id,
      email: demoBundle.account.email,
      displayName: demoBundle.account.displayName,
      avatarUrl: demoBundle.account.avatarUrl ?? null,
      createdAt: new Date(demoBundle.account.createdAt),
      plan: demoBundle.account.plan,
    });
  }

  await db.insert(trees).values({
    id: demoBundle.tree.id,
    accountId: demoBundle.tree.accountId,
    name: demoBundle.tree.name,
    slug: demoBundle.tree.slug,
    description: demoBundle.tree.description ?? null,
    themeLayout: demoBundle.tree.themeLayout,
    themeSkin: demoBundle.tree.themeSkin,
    isPublic: demoBundle.tree.isPublic,
    shareToken: demoBundle.tree.shareToken,
    createdAt: new Date(demoBundle.tree.createdAt),
    updatedAt: new Date(demoBundle.tree.updatedAt),
  });

  await db.insert(people).values(
    demoBundle.people.map((person) => ({
      ...person,
      suffix: person.suffix ?? null,
      birthDateText: person.birthDateText ?? null,
      birthDateNormalized: person.birthDateNormalized ?? null,
      birthPlace: person.birthPlace ?? null,
      deathDateText: person.deathDateText ?? null,
      deathDateNormalized: person.deathDateNormalized ?? null,
      deathPlace: person.deathPlace ?? null,
      summary: person.summary ?? null,
      biographyMd: person.biographyMd ?? null,
      createdAt: new Date(person.createdAt),
      updatedAt: new Date(person.updatedAt),
    })),
  );

  await db.insert(families).values(demoBundle.families);
  await db.insert(familyChildren).values(demoBundle.familyChildren);
  await db.insert(events).values(demoBundle.events);
  await db.insert(lineages).values(demoBundle.lineages);
  await db.insert(lineageMembers).values(demoBundle.lineageMembers);
  await db.insert(sources).values(
    demoBundle.sources.map((source) => ({
      ...source,
      author: source.author ?? null,
      url: source.url ?? null,
      notes: source.notes ?? null,
      createdAt: new Date(source.createdAt),
    })),
  );
  await db.insert(claims).values(
    demoBundle.claims.map((claim) => ({
      ...claim,
      notes: claim.notes ?? null,
      createdAt: new Date(claim.createdAt),
    })),
  );
  await db.insert(citations).values(
    demoBundle.citations.map((citation) => ({
      ...citation,
      page: citation.page ?? null,
      notes: citation.notes ?? null,
    })),
  );
  await db.insert(reviewIssues).values(
    demoBundle.reviewIssues.map((issue) => ({
      ...issue,
      resolutionNote: issue.resolutionNote ?? null,
      createdAt: new Date(issue.createdAt),
      resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : null,
    })),
  );
  await db.insert(externalIds).values(demoBundle.externalIds);
  await db.insert(importJobs).values(
    demoBundle.importJobs.map((job) => ({
      ...job,
      storagePath: job.storagePath ?? null,
      payloadJson: job.payloadJson ? JSON.parse(job.payloadJson) : null,
      counts: job.counts,
      issues: job.issues,
      createdAt: new Date(job.createdAt),
      expiresAt: new Date(job.expiresAt),
    })),
  );

  return demoBundle;
}
