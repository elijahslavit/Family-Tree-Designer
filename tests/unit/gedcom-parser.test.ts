import { parseGedcomText } from "@/lib/import/gedcom-parser";

describe("parseGedcomText", () => {
  it("parses a small GEDCOM payload into people and families", () => {
    const gedcom = `
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
`;

    const parsed = parseGedcomText({
      treeId: "tree-test",
      content: gedcom,
    });

    expect(parsed.people).toHaveLength(2);
    expect(parsed.families).toHaveLength(1);
    expect(parsed.externalIds).toHaveLength(3);
  });
});
