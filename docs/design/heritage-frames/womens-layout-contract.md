## Approved style master (women’s)

**Locked:** Italy feminine (existing D→C pick)  
Source file: `public/card-kits/italian-heritage-feminine/source-frame.webp`

Every other women’s theme must match this card’s **exact** window size/location, nameplate size/location, gap, border weight, ornament density (~this richness), vignette scale, and corner-boss treatment — only swap country-specific motifs from the men’s ledger, rendered in the feminine register (softer florals, ribbons, lighter gold).

**First country that met the bar:** England v3 Option B → `public/card-kits/england-heritage-feminine/source-frame.webp`

---

# Heritage frames — women’s layout contract (locked)

Locked 2026-07-22. Same spacing discipline as the men’s contract — different wireframe only.

## SIZE REQUIREMENTS (lead every prompt with this — non-negotiable)

Paste this block **first** in every feminine country derivation prompt. Do not bury it.

**References (always attach both):**
- `@master` = Italy feminine `source-frame.webp` (style + spacing master)
- `@sizebar` = England feminine v3 B `source-frame.webp` (accepted full-card size bar)

```text
SIZE + WIREFRAME PROPORTIONS — REJECT ANY RESULT THAT FAILS THESE:
1. ONE COMPLETE vertical keepsake card filling the ENTIRE frame edge-to-edge — identical OUTER CARD SILHOUETTE and proportions to @master and @sizebar. Not a cropped detail, not a floating motif, not a partial border, not a white sheet with ornaments around a hole.
2. Oval cameo window: SAME width, height, and center position as @master (pixel-identical). Do not shrink, enlarge, raise, lower, or widen/narrow the oval. Match @sizebar's window scale exactly.
3. Cartouche nameplate: SAME width, height, and position as @master (pixel-identical). Do not shrink it to a sliver or stretch it.
4. Gap / spacing stack: the vertical rhythm window → gap → plaque → bottom margin must match @master and @sizebar. Do not increase or collapse any of those gaps.
5. Border / margin weight: outer parchment margin and rail thickness must match @master — do not thicken the frame so the window reads smaller.
6. Ornament density: SAME richness/fullness as @master and @sizebar — not sparse, not washed out, not a fragment.
Reject any option where the card reads smaller than @sizebar, or where window/plaque sizes clearly drift from @master.
```

England v3 Option B is the reference for “this meets size.” Germany v2 D is locked but still watch for drift — prefer options closer to Italy + England B.

## Source of truth

**Geometry:** `public/card-kits/_templates/layout-v2-feminine/source-frame.webp` (oval + cartouche)  
**Style / spacing / density master:** Italy feminine → `public/card-kits/italian-heritage-feminine/source-frame.webp`

Every women’s theme is derived from the Italy feminine master (not the blank golden template alone).

Do **not** regenerate from scratch. Do **not** change window or plaque shape. Do **not** derive from the blank golden template without the Italy master as the spacing reference.

Canonical slots (`public/card-kits/_templates/canonical-slots.json` → `heritage-feminine-shared`):

| Slot | left | top | width | height | shape |
|---|---|---|---|---|---|
| window | 29.2 | 26.5 | 41.1 | 30.6 | oval cameo |
| plaque | 31.1 | 57.7 | 37.7 | 11.4 | cartouche |

After each themed build: measure → validate within **2pp** of `heritage-feminine-shared` → overwrite kit `slots` with exact canon numbers. App overlay uses the same shared slots for every feminine country.

## House skeleton (all 7 themes)

Same as men’s: crown · corners · LOCKED oval window · LOCKED cartouche plaque · bottom vignettes only · NO crest under plaque.

- **Window:** soft oval cameo only (never invent a new hole shape).
- **Nameplate:** canon height — wide enough for full name + lifespan. **Do not increase** the vertical gap between window and plaque vs Italy feminine.
- **Vignettes:** bottom-left and bottom-right only; never between window and plaque. Do not force ships/boats unless the ledger explicitly requires them.
- **Base crest / shield:** REMOVED (same as men’s).
- **Register:** softer curling gold, ribbon-bow crown, florals in bloom — still adult memorial, never cutesy.

## Kit naming

`public/card-kits/<theme>-heritage-feminine/`

## Prompt skeleton (feminine country)

1. SIZE REQUIREMENTS block (above)  
2. `@master` structural lock (paper, gold, aging, bilateral symmetry)  
3. Country motifs only (rail · crown · botanical · 2 vignettes · corner bosses · accents)  
4. Platinum-grey backdrop  
5. Shared negatives

## Shared negatives (every prompt)

no text, no lettering, no labels, no numbers, no banners or ribbon mottos, no watermark, no national flags, no military insignia, no face or portrait in the window, do not cover or shrink the portrait window or nameplate interiors — both stay smooth blank ivory, keep window and nameplate pixel-identical in size and position to @master
