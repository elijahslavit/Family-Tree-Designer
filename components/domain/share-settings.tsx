"use client";

import { useTransition } from "react";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { useToast } from "@/components/foundation/toast";
import { regenerateShareToken, toggleTreePublic, updateTreeDetails } from "@/lib/actions";
import type { Tree } from "@/lib/types";

export function ShareSettings({ tree }: { tree: Tree }) {
  const [isPending, startSaving] = useTransition();
  const { pushToast } = useToast();
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const shareUrl = `${origin}/t/${tree.slug}?share=${tree.shareToken}`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Sharing
          </p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Public archive link</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          The current share URL requires both the tree slug and the active share token.
        </p>
        <code className="block rounded-[var(--radius-md)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--text-secondary)]">
          {shareUrl || `/t/${tree.slug}?share=${tree.shareToken}`}
        </code>
        <div className="flex flex-wrap gap-3">
          <Button
            loading={isPending}
            variant={tree.isPublic ? "secondary" : "primary"}
            onClick={() =>
              startSaving(async () => {
                await toggleTreePublic({
                  treeId: tree.id,
                  isPublic: !tree.isPublic,
                });
                pushToast(
                  tree.isPublic ? "Tree set to private." : "Tree is now publicly shareable.",
                  "success",
                );
              })
            }
          >
            {tree.isPublic ? "Make private" : "Make public"}
          </Button>
          <Button
            loading={isPending}
            variant="ghost"
            onClick={() =>
              startSaving(async () => {
                const token = await regenerateShareToken(tree.id);
                navigator.clipboard.writeText(`/t/${tree.slug}?share=${token}`);
                pushToast("Share token regenerated and copied.", "success");
              })
            }
          >
            Regenerate token
          </Button>
        </div>
      </Card>
      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Tree details
          </p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Presentation metadata</h2>
        </div>
        <Button
          loading={isPending}
          variant="secondary"
          onClick={() =>
            startSaving(async () => {
              await updateTreeDetails({
                treeId: tree.id,
                name: `${tree.name} Edition`,
                description: tree.description ?? null,
              });
              pushToast("Tree details updated.", "success");
            })
          }
        >
          Generate alternate slug
        </Button>
      </Card>
    </div>
  );
}
