"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { requireAccountSession } from "@/lib/auth/session";
import { getTreeBundle } from "@/lib/data/demo-store";
import { usesDatabaseRuntime } from "@/lib/data/runtime-store";
import {
  commitParsedGedcomToBundle,
  type CommitImportResult,
} from "@/lib/import/commit-import";
import { parseGedcomText } from "@/lib/import/gedcom-parser";
import { log } from "@/lib/logger";
import {
  commitPilotGedcomImport,
  getPilotProject,
  PilotDomainError,
  resolvePilotActorForIdentity,
  setPilotProjectTheme,
  updatePilotCuration,
  updatePilotProjectDetails,
} from "@/lib/pilot/store";
import type {
  PilotBranding,
  PilotImportIssue,
  PilotWelcome,
} from "@/lib/pilot/types";
import type { ReviewIssue } from "@/lib/types";

/** Beyond this the issue list stops being reviewable and becomes noise. */
const MAX_DISPLAYED_ISSUES = 50;
const MAX_GEDCOM_BYTES = 20 * 1024 * 1024;

export type PilotImportActionResult =
  | {
      ok: true;
      peopleCount: number;
      familyCount: number;
      hiddenLivingCount: number;
      presentablePeopleCount: number;
      lineageCount: number;
      issueCount: number;
    }
  | { ok: false; error: string };

function toPilotIssue(issue: ReviewIssue): PilotImportIssue {
  const severity =
    issue.type === "parse_error"
      ? ("blocking" as const)
      : issue.type === "missing_data"
        ? ("info" as const)
        : ("warning" as const);

  const title =
    issue.type === "parse_error"
      ? "Record could not be parsed"
      : issue.type === "duplicate"
        ? "Possible duplicate person"
        : issue.type === "conflict"
          ? "Conflicting information"
          : "Missing information";

  return {
    id: issue.id,
    subjectType: issue.subjectType,
    subjectId: issue.subjectId,
    severity,
    title,
    description: issue.description,
    status:
      issue.status === "resolved"
        ? "resolved"
        : issue.status === "dismissed"
          ? "acknowledged"
          : "open",
  };
}

/**
 * Opening copy drawn from the file itself. The genealogist rewrites this during
 * curation, but it must never arrive still describing the demo family.
 */
function buildWelcomeFromImport(result: CommitImportResult) {
  const familyName = result.dominantSurname
    ? `The ${result.dominantSurname} Family`
    : "A Family Archive";

  const span =
    result.earliestYear && result.latestYear && result.latestYear > result.earliestYear
      ? `${result.earliestYear}–${result.latestYear}`
      : null;

  const headline = span
    ? `${result.presentablePeopleCount} lives, ${span}.`
    : `${result.presentablePeopleCount} lives, kept together.`;

  const introduction = [
    `This private archive gathers ${result.presentablePeopleCount} people`,
    result.familyCount ? ` across ${result.familyCount} family groups` : "",
    span ? `, spanning ${span}` : "",
    ". Begin with a single person and follow the branches from there.",
  ].join("");

  return {
    eyebrow: "A private family archive",
    familyName,
    headline,
    introduction,
    primaryActionLabel: "Discover an ancestor",
  };
}

function revalidatePilotSurfaces(projectRef: string, slug: string) {
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectRef}`);
  revalidatePath(`/projects/${projectRef}/import`);
  revalidatePath(`/projects/${projectRef}/curate`);
  revalidatePath(`/projects/${projectRef}/review`);
  revalidatePath(`/projects/${projectRef}/preview`, "layout");
  revalidatePath(`/s/${slug}`, "layout");
}

/**
 * Parse a real GEDCOM into the working tree and record the result against the
 * pilot project. The file is read in memory and never written to disk.
 */
export async function importPilotGedcomAction(
  formData: FormData,
): Promise<PilotImportActionResult> {
  const projectRef = String(formData.get("projectRef") ?? "").trim();
  const file = formData.get("file");

  if (!projectRef) {
    return { ok: false, error: "No project was supplied for this import." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a GEDCOM file to import." };
  }

  if (file.size > MAX_GEDCOM_BYTES) {
    return { ok: false, error: "That GEDCOM is larger than the 20 MB limit." };
  }

  // The showcase reads from the in-memory demo bundle. Against a real database
  // this would silently write nowhere, so refuse rather than mislead.
  if (usesDatabaseRuntime()) {
    return {
      ok: false,
      error:
        "Direct GEDCOM import is available in local presentation mode only. Use the tree import workflow against a provisioned database.",
    };
  }

  const identityId = await requireAccountSession();
  const actorId = resolvePilotActorForIdentity(projectRef, identityId, [
    "operator",
    "genealogist",
  ]);
  const project = getPilotProject(projectRef);

  let parsed;
  try {
    parsed = parseGedcomText({
      treeId: project.treeId,
      content: await file.text(),
    });
  } catch (error) {
    log("error", "GEDCOM parse failed", {
      projectRef,
      fileName: file.name,
      message: error instanceof Error ? error.message : "unknown",
    });
    return {
      ok: false,
      error: "That file could not be read as GEDCOM. Export it again and retry.",
    };
  }

  if (!parsed.people.length) {
    return {
      ok: false,
      error: "No people were found in that file. Confirm it is a GEDCOM export.",
    };
  }

  const result = commitParsedGedcomToBundle({
    bundle: getTreeBundle(project.treeId),
    parsed,
    treeId: project.treeId,
  });

  if (!result.focalPersonId) {
    return {
      ok: false,
      error:
        "Every person in that file is treated as possibly living, so nothing can be presented yet. Add death dates or record consent before importing.",
    };
  }

  commitPilotGedcomImport({
    projectRef,
    actorId,
    welcome: buildWelcomeFromImport(result),
    fileName: file.name,
    peopleCount: result.peopleCount,
    familyCount: result.familyCount,
    sourceCount: 0,
    focalPersonId: result.focalPersonId,
    hiddenLivingCount: result.hiddenLivingCount,
    issues: parsed.issues.slice(0, MAX_DISPLAYED_ISSUES).map(toPilotIssue),
  });

  log("info", "Pilot GEDCOM import committed", {
    projectRef,
    fileName: file.name,
    people: result.peopleCount,
    families: result.familyCount,
    hiddenLiving: result.hiddenLivingCount,
  });

  revalidatePilotSurfaces(projectRef, project.slug);

  return {
    ok: true,
    peopleCount: result.peopleCount,
    familyCount: result.familyCount,
    hiddenLivingCount: result.hiddenLivingCount,
    presentablePeopleCount: result.presentablePeopleCount,
    lineageCount: result.lineageCount,
    issueCount: parsed.issues.length,
  };
}

export async function updatePilotProjectDetailsAction(input: {
  projectRef: string;
  title: string;
  clientLabel: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const identityId = await requireAccountSession();
  const actorId = resolvePilotActorForIdentity(input.projectRef, identityId, [
    "operator",
    "genealogist",
  ]);

  try {
    const project = updatePilotProjectDetails({ ...input, actorId });
    revalidatePilotSurfaces(project.id, project.slug);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toActionError(error, "Those project details are not valid.") };
  }
}

export async function updatePilotCurationAction(input: {
  projectRef: string;
  welcome: Pick<
    PilotWelcome,
    "eyebrow" | "familyName" | "headline" | "introduction" | "primaryActionLabel"
  >;
  branding: Pick<PilotBranding, "practiceName" | "byline">;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const identityId = await requireAccountSession();
  const actorId = resolvePilotActorForIdentity(input.projectRef, identityId, [
    "operator",
    "genealogist",
  ]);

  try {
    const project = updatePilotCuration({ ...input, actorId });
    revalidatePilotSurfaces(project.id, project.slug);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toActionError(error, "Those presentation details are not valid."),
    };
  }
}

/** Surface a usable message for the two expected failure shapes; rethrow the rest. */
function toActionError(error: unknown, fallback: string) {
  if (error instanceof PilotDomainError) {
    return error.message;
  }
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallback;
  }
  throw error;
}

export async function updatePilotThemeAction(input: {
  projectRef: string;
  themeId: PilotBranding["themeId"];
}) {
  const identityId = await requireAccountSession();
  const actorId = resolvePilotActorForIdentity(input.projectRef, identityId, [
    "operator",
    "genealogist",
  ]);
  const project = setPilotProjectTheme({ ...input, actorId });
  revalidatePilotSurfaces(project.id, project.slug);

  return { ok: true as const, themeId: project.branding.themeId };
}
