"use client";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";

export default function PublicTreeError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card className="space-y-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Shared archive error
        </p>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
          This archive view could not load
        </h1>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          Retry the current page, or return to the shared directory if the failure came from a deeper view.
        </p>
        <div className="flex gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </Card>
    </main>
  );
}
