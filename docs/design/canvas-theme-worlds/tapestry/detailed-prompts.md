# Detailed Tapestry Prompts — Canvas Backdrop Art

Copy-ready prompts for the two approved canvas worlds. Use **one chat/session per theme**. Accept Image 1 before continuing — it is the style lock for everything after.

**Node-placement rule (both themes):** Leave large empty / feathered zones where person cards sit. Do not put focal landmarks, seals, faces, or bright glints in the left/right card columns. Atmosphere only in those bands.

---

## Illuminated Keep — Standing orders (paste first)

```text
You are the sole artist for a matching decorative art kit used behind a digital family-tree canvas.

WORLD: Illuminated Keep — medieval castle storybook charter page.
MEDIUM: Illuminated-manuscript gouache with gold leaf on aged parchment; visible vellum grain and gentle craquelure. Not photorealistic. Not 3D render. Not flat vector.

PALETTE (lock strictly):
- parchment #e9dcbe
- pale vellum #f2e8cf
- heraldic red #7c2418 (sparingly — bosses, banner tips, thin accents)
- gold leaf #a3771c
- walnut ink #2a1e12
- azure #2c4a75 only as a tiny cool glint if needed

LIGHT: Soft candlelight from UPPER LEFT only. Warm falloff. No second key light. No rim light from the right.

MOTIFS ALLOWED: castle stonework, battlements, quatrefoils, vine scrolls, oak leaves, furled banners, wax-seal shapes (no text in seals), carved strapwork, roots and foundation stones.

HARD BANS: any text, letters, numbers, monograms, human faces or figures, animals with faces, watermarks, logos, UI chrome, hard rectangular picture borders, pure white (#ffffff), pure black (#000000), neon, photographic grain overlays, modern materials (glass, chrome, concrete).

COMPOSITION FOR THE APP:
- A narrow vertical mural spine (~center third) carries the story imagery.
- LEFT and RIGHT thirds must stay quieter: soft parchment, faint vine only — these are NODE PLACEMENT ZONES where family cards will sit. Do not put towers, gates, crests, or bright gold masses in those side zones.
- Edges that must feather: fade cleanly into plain parchment #e9dcbe with no hard crop line.

I will request one asset at a time. After I say "Accepted", match that exact hand, palette, and light for every later image. Prefer small fixes over regenerating from scratch.
```

### Keep · SPINE-1 (anchor) — generate first

**Export:** 1200×1320 (10:11) · WebP ≤150 KB  
**Edges:** L/R feather to parchment · bottom unfinished mid-stone for outpaint

```text
Tall vertical mural panel for a family-tree page background.
SUBJECT: Upper reach of a hilltop keep at soft dawn — tower tops, battlement silhouette, oak canopy branches framing the sky, one or two furled banners without emblems.
COMPOSITION: All primary architecture stays in a NARROW CENTER COLUMN (~40% width). Left and right margins are nearly empty parchment with only the faintest vine scroll — reserved for floating family cards. Bottom edge cuts mid-stonework, unfinished, so the mural can continue downward. Top may bleed slightly.
STYLE: Illuminated manuscript gouache + gold leaf on aged parchment, vellum grain, soft craquelure.
LIGHT: Candle-warm key from upper left; parchment sky stays pale, never white.
COLORS: Only #e9dcbe, #f2e8cf, #7c2418, #a3771c, #2a1e12 (azure only if a tiny cool shadow).
NEGATIVE: No text, no faces, no people, no animals, no hard border, no photorealism, no busy detail in the side margins, no centered crest blocking the middle third.
ASPECT: Tall portrait 10:11.
```

### Keep · SPINE-2 (lower mural)

**Method preferred:** Outpaint / extend SPINE-1 downward.  
**Export:** 1200×1320

```text
Continue the accepted Keep mural DOWNWARD in the exact same hand and palette.
SUBJECT: Castle gate house, climbing vine on stone, then foundation stones dissolving into roots.
COMPOSITION: Keep architecture in the center column only. Left/right remain quiet parchment node zones. Top edge must seamlessly continue from the unfinished mid-stone of SPINE-1. Bottom stops unfinished mid-roots.
LIGHT: Same upper-left candlelight. Slightly deeper walnut shadows than SPINE-1 as we go lower.
NEGATIVE: No new landmarks that demand attention in the side margins; no text; no faces; no hard frame.
```

### Keep · SPINE-MID (loopable middle — deep trees only)

**Method preferred:** Outpaint between accepted SPINE-1 and SPINE-2.  
**Export:** 1200×1320

```text
A middle stretch of the same Keep mural that can repeat between upper and lower panels.
SUBJECT: Only continuous stone ashlar wall with vine scroll and occasional quatrefoil — NO towers, NO gate, NO distinctive landmark.
COMPOSITION: Center column only; side parchment node zones stay empty. Top and bottom both stop mid-pattern so the piece tiles vertically without a seam story.
STYLE/LIGHT/PALETTE: Identical to accepted SPINE-1.
NEGATIVE: No focal object, no crest, no banners, no text, no faces.
```

### Keep · HEADER-CREST

**Export:** 2080×480 (13:3)

```text
Wide header ornament for the top of a family-tree canvas.
SUBJECT: A single carved stone shield (blank — no heraldry marks) wreathed in oak leaves, flanked by two furled banners without emblems. Small, centered, ceremonial.
COMPOSITION: Crest sits in the upper center. Generous empty parchment on left, right, and below — room for the page title and for cards starting lower. Top edge may bleed. Left/right/bottom feather to plain #e9dcbe.
STYLE: Same illuminated manuscript kit as accepted SPINE-1. Gold leaf accents on leaf tips and shield rim only.
NEGATIVE: No letters on the shield, no faces, no busy ground pattern, no full castle scene.
ASPECT: Wide 13:3.
```

### Keep · FOOTER-TERMINUS

**Export:** 1600×344 (~20:4.3)

```text
Wide closing footer for the Keep mural world.
SUBJECT: Roots and foundation stones resolving into ONE carved horizontal stone rail with a thin gold-leaf edge — the only hard bottom edge in the kit.
COMPOSITION: Rail sits at the very bottom. Above it, unfinished mid-stone/roots that could meet SPINE-2. Sides feather to parchment. Keep the center denser; outer thirds quieter for any residual node overhang.
STYLE/LIGHT/PALETTE: Match accepted SPINE-1.
NEGATIVE: No text carved into the rail, no faces, no modern baseboard look.
```

### Keep · NODE-FRAME (9-slice card frame)

**Export:** 512×512 · design for 96px corner insets · transparent or parchment to cut later

```text
Square ornamental frame asset for family-tree person cards (9-slice).
SUBJECT: Rectangular gold-leaf strapwork frame with small heraldic-red corner bosses. Inner and outer edges PERFECTLY STRAIGHT and parallel. All four sides symmetric. Completely EMPTY center (transparent or flat parchment).
COMPOSITION: Ornament lives only in a ~96px border ring. Corners are distinctive fixed pieces; edge middles are simple straight gold moldings that can stretch. No vignette art in the center.
STYLE: Match Keep metal (gold #a3771c, red #7c2418 bosses, walnut edge line). Manuscript gouache, not chrome.
LIGHT: Soft highlight on upper-left corner only.
NEGATIVE: No text, no face in bosses, no oval (that's a separate asset), no busy filigree that breaks when stretched, no drop shadow.
ASPECT: Exact square.
```

### Keep · PORTRAIT-MASK

**Export:** 300×360 (3:3.6) · alpha outside the ring

```text
Tall arched-oval portrait bezel matching the Keep NODE-FRAME metal.
SUBJECT: Gold leaf oval/arch ring with a thin heraldic-red inner hairline. Empty center. Outside the ring fully transparent (or flat parchment to remove).
STYLE/LIGHT: Same gold as NODE-FRAME; upper-left glint only.
NEGATIVE: No portrait inside, no text, no rectangular outer plate, no heavy baroque overload.
```

---

## Midnight Archive — Standing orders (paste first)

```text
You are the sole artist for a matching decorative art kit used behind a digital family-tree canvas.

WORLD: Midnight Archive — museum at night / genealogical vault.
MEDIUM: Oil on dark gesso with soft varnish sheen; fine dust motes only in the key light. Moody, not horror. Not photoreal product shot. Not neon cyberpunk.

PALETTE (lock strictly):
- near-black #0f0d0a
- umber surface #1c1610
- gold #e5aa45
- pale gold #f3c877
- bone #cec1a8 (rare highlights)

LIGHT: ONE warm museum lamp / candle key from UPPER LEFT. Deep falloff to black. Nothing fully lit. No daylight. No cool blue fill.

MOTIFS ALLOWED: gilt picture frames (empty or turned away), archive drawers, brass handles, ribbon-tied document bundles (no readable labels), damask drapery shadow, candle glow, thin gold filigree.

HARD BANS: text, letters, readable labels, human faces or figures, daylight windows, saturated non-gold colors, hard rectangular crop borders, pure white, neon, modern screens, watermarks.

COMPOSITION FOR THE APP:
- CSS already provides a continuous near-black ground — your art is FEATHERED VIGNETTES and strips, not a full wallpaper.
- Outer 15% of each vignette must dissolve into solid #0f0d0a so cards and connectors stay legible.
- Leave open dark fields in the central tree area where person cards float — decoration hugs margins, header, footer, and generation seams.

I will request one asset at a time. After "Accepted", match that hand for all later images.
```

### Midnight · HEADER-MURAL (anchor) — generate first

**Export:** 1800×380 (≈9:1.9)

```text
Very wide establishing vignette for the top of a dark family-tree canvas.
SUBJECT: Dim archive hall at night — depth of empty gilt frame corners and brass drawer pulls catching one warm lamp; shelves recede into black.
COMPOSITION: Atmosphere heaviest in the upper band. BOTTOM THIRD and BOTH SIDE MARGINS must fade fully to solid near-black #0f0d0a — those regions are where the title sits lightly and where the first row of family cards begins. No bright object in the lower center.
STYLE: Oil on dark gesso, soft varnish sheen, museum-at-night.
LIGHT: Single warm key upper left; dust motes only in the beam.
COLORS: Only #0f0d0a, #1c1610, #e5aa45, #f3c877, #cec1a8.
NEGATIVE: No text on frames, no faces in portraits, no daylight, no hard border, no busy lower third.
ASPECT: Extreme wide ~9:2.
```

### Midnight · DIVIDER-STRIP (must tile ×3)

**Export:** 1024×128 (8:1) · test three copies side-by-side before accepting

```text
Very wide, thin horizontal divider band for seams between generations on a dark family tree.
SUBJECT: Delicate gold filigree rule with two or three tiny candle glints, floating on darkness.
COMPOSITION: Ornament is a horizontal band in the vertical middle. ABOVE and BELOW the band fade quickly to transparent / solid #0f0d0a. LEFT and RIGHT ends must be designed to LOOP — when three copies sit edge-to-edge there is NO visible join, no brighter knot at the seam, no unique center medallion.
STYLE/LIGHT/PALETTE: Match accepted HEADER-MURAL gold.
NEGATIVE: No text, no faces, no thick bar that fights card edges, no non-tileable focal jewel at center.
ASPECT: 8:1 strip.
```

### Midnight · NODE-FRAME

**Export:** 512×512 · 96px insets · cut to alpha after

```text
Square thin elegant rectangular gilt frame for dark-theme person cards (9-slice).
SUBJECT: Straight inner and outer gold moldings, four-way symmetry, empty center. One subtle pale-gold glint on the TOP-LEFT corner only. No red bosses (Keep-only).
COMPOSITION: Ornament only in border ring; center empty black/transparent for the card face.
STYLE: Same gold metal language as HEADER-MURAL.
NEGATIVE: No text, no heavy baroque corners that break when stretched, no oval.
ASPECT: Exact square.
```

### Midnight · PORTRAIT-MASK

**Export:** 300×360

```text
Tall arched-oval gilt portrait bezel matching Midnight NODE-FRAME.
Empty center. Outside ring transparent. Upper-left glint only. No text, no face inside. Museum-at-night oil metal, palette locked to #e5aa45 / #f3c877 on #0f0d0a.
```

### Midnight · CORNER-NW

**Export:** 300×300 · mirrored in CSS for other corners

```text
Small ornamental brass corner flourish for the top-left of the dark canvas.
SUBJECT: Brass fitting / gilt corner strap catching the museum lamp.
COMPOSITION: Anchored in the TOP-LEFT corner of the square. Fades to solid #0f0d0a toward the lower-right (toward the tree). Designed so horizontal and vertical flips still read correctly.
NEGATIVE: No text, no face, no full frame, no object in the lower-right quadrant.
```

### Midnight · MARGIN-VIGNETTE

**Export:** 380×560 (2:3) · intended ~40% opacity in product

```text
Tall narrow atmospheric vignette for page left/right margins behind a family tree.
SUBJECT: Soft damask drapery fold barely catching warm light — more shadow pattern than object.
COMPOSITION: Bleed toward the outer page edge; feather on the three inner sides into #0f0d0a. Keep the inner half nearly empty so cards remain readable. Very low contrast.
NEGATIVE: No readable pattern that looks like letters, no faces, no bright gold masses.
```

### Midnight · FOOTER-VIGNETTE

**Export:** 1400×236 (≈7:1.2)

```text
Wide low closing vignette for the bottom of the Midnight Archive canvas.
SUBJECT: Top edge of a closed archive drawer with a thin brass rail, receding into darkness.
COMPOSITION: Brass rail forms one clean horizontal line at the VERY BOTTOM. Everything above fades upward into #0f0d0a. Sides feather. Keep the center slightly denser; do not put a bright handle knob under where a centered card might sit — offset any highlight slightly left (key light side).
STYLE/LIGHT/PALETTE: Match HEADER-MURAL.
NEGATIVE: No labels on the drawer, no faces, no daylight gap under the rail.
```

---

## Acceptance checklist (every asset)

1. Key light is upper-left only.
2. Feather edges dissolve into the theme ground color (parchment or #0f0d0a) — no hard picture border.
3. Node placement zones stay quiet (Keep sides / Midnight open fields).
4. No text, faces, watermarks.
5. Palette locked — no rogue cyan, magenta, or pure white.
6. DIVIDER-STRIP: three copies side-by-side show no seam.
7. NODE-FRAME: edges stay straight; center empty; corners distinct for 9-slice.

## Suggested generation order

**Keep:** SPINE-1 → SPINE-2 → SPINE-MID → HEADER-CREST → FOOTER-TERMINUS → NODE-FRAME → PORTRAIT-MASK  

**Midnight:** HEADER-MURAL → DIVIDER-STRIP (tile test) → NODE-FRAME → PORTRAIT-MASK → CORNER-NW → MARGIN-VIGNETTE → FOOTER-VIGNETTE

## Target folders (when importing)

```text
public/themes/illuminated-keep/tapestry/
public/themes/midnight-archive/tapestry/
```

File names: match slot ids lowercase, e.g. `spine-1.webp`, `header-mural.webp`, `divider-strip.webp`.
