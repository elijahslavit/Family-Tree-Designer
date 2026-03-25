import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import type { ReviewIssue } from "@/lib/types";

export function ImportReviewItem({ issue }: { issue: ReviewIssue }) {
  const resolved = issue.status === "resolved";

  return (
    <Card className="flex items-start gap-3">
      {resolved ? (
        <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--color-success)]" />
      ) : (
        <AlertTriangle className="mt-1 h-5 w-5 text-[var(--color-warning)]" />
      )}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={resolved ? "success" : "warning"}>{issue.type}</Badge>
          <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {issue.subjectType}
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{issue.description}</p>
      </div>
    </Card>
  );
}
