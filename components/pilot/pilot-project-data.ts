import "server-only";

import { notFound } from "next/navigation";

import type { PilotWorkspaceProject } from "@/components/pilot/pilot-workspace-shell";
import { requireAccountSession } from "@/lib/auth/session";
import { getPilotProject, getPilotWorkspace, PilotDomainError } from "@/lib/pilot/store";
import { PILOT_WORKFLOW, type PilotProject } from "@/lib/pilot/types";

const CREATOR_PROJECT_ROLES = new Set(["operator", "genealogist"]);

function hasCreatorProjectAccess(
  project: PilotProject,
  identityId: string,
  now = new Date(),
) {
  return project.roles.some((assignment) => {
    if (
      assignment.identityId !== identityId ||
      assignment.status !== "active" ||
      !CREATOR_PROJECT_ROLES.has(assignment.role)
    ) {
      return false;
    }

    return !assignment.expiresAt || new Date(assignment.expiresAt) > now;
  });
}

export async function loadPilotWorkspace() {
  const identityId = await requireAccountSession();
  const workspace = getPilotWorkspace();
  const projects = workspace.projects.filter((project) =>
    hasCreatorProjectAccess(project, identityId),
  );

  if (projects.length === 0) {
    notFound();
  }

  return {
    ...workspace,
    portfolio: {
      ...workspace.portfolio,
      projectIds: projects.map((project) => project.id),
    },
    projects,
    activeProjectId: projects.some(
      (project) => project.id === workspace.activeProjectId,
    )
      ? workspace.activeProjectId
      : projects[0]!.id,
  };
}

export async function loadPilotProject(params: Promise<{ projectId: string }>) {
  const identityId = await requireAccountSession();
  const { projectId } = await params;
  try {
    const project = getPilotProject(projectId);
    if (!hasCreatorProjectAccess(project, identityId)) {
      notFound();
    }
    return project;
  } catch (error) {
    if (error instanceof PilotDomainError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}

export function toWorkspaceProject(project: NonNullable<ReturnType<typeof getPilotProject>>): PilotWorkspaceProject {
  const completed = project.workflow.filter((step) => step.state === "complete").length;

  return {
    id: project.id,
    name: project.title,
    clientName: project.clientLabel,
    statusLabel: project.workflow.find((step) => step.state === "current")?.label ?? project.status,
    progress: Math.round((completed / PILOT_WORKFLOW.length) * 100),
    synthetic: true,
  };
}
