"use client";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";

export default function AuthError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card className="space-y-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Creator error
        </p>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
          This creator screen could not load
        </h1>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          The app kept the failure contained. Retry the current route, or return to the dashboard if the problem persists.
        </p>
        <div className="flex gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button variant="secondary" onClick={() => (window.location.href = "/dashboard")}>
            Go to dashboard
          </Button>
        </div>
      </Card>
    </main>
  );
}
