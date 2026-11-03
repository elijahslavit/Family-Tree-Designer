import { describe, expect, it } from "vitest";

import { decodeGedcomFile, parseGedcomName, parseGedcomText } from "@/lib/import/gedcom-parser";

function parse(content: string, maxPeople?: number) {
  return parseGedcomText({ treeId: "tree-test", content, maxPeople });
}

describe("parseGedcomText", () => {
  it("parses a small GEDCOM payload into people and families", () => {
    const parsed = parse(`
0 @I1@ INDI
1 NAME John /Hart/
1 SEX M
1 BIRT
2 DATE 1 JAN 1950
0 @I2@ INDI
1 NAME Jane /Mercer/
1 SEX F
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
`);

    expect(parsed.people).toHaveLength(2);
    expect(parsed.families).toHaveLength(1);
    expect(parsed.externalIds).toHaveLength(3);
    expect(parsed.issues).toEqual([]);
  });

  it("keeps multiple given names together and reads the slash-delimited surname", () => {
    const [person] = parse("0 @I1@ INDI\n1 NAME John Paul /Smith/ Jr.").people;
    expect(person).toMatchObject({ givenName: "John Paul", surname: "Smith", suffix: "Jr.", fullName: "John Paul Smith Jr." });
  });

  it("uses the first NAME as primary and reports alternates instead of overwriting", () => {
    const parsed = parse("0 @I1@ INDI\n1 NAME John /Smith/\n1 NAME Johnny /Smith/");
    expect(parsed.people[0]!.fullName).toBe("John Smith");
    expect(parsed.issues.some((issue) => issue.type === "unsupported" && issue.description.includes("Johnny /Smith/"))).toBe(true);
  });

  it("falls back to GIVN and SURN parts when the NAME line has no value", () => {
    const [person] = parse("0 @I1@ INDI\n1 NAME\n2 GIVN Mary Ann\n2 SURN van der Berg").people;
    expect(person).toMatchObject({ givenName: "Mary Ann", surname: "van der Berg", fullName: "Mary Ann van der Berg" });
  });

  it("joins CONT and CONC continuation lines in notes", () => {
    const [person] = parse("0 @I1@ INDI\n1 NAME A /B/\n1 NOTE First line\n2 CONT second li\n2 CONC ne continues").people;
    expect(person!.biographyMd).toBe("First line\nsecond line continues");
  });

  it("treats a death, burial, or cremation record as evidence the person has died", () => {
    const parsed = parse(`
0 @I1@ INDI
1 NAME No /Record/
0 @I2@ INDI
1 NAME Death /Flag/
1 DEAT Y
0 @I3@ INDI
1 NAME Buried /Only/
1 BURI
2 PLAC Lexington
`);
    expect(parsed.people.map((person) => person.isLiving)).toEqual([true, false, false]);
  });

  it("flags an unresolved spouse even when the other spouse resolves", () => {
    const parsed = parse("0 @I1@ INDI\n1 NAME A /B/\n0 @F1@ FAM\n1 HUSB @I1@\n1 WIFE @I9@\n1 CHIL @I8@");
    const descriptions = parsed.issues.map((issue) => issue.description);
    expect(descriptions).toContain("Family @F1@ references unresolved wife @I9@.");
    expect(descriptions).toContain("Family @F1@ references unresolved child @I8@.");
    expect(parsed.families).toHaveLength(1);
  });

  it("reports content it does not import instead of dropping it silently", () => {
    const parsed = parse(`
0 HEAD
1 CHAR UTF-8
0 @I1@ INDI
1 NAME A /B/
1 OCCU Railway clerk
1 OCCU Engineer
1 SOUR @S1@
0 @S1@ SOUR
1 TITL Census
0 TRLR
`);
    const unsupported = parsed.issues.filter((issue) => issue.type === "unsupported").map((issue) => issue.description);
    expect(unsupported).toContain("2 occupation (OCCU) person entries were not imported.");
    expect(unsupported).toContain("1 source citation (SOUR) person entry was not imported.");
    expect(unsupported).toContain("1 source citation (SOUR) top-level record was not imported.");
    expect(unsupported.some((text) => text.includes("HEAD") || text.includes("TRLR"))).toBe(false);
  });

  it("handles CR-only line endings and a byte-order mark", () => {
    const parsed = parse("﻿0 @I1@ INDI\r1 NAME A /B/\r0 @I2@ INDI\r1 NAME C /D/");
    expect(parsed.people.map((person) => person.fullName)).toEqual(["A B", "C D"]);
  });

  it("warns when a file exceeds the project's people cap", () => {
    const parsed = parse("0 @I1@ INDI\n1 NAME A /B/\n0 @I2@ INDI\n1 NAME C /D/\n0 @I3@ INDI\n1 NAME E /F/", 2);
    expect(parsed.issues.some((issue) => issue.type === "conflict" && issue.description.includes("3 people, more than the 2"))).toBe(true);
  });
});

describe("parseGedcomName", () => {
  it("treats the last word as the surname when no slashes are present", () => {
    expect(parseGedcomName("Eleanor Hart West")).toMatchObject({ givenName: "Eleanor Hart", surname: "West" });
  });

  it("handles a surname-only name", () => {
    expect(parseGedcomName("/Hart/")).toMatchObject({ givenName: "Unknown", surname: "Hart", fullName: "Hart" });
  });
});

describe("decodeGedcomFile", () => {
  const encode = (text: string) => new TextEncoder().encode(text);

  it("decodes UTF-8 with or without a byte-order mark", () => {
    const withBom = new Uint8Array([0xef, 0xbb, 0xbf, ...encode("0 HEAD\n1 CHAR UTF-8\n0 @I1@ INDI\n1 NAME Zoë /Hart/")]);
    const result = decodeGedcomFile(withBom);
    expect(result).toMatchObject({ ok: true, encoding: "UTF-8" });
    expect(result.ok && result.text).toContain("Zoë");
  });

  it("refuses ANSEL with an instruction to re-export as UTF-8", () => {
    const result = decodeGedcomFile(encode("0 HEAD\n1 CHAR ANSEL\n0 TRLR"));
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toMatch(/ANSEL.*UTF-8/);
  });

  it("refuses bytes that are not valid UTF-8", () => {
    const result = decodeGedcomFile(new Uint8Array([0x30, 0x20, 0xff, 0xfe, 0x41]).subarray(0));
    expect(result.ok).toBe(false);
  });

  it("decodes UTF-16 files that start with a byte-order mark", () => {
    const text = "0 HEAD\n1 CHAR UNICODE";
    const bytes = new Uint8Array(2 + text.length * 2);
    bytes[0] = 0xff;
    bytes[1] = 0xfe;
    for (let index = 0; index < text.length; index += 1) bytes[2 + index * 2] = text.charCodeAt(index);
    expect(decodeGedcomFile(bytes)).toMatchObject({ ok: true, text, encoding: "UTF-16LE" });
  });
});
