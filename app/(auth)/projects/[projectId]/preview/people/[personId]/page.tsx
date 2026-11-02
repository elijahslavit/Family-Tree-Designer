import { notFound } from "next/navigation";

import { ShowcasePersonDetail } from "@/components/pilot/showcase-content";
import { buildPilotShowcase, getShowcasePerson, getShowcaseRelatives } from "@/lib/showcase/pilot-showcase";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

export default async function PilotPreviewPersonPage({ params }: { params: Promise<{ projectId: string; personId: string }> }) {
  const { projectId, personId } = await params;
  const project = await getSyntheticPilotProject(projectId);
  const person = getShowcasePerson(project, personId);
  if (!person) notFound();
  const basePath = `/projects/${project.id}/preview`;
  const showcase = buildPilotShowcase(project, basePath);
  const relatives = getShowcaseRelatives(person.view, showcase.people);
  const stories = showcase.stories.filter((story) => project.stories.find((candidate) => candidate.id === story.id)?.personIds.includes(personId));

  return (
    <ShowcasePersonDetail
      basePath={basePath}
      person={person.card}
      birthPlace={person.raw.birthPlace ?? "Place not recorded"}
      biography={[person.raw.biographyMd ?? person.raw.summary ?? "No life sketch has been recorded."]}
      facts={[
        { label: "Born", value: [person.raw.birthDateText, person.raw.birthPlace].filter(Boolean).join(" · ") },
        { label: "Died", value: [person.raw.deathDateText, person.raw.deathPlace].filter(Boolean).join(" · ") || "Living details minimized" },
      ]}
      relatives={relatives}
      stories={stories}
      source={{ id: "src01", title: "Hart Reunion Circular", detail: "A synthetic, cited demonstration source." }}
    />
  );
}
