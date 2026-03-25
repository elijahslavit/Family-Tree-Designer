"use client";

import { PanelRightClose, PanelRightOpen } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/foundation/button";
import { Drawer } from "@/components/foundation/drawer";
import {
  MobileNavDrawer,
  ShellNavLinks,
  type ShellNavItem,
} from "@/components/layouts/shell-nav";
import type { Tree } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

type ExplorerShellProps = PropsWithChildren<{
  tree: Tree;
  drawer?: ReactNode;
  navItems: ShellNavItem[];
  eyebrow?: string;
}>;

export function ExplorerShell({
  tree,
  drawer,
  children,
  navItems,
  eyebrow = "Explorer",
}: ExplorerShellProps) {
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(Boolean(drawer));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-primary)_92%,transparent)] px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{eyebrow}</p>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">{tree.name}</h1>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <ShellNavLinks items={navItems} className="text-sm" />
            {drawer ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDesktopDrawerOpen((current) => !current)}
              >
                {desktopDrawerOpen ? (
                  <>
                    <PanelRightClose className="h-4 w-4" />
                    Hide details
                  </>
                ) : (
                  <>
                    <PanelRightOpen className="h-4 w-4" />
                    Show details
                  </>
                )}
              </Button>
            ) : null}
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            {drawer ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setMobileDrawerOpen(true)}
              >
                Details
              </Button>
            ) : null}
            <MobileNavDrawer title={`${tree.name} navigation`} items={navItems} />
          </div>
        </div>
      </header>
      <div className="relative px-4 py-4">
        <main
          className={cn(
            "min-h-[calc(100vh-5.5rem)]",
            drawer && desktopDrawerOpen ? "lg:pr-[24rem]" : "",
          )}
        >
          {children}
        </main>
        {drawer && desktopDrawerOpen ? (
          <aside className="fixed right-4 top-[5.25rem] z-20 hidden h-[calc(100vh-6rem)] w-[min(360px,calc(100vw-2rem))] overflow-y-auto lg:block">
            {drawer}
          </aside>
        ) : null}
      </div>
      {drawer ? (
        <div className="lg:hidden">
          <Drawer
            open={mobileDrawerOpen}
            title="Canvas details"
            onClose={() => setMobileDrawerOpen(false)}
            side="bottom"
          >
            {drawer}
          </Drawer>
        </div>
      ) : null}
    </div>
  );
}
