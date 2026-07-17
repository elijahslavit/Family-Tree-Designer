# Tapestry slot map — The Illuminated Keep (Architecture A · Mural Spine)

Decided 2026-07-15. One continuous vertical mural runs the scroll; generations hang beside it.
Wireframe & visual reference: tapestry kit artifact (Layout A).

## Style bible (prefix every generation verbatim)

- Medium & grain: illuminated-manuscript gouache with gold leaf on aged parchment; visible vellum
  grain and gentle craquelure
- Palette (exact hex): #e9dcbe parchment · #f2e8cf pale vellum · #7c2418 heraldic red ·
  #a3771c gold leaf · #2a1e12 walnut ink · #2c4a75 azure accent (sparingly)
- Light direction: soft candlelight from the upper left; warm falloff
- Era / motif vocabulary: castle stonework, quatrefoils, vine scrolls, banners, wax seals,
  battlements, oak leaves
- Never include: text or lettering, human faces, watermarks, photorealism, hard pictorial edges,
  pure white or black
- Reference image: the first accepted SPINE-1 render — condition all later generations on it

## Slots

| Slot id | Purpose | Aspect / export @2x | Z | Edges (T / R / B / L) | Content brief |
|---|---|---|---|---|---|
| HEADER-CREST | Introduces the world above the title | 13:3 · 2080×480 | 2 | bleed / feather / feather / feather | Keep's gate crest with banners |
| SPINE-1 | Mural upper reach | 10:11 · 1200×1320 | 1 | outpaint / feather / outpaint / feather | Tower top and oak canopy at dawn |
| SPINE-MID | Repeatable middle reach (covers deep trees) | 10:11 · 1200×1320 | 1 | outpaint / feather / outpaint / feather | Stonework and vine wall, visually loopable |
| SPINE-2 | Mural lower reach | 10:11 · 1200×1320 | 1 | outpaint / feather / outpaint / feather | Gate, roots, foundation |
| FOOTER-TERMINUS | Mural resolves at page end | 20:4.3 · 1600×344 | 2 | outpaint / feather / ornament / feather | Roots resolving into a carved stone base |
| NODE-FRAME | 9-slice shield/card frame | 512×512, 96px insets | 4 | corners fixed, edges tile | Gold strapwork frame, red corner bosses, empty center |
| PORTRAIT-MASK | Portrait bezel | 3:3.6 · 300×360 | 4 | ornament ring, outside alpha | Gold oval bezel matching frame metal |

## Order of generation

1. SPINE-1 (anchor — iterate until it nails the bible, then reference-condition everything)
2. SPINE-2, then SPINE-MID by outpainting from accepted spines
3. HEADER-CREST, FOOTER-TERMINUS (outpaint from spine ends)
4. NODE-FRAME, PORTRAIT-MASK

## Composition notes

- Ground layer (CSS): existing parchment gradient in illuminated-keep.css — mural edges feather into it
- Spine column ≈ 300px CSS width, centered; nodes flank left/right; connectors route around the mural
- Pilot depth is 1–3 generations: SPINE-1 + SPINE-2 suffice; SPINE-MID inserts for deeper trees
- Acceptance per asset: light from upper left; declared feather edges reach true alpha; palette-locked
  to tokens; ≤150 KB WebP/AVIF each, ≤900 KB total per theme
