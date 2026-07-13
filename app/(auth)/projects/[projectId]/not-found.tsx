import { FolderKanban } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/foundation/card";

export default function ProjectNotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#f1eee7] p-6"><Card className="max-w-xl space-y-4 border-dashed bg-white text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#eef2ed] text-[#4f6454]"><FolderKanban className="h-5 w-5" /></span><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#82796d]">Project not found</p><h1 className="text-3xl font-semibold">This pilot is not in your portfolio</h1><p className="text-sm leading-6 text-[#746b5e]">The project may have been removed, archived under another identifier, or the link may be incorrect.</p><Link href="/projects" style={{ color: "#ffffff" }} className="inline-flex items-center justify-center rounded-lg bg-[#263a31] px-4 py-2 text-sm font-semibold text-white">Return to all projects</Link></Card></main>;
}
