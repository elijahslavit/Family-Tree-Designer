---
name: interactive-card-effects
description: Implement the in-browser presentation layer for a card-art kit — staggered reveal animation, subtle 3D tilt toward the cursor, cursor-tracked dynamic lighting, roughness-masked specular sheen, height-map displacement, and optional WebGL normal-map relighting — with hard performance and reduced-motion budgets. Trigger when the user wants cards to "feel 3D" or "come alive", asks for dynamic/cursor lighting, holographic or parallax card effects, or wants to wire up a kit produced by card-art-pipeline.
---

# interactive-card-effects

Turn a static card-art kit into a tactile, lit, responsive experience. The effects layer is
theme-agnostic: it consumes whatever artwork the kit contains and never dictates subject matter.

## Input contract

Expects a kit in the card-art-pipeline shape: `kit.json` plus transparent card fronts, an
optional back, full-bleed background art, and per-card `normal` / `roughness` / `height` maps.
If the maps are missing, route to the card-art-pipeline skill first — tilt and cursor lighting
work without maps, but sheen masking and displacement need them. If `kit.json` records a
`buildLink`, fetch that page for exact asset dimensions and source URLs before wiring paths.

## Effect stack (build in this order; each ships independently)

1. **Reveal animation.** Cards deal in staggered on a trigger (button, scroll, load): transform +
   opacity only, ~60–90ms stagger, spring-ish easing. If `back.png` exists, reveal as a
   back-to-front flip (`rotateY` with `backface-visibility: hidden` on two stacked faces).
2. **Tilt toward the cursor.** Perspective on a wrapper (~1000px); per-card `rotateX`/`rotateY`
   from the pointer's offset to the card center, clamped to ±6–8°. Lerp the displayed angle
   toward the target each frame (factor ≈ 0.1) and ease back to rest on pointer leave — snapping
   directly to the pointer reads as jitter, not physicality.
3. **Cursor light.** One overlay div per card holding a radial gradient positioned by CSS custom
   properties (`--px`, `--py`); blend with `mix-blend-mode: soft-light` (subtle) or `overlay`
   (strong). The light warms the artwork's own texture rather than painting over it.
4. **Specular sheen.** A second, tighter gradient sweep that travels with the pointer, blended
   `color-dodge` at low opacity, and masked by the roughness map (`mask-image`) so matte areas of
   the artwork stay matte — this masking is what separates the effect from a cheap glare. This is
   the classic CSS holographic trading-card technique.
5. **Height-map displacement.** Default tier: SVG filter — `feImage` loading the height map into
   `feDisplacementMap`, with `scale` driven from the pointer offset via JS. Cheap and good for
   subtle warps; verify in Safari, whose `feImage` handling is quirky. Keep scale small
   (≤ 12) — displacement should read as relief, not liquid.
6. **WebGL relighting (optional, only if the user wants true dynamic light).** Fragment shader
   samples base color + normal + height; displace UVs by height along the pointer vector; light
   = `dot(normal, normalize(lightPos - fragPos))`. One canvas per card, sized to the card, only
   for the card currently hovered. Skip this tier unless asked — the CSS stack covers most needs.
7. **Background ambiance.** The kit's background art sits full-bleed behind everything, fixed or
   drifting on a very slow parallax (4–8px total travel). Cards float above it with layered
   shadows (one tight, one wide and soft).

## Architecture rules

- One self-contained component matching the repo (React/Next → a single client component;
  otherwise a vanilla module). All pointer math lives in **one** `pointermove` listener on the
  container; per-card values are derived from it — never one listener per card.
- CSS custom properties are the bus between JS and styles; JS writes numbers, CSS renders them.
- Throttle with `requestAnimationFrame`; cache card rects on resize/scroll — never call
  `getBoundingClientRect` inside the move handler.
- `will-change: transform` only while a card is being interacted with, not permanently.
- Unified pointer events (mouse + touch). Touch fallback: tap to reveal/flip, no tilt.
- `prefers-reduced-motion`: instant fade reveal, a static light at a fixed flattering position,
  no tilt, no displacement. This is a hard requirement, not a nice-to-have.
- Maps load lazily and only for the tiers actually enabled; preload the first-visible card.

## Wiring sketch (the pattern, not a paste target)

```js
container.addEventListener("pointermove", (e) => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = null;
    for (const card of cards) {            // rects cached on resize
      const dx = (e.clientX - card.cx) / card.halfW;   // -1..1
      const dy = (e.clientY - card.cy) / card.halfH;
      card.targetRX = clamp(-dy * MAX_TILT); card.targetRY = clamp(dx * MAX_TILT);
      card.el.style.setProperty("--px", `${(dx + 1) * 50}%`);
      card.el.style.setProperty("--py", `${(dy + 1) * 50}%`);
    }
  });
});
// separate rAF loop: displayed angle += (target - displayed) * 0.1
```

## Acceptance checklist

- Composite-only frames during pointer movement (DevTools performance panel: no layout, no paint
  in the hot path).
- Graceful degradation: without maps, tilt + light still work; without JS, cards render static
  and legible.
- Reduced motion honored end to end; the reveal trigger is a real button (focusable, visible
  focus, works from the keyboard).
- Cutout transparency verified over the background art; sheen doesn't blow out the palette on
  either the darkest or lightest card.
- If the host page has light and dark contexts, both are checked — blend modes that flatter a
  dark surface can wash out on a light one.
