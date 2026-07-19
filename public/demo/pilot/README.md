# Hart pilot demo media

Every asset in this directory is **clearly synthetic** and was created specifically for the Family Tree Designer pilot demonstration. The people, organizations, photographs, documents, handwriting, seals, signatures, dates, identifiers, and events depicted here are fictional. These files must not be presented as authentic records or evidence.

The SVGs are code-native, contain no scripts or external resources, and are safe to serve as static demo artwork. Each file also includes a synthetic-data notice in its `<title>`, `<desc>`, and `<metadata>` elements.

## Portraits

The ancestor portraits in `portraits/` are generated photographs of people who
never existed, produced from the prompt pack in
[`docs/design/ancestor-portrait-prompts.md`](../../../docs/design/ancestor-portrait-prompts.md).
They carry no visible watermark: the earlier placeholders had the word SYNTHETIC
drawn into the artwork, which also reached the marketing pages. The declaration
now lives in the words around the images instead — each portrait's stored media
record states that it is synthetic demonstration artwork, and the marketing pages
label the archive as a sample.

They are deliberately not uniform. Walter and June are framed as 1948 studio
portraits, Samuel as 1965 and Robert as 1972, because a real family archive
accumulates photographs across decades rather than commissioning them all at once.

| Demo person | File | Existing demo ID |
| --- | --- | --- |
| Walter Hart | `portraits/walter.webp` | `p01` |
| June Mercer Hart | `portraits/june.webp` | `p02` |
| Eleanor Hart West | `portraits/eleanor.webp` | `p03` |
| Robert Hart | `portraits/robert.webp` | `p04` |
| Samuel West | `portraits/samuel.webp` | `p05` |
| Margaret West Vale | `portrait-margaret-west-vale.svg` | `p06` |

Margaret is recorded as living, so she is hidden from the presentation and keeps
the original placeholder.

## Suggested presentation mapping

- `hart-family-hero.svg` — wide welcome-page hero or editorial collage.
- `record-hart-reunion-circular.svg` — June's typed reunion circular; link to `p02` and a featured story.
- `record-walter-railway-letter.svg` — Walter's fictional railway correspondence; link to `p01`.
- `record-eleanor-photo-index.svg` — Eleanor's fictional archive index card; link to `p03`.
- `meridian-family-histories-logo.svg` — fictional professional-genealogist branding for creator and client-preview states.

## Accessibility suggestions

The embedded SVG descriptions are deliberately concise. Product-level alt text should explain why an asset appears in context, for example: “Synthetic paper-cut portrait representing Walter Hart beside a railway timetable motif.” Decorative uses of the hero background should use empty alt text.
