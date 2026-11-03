import { ShowcaseTreeView } from "@/components/pilot/showcase-tree";
import { getShowcaseAccess } from "@/lib/showcase/access";

export default async function PrivateTreePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const access = await getShowcaseAccess(slug);
  if (!access.authorized) return null;
  return (
    <ShowcaseTreeView
      project={access.project}
      basePath={`/s/${access.project.slug}`}
      query={await searchParams}
    />
  );
}
