# Tapestry slot map — Midnight Archive (Architecture B · Vignettes on a Continuous Ground)

Decided 2026-07-15. The CSS ground carries continuity; art appears as feathered vignettes plus one
tileable divider strip covering every generation seam. Wireframe & visual reference: tapestry kit
artifact (Layout B).

## Style bible (prefix every generation verbatim)

- Medium & grain: oil on dark gesso with a soft varnish sheen; museum-at-night mood, fine dust motes
  in the key light
- Palette (exact hex): #0f0d0a near-black · #1c1610 umber surface · #e5aa45 gold · #f3c877 pale gold ·
  #cec1a8 bone
- Light direction: single warm key from the upper left, deep falloff to black; nothing fully lit
- Era / motif vocabulary: gilt frames, archive drawers, ribbon-tied bundles, candle glow, damask
  shadow patterns, brass fittings
- Never include: text, faces, saturated colors beyond the gold range, hard edges, daylight
- Reference image: the first accepted HEADER-MURAL render — condition all later generations on it

## Slots

| Slot id | Purpose | Aspect / export @2x | Z | Edges (T / R / B / L) | Content brief |
|---|---|---|---|---|---|
| HEADER-MURAL | Establishing scene under the title | 9:1.9 · 1800×380 | 2 | bleed / feather / feather / feather | Dim archive hall, one lamp on gilt corners |
| CORNER-NW | Corner flourish (mirror for NE/SW/SE) | 1:1 · 300×300 | 3 | outer bleed, inner feather | Brass fitting catching the key light |
| DIVIDER-STRIP | Seam-covering band at every generation join | tile 8:1 · 1024×128 | 2 | feather / bleed / feather / bleed | Gold filigree rule with candle-glint; must tile ×3 |
| MARGIN-VIGNETTE | Ambient depth at page margins | 2:3 · 380×560 | 1 | feather ×3, bleed at page edge | Damask drapery fragment, reads at 40% opacity |
| NODE-FRAME | 9-slice card frame | 512×512, 96px insets | 4 | corners fixed, edges tile | Thin gilt frame, empty center |
| PORTRAIT-MASK | Portrait bezel | 3:3.6 · 300×360 | 4 | ornament ring, outside alpha | Arched gilt bezel |
| FOOTER-VIGNETTE | Closing scene at page end | 7:1.2 · 1400×236 | 2 | feather / feather / ornament / feather | Archive drawer receding into dark, brass base rule |

## Order of generation

1. HEADER-MURAL (anchor)
2. DIVIDER-STRIP (tile-test ×3 before accepting)
3. NODE-FRAME + PORTRAIT-MASK
4. CORNER-NW, MARGIN-VIGNETTE, FOOTER-VIGNETTE

## Composition notes

- Ground layer (CSS): existing near-black + gold radial glow in midnight-archive.css
- Feather edges must be indistinguishable from #0f0d0a in their outer 15%
- Acceptance per asset: key light upper left; palette-locked; ≤150 KB WebP/AVIF each, ≤900 KB total
