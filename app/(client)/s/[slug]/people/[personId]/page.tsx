import { notFound } from "next/navigation";

import { ShowcasePersonDetail } from "@/components/pilot/showcase-content";
import { getShowcaseAccess } from "@/lib/showcase/access";
import { buildPilotShowcase, getShowcasePerson, getShowcaseRelatives } from "@/lib/showcase/pilot-showcase";

export default async function PrivatePersonPage({ params }: { params: Promise<{ slug: string; personId: string }> }) {
  const { slug, personId } = await params; const access = await getShowcaseAccess(slug); if (!access.authorized) return null;
  const person = getShowcasePerson(access.project, personId); if (!person) notFound();
  const basePath = `/s/${access.project.slug}`; const showcase = buildPilotShowcase(access.project, basePath);
  const relatives = getShowcaseRelatives(person.view, showcase.people);
  const stories = showcase.stories.filter((story) => access.project.stories.find((candidate) => candidate.id === story.id)?.personIds.includes(personId));
  return <ShowcasePersonDetail basePath={basePath} person={person.card} birthPlace={person.raw.birthPlace ?? "Place not recorded"} biography={[person.raw.biographyMd ?? person.raw.summary ?? "No life sketch has been recorded."]} facts={[{ label: "Born", value: [person.raw.birthDateText, person.raw.birthPlace].filter(Boolean).join(" · ") }, { label: "Died", value: [person.raw.deathDateText, person.raw.deathPlace].filter(Boolean).join(" · ") || "Living details minimized" }]} relatives={relatives} stories={stories} source={{ id: "src01", title: "Hart Reunion Circular", detail: "A synthetic, cited demonstration source." }} />;
}
