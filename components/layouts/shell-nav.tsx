"use client";

import Link from "next/link";
import { Menu, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/foundation/button";
import { Drawer } from "@/components/foundation/drawer";
import { cn } from "@/lib/utils/cn";

export type ShellNavItem = {
  href: string;
  label: string;
};

function getTargetPath(href: string) {
  return href.split("?")[0] || href;
}

function isActiveLink(pathname: string, href: string) {
  const target = getTargetPath(href);

  if (pathname === target) {
    return true;
  }

  if (target === "/directory") {
    return pathname.startsWith("/person/");
  }

  if (/^\/t\/[^/]+$/.test(target)) {
    return pathname.startsWith(`${target}/person/`);
  }

  return false;
}

export function ShellNavLinks({
  items,
  className,
  stacked = false,
  onNavigate,
}: {
  items: ShellNavItem[];
  className?: string;
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        stacked ? "grid gap-2" : "flex flex-wrap items-center gap-2",
        className,
      )}
    >
      {items.map((item) => {
        const active = isActiveLink(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-full px-3 py-2 text-sm transition-colors",
              active
                ? "bg-[var(--accent-muted)] font-semibold text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNavDrawer({
  title,
  items,
  buttonLabel = "Open navigation",
  children,
}: {
  title: string;
  items: ShellNavItem[];
  buttonLabel?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        aria-label={buttonLabel}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Drawer open={open} title={title} onClose={() => setOpen(false)}>
        <div className="space-y-5">
          <ShellNavLinks
            items={items}
            stacked
            className="border-b border-[var(--border-default)] pb-4"
            onNavigate={() => setOpen(false)}
          />
          {children}
        </div>
      </Drawer>
    </>
  );
}

export function MobileBottomNav({
  title,
  items,
  children,
}: {
  title: string;
  items: ShellNavItem[];
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const primaryItems = items.slice(0, 4);
  const overflowItems = items.slice(4);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-primary)_94%,transparent)] px-3 py-2 backdrop-blur lg:hidden">
        <div
          className="mx-auto grid max-w-3xl items-center gap-2"
          style={{
            gridTemplateColumns: overflowItems.length
              ? "repeat(4, minmax(0, 1fr)) auto"
              : `repeat(${Math.max(primaryItems.length, 1)}, minmax(0, 1fr))`,
          }}
        >
          {primaryItems.map((item) => {
            const active = isActiveLink(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "truncate rounded-[var(--radius-md)] px-2 py-3 text-center text-xs font-semibold transition-colors",
                  active
                    ? "bg-[var(--accent-muted)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--accent-muted)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {overflowItems.length ? (
            <Button
              type="button"
              variant="secondary"
              aria-label="More navigation"
              className="px-3 py-3"
              onClick={() => setOpen(true)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </nav>
      {overflowItems.length ? (
        <Drawer open={open} title={title} onClose={() => setOpen(false)} side="bottom">
          <div className="space-y-5">
            <ShellNavLinks items={items} stacked onNavigate={() => setOpen(false)} />
            {children}
          </div>
        </Drawer>
      ) : null}
    </>
  );
}
