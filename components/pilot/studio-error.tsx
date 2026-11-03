"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/foundation/button";

/** Shared error screen for the professional studio's route segments. */
export function StudioError({
  error,
  retry,
  title = "This page couldn’t load",
}: {
  error: Error & { digest?: string };
  retry: () => void;
  title?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f1eee7] p-6">
      <div className="w-full max-w-xl space-y-4 rounded-2xl border border-black/10 bg-white p-7 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6255]">Something went wrong</p>
        <h1 className="font-serif text-3xl font-semibold text-[#241f18]">{title}</h1>
        <p className="text-sm leading-6 text-[#5f584e]">
          Nothing in your projects was changed. Try again, or go back to your projects.
        </p>
        {error.digest ? <p className="text-xs text-[#6b6255]">Reference: {error.digest}</p> : null}
        <div className="flex flex-wrap gap-3">
          <Button onClick={retry}>Try again</Button>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#302a23] transition-colors hover:bg-[#f7f4ee]"
          >
            Back to your projects
          </Link>
        </div>
      </div>
    </main>
  );
}
