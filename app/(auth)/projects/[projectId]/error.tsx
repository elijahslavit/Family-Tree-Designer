"use client";

import { useEffect } from "react";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";

export default function ProjectError({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="grid min-h-screen place-items-center bg-[#f1eee7] p-6"><Card className="max-w-xl space-y-4 border-black/10 bg-white"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#82796d]">Contained project error</p><h1 className="text-3xl font-semibold">This project screen could not load</h1><p className="text-sm leading-6 text-[#746b5e]">The error boundary kept the rest of the professional studio available. Retry this server render or return to the project portfolio.</p>{error.digest ? <p className="text-xs text-[#82796d]">Reference: {error.digest}</p> : null}<div className="flex flex-wrap gap-3"><Button onClick={unstable_retry}>Try again</Button><Button variant="secondary" onClick={() => { window.location.href = "/projects"; }}>All projects</Button></div></Card></main>;
}
