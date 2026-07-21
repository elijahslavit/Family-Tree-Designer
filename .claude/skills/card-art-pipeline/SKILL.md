---
name: card-art-pipeline
description: Generate a style-consistent art kit for a themed card set — identity brief → base scene → hero card extraction → same-frame variants → card back → background-only art, then a local sharp pass for the transparent cutout and normal/roughness/height maps. Drives the diffui MCP tools for generation, or emits a portable paste-ready prompt sequence for any image generator. Trigger when the user wants a set of matching illustrated cards, "card art", "card kit", "deck artwork", material/depth maps for card images, or assets for an interactive card experience. Pairs with interactive-card-effects for the in-browser presentation.
---

# card-art-pipeline

Produce a complete, coherent art kit for a themed set of illustrated cards: every card front
sharing one exact frame, a matching card back, a full-bleed background the cards live on, and
per-card material maps (normal, roughness, height) so a frontend can relight and displace them.

Three principles carry the whole pipeline; everything else is mechanics:

1. **One identity brief drives every asset.** Write the brief once (Phase 0); every later prompt
   inherits its palette and style instead of restating taste ad hoc.
2. **Derive, never regenerate.** Each asset is extracted or varied from the previously accepted
   image. The base scene births the hero card; the hero card births every variant and the back.
   Regenerating from scratch mid-chain breaks the frame and poisons everything after it.
3. **The art must carry physical relief.** Whatever the style, the surface needs embossing,
   engraving, cut grooves, impasto — something with real height that raking light can catch. Name
   it in the prompt ("physically embossed, blind-letterpress relief, raking light from the upper
   left throws shadow into every groove"), and check for cast shadow in the result. Delicate flat
   linework looks refined and produces a flat normal map, which makes the whole interactive tier
   fall flat. If the first pass comes back flat, regenerate for relief before going further —
   every downstream asset inherits this.

## The kit (output contract)

```
scripts/build-card-kit.js      checked-in: source art → cutout + maps (Path C)
public/card-kits/<set-slug>/
  kit.json                     manifest (shape below)
  source-<slug>.webp           accepted generation, committed so the kit rebuilds
  background.png               full-bleed backdrop art, no UI, center visually open
  back.png                     card back, transparent background
  cards/<card-slug>.png        each front, transparent background
  maps/<card-slug>-normal.png
  maps/<card-slug>-roughness.png
  maps/<card-slug>-height.png
```

Commit the source art and the build script, not just the outputs. Generations live in a gitignored
scratch folder; a kit whose inputs are gitignored cannot be rebuilt or retuned by anyone else.

`kit.json` is the contract the interactive-card-effects skill consumes:

```json
{
  "name": "Four Seasons", "slug": "four-seasons",
  "palette": ["#101418", "#1A2A6C", "#D7B46A"], "mode": "dark", "cardAspect": "2:3",
  "source": "source-four-seasons.webp", "build": "node scripts/build-card-kit.js",
  "background": "background.png", "back": "back.png",
  "cards": [{ "name": "Autumn", "slug": "autumn", "front": "cards/autumn.png",
    "maps": { "normal": "maps/autumn-normal.png", "roughness": "maps/autumn-roughness.png",
              "height": "maps/autumn-height.png" },
    "slots": { "window": { "left": 25.0, "top": 16.9, "width": 52.0, "height": 53.9,
                           "archRadiusY": 25 } } }],
  "buildLink": "optional diffui build URL"
}
```

`slots` is optional and only applies to **template frames** — cards whose window and caption are
filled at runtime rather than baked into the art. Percentages of the card box, measured off the
finished cutout, so the consuming component scales freely.

## Phase 0 — the brief (both paths)

Collect or infer: the theme; a list of 3–8 named cards (e.g. a seasons set: Spring, Summer,
Autumn, Winter; a constellation set; a native-trees set); one or two anchor art styles; a palette
of 5–7 hexes; mood words; dark or light mode; card aspect — default to a long, skinny card
(~0.6 width:height, e.g. a 900×1500 canonical box) unless the user says otherwise; generate on a
taller/narrower canvas (not a squarer one padded afterward) so the artwork itself fills the skinny
shape rather than relying on transparent padding at the sides. Harvest palette
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

## Phase 0b — theme sets: keep every theme distinct

When the set is a series of **template frames on one shared house treatment** (e.g. per-country
heritage frames: same paper, foil, aging, window+plaque geometry — only the ornament changes), the
failure mode is that every theme rhymes: same crown, same corner vignette, same filler botanicals,
only the accent plant swapped. Two fixes.

**Differentiate on structure, not just the plant.** The strongest levers change the *silhouette
and texture*, not the flora. For each theme vary, in priority order:

1. **Architecture** — the arch and frame tradition (Renaissance round arch / Gothic Perpendicular
   / Rococo rocaille / Federal fanlight / …). This changes the outline itself.
2. **Rail band** — the culture's own ornament grammar (Cosmatesque mosaic / Gothic quatrefoil /
   rocaille scroll / Greek-key). 
3. **Crown** (top-center emblem) — never reuse one crown across the set (compass rose, rose window,
   shell cartouche, fanlight sunburst, …).
4. Then botanical, vignettes, base emblem, palette.

**Left and right must mirror.** Diffusion models default to varying flanking ornament instead of
repeating it — the two roses beside an arch coming out different colors, corner vignettes drifting
out of visual balance. State bilateral symmetry explicitly and specifically ("the flowers flanking
the arch are identical in color and form, mirrored left-to-right, not two different varieties/colors")
rather than trusting "symmetric" alone, and check every flanking pair in the result before
accepting: same rail motif, same flower color, same medallion, corner vignettes balanced in weight.

**Every card needs both a window AND a nameplate — no exceptions, and both sized generously.**
This is not a per-card judgment call: reject any option missing either one outright, regardless of
how good the rest of the art is (observed repeatedly — a gorgeous rose garland or wreath with no
empty plaque anywhere is not shippable, it's a dead end that costs a full regeneration cycle). Give
the nameplate real size, not a decorative sliver: it has to hold a full name and a birth–death year
range legibly, so undersize it and every card in the set inherits the same fix later. When unsure
whether a nameplate is big enough, size it toward the *largest* comfortable option in the set, not
the smallest.

**Keep window and nameplate size consistent across the whole set.** Different themes will naturally
land at different proportions from generation to generation, but don't let that drift go unchecked —
after generating a theme, compare its window/plaque size against the rest of the set and regenerate
outliers so every card reads as the same "weight" of object at a glance. If some vary, err toward
the *larger* end of the set as the target (a bigger window and card reads better than a cramped
one), never toward the smallest. This is a different axis from Phase 0b's per-theme differentiation
— vary the *style* of the window/frame per theme, not its *size* relative to the rest of the set.

**Never duplicate an object within one card.** Each corner vignette, each flanking motif instance,
each medallion must depict something distinct from every other element on that same card — repeating
the same little scene or charge twice on one face reads as a generation shortcut, not a design
choice. Mirrored *pairs* (Phase 0b's bilateral symmetry) are the one deliberate exception: the two
flanking sprays or ribbons are supposed to be identical to each other, that's symmetry, not
duplication — duplication is two *different* slots on the card (e.g. both corner vignettes) showing
the same scene.

**The portrait window is the subject — keep it dominant.** This is a portrait frame, not a border
showcase: the arched window must read as the single biggest element on the card, not one motif
among equals. Target the window spanning roughly 45–60% of the card's height. Say so explicitly in
the prompt ("the arched portrait window is the dominant element, large and unmistakably the focal
point — the border ornament frames it, never competes with it") and reject options where corner
vignettes, a crest, or the rail ornament out-compete the window for attention.

**Fill a design card per theme before prompting** — and front-load the distinctive fields in the
prompt (word order is weight; the shared house treatment goes *last*, the signature motifs *first*):

> Architecture · Rail · Crown · Botanical · 2 Vignettes · Base emblem · Palette accents ·
> one signature object · **negatives**

**Keep a differentiation ledger** (a short table in the kit folder or a comment) recording each
theme's Architecture/Rail/Crown/Botanical, so no two converge. Before generating a new theme, scan
it and pick unused levers.

**Required negatives (inline).** diffui/most template-frame prompts take one string with no separate
negative field, so state the rejection list explicitly in the prompt: *no text, no lettering, no
labels, no numbers, no banners or ribbon mottos, no watermark, no national flags, no military
insignia (crosses, imperial eagles), no face in the window.* This is not optional — without it the
model bakes in place-name labels, mottos, and militaria (observed: a German frame that added an
Iron Cross, a "GOTT MIT UNS" banner, and place labels). Fraught nationalist/military symbols are
both off-brief and a taste problem for a family keepsake — ban them by name per theme.

## Phase 0c — masculine / feminine variant pairs

When a template-frame theme is used for people of either sex (an ancestor-card set, a memorial-card
set), offer **two frames per theme**, not one — the same split real Victorian/Edwardian keepsake
ephemera made: a heavier heraldic/architectural treatment and a softer floral/ribboned one. This is
a second differentiation axis layered on top of Phase 0b's per-theme one; the two frames of a pair
must still read as unmistakably the *same theme* (same culture, same palette family, same vignette
subjects), differentiated only along this axis.

Vary, in priority order — mirroring Phase 0b's table but for gender instead of theme:

1. **Window shape.** Masculine: a hard architectural opening (pointed arch, straight-edged panel).
   Feminine: a soft oval or rounded medallion, optionally set in a ribbon bow or floral wreath
   instead of bare architecture. This changes the silhouette, same as architecture does in 0b.
2. **Primary motif register.** Masculine: heraldry, shields, laurel, oak, medals, architecture.
   Feminine: flowers in full bloom, ribbons, lace-like filigree, doves, fans — softer forms of the
   *theme's own* botanicals (a theme's oak can still appear feminine as a light spray rather than a
   heavy wreath) rather than swapping to unrelated flora.
3. **Line quality.** Masculine: angular, heavier gold, sharper facets. Feminine: curling, lighter
   and more delicate gold linework, pastel enamel accents.
4. **Palette accent balance.** Same house palette *family* — do not swap to a different theme's
   colors — but shift which accents lead: masculine leans the darker/cooler hexes already in the
   palette (oxblood, forest, navy, walnut), feminine leans the same set's warmer/softer ones (blush,
   dusty rose, powder blue) if present, or introduce one small period-appropriate soft accent within
   the established mood rather than a wholesale repalette.
5. **Crown / top emblem.** Masculine keeps the theme's heraldic or architectural crown from Phase
   0b. Feminine swaps it for a softer equivalent (a ribbon-tied floral spray, a cameo-style oval)
   while keeping the theme's own botanicals and vignette locations.
6. **Base emblem.** Masculine: the theme's shield/crest as-is. Feminine: a floral swag or bow in
   its place, or the same charge rendered smaller and gathered in flowers rather than a hard shield.

**Extra negative for feminine variants specifically:** dignified and adult, not cutesy — this is a
memorial/keepsake card, not a greeting card. No cartoonish motifs, no infantilizing treatment.

**Implementation split.** Masculine and feminine frames commonly need *different* slot geometry
(window shape changes its own bounding box), so build them as two independent kits sharing a theme
name — `<theme>-heritage-masculine` and `<theme>-heritage-feminine` as sibling `public/card-kits/`
folders, each with its own `source-frame.webp`, cutout, maps, and `kit.json`, run through the same
`build-theme-frame.js <slug>` — rather than trying to force both into one kit's `cards` array (that
schema supports it structurally, but two very differently-shaped windows sharing one slot record
does not).

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
   possible; use up the full area. Keep it on a white background."*

   Background choice depends on the card: white is cleanest for a **dark** card. For a **light**
   card (cream, ivory, bone) ask for a mid-grey or dark backdrop instead — see the cutout note in
   step 8, where cream-on-white fails outright.
4. **High-res pass** — *optional, and drift-prone.* "Only scale it up" is a re-generation, not an
   upscale: it has returned a different card (ornament dropped, texture replaced) even with the
   frame language repeated. There is no true upscale tool in the diffui MCP. Do the arithmetic
   first — a 1024px-wide asset in a 460px box is already past retina, so usually **skip this
   step**. If you must run it, feed the canvas `image_id` rather than a local file (a local file
   starts a fresh node with no prompt lineage) and diff the result against the hero before
   accepting.
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
8. **Cutout and maps — read Path C first.** The `build_*` tools (`build_remove_background`,
   `build_create_maps`, `build_get_image`) require a `create_build_link` build id, and the assets
   they return live behind authenticated URLs. On hosts where the API key is not reachable from
   the shell, those assets cannot be written to disk at all, and `build_remove_background`
   destroys light-on-white art regardless. Do this half locally.

Get an accept/reject from the user at step 3 before fanning out to variants — a drifted frame
at the hero stage multiplies into every asset after it.

## Path C — cutout and maps, locally (preferred over the `build_*` tools)

Generation belongs on diffui; everything after it is deterministic image processing that belongs
in the repo, where it is reproducible, free, and inspectable. Download the accepted art from its
`/files/generations/...` URL (that one needs no auth), commit it as the kit's `source-frame`, and
build from it with `sharp` in a checked-in script. `scripts/build-theme-frame.js` in this repo is
the reference implementation of everything below — copy/adapt it rather than re-deriving from
scratch; it is the product of several rounds of debugging the specific failure modes noted here.

**Shoot every card on deep charcoal velvet**, regardless of whether the card itself is light or
dark — this repo's cards are all light parchment, and dark-behind-light gives the cleanest
brightness-based silhouette. State it in every generation prompt ("photographed on deep charcoal
velvet under soft raking light from the upper-left").

**Silhouette: exclude a border margin, don't threshold or erode.** A lit velvet fold can catch warm
bounce light off the card's own gold foil and land in the *same* hue/saturation/luminance range as
the card's paper or metal — no per-pixel color rule (luminance threshold, saturation gate, hue gate)
reliably tells them apart, because colorimetrically they can be identical. Erosion-based fixes were
tried and abandoned: a fixed radius either lets a wide bridge through or eats legitimate fine gold
engraving (which erodes away in its own sharp "cliff" nearly indistinguishable from a severed
bridge), and an adaptive "grow the radius until the flooded area cliffs" heuristic false-positived
on clean images and false-negatived on the actual leak. What works: every generation is composed
with the card inset from the frame edge by prompt design, so force a margin ring at the *image*
border (e.g. 2% of min(width,height)) to read as non-card regardless of brightness before flood-
filling from the image center. A leaked fold always touches that outer ring; blocking the ring
severs the connection at the border no matter how wide the bridge is inside, without touching any
interior engraving. Recover the true deckled edge afterward with a **small** pad (a handful of px,
decoupled from the margin) around the found core, then re-scan the original (non-excluded) bright
mask fenced to that padded box — padding back out by the *full* margin re-admits the exact fold
pixels you just excluded and reopens the leak.
- **Cutout by geometry, not colour**, inside that fence. Card silhouettes are convex, so mark every
  pixel above the backdrop luminance, fill each row between its first and last mark, then blur the
  mask ~0.8px for an antialiased edge. Exact, and it never eats the artwork.
- **Height** from a **high-pass** of luminance (subtract a wide blur of itself), not raw luminance
  or a raw percentile clip. Printed corner vignettes and illustration are broad, low-frequency
  darkness — raw luminance sinks them into craters. High-pass keeps that broad tone at the paper
  plane and lifts only true grooves and emboss edges. Use a wide blur radius (large enough to
  preserve ornament-scale relief, wide enough to flatten whole illustrated scenes) — too narrow a
  high-pass erases the ornament's own carved relief along with the vignettes.
- **Pin metal to a flat plateau** just *above* the paper's mean height, but **add its own groove
  relief back on top** rather than flattening it to a pure plateau — gold ornament is itself carved
  (leaves, scrollwork), and a pure flat plateau makes the entire border read flat under light no
  matter how good the rest of the map is. Detect metal by **hue**, not raw saturation (a saturation-
  only gate also grabs saturated non-metal enamel colors like terracotta or teal); gate on hue window
  + saturation + value together, blur the mask ~1.5px, and blend.
- **Normal** = Sobel over the height map, but **pre-blur ~1.4px first**. Generated art is usually
  webp, and its compression noise has the same amplitude as fine linework — without the pre-blur
  the normal map is scanline noise, not terrain, and it is obvious on sight (horizontal striping).
- **Roughness** from the metal mask: paper high (~235), metal low (~45). This is what makes the
  specular land only on the gilt.
- **`sharp` promotes 1-channel raw input to 3-channel sRGB on output.** Reading it back as
  1 channel silently shears the image — content appears vertically stretched and striped. Collapse
  explicitly: take every `info.channels`-th byte. This bug is quiet and costs an hour.
- Verify by eye at each stage. A correct normal map reads as legible terrain in flat blue-violet;
  a correct roughness map is near-white paper with black metal.

**Canonical pixel size across the set.** Every theme/card in a set should come out the *same* pixel
width and height, not just the same aspect ratio, so a frontend never has to special-case one card.
After finding the tight card box, resize with `fit: "contain"` into a fixed target box (default
900×1500 per the long-skinny-card preference below) — transparent background for the cutout, the
map's own neutral value for each map (mid-grey-blue `(128,128,255)` for normal, white for roughness,
black for height) — so nothing distorts and any letterboxing is invisible/neutral. Then remap the
measured slot percentages from the tight box onto the padded canonical box before writing `kit.json`
— they are not the same percentages.

**Slots: connected-component flood fill, closed first.** Measure the portrait window and caption
plaque as the largest smooth, bright, *connected* regions in the alpha-masked interior — not a
per-row brightness-coverage scan. Row-band coverage breaks on tall ornate frames: an isolated bright
petal beside the window widens that row's "coverage" and pulls the detected box outward even though
the petal never touches the window. Flood fill only follows pixels that actually touch, so it can't
be fooled that way. But flood fill alone breaks the opposite direction on a **twin-lancet or
mullioned window**: a thin gold divider bar down the middle reads as non-smooth (or non-bright) and
splits one visual opening into two disconnected components, and picking "the largest component"
then returns only half the window. Fix: apply a small morphological **closing** (dilate then erode,
a handful of px) to the smoothness/brightness mask before flood-filling — bridges a division that
thin without merging the window into the plaque below it (that gap is a full sill bar, much wider
than the closing radius). Detect the empty panels themselves by **local flatness** (`|luminance −
lowpass| < threshold`), not raw color — the panel and the surrounding parchment are often nearly
the same cream, so color can't separate them, but the panel is smooth where the parchment carries
paper texture and the panel is bounded by ornament everywhere else.

**Debug overlay: thick lines, always check it.** Draw the detected window/plaque rectangles with a
thick line (4px+), not 1px — a 1px line in a contrasting color still visually disappears against
similarly-colored gold ornament and gives false confidence that the slot is correct when it silently
isn't. Render the overlay over the actual cutout and inspect it by eye before shipping a kit; both
silhouette bugs above (velvet bleed, split-window under-detection) were invisible in the printed
percentage numbers alone and obvious the instant the overlay was actually looked at.

## Path B — no diffui (portable prompt pack)

Emit a paste-ready package instead of calling tools. Two hard style rules for everything the user
reads: plain language (no jargon), and one fully self-contained section per tool — fully
assembled prompts with the real card names filled in, no placeholders left for the user.

1. **Standing orders** — first message of a new image-chat thread: the identity brief plus rules
   that apply to every image (palette hexes, white background, no text or lettering in the art).
2. **The prompt sequence** — the same prompts as Path A steps 2–7, numbered in order, each
   beginning "Using the previous image as the reference, …". Tell the user to generate them
   strictly in order and re-run any step they don't accept before moving on.
3. **Maps** — in order of quality: a material-inference model (`fal-ai/patina` is what the
   reference tarot deck used, and it infers genuine material properties rather than guessing from
   luminance); then any PBR/material-map service; then the local `sharp` derivation in Path C,
   which is deterministic and free but whose roughness is really only "metal vs not".
4. User drops the files into the kit tree; you write `kit.json`.

## Continuity rules

- Change exactly one thing per prompt; repeat frame/size language verbatim everywhere else.
- Palette hexes never vary between prompts.
- One backdrop colour for every card render until the cutout step — white behind dark cards, mid
  grey or dark behind light ones.
- Treat "only scale it up" as a re-generation and diff the result; it is not an upscale.
- Maps must match their card image's dimensions 1:1 or displacement will smear.
- For template frames, leave the slots genuinely empty in the art ("leave the arched window empty
  ivory, leave the plaque blank, no lettering anywhere"). Baked-in names and faces cannot be
  un-baked, and one empty frame serves every person in the set.

## Done when

Every front shares an identical frame at a glance; cutouts have real transparency (verify over a
dark surface, not white); the art shows visible relief with cast shadow; the normal map reads as
legible terrain rather than striping; maps align 1:1; the kit rebuilds from committed source with
one command; `kit.json` is complete and paths resolve.

Then hand off to interactive-card-effects, which lights this kit with a WebGL shader — that skill
is where the maps actually pay off, and its opening section explains why CSS cannot substitute.
