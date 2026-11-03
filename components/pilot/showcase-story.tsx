import { notFound } from "next/navigation";

import { ShowcaseStoryDetail } from "@/components/pilot/showcase-content";
import type { PilotProject } from "@/lib/pilot/types";
import { getShowcaseStory } from "@/lib/showcase/pilot-showcase";

/** Story page shared by the professional preview and the client presentation. */
export function ShowcaseStoryView({
  project,
  basePath,
  storyId,
}: {
  project: PilotProject;
  basePath: string;
  storyId: string;
}) {
  const result = getShowcaseStory(project, storyId);
  if (!result) notFound();

  const paragraphs = result.story.bodyMd
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return (
    <ShowcaseStoryDetail
      basePath={basePath}
      story={result.card}
      paragraphs={paragraphs}
      pullQuote={result.story.dek}
      people={result.people}
      sources={result.sources}
      nextStory={result.nextStory}
    />
  );
}
