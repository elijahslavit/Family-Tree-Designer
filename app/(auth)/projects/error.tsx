"use client";

import { useEffect } from "react";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";

export default function ProjectsError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f1eee7] p-6">
      <Card className="max-w-xl space-y-4 border-black/10 bg-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#82796d]">Professional studio error</p>
        <h1 className="text-3xl font-semibold text-[#241f18]">The project workspace could not load</h1>
        <p className="text-sm leading-6 text-[#746b5e]">No project data was changed. Retry the server render, or return to the creator dashboard if the issue persists.</p>
        {error.digest ? <p className="text-xs text-[#82796d]">Reference: {error.digest}</p> : null}
        <div className="flex flex-wrap gap-3"><Button onClick={unstable_retry}>Try again</Button><Button variant="secondary" onClick={() => { window.location.href = "/dashboard"; }}>Creator dashboard</Button></div>
      </Card>
    </main>
  );
}
