## Approved style master (men’s)

**Locked:** Italy v5 Option D (`imageId` `b65e5450-2c35-4e69-994d-e12d535c656c`)  
Source file: `public/card-kits/italian-heritage-masculine/source-frame.webp`

Every other men’s theme must match this card’s **exact** window size/location, nameplate size/location, gap, border weight, ornament density (~this richness), vignette scale, and corner-boss treatment — only swap country-specific motifs from the ledger.

---

# Heritage frames — men’s layout contract (locked)


Locked 2026-07-21. Consistency first. Feminine variants later.

## Source of truth

**Geometry:** `public/card-kits/_templates/layout-v1-masculine/source-frame.webp`  
**Style / spacing / density master:** Italy v5 Option D → `public/card-kits/italian-heritage-masculine/source-frame.webp`

Every men’s theme is derived from both: lock window + nameplate to the golden template / Italy D spacing; match Italy D’s ornament weight; swap only country motifs.

Do **not** regenerate from scratch. Do **not** change window or plaque shape.

Canonical slots (`public/card-kits/_templates/canonical-slots.json` → `layout-v1-masculine`):

| Slot | left | top | width | height | shape |
|---|---|---|---|---|---|
| window | 21.8 | 14.5 | 49.4 | 52.7 | round-top arch (`archRadiusY`: 26) |
| plaque | 19.9 | 72.5 | 53.2 | 11.3 | wide rectangle, notched corners |

After each themed build: measure → validate within **2pp** of canon → overwrite kit `slots` with exact canon numbers.

## House skeleton (all 7 themes)

```text
┌────────────────────────────────┐
│  · crown ·                     │  theme crown above arch (small)
│  corner    corner              │  swappable culture charges
│                                │
│      ╔══════════════╗          │  LOCKED round arch window
│      ║   PORTRAIT   ║          │  empty ivory interior
│      ║              ║          │
│      ╚══════════════╝          │
│      ┌──────────────┐          │  LOCKED wide nameplate
│      │  NAMEPLATE   │          │  empty ivory; full name + years
│      └──────────────┘          │
│  vignette          vignette    │  bottom flanks only — NO crest
│  corner                 corner │
└────────────────────────────────┘
```

- **Window:** round-top arch only (Gothic/pointed may appear as *rail ornament*, never as a new hole).
- **Nameplate:** canon height (~11%) — wide enough for full name + lifespan. **Do not increase** the vertical gap between window and plaque vs the golden template — that spacing is already locked. No crest under the plaque.
- **Vignettes:** bottom-left and bottom-right, **different** scenes; mirrored weight, not duplicate content. Sit in the outer border margin — never between window and plaque.
- **Base crest / shield:** **REMOVED.** No laurel-wreathed shield, no center emblem under the nameplate — it crowds window + plaque.
- **Corners:** four culture-specific charges (same motif family, identical treatment) — swappable per theme.
- **Border respect:** ornament must *embrace* the golden template’s existing borders (pinstripes, corner placements, beaded moldings) — decorate the quiet parchment zones and rail bands. Do **not** overwrite, thicken, or replace the template’s structural borders with a new heavier frame.
- **Paper / gold / aging / bilateral symmetry:** inherited from the golden template.

## Kit naming

`public/card-kits/<theme>-heritage-masculine/` for this pass.

Rebuild targets: `italian`, `england`, `germany` (replace prior drift).  
New: `france`, `ireland`, `mexico`, `african-american`.

Legacy folders without `-masculine` may remain until the app is rewired; new kits are the source of truth.

## Shared negatives (every prompt)

no text, no lettering, no labels, no numbers, no banners or ribbon mottos, no watermark, no national flags, no military insignia, no iron crosses, no imperial eagles, no face or portrait in the window, do not cover or shrink the portrait window or nameplate interiors — both stay smooth blank ivory, keep window and nameplate pixel-identical in size and position to @template
