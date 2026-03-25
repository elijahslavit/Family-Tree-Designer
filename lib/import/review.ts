import type { ReviewIssue } from "@/lib/types";

export function createReviewIssue(
  treeId: string,
  subjectType: "person" | "family" | "event",
  subjectId: string,
  description: string,
  type: ReviewIssue["type"] = "parse_error",
): ReviewIssue {
  return {
    id: crypto.randomUUID(),
    treeId,
    type,
    subjectType,
    subjectId,
    description,
    status: "open",
    resolutionNote: null,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };
}
