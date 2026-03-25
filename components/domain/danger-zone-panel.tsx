"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { useToast } from "@/components/foundation/toast";
import { resetDemoArchive } from "@/lib/actions";

export function DangerZonePanel({ demoMode }: { demoMode: boolean }) {
  const router = useRouter();
  const [isPending, startSaving] = useTransition();
  const { pushToast } = useToast();

  return (
    <Card className="space-y-5 border-[color-mix(in_oklab,var(--color-danger)_45%,var(--border-default))]">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-danger)]">Danger zone</p>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Destructive controls</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
          <p className="font-semibold text-[var(--text-primary)]">Delete tree</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Permanent tree deletion is reserved for the real persisted backend path. This demo build keeps the control read-only for now.
          </p>
          <Button type="button" variant="danger" className="mt-4" disabled>
            Delete tree
          </Button>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
          <p className="font-semibold text-[var(--text-primary)]">Delete account</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Account deletion will be enabled when the live auth and persistence path becomes the primary runtime.
          </p>
          <Button type="button" variant="danger" className="mt-4" disabled>
            Delete account
          </Button>
        </div>
      </div>
      {demoMode ? (
        <div className="rounded-[var(--radius-md)] border border-dashed border-[color-mix(in_oklab,var(--color-danger)_40%,var(--border-default))] p-4">
          <p className="font-semibold text-[var(--text-primary)]">Reset demo archive</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Clear experimental edits and restore the seeded sample archive for another QA pass.
          </p>
          <Button
            type="button"
            variant="danger"
            className="mt-4"
            loading={isPending}
            onClick={() =>
              startSaving(async () => {
                if (
                  typeof window !== "undefined" &&
                  !window.confirm("Reset the demo archive back to the seeded sample data?")
                ) {
                  return;
                }

                await resetDemoArchive();
                pushToast("Demo archive reset to the seeded sample.", "success");
                router.refresh();
              })
            }
          >
            Reset demo data
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
