import { notFound } from "next/navigation";

import { ShowcaseSourceDetail } from "@/components/pilot/showcase-content";
import { getShowcaseAccess } from "@/lib/showcase/access";
import { getShowcaseSource } from "@/lib/showcase/pilot-showcase";

export default async function PrivateSourcePage({ params }: { params: Promise<{ slug: string; sourceId: string }> }) { const { slug, sourceId } = await params; const access = await getShowcaseAccess(slug); if (!access.authorized) return null; const result = getShowcaseSource(access.project, sourceId); if (!result) notFound(); const basePath = `/s/${access.project.slug}`; return <ShowcaseSourceDetail basePath={basePath} title={result.source.title} citation={`${result.source.author ?? "Unknown author"}. ${result.source.notes ?? "Source note unavailable"}`} repository="Synthetic Hart Family Archive" date="1968" previewPath={result.previewPath} transcription={result.source.notes ?? "No archive note recorded."} connectedPeople={result.connectedPeople} downloadAvailable={false} />; }
