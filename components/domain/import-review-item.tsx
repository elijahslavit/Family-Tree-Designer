"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { resolveReviewIssue } from "@/lib/actions";
import { Badge } from "@/components/foundation/badge";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { Input } from "@/components/foundation/input";
import { useToast } from "@/components/foundation/toast";
import type { ReviewIssue } from "@/lib/types";

export function ImportReviewItem({
  issue,
  editable = false,
}: {
  issue: ReviewIssue;
  editable?: boolean;
}) {
  const [isPending, startSaving] = useTransition();
  const [resolutionNote, setResolutionNote] = useState(issue.resolutionNote ?? "");
  const { pushToast } = useToast();
  const resolved = issue.status === "resolved";

  return (
    <Card className="flex items-start gap-3">
      {resolved ? (
        <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--color-success)]" />
      ) : (
        <AlertTriangle className="mt-1 h-5 w-5 text-[var(--color-warning)]" />
      )}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={resolved ? "success" : issue.status === "dismissed" ? "default" : "warning"}>
            {issue.type}
          </Badge>
          <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {issue.subjectType}
          </span>
          <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {issue.status}
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{issue.description}</p>
        {editable ? (
          <div className="space-y-3">
            <Input
              value={resolutionNote}
              onChange={(event) => setResolutionNote(event.target.value)}
              placeholder="Optional resolution note"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                loading={isPending}
                variant="secondary"
                onClick={() =>
                  startSaving(async () => {
                    await resolveReviewIssue({
                      issueId: issue.id,
                      status: "resolved",
                      resolutionNote: resolutionNote || null,
                    });
                    pushToast("Issue resolved.", "success");
                  })
                }
              >
                Resolve
              </Button>
              <Button
                loading={isPending}
                variant="ghost"
                onClick={() =>
                  startSaving(async () => {
                    await resolveReviewIssue({
                      issueId: issue.id,
                      status: "dismissed",
                      resolutionNote: resolutionNote || null,
                    });
                    pushToast("Issue dismissed.", "success");
                  })
                }
              >
                Dismiss
              </Button>
              {issue.status !== "open" ? (
                <Button
                  loading={isPending}
                  variant="ghost"
                  onClick={() =>
                    startSaving(async () => {
                      await resolveReviewIssue({
                        issueId: issue.id,
                        status: "open",
                        resolutionNote: resolutionNote || null,
                      });
                      pushToast("Issue reopened.", "success");
                    })
                  }
                >
                  Reopen
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
