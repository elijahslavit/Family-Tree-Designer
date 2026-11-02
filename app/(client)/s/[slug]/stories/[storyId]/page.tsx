import { ShowcaseStoryView } from "@/components/pilot/showcase-story";
import { getShowcaseAccess } from "@/lib/showcase/access";

export default async function PrivateStoryPage({
  params,
}: {
  params: Promise<{ slug: string; storyId: string }>;
}) {
  const { slug, storyId } = await params;
  const access = await getShowcaseAccess(slug);
  if (!access.authorized) return null;
  return <ShowcaseStoryView project={access.project} basePath={`/s/${access.project.slug}`} storyId={storyId} />;
}
