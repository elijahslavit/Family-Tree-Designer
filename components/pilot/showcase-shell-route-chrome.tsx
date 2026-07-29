"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { ShowcaseShell } from "@/components/pilot/showcase-shell";

type ShowcaseShellRouteChromeProps = Omit<ComponentProps<typeof ShowcaseShell>, "chrome">;

/**
 * Tree routes go immersive (full-viewport stage, no archive header/footer).
 * Other showcase pages keep the standard shell.
 */
export function ShowcaseShellRouteChrome(props: ShowcaseShellRouteChromeProps) {
  const pathname = usePathname();
  const chrome = pathname.endsWith("/tree") ? "immersive" : "standard";

  return <ShowcaseShell {...props} chrome={chrome} />;
}
