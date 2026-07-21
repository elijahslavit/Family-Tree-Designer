---
name: interactive-card-effects
description: Implement the in-browser presentation layer for a card-art kit — per-pixel WebGL relighting from normal/roughness/height maps, height parallax, staggered reveal, and subtle 3D tilt — with hard performance and reduced-motion budgets. Trigger when the user wants cards to "feel 3D" or "come alive", asks for dynamic/cursor lighting, holographic or parallax card effects, references the renderaissance/tarot card effect, or wants to wire up a kit produced by card-art-pipeline.
---

# interactive-card-effects

Turn a static card-art kit into a tactile, lit, responsive surface. The effects layer is
theme-agnostic: it consumes whatever artwork the kit contains and never dictates subject matter.

## The one thing that matters

**If the user wants the card to look lit, the answer is a WebGL2 shader over the card, not CSS.**

CSS masks and blended gradients can only *brighten regions*. They cannot turn a surface toward a
light, so relief stays flat no matter how good the maps are. A masked radial gradient looks like a
moving glow; `dot(N, L)` against a normal map looks like a lit object. There is no CSS
approximation of the second — do not spend a cycle trying, and do not present a masked-gradient
build as the effect. This was learned the expensive way: a full CSS sheen/mask implementation
shipped, looked flat, and was thrown away for the shader below.

Build the shader tier **first**. Everything else here is ornament around it.

## Input contract

Expects a kit in the card-art-pipeline shape: `kit.json` plus a transparent card front and
per-card `normal` / `roughness` / `height` maps. Maps must match the front's dimensions 1:1.
No maps → route to card-art-pipeline first; tilt and reveal work without them, lighting does not.

The art itself must carry physical relief — embossing, engraving, impasto, cut grooves. Flat line
art yields a flat normal map and the shader will have nothing to light. If the art is flat, fix
the art, not the shader.

## Tier 1 — per-pixel relighting (the effect)

A WebGL2 canvas absolutely positioned over the card `<img>`, same box. The image stays underneath
as the no-WebGL fallback; fade the canvas in once its textures upload.

Proven fragment shader — normal-mapped diffuse, roughness-shaped Blinn-Phong specular, height
parallax. Ship this, then tune uniforms:

```glsl
#version 300 es
precision highp float;
in vec2 vUv; out vec4 frag;
uniform sampler2D uDiffuse, uNormal, uRough, uHeight;
uniform vec2 uMouse; uniform float uHasMouse, uParallax, uLightZ, uNormalStr;
uniform float uSpecStr, uDiffuseAmt, uAmbientAmt, uMotion;
uniform vec3 uLightColor, uAmbientColor;

void main() {
  vec2 uv = vUv;

  // Height parallax: raised pixels drift against the pointer.
  float h0 = texture(uHeight, uv).r;
  if (uMotion > 0.5 && uHasMouse > 0.5) {
    vec2 viewOff = (uMouse - vec2(0.5)) * 2.0;
    uv = clamp(uv - viewOff * (h0 * uParallax), 0.001, 0.999);
  }

  vec4 diff = texture(uDiffuse, uv);
  float a = diff.a;
  if (a < 0.004) { frag = vec4(0.0); return; }   // keep the cutout's transparency

  vec3 albedo = diff.rgb;
  float rough = texture(uRough, uv).r;
  float h = texture(uHeight, uv).r;

  vec3 nRaw = texture(uNormal, uv).xyz * 2.0 - 1.0;
  nRaw.xy *= uNormalStr;
  vec3 N = normalize(vec3(nRaw.xy, max(nRaw.z, 0.08)));

  vec3 V = vec3(0.0, 0.0, 1.0);
  float ambRelief = 0.74 + 0.26 * max(N.z, 0.0);
  vec3 col = albedo * uAmbientColor * uAmbientAmt * ambRelief;

  vec2 lightUv = (uHasMouse > 0.5) ? uMouse : vec2(0.5, 0.72);  // flattering rest position
  vec3 L = normalize(vec3(lightUv.x - uv.x, lightUv.y - uv.y, uLightZ));
  float wrap = max(dot(N, L), 0.0) * 0.8 + 0.2;   // wrap term: never fully black
  col += albedo * uLightColor * (wrap * uDiffuseAmt);

  vec3 H = normalize(L + V);
  float shininess = mix(52.0, 6.0, clamp(rough, 0.0, 1.0));  // smooth = tight, rough = broad
  float spec = pow(max(dot(N, H), 0.0), shininess);
  spec *= (1.0 - rough * 0.85) * uSpecStr;
  spec *= 0.82 + 0.34 * h;
  col += uLightColor * spec;

  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.4);
  col += uLightColor * rim * (1.0 - abs(L.z)) * 0.1 * (1.0 - rough * 0.5);

  frag = vec4(clamp(col, 0.0, 1.0) * a, a);   // premultiplied
}
```

Vertex shader is a single full-screen triangle: `bufferData([-1,-1, 3,-1, -1,3])`,
`vUv = aPos * 0.5 + 0.5`, `drawArrays(TRIANGLES, 0, 3)`.

### Uniform tuning, by card

The published values suit a **dark** card on a night page. A **light** card washes out with them —
ambient must carry the exposure and the key only shape it, or the paper blows to white.

| Uniform | Dark card | Light card | Note |
|---|---|---|---|
| `uAmbientAmt` | 0.56 | 0.66 | raise for light art |
| `uDiffuseAmt` | 0.62 | 0.34 | lower for light art, or it clips |
| `uSpecStr` | 0.34 | 0.5 | the gilt highlight |
| `uNormalStr` | 1.35 | 1.5 | relief exaggeration |
| `uLightZ` | 0.5 | 0.45 | lower = more raking |
| `uParallax` | 0.0034 | 0.003 | 0 under reduced motion |

Sanity check: `albedo * ambient + diffuse` must stay under 1.0 for the brightest pixel, or
highlights clamp into flat white and the relief disappears exactly where it should be strongest.

### Setup details that cost time when wrong

- `getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false })`, then
  `blendFunc(ONE, ONE_MINUS_SRC_ALPHA)` — the shader already outputs `col * a`.
- `pixelStorei(UNPACK_FLIP_Y_WEBGL, 1)` before every `texImage2D`, and pointer y is
  `1 - (clientY - top) / height`. Get one of the two wrong and the light moves the wrong way
  vertically — which reads as "the effect is broken" without an obvious cause.
- Diffuse uploads as `RGBA` (it carries the cutout alpha); the three maps as `RGB`.
- Mipmaps + `LINEAR_MIPMAP_LINEAR`, else the maps alias badly when the card is small.
- Seed each texture with a 1×1 pixel before the images land: `[0,0,0,0]` for diffuse,
  `[128,128,255]` (flat normal) for the maps.
- Cap DPR at 2 and size from `offsetWidth/Height`, not `getBoundingClientRect` — the rect is
  mid-transform while the card tilts and would thrash the buffer every frame.
- **Draw on demand, not every frame.** Set `needsDraw` from pointer/resize and check it inside the
  rAF loop. A permanently spinning shader on a marketing page is a battery bug.
- Allow pointer overshoot (clamp to about -0.4…1.4) so the key can rake in from off the card.
- TypeScript: bind `const ctx: WebGL2RenderingContext = gl` right after the null check — nested
  draw/upload closures lose the narrowing and you get dozens of "possibly null" errors.
- Clean up on unmount: `getExtension("WEBGL_lose_context")?.loseContext()`.

Working reference implementation: `components/showcase/lit-card-surface.tsx` in
Family-Tree-Designer. Public prior art worth reading directly rather than from memory:
`https://html.non.io/tarot/js/card.js` (plain, unminified, fetchable with curl).

## Tier 2 — tilt, reveal, ambiance (after the shader works)

1. **Tilt toward the cursor.** Perspective on a wrapper (~1000px); `rotateX`/`rotateY` from the
   pointer offset to card center, clamped to ±5–8°. Lerp toward the target each frame (≈0.1) and
   ease to rest on leave — snapping reads as jitter, not physicality.
2. **Reveal.** Staggered deal on a trigger: transform + opacity only, 60–90ms stagger. With a
   `back.png`, reveal as a `rotateY` flip across two stacked faces with `backface-visibility`.
3. **Background ambiance.** Kit background full-bleed behind everything, very slow parallax
   (4–8px total). Cards float with two shadows, one tight and one wide.

If the card composites DOM on top of the art (a portrait in a window, a caption on a plaque),
those layers sit above the canvas and stay unlit. That is usually correct — a photo behind glass
does not catch the frame's raking light — but decide it deliberately.

## Architecture rules

- One self-contained component matching the repo. Own the lighting in **one** place: if a wrapper
  also paints a blanket sheen, the lit card gets exposed twice. Give the wrapper the tilt and let
  the card light itself, since only it knows which maps it has.
- All pointer math in one listener; per-card values derived from it. Never one listener per card.
- Cache rects on resize/scroll; never `getBoundingClientRect` in the hot path.
- `will-change: transform` only during interaction.
- Mouse-only lighting and tilt; touch gets the static card. Optionally drive `uMouse` from device
  orientation on mobile.
- `prefers-reduced-motion`: parallax to 0, motion off, light parked at the rest position, no tilt.
  Hard requirement.
- Cutouts are transparent — a card that clips its own rounded corners means the container is still
  applying `border-radius` + `overflow: hidden`. Drop both and use `filter: drop-shadow()` so the
  shadow follows the alpha instead of the element box.

## Acceptance checklist

- Move the pointer corner to corner and confirm the highlight **travels across the relief**, with
  grooves shading on the far side. A glow that merely follows the cursor means the normal map is
  not being sampled — check `UNPACK_FLIP_Y` and that the maps actually loaded.
- Screenshot two opposite pointer positions and diff them; the lit regions must differ.
- No console errors, `canvas.width/height` non-zero, WebGL2 confirmed present.
- Fallback path exercised: kill WebGL and confirm the plain image still renders.
- Composite-only frames during movement; no redraw when the pointer is still.
- Reduced motion honored end to end; keyboard-reachable reveal trigger.
- Checked on both light and dark host surfaces if the page has both.
