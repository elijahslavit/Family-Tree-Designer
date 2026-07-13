import { notFound } from "next/navigation";

import { ShowcaseStoryDetail } from "@/components/pilot/showcase-content";
import { getShowcaseAccess } from "@/lib/showcase/access";
import { getShowcaseStory } from "@/lib/showcase/pilot-showcase";

export default async function PrivateStoryPage({ params }: { params: Promise<{ slug: string; storyId: string }> }) { const { slug, storyId } = await params; const access = await getShowcaseAccess(slug); if (!access.authorized) return null; const result = getShowcaseStory(access.project, storyId); if (!result) notFound(); const basePath = `/s/${access.project.slug}`; return <ShowcaseStoryDetail basePath={basePath} story={result.card} body={[{ paragraphs: [result.story.bodyMd], pullQuote: result.story.dek }]} people={result.people} source={{ id: result.story.sourceIds[0] ?? "src01", title: "Hart Reunion Circular", detail: "Source context preserved with the synthetic narrative." }} />; }
