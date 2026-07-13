import { ShowcaseStoriesIndex } from "@/components/pilot/showcase-content";
import { getShowcaseAccess } from "@/lib/showcase/access";
import { buildPilotShowcase } from "@/lib/showcase/pilot-showcase";

export default async function PrivateStoriesPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const access = await getShowcaseAccess(slug); if (!access.authorized) return null; const basePath = `/s/${access.project.slug}`; const showcase = buildPilotShowcase(access.project, basePath); return <ShowcaseStoriesIndex basePath={basePath} stories={showcase.stories} />; }
