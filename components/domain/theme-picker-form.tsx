"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { useToast } from "@/components/foundation/toast";
import { LayoutPreview } from "@/components/domain/layout-preview";
import { SkinPreview } from "@/components/domain/skin-preview";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { updateTreeTheme } from "@/lib/actions";
import { themeLayouts, themeSkins } from "@/lib/utils/constants";
import type { ThemeLayout, ThemeSkin, Tree } from "@/lib/types";

export function ThemePickerForm({ tree }: { tree: Tree }) {
  const [layout, setLayout] = useState<ThemeLayout>(tree.themeLayout);
  const [skin, setSkin] = useState<ThemeSkin>(tree.themeSkin);
  const [isPending, startSaving] = useTransition();
  const { pushToast } = useToast();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Theme
          </p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Layout and skin</h2>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Layout</p>
          <div className="grid gap-3 md:grid-cols-3">
            {themeLayouts.map((item) => (
              <button key={item} type="button" onClick={() => setLayout(item)}>
                <LayoutPreview layout={item} />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Skin</p>
          <div className="grid gap-3 md:grid-cols-3">
            {themeSkins.map((item) => (
              <button key={item} type="button" onClick={() => setSkin(item)}>
                <SkinPreview skin={item} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            loading={isPending}
            onClick={() =>
              startSaving(async () => {
                await updateTreeTheme({
                  treeId: tree.id,
                  themeLayout: layout,
                  themeSkin: skin,
                });
                pushToast("Theme updated.", "success");
              })
            }
          >
            Save theme
          </Button>
        </div>
      </Card>
      <ThemeProvider layout={layout} skin={skin} className="rounded-[var(--radius-lg)] p-4">
        <Card className="space-y-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Preview</p>
          <h3 className="text-3xl font-semibold text-[var(--text-primary)] display-name">
            The Hart Family Archive
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Live preview of the currently selected theme combination.
          </p>
          <div className="grid gap-3">
            <Card className="bg-[var(--bg-elevated)]">
              <p className="text-sm text-[var(--text-secondary)]">
                Biography, relatives, timeline, and directory cards all pick up these tokens.
              </p>
            </Card>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 rounded-[var(--radius-md)] bg-[var(--bg-surface)]" />
              <div className="h-20 rounded-[var(--radius-md)] bg-[var(--accent-muted)]" />
              <div className="h-20 rounded-[var(--radius-md)] bg-[var(--bg-canvas)]" />
            </div>
          </div>
        </Card>
      </ThemeProvider>
    </div>
  );
}
