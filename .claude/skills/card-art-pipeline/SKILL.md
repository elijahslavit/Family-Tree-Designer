---
name: card-art-pipeline
description: Generate a style-consistent art kit for a themed card set — identity brief → base scene → hero card extraction → same-frame variants → card back → background-only art → high-res pass → background removal → normal/roughness/height maps. Drives the diffui MCP tools when connected, or emits a portable paste-ready prompt sequence for any image generator. Trigger when the user wants a set of matching illustrated cards, "card art", "card kit", "deck artwork", material/depth maps for card images, or assets for an interactive card experience. Pairs with interactive-card-effects for the in-browser presentation.
---

# card-art-pipeline

Produce a complete, coherent art kit for a themed set of illustrated cards: every card front
sharing one exact frame, a matching card back, a full-bleed background the cards live on, and
per-card material maps (normal, roughness, height) so a frontend can relight and displace them.

Two principles carry the whole pipeline; everything else is mechanics:

1. **One identity brief drives every asset.** Write the brief once (Phase 0); every later prompt
   inherits its palette and style instead of restating taste ad hoc.
2. **Derive, never regenerate.** Each asset is extracted or varied from the previously accepted
   image. The base scene births the hero card; the hero card births every variant and the back.
   Regenerating from scratch mid-chain breaks the frame and poisons everything after it.

## The kit (output contract)

```
public/card-kits/<set-slug>/
  kit.json                     manifest (shape below)
  background.png               full-bleed backdrop art, no UI, center visually open
  back.png                     card back, transparent background
  cards/<card-slug>.png        each front, transparent background
  maps/<card-slug>-normal.png
  maps/<card-slug>-roughness.png
  maps/<card-slug>-height.png
```

`kit.json` is the contract the interactive-card-effects skill consumes:

```json
{
  "name": "Four Seasons", "slug": "four-seasons",
  "palette": ["#101418", "#1A2A6C", "#D7B46A"], "mode": "dark", "cardAspect": "2:3",
  "background": "background.png", "back": "back.png",
  "cards": [{ "name": "Autumn", "slug": "autumn", "front": "cards/autumn.png",
    "maps": { "normal": "maps/autumn-normal.png", "roughness": "maps/autumn-roughness.png",
              "height": "maps/autumn-height.png" } }],
  "buildLink": "optional diffui build URL"
}
```

## Phase 0 — the brief (both paths)

Collect or infer: the theme; a list of 3–8 named cards (e.g. a seasons set: Spring, Summer,
Autumn, Winter; a constellation set; a native-trees set); one or two anchor art styles; a palette
of 5–7 hexes; mood words; dark or light mode; card aspect (default 2:3 tall). Harvest palette
hexes from the host app's design tokens when the kit is for an existing app — never invent colors
tokens already define.

Write a two-paragraph **identity brief**:

- Paragraph 1 — the world: subject matter, the anchor style(s) named as a specific hand or
  tradition (not a bare medium), palette with form attached to each color ("fields of deep blue,
  thin lines of gold"), one or two exemplar scenes, the feeling the viewer should get.
- Paragraph 2 — the system: expressive artwork anchored by clean minimal layout and elegant
  typography; one small signature detail repeated across every asset (the strongest coherence
  device); a named cliché the set positions against and its replacement; the mode (dark/light).

If the image-prompt skill is available, apply its anti-generic rules when writing the brief
(name a hand, flat vs painted, rest areas, ban defaults by name). The brief describes a system;
each later prompt derives ONE style and ONE scene from it — never paste the whole brief as an
image prompt.

## Path A — diffui MCP connected (preferred)

Keep any browser canvas tab **closed** while generating — an open tab can clobber MCP-added nodes
on sync. Load tool schemas via ToolSearch as needed.

1. `create_project`. If the kit belongs to an established brand, `list_brands` first and pass
   `brand_id` on every generation call.
2. `generate_options` with the identity brief, framed as a full desktop scene (~1440×1024) that
   features the hero card in context — a designed page composition art-directs the card far better
   than generating a lone card cold. Present the options and **stop; the user picks.**
3. **Hero card extraction** (`generate_with_inputs` feeding the chosen image, or
   `build_generate_image` with it as input): *"Show only the card. Make it as high res as
   possible; use up the full area. Keep it on a white background."* White stays until the removal
   step — it gives the cleanest cutout.
4. **High-res pass**, larger output dimensions: *"Show a higher res version of this. Only scale it
   up — don't add any additional elements. Keep the card on the white background, taking up most
   of the design with 20px of padding, same cutout shape."*
5. **Variants** — one generation per card in the list, feeding the accepted hero card: *"Show the
   card '<Name>'. Keep the exact same card size, frame, and decorations. Only change the content
   and the artwork."* Repeat the frame sentence verbatim every time.
6. **Card back**, feeding the hero card: *"Show the back of the card. Keep the exact same card
   size, shape, and edge decorations. Don't include any name or number — only intricate artwork.
   Keep it on a white background. The card should take up the entire design."*
7. **Background art**, feeding the chosen base scene: *"Show only the background art behind the
   card, without any of the UI elements or text elements. Only show the artwork."* Spec it
   full-bleed at the host surface's size, denser at the edges, center visually open so cards can
   sit above it; restate lighting, mood, and palette from the brief.
8. `build_remove_background` on every front and the back → transparent cutouts.
9. `build_create_maps` on every card front → normal, roughness, height. Optionally the back too.
10. `build_get_image` to download everything into the kit tree; write `kit.json`.
11. `create_build_link`; store the URL in `kit.json` for the implementation handoff.

Get an accept/reject from the user at steps 3–4 before fanning out to variants — a drifted frame
at the hero stage multiplies into every asset after it.

## Path B — no diffui (portable prompt pack)

Emit a paste-ready package instead of calling tools. Two hard style rules for everything the user
reads: plain language (no jargon), and one fully self-contained section per tool — fully
assembled prompts with the real card names filled in, no placeholders left for the user.

1. **Standing orders** — first message of a new image-chat thread: the identity brief plus rules
   that apply to every image (palette hexes, white background, no text or lettering in the art).
2. **The prompt sequence** — the same prompts as Path A steps 2–7, numbered in order, each
   beginning "Using the previous image as the reference, …". Tell the user to generate them
   strictly in order and re-run any step they don't accept before moving on.
3. **Maps** — in order of quality: run each finished card through diffui's map generation or any
   PBR/material-map service; or a depth-estimation model for the height map. Last-resort fallback
   for subtle effects only: a blurred grayscale copy of the card as the height map, and skip
   normal-map lighting.
4. User drops the files into the kit tree; you write `kit.json`.

## Continuity rules

- Change exactly one thing per prompt; repeat frame/size language verbatim everywhere else.
- Palette hexes never vary between prompts.
- White background on every card render until the removal step.
- The scale-up pass adds nothing — "only scale it up" is load-bearing.
- Maps must match their card image's dimensions 1:1 or displacement will smear.

## Done when

Every front shares an identical frame at a glance; cutouts have real transparency (verify over a
dark surface); maps exist for every card and align 1:1; `kit.json` is complete and paths resolve.
Then hand off: the interactive-card-effects skill implements the reveal, lighting, displacement,
and tilt presentation from this kit.
