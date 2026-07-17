import { ShowcaseHome } from "@/components/pilot/showcase-home";
import { getShowcaseAccess } from "@/lib/showcase/access";
import { buildPilotShowcase } from "@/lib/showcase/pilot-showcase";

export default async function PrivateShowcasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const access = await getShowcaseAccess(slug);
  if (!access.authorized) return null;
  const basePath = `/s/${access.project.slug}`;
  const showcase = buildPilotShowcase(access.project, basePath);
  return <ShowcaseHome basePath={basePath} familyName={access.project.welcome.familyName} eyebrow={access.project.welcome.eyebrow} tagline={access.project.welcome.headline} introduction={access.project.welcome.introduction} heroPath={showcase.heroPath} curatorName={access.project.branding.practiceName} focalPerson={showcase.focalPerson} people={showcase.people} stories={showcase.stories} sourcePreviewPath={showcase.sourcePreviewPath} />;
}
