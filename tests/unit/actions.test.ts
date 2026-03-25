import { vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  confirmGedcomImport,
  regenerateShareToken,
  setParents,
} from "@/lib/actions";
import { getDemoStore, resetDemoStore } from "@/lib/data/demo-store";
import { getTreeBySlug } from "@/lib/queries";

describe("action layer", () => {
  beforeEach(() => {
    resetDemoStore();
  });

  it("confirms staged GEDCOM imports only once", async () => {
    const store = getDemoStore();

    store.importJobs.unshift({
      id: "job-idempotent",
      treeId: store.tree.id,
      accountId: store.account.id,
      status: "parsed",
      fileName: "idempotent.ged",
      storagePath: null,
      payloadJson: JSON.stringify({
        people: [
          {
            id: "person-imported-once",
            treeId: store.tree.id,
            givenName: "Ida",
            surname: "Sample",
            fullName: "Ida Sample",
            suffix: null,
            gender: "female",
            birthDateText: null,
            birthDateNormalized: null,
            birthPlace: null,
            deathDateText: null,
            deathDateNormalized: null,
            deathPlace: null,
            summary: "Imported from a staged GEDCOM payload.",
            biographyMd: null,
            isLiving: true,
            createdAt: "2026-03-24T18:00:00.000Z",
            updatedAt: "2026-03-24T18:00:00.000Z",
          },
        ],
        families: [],
        familyChildren: [],
        events: [],
        externalIds: [],
        issues: [],
      }),
      counts: {
        people: 1,
        families: 0,
        events: 0,
        issues: 0,
      },
      issues: [],
      createdAt: "2026-03-24T18:00:00.000Z",
      expiresAt: "2026-03-25T18:00:00.000Z",
    });

    await confirmGedcomImport({ jobId: "job-idempotent" });
    await confirmGedcomImport({ jobId: "job-idempotent" });

    expect(
      store.people.filter((person) => person.id === "person-imported-once"),
    ).toHaveLength(1);
    expect(store.importJobs[0]?.status).toBe("confirmed");
    expect(store.importJobs[0]?.payloadJson).toBeNull();
  });

  it("creates a parent family and child link for orphan people", async () => {
    const store = getDemoStore();
    const orphan = store.people.find((person) => person.id === "p20")!;

    await setParents({
      treeId: store.tree.id,
      personId: orphan.id,
      fatherId: "p01",
      motherId: "p02",
    });

    const linkedFamily = store.families.find(
      (family) => family.spouse1Id === "p01" && family.spouse2Id === "p02",
    );

    expect(linkedFamily).toBeTruthy();
    expect(
      store.familyChildren.some(
        (item) => item.familyId === linkedFamily?.id && item.childId === orphan.id,
      ),
    ).toBe(true);
  });

  it("invalidates the previous public token after regeneration", async () => {
    const store = getDemoStore();
    const previousToken = store.tree.shareToken;

    await regenerateShareToken(store.tree.id);

    await expect(
      getTreeBySlug(store.tree.slug, {
        mode: "viewer",
        shareToken: previousToken,
      }),
    ).rejects.toThrow();
  });
});
