import { notFound } from "next/navigation";

import {
  canAccessTree,
  getCanvasNeighborhoodFromBundle,
  getDashboardDataFromBundle,
  getDefaultPersonIdFromBundle,
  getEventsByPersonFromBundle,
  getFamiliesFromBundle,
  getFamilyByIdFromBundle,
  getFamilyChildrenByTreeFromBundle,
  getImportJobFromBundle,
  getImportJobsFromBundle,
  getLineageByIdFromBundle,
  getLineagesByTreeFromBundle,
  getPeopleByTreeFromBundle,
  getPersonViewFromBundle,
  getReviewIssuesByTreeFromBundle,
} from "@/lib/data/tree-selectors";
import {
  getRuntimeBundleBySlug,
  getRuntimeBundleForCreator,
} from "@/lib/data/runtime-store";
import type {
  DirectoryFilters,
  ReviewIssueStatus,
  ViewerContext,
} from "@/lib/types";

async function getBundleForCreator(accountId: string) {
  const bundle = await getRuntimeBundleForCreator(accountId);

  if (!bundle) {
    notFound();
  }

  return bundle;
}

async function getBundleForTreeSlug(treeSlug: string, viewer: ViewerContext) {
  const bundle = await getRuntimeBundleBySlug(treeSlug);

  if (!bundle || !canAccessTree(bundle.tree, viewer)) {
    notFound();
  }

  return bundle;
}

export async function getTreeBySlug(slug: string, viewer: ViewerContext) {
  const bundle = await getBundleForTreeSlug(slug, viewer);
  return bundle.tree;
}

export async function getActiveTreeForCreator(accountId: string) {
  const bundle = await getBundleForCreator(accountId);
  return bundle.tree;
}

export async function getAccountForCreator(accountId: string) {
  const bundle = await getBundleForCreator(accountId);
  return bundle.account;
}

export async function getDashboardData(accountId: string) {
  const bundle = await getBundleForCreator(accountId);
  return getDashboardDataFromBundle(bundle);
}

export async function getPeopleByTree({
  treeSlug,
  viewer,
  filters = {},
}: {
  treeSlug: string;
  viewer: ViewerContext;
  filters?: DirectoryFilters;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  return getPeopleByTreeFromBundle(bundle, viewer, filters);
}

export async function getPersonById({
  treeSlug,
  personId,
  viewer,
}: {
  treeSlug: string;
  personId: string;
  viewer: ViewerContext;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  const person = getPersonViewFromBundle(bundle, personId, viewer);

  if (!person) {
    notFound();
  }

  return person;
}

export async function getFamiliesByTree({
  treeSlug,
  viewer,
}: {
  treeSlug: string;
  viewer: ViewerContext;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  return getFamiliesFromBundle(bundle);
}

export async function getLineagesByTree({
  treeSlug,
  viewer,
}: {
  treeSlug: string;
  viewer: ViewerContext;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  return getLineagesByTreeFromBundle(bundle, viewer);
}

export async function getEventsByPerson({
  treeSlug,
  personId,
  viewer,
}: {
  treeSlug: string;
  personId: string;
  viewer: ViewerContext;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  const events = getEventsByPersonFromBundle(bundle, personId, viewer);

  if (events === null) {
    notFound();
  }

  return events;
}

export async function getImportJobsByTree({
  treeSlug,
  viewer,
}: {
  treeSlug: string;
  viewer: ViewerContext;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  return getImportJobsFromBundle(bundle);
}

export async function getImportJob({
  treeSlug,
  jobId,
  viewer,
}: {
  treeSlug: string;
  jobId: string;
  viewer: ViewerContext;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  return getImportJobFromBundle(bundle, jobId);
}

export async function getReviewIssuesByTree({
  treeSlug,
  viewer,
  status,
}: {
  treeSlug: string;
  viewer: ViewerContext;
  status?: ReviewIssueStatus;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  return getReviewIssuesByTreeFromBundle(bundle, status);
}

export async function getCanvasNeighborhood({
  treeSlug,
  personId,
  viewer,
  depth = 1,
  lineageId = null,
}: {
  treeSlug: string;
  personId: string;
  viewer: ViewerContext;
  depth?: number;
  lineageId?: string | null;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  const canvas = await getCanvasNeighborhoodFromBundle({
    bundle,
    personId,
    viewer,
    depth,
    lineageId,
  });

  if (!canvas) {
    notFound();
  }

  return canvas;
}

export async function getPublicEntry(treeSlug: string, shareToken: string | null) {
  const viewer: ViewerContext = {
    mode: "viewer",
    shareToken,
  };
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);

  return {
    tree: bundle.tree,
    directory: getPeopleByTreeFromBundle(bundle, viewer),
  };
}

export async function getThemeSnapshot(treeSlug: string, viewer: ViewerContext) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);

  return {
    layout: bundle.tree.themeLayout,
    skin: bundle.tree.themeSkin,
  };
}

export async function getDefaultPersonIdForTree({
  treeSlug,
  viewer,
}: {
  treeSlug: string;
  viewer: ViewerContext;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  return getDefaultPersonIdFromBundle(bundle);
}

export async function getFamilyById(familyId: string, accountId?: string | null) {
  if (accountId) {
    const bundle = await getBundleForCreator(accountId);
    return getFamilyByIdFromBundle(bundle, familyId);
  }

  const bundle = await getRuntimeBundleBySlug("hart-family-archive");
  return bundle ? getFamilyByIdFromBundle(bundle, familyId) : null;
}

export async function getLineageById(lineageId: string, accountId?: string | null) {
  if (accountId) {
    const bundle = await getBundleForCreator(accountId);
    return getLineageByIdFromBundle(bundle, lineageId);
  }

  const bundle = await getRuntimeBundleBySlug("hart-family-archive");
  return bundle ? getLineageByIdFromBundle(bundle, lineageId) : null;
}

export async function getFamilyChildrenByTree({
  treeSlug,
  viewer,
}: {
  treeSlug: string;
  viewer: ViewerContext;
}) {
  const bundle = await getBundleForTreeSlug(treeSlug, viewer);
  return getFamilyChildrenByTreeFromBundle(bundle);
}
