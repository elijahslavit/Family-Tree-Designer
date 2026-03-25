import type { ReactNode } from "react";

import { ClassicShell } from "@/components/layouts/classic-shell";
import { EditorialShell } from "@/components/layouts/editorial-shell";
import { ExplorerShell } from "@/components/layouts/explorer-shell";
import type { Tree } from "@/lib/types";

type ShellProps = {
  tree: Tree;
  main: ReactNode;
  detail?: ReactNode;
  sidebar?: ReactNode;
  variant?: "default" | "profile";
};

export function CreatorTreeShell({
  tree,
  main,
  detail,
  sidebar,
  variant = "default",
}: ShellProps) {
  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/directory", label: "Directory" },
    { href: "/lineages", label: "Lineages" },
    { href: "/canvas", label: "Canvas" },
    { href: "/import", label: "Import" },
    { href: "/theme", label: "Theme" },
    { href: "/settings", label: "Settings" },
  ];

  if (tree.themeLayout === "classic") {
    return (
      <ClassicShell
        tree={tree}
        sidebar={sidebar}
        detail={detail}
        navItems={navItems}
        eyebrow="Creator mode"
      >
        {main}
      </ClassicShell>
    );
  }

  if (tree.themeLayout === "explorer" && variant === "profile") {
    return (
      <EditorialShell tree={tree} aside={detail} navItems={navItems} eyebrow="Creator mode">
        {main}
      </EditorialShell>
    );
  }

  if (tree.themeLayout === "explorer") {
    return (
      <ExplorerShell
        tree={tree}
        drawer={detail}
        navItems={navItems}
        eyebrow="Creator mode"
      >
        {main}
      </ExplorerShell>
    );
  }

  return (
    <EditorialShell tree={tree} aside={detail} navItems={navItems} eyebrow="Creator mode">
      {main}
    </EditorialShell>
  );
}

export function PublicTreeShell({
  tree,
  main,
  detail,
  sidebar,
  variant = "default",
}: ShellProps) {
  const share = `share=${tree.shareToken}`;
  const navItems = [
    { href: `/t/${tree.slug}?${share}`, label: "Directory" },
    { href: `/t/${tree.slug}/lineages?${share}`, label: "Lineages" },
    { href: `/t/${tree.slug}/canvas?${share}`, label: "Canvas" },
  ];

  if (tree.themeLayout === "classic") {
    return (
      <ClassicShell
        tree={tree}
        sidebar={sidebar}
        detail={detail}
        navItems={navItems}
        eyebrow="Shared archive"
      >
        {main}
      </ClassicShell>
    );
  }

  if (tree.themeLayout === "explorer" && variant === "profile") {
    return (
      <EditorialShell tree={tree} aside={detail} navItems={navItems} eyebrow="Shared archive">
        {main}
      </EditorialShell>
    );
  }

  if (tree.themeLayout === "explorer") {
    return (
      <ExplorerShell
        tree={tree}
        drawer={detail}
        navItems={navItems}
        eyebrow="Shared archive"
      >
        {main}
      </ExplorerShell>
    );
  }

  return (
    <EditorialShell tree={tree} aside={detail} navItems={navItems} eyebrow="Shared archive">
      {main}
    </EditorialShell>
  );
}
