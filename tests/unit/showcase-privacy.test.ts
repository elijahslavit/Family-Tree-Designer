import { getPilotProject, resetPilotWorkspace } from "@/lib/pilot/store";
import {
  buildPilotShowcase,
  getShowcasePerson,
  getShowcaseSource,
  getShowcaseStory,
  safeDisplayPath,
} from "@/lib/showcase/pilot-showcase";

describe("pilot showcase privacy boundary", () => {
  beforeEach(() => {
    resetPilotWorkspace();
  });

  it("denies direct story, source, and media access when visibility or consent is absent", () => {
    const project = getPilotProject("pilot-hart-001");
    const privateStory = project.stories.find(
      (story) => story.id === "story-cedar-chest",
    )!;
    privateStory.visibility = "private";

    expect(getShowcaseStory(project, privateStory.id)).toBeNull();
    expect(getShowcaseStory(project, "story-eleanor-index")).toBeNull();

    const portrait = project.media.find(
      (asset) => asset.id === "media-portrait-margaret",
    )!;
    expect(safeDisplayPath(project, portrait)).toBe(
      "/demo/pilot/portrait-margaret-west-vale.svg",
    );

    portrait.visibility = "private";
    expect(safeDisplayPath(project, portrait)).toBeNull();
    portrait.visibility = "invited_family";
    portrait.consentStatus = "pending";
    expect(safeDisplayPath(project, portrait)).toBeNull();
    portrait.consentStatus = "granted";
    portrait.quarantineStatus = "pending";
    expect(safeDisplayPath(project, portrait)).toBeNull();

    project.stories.forEach((story) => {
      if (story.sourceIds.includes("src01")) {
        story.visibility = "private";
      }
    });
    project.media.forEach((asset) => {
      if (asset.sourceIds.includes("src01")) {
        asset.visibility = "private";
      }
    });
    expect(getShowcaseSource(project, "src01")).toBeNull();
  });

  it("minimizes living-person fields and relationships independently by consent", () => {
    const project = getPilotProject("pilot-hart-001");
    const living = getShowcasePerson(project, "p06");

    expect(living).not.toBeNull();
    expect(living!.raw.fullName).toBe("Margaret West Vale");
    expect(living!.raw.birthDateText).toBeNull();
    expect(living!.raw.birthDateNormalized).toBeNull();
    expect(living!.raw.birthPlace).toBeNull();
    expect(living!.raw.summary).toBeNull();
    expect(living!.raw.biographyMd).toBeNull();
    expect(living!.view.timeline).toEqual([]);
    expect(living!.card.years).toBe("Living");
    expect(living!.card.summary).toBe(
      "Living details are intentionally minimized.",
    );
    expect(living!.card.imagePath).toBe(
      "/demo/pilot/portrait-margaret-west-vale.svg",
    );
    expect(living!.view.relatives.parents.map((person) => person.id)).toEqual([
      "p03",
      "p05",
    ]);

    const consent = project.consents.find(
      (record) => record.personId === "p06",
    )!;
    consent.allowedFields = ["display_name"];
    const displayNameOnly = getShowcasePerson(project, "p06");
    expect(displayNameOnly).not.toBeNull();
    expect(displayNameOnly!.view.relatives).toEqual({
      parents: [],
      siblings: [],
      spouses: [],
      children: [],
    });
    expect(displayNameOnly!.card.imagePath).toBe(
      "/demo/pilot/meridian-family-histories-logo.svg",
    );

    expect(getShowcasePerson(project, "p19")).toBeNull();
  });

  it("reveals only a specifically consented living story field while keeping dates minimized", () => {
    const project = getPilotProject("pilot-hart-001");
    const consent = project.consents.find(
      (record) => record.personId === "p06",
    )!;
    consent.allowedFields.push("story");

    const living = getShowcasePerson(project, "p06");
    const story = getShowcaseStory(project, "story-eleanor-index");
    const showcase = buildPilotShowcase(project, "/s/hart-family-legacy");

    expect(living!.raw.summary).toContain("School librarian");
    expect(living!.raw.biographyMd).toContain("scanning reunion photos");
    expect(living!.raw.birthDateText).toBeNull();
    expect(living!.raw.birthPlace).toBeNull();
    expect(story?.people.map((person) => person.id)).toContain("p06");
    expect(showcase.stories.map((candidate) => candidate.id)).toContain(
      "story-eleanor-index",
    );
  });
});
