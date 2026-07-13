"use client";

import Link from "next/link";
import { Copy, Globe, KeyRound, Lock, Save, Sparkles } from "lucide-react";
import { useState, useSyncExternalStore, useTransition } from "react";

import { Badge } from "@/components/foundation/badge";
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
import { publicTreeHref } from "@/lib/utils/links";

const subscribeToOrigin = () => () => {};
const getOriginSnapshot = () => window.location.origin;
const getOriginServerSnapshot = () => "";

export function ShareSettings({ tree }: { tree: Tree }) {
  const [isPending, startSaving] = useTransition();
  const [name, setName] = useState(tree.name);
  const [slug, setSlug] = useState(tree.slug);
  const [description, setDescription] = useState(tree.description ?? "");
  const [isPublic, setIsPublic] = useState(tree.isPublic);
  const [shareToken, setShareToken] = useState(tree.shareToken);
  const origin = useSyncExternalStore(
    subscribeToOrigin,
    getOriginSnapshot,
    getOriginServerSnapshot,
  );
  const { pushToast } = useToast();
  const sharePath = publicTreeHref(slug, shareToken);
  const shareUrl = `${origin}${sharePath}`;

  const copyShareUrl = (url: string, message: string) =>
    startSaving(async () => {
      await navigator.clipboard.writeText(url);
      pushToast(message, "success");
    });

  return (
    <section id="tree-settings" className="space-y-5 scroll-mt-24">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Tree settings
        </p>
        <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Identity and sharing</h2>
        <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
          Name the archive, shape the public URL, and control when the shared tree is visible.
          These settings define how relatives encounter the archive.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="default">Tree details</Badge>
              <Badge tone="default">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Landing, directory, and profile headers all draw from this metadata
              </Badge>
            </div>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)]">Presentation metadata</h3>
          </div>

          <form
            className="grid gap-4"
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
              <span className="text-sm font-semibold text-[var(--text-primary)]">Tree name</span>
              <Input
                aria-label="Tree name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">Public slug</span>
                <Input
                  aria-label="Public slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                />
              </label>
              <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_72%,transparent)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Share path preview</p>
                <code className="mt-2 block text-xs leading-6 text-[var(--text-secondary)]">
                  {sharePath}
                </code>
              </div>
            </div>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Description</span>
              <Textarea
                aria-label="Tree description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-28"
              />
            </label>
            <div className="flex justify-end">
              <Button loading={isPending} type="submit">
                <Save className="h-4 w-4" />
                Save details
              </Button>
            </div>
          </form>
        </Card>

        <Card className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={isPublic ? "accent" : "default"}>
                {isPublic ? <Globe className="mr-1 h-3.5 w-3.5" /> : <Lock className="mr-1 h-3.5 w-3.5" />}
                {isPublic ? "Public archive link" : "Private archive"}
              </Badge>
              <Badge tone="default">
                <KeyRound className="mr-1 h-3.5 w-3.5" />
                Active share token required
              </Badge>
            </div>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)]">Sharing controls</h3>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              Public access requires the current slug and active token. Regenerating the token
              invalidates older links immediately.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_72%,transparent)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Share URL</p>
            <code className="mt-2 block break-all text-xs leading-6 text-[var(--text-secondary)]">
              {shareUrl || sharePath}
            </code>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Archive status</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                {isPublic ? "Visible to viewers" : "Creator-only"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {isPublic
                  ? "Anyone with the slug and token can browse the archive in read-only mode."
                  : "The shared tree is currently disabled, so no public link will resolve."}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Token policy</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">Regeneratable</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Use token regeneration any time a link needs to be invalidated without changing the slug.
              </p>
            </div>
          </div>

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
              variant="secondary"
              onClick={() => copyShareUrl(`${window.location.origin}${sharePath}`, "Share URL copied.")}
            >
              <Copy className="h-4 w-4" />
              Copy URL
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
                  const nextUrl = `${window.location.origin}${publicTreeHref(slug, token)}`;
                  await navigator.clipboard.writeText(nextUrl);
                  pushToast("Share token regenerated and copied.", "success");
                })
              }
            >
              Regenerate token
            </Button>
            {isPublic ? (
              <Link
                href={sharePath}
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)]"
              >
                Open archive
              </Link>
            ) : null}
          </div>
        </Card>
      </div>
    </section>
  );
}
