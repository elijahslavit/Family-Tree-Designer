import { getDemoStore, resetDemoStore } from "@/lib/data/demo-store";
import { getPeopleByTree, getPersonById } from "@/lib/queries";

describe("query layer", () => {
  beforeEach(() => {
    resetDemoStore();
  });

  it("masks living people in viewer mode", async () => {
    const store = getDemoStore();
    const livingPerson = store.people.find((person) => person.isLiving)!;

    const person = await getPersonById({
      treeSlug: store.tree.slug,
      personId: livingPerson.id,
      viewer: {
        mode: "viewer",
        shareToken: store.tree.shareToken,
      },
    });

    expect(person.summary).toBe("Details private");
    expect(person.birthDateText).toBeNull();
  });

  it("filters the directory by search term", async () => {
    const store = getDemoStore();

    const directory = await getPeopleByTree({
      treeSlug: store.tree.slug,
      viewer: {
        mode: "creator",
        accountId: store.account.id,
      },
      filters: {
        search: "Walter",
      },
    });

    expect(directory.items).toHaveLength(1);
    expect(directory.items[0]?.fullName).toContain("Walter");
  });
});
