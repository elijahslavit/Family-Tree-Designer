import { describe, expect, it } from "vitest";

import { searchPeople } from "@/components/canvas/canvas-search";
import { generationLabel } from "@/lib/data/canvas-layout";

const people = [
  { id: "a", name: "Walter Hart", years: "1912–1987" },
  { id: "b", name: "Eleanor Hart West", years: "1938–2014" },
  { id: "c", name: "Zoë Harrow", years: "1950–2020" },
  { id: "d", name: "Samuel West", years: "1935–2001" },
  { id: "e", name: "Ethan Chartwell", years: "1990–" },
];

describe("searchPeople", () => {
  it("returns nothing for an empty query", () => {
    expect(searchPeople(people, "   ")).toEqual([]);
  });

  it("ranks matches at the start of a word ahead of matches inside a word", () => {
    const names = searchPeople(people, "har").map((person) => person.name);
    expect(names.slice(0, 3).sort()).toEqual(["Eleanor Hart West", "Walter Hart", "Zoë Harrow"].sort());
    expect(names.at(-1)).toBe("Ethan Chartwell");
  });

  it("ignores case and accents", () => {
    expect(searchPeople(people, "ZOE").map((person) => person.id)).toEqual(["c"]);
  });

  it("finds people by surname", () => {
    expect(searchPeople(people, "west").map((person) => person.id).sort()).toEqual(["b", "d"]);
  });
});

describe("generationLabel", () => {
  it("names rows relative to the focus person", () => {
    expect(generationLabel(0, "Eleanor Hart West")).toBe("Eleanor's generation");
    expect(generationLabel(-1, "Eleanor")).toBe("Parents' generation");
    expect(generationLabel(-2, "Eleanor")).toBe("Grandparents' generation");
    expect(generationLabel(1, "Eleanor")).toBe("Children's generation");
    expect(generationLabel(-5, "Eleanor")).toBe("5 generations earlier");
    expect(generationLabel(6, "Eleanor")).toBe("6 generations later");
  });
});
