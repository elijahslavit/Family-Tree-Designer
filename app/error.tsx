"use client";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card className="space-y-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-danger)]">Error</p>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          The archive hit a recoverable error.
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </Card>
    </div>
  );
}
