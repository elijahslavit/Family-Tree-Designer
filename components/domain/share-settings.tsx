"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { Input, Textarea } from "@/components/foundation/input";
import { useToast } from "@/components/foundation/toast";
import {
  regenerateShareToken,
  toggleTreePublic,
  updateTreeDetails,
} from "@/lib/actions";
import type { Tree } from "@/lib/types";

export function ShareSettings({ tree }: { tree: Tree }) {
  const [isPending, startSaving] = useTransition();
  const [name, setName] = useState(tree.name);
  const [slug, setSlug] = useState(tree.slug);
  const [description, setDescription] = useState(tree.description ?? "");
  const [isPublic, setIsPublic] = useState(tree.isPublic);
  const [shareToken, setShareToken] = useState(tree.shareToken);
  const { pushToast } = useToast();
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const shareUrl = `${origin}/t/${slug}?share=${shareToken}`;

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
          Public access requires the current slug and active share token. Regenerating the token invalidates older links immediately.
        </p>
        <code className="block rounded-[var(--radius-md)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--text-secondary)]">
          {shareUrl || `/t/${slug}?share=${shareToken}`}
        </code>
        <div className="flex flex-wrap gap-3">
          <Button
            loading={isPending}
            variant={isPublic ? "secondary" : "primary"}
            onClick={() =>
              startSaving(async () => {
                const nextValue = !isPublic;

                if (
                  typeof window !== "undefined" &&
                  !window.confirm(
                    nextValue
                      ? "Enable public sharing for this tree?"
                      : "Disable the public archive link?",
                  )
                ) {
                  return;
                }

                const nextState = await toggleTreePublic({
                  treeId: tree.id,
                  isPublic: nextValue,
                });
                setIsPublic(nextState);
                pushToast(
                  nextState ? "Tree is now publicly shareable." : "Tree set to private.",
                  "success",
                );
              })
            }
          >
            {isPublic ? "Make private" : "Make public"}
          </Button>
          <Button
            loading={isPending}
            variant="ghost"
            onClick={() =>
              startSaving(async () => {
                if (
                  typeof window !== "undefined" &&
                  !window.confirm("Regenerate the share token and invalidate the current link?")
                ) {
                  return;
                }

                const token = await regenerateShareToken(tree.id);
                setShareToken(token);
                await navigator.clipboard.writeText(
                  `${window.location.origin}/t/${slug}?share=${token}`,
                );
                pushToast("Share token regenerated and copied.", "success");
              })
            }
          >
            Regenerate token
          </Button>
          <Button
            loading={isPending}
            variant="secondary"
            onClick={() =>
              startSaving(async () => {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/t/${slug}?share=${shareToken}`,
                );
                pushToast("Share URL copied.", "success");
              })
            }
          >
            Copy URL
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
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            startSaving(async () => {
              const updated = await updateTreeDetails({
                treeId: tree.id,
                name,
                slug,
                description: description || null,
              });
              setName(updated.name);
              setSlug(updated.slug);
              setDescription(updated.description ?? "");
              pushToast("Tree details updated.", "success");
            });
          }}
        >
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Tree name</span>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Public slug</span>
            <Input value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Description</span>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24"
            />
          </label>
          <div className="flex justify-end">
            <Button loading={isPending} type="submit">
              Save details
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
