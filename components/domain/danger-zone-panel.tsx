"use client";

import { AlertTriangle, RotateCcw, ShieldOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useTransition } from "react";

import { Badge } from "@/components/foundation/badge";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { useToast } from "@/components/foundation/toast";
import { resetDemoArchive } from "@/lib/actions";

export function DangerZonePanel({ demoMode }: { demoMode: boolean }) {
  const router = useRouter();
  const [isPending, startSaving] = useTransition();
  const { pushToast } = useToast();

  return (
    <section id="danger-zone" className="space-y-5 scroll-mt-24">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-danger)]">
          Danger zone
        </p>
        <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Destructive controls</h2>
        <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
          High-impact actions stay isolated here and require deliberate intent. Tree and account
          deletion stay gated until the app can safely recover after destructive operations in both
          demo and persisted runtimes.
        </p>
      </div>

      <Card className="space-y-5 border-[color-mix(in_oklab,var(--color-danger)_45%,var(--border-default))]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="danger">
            <AlertTriangle className="mr-1 h-3.5 w-3.5" />
            Irreversible operations
          </Badge>
          {demoMode ? <Badge tone="warning">Demo reset available</Badge> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DangerCard
            title="Delete tree"
            body="Removing the tree would delete all people, families, events, and lineages inside it. This stays disabled until the app can recover cleanly when an owner has no remaining tree."
            buttonLabel="Delete tree"
            icon={<Trash2 className="h-4 w-4" />}
          />
          <DangerCard
            title="Delete account"
            body="Account deletion will eventually cascade across every owned tree and revoke the creator login. The control remains gated until the runtime can also remove the upstream auth identity."
            buttonLabel="Delete account"
            icon={<ShieldOff className="h-4 w-4" />}
          />
        </div>

        {demoMode ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[color-mix(in_oklab,var(--color-danger)_45%,var(--border-default))] bg-[color-mix(in_oklab,var(--color-danger)_6%,transparent)] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--color-danger)]">
                  <RotateCcw className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.16em]">Demo-only reset</p>
                </div>
                <p className="text-xl font-semibold text-[var(--text-primary)]">Reset demo archive</p>
                <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                  Clear experimental edits and restore the seeded sample archive for another QA
                  pass. This affects only the in-memory demo state.
                </p>
              </div>
              <Button
                type="button"
                variant="danger"
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
          </div>
        ) : null}
      </Card>
    </section>
  );
}

function DangerCard({
  title,
  body,
  buttonLabel,
  icon,
}: {
  title: string;
  body: string;
  buttonLabel: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_74%,transparent)] p-4">
      <div className="flex items-center gap-2 text-[var(--color-danger)]">{icon}</div>
      <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{body}</p>
      <Button type="button" variant="danger" className="mt-4" disabled>
        {buttonLabel}
      </Button>
    </div>
  );
}
