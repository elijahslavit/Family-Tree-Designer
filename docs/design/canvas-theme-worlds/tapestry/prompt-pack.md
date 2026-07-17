# Image Prompt Pack — Theme Artwork

Everything needed to create the artwork for the two themes. **Find the section for the tool you're
using and follow it top to bottom** — each section is complete on its own.

The two themes:

- **Illuminated Keep** (castle storybook look) — one tall mural runs down the page, and the family
  cards hang beside it.
- **Midnight Archive** (dark museum look) — small glowing artworks placed around a dark page.

One rule applies everywhere: **make the first image of each theme before anything else.** It sets
the look. Every image after it should be made to match it.

---

# Using ChatGPT

**How it works:** ChatGPT remembers your conversation. So you set the style rules once at the top of
a chat, and then ask for one image at a time with short requests.

1. Start a **new chat** — one chat per theme.
2. Paste the theme's **first message** (below) and send it.
3. Ask for the images **one at a time**, in the order listed.
4. If an image is close but not right, don't start over. Ask for one small change:
   *"Keep everything the same, just make the bottom fade out more."*
5. When you like one, say: *"Accepted — match this style for everything that follows."*
6. For images that need a **see-through background**, the request says so — after ChatGPT delivers,
   check that the background is actually see-through (you'll see a gray checkerboard behind it).

## Illuminated Keep — in ChatGPT

**First message (paste exactly, then send):**

> You are creating a matching set of decorative artwork for a digital family-history page with a
> medieval castle storybook look. Every image in this chat must look like it was painted by the same
> hand. The style for everything: painted like an illuminated medieval manuscript with gold leaf on
> old parchment, soft candlelight always coming from the upper left, and only these colors —
> parchment #e9dcbe, deep red #7c2418, gold #a3771c, dark brown ink #2a1e12. Castle imagery: stone
> towers, oak leaves, vines, banners, wax seals. Never include: any words or letters, any human
> faces, watermarks, or bright modern colors. Edges of every image should fade out softly unless I
> say otherwise. I will ask for one image at a time and either accept it or ask for one small fix.

**Image 1 — the tall mural, top part** *(make this first; it sets the look)*
> A tall vertical mural: the top of a hilltop castle among oak branches at dawn, faint banners in a
> parchment sky. Keep the art in a narrow column — the left and right sides should fade to plain
> parchment. The bottom should stop mid-stonework, unfinished, so it can continue in the next image.
> Tall format.

**Image 2 — the mural, bottom part**
> Continue the accepted mural downward in exactly the same style: the castle gate, climbing vines,
> then roots and foundation stones. The top must pick up where the last image stopped. Sides fade to
> parchment; bottom stops mid-roots, unfinished.

**Image 3 — the mural, middle piece** *(only needed for large families)*
> A middle stretch of the same mural that could fit between the two accepted pieces: just stone wall
> and vine, no landmarks, so it can repeat without being noticed. Top and bottom both stop
> mid-pattern; sides fade to parchment.

**Image 4 — the crest at the top of the page**
> A wide piece: a carved stone shield wreathed in oak leaves with two furled banners, centered and
> small with plenty of parchment space around it. Everything fades to plain parchment except the
> top, which can run off the edge. Wide format.

**Image 5 — the stone base at the bottom of the page**
> A wide closing piece: roots and foundation stones settling into one carved stone rail with a gold
> edge — this rail is the only hard edge, at the very bottom. The top stops mid-stone, unfinished;
> sides fade to parchment. Wide format.

**Image 6 — the frame that goes around family cards**
> A rectangular ornate gold frame with small red corner decorations. The inner and outer edges must
> be perfectly straight, all four sides symmetric, and the middle completely empty. See-through
> background. Square format.
> *(Why the strict shape: we stretch this one frame around cards of many sizes — the corners stay
> put and the straight edges stretch.)*

**Image 7 — the oval frame for portraits**
> A gold arched-oval frame in the same metal style as the card frame, with a thin red inner line,
> empty middle, and see-through background everywhere outside the ring. Tall format.

## Midnight Archive — in ChatGPT

**First message (paste exactly, then send):**

> You are creating a matching set of decorative artwork for a digital family-history page with a
> dark "museum at night" look. Every image in this chat must look like it was painted by the same
> hand. The style for everything: oil painting on a very dark background with a soft sheen, one warm
> lamp always shining from the upper left, everything else falling into darkness, and only these
> colors — near-black #0f0d0a, dark brown #1c1610, gold #e5aa45, pale gold #f3c877, bone #cec1a8.
> Imagery: gilded picture frames, archive drawers, ribbon-tied bundles, candle glow, brass fittings.
> Never include: any words or letters, any human faces, watermarks, daylight, or bright colors
> beyond gold. Edges of every image should fade into darkness unless I say otherwise. I will ask for
> one image at a time and either accept it or ask for one small fix.

**Image 1 — the big picture at the top of the page** *(make this first; it sets the look)*
> A very wide, dim archive hall fading into darkness: one warm lamp catching the corners of gilded
> frames and brass drawer handles, everything else nearly black. The bottom third and both sides
> must fade fully into solid black. Wide format.

**Image 2 — the thin gold divider line**
> A very wide, thin band of delicate gold scrollwork floating on darkness, with a few candle-glints.
> The left and right edges must flow into each other so copies placed side by side look like one
> continuous band. Above and below the band, fade quickly to a see-through background.
> *(Check: place three copies side by side — there must be no visible line where they meet.)*

**Image 3 — the frame that goes around family cards**
> A thin elegant rectangular gold frame with perfectly straight inner and outer edges, all four
> sides symmetric, a subtle glint on the top-left corner only, completely empty middle, see-through
> background. Square format.

**Image 4 — the oval frame for portraits**
> An arched-oval gold frame in the same metal as the card frame, empty middle, see-through
> background outside the ring. Tall format.

**Image 5 — the corner decoration**
> A small ornamental brass corner piece catching the lamp light, tucked into the top-left corner of
> the canvas, fading to see-through toward the middle. Square, see-through background.
> *(We flip copies of this for the other three corners.)*

**Image 6 — the curtain wisp for the page edges**
> A tall narrow wisp of patterned drapery barely catching the warm light — very subtle, more
> atmosphere than object. All edges fade into darkness. Tall format.

**Image 7 — the closing picture at the bottom of the page**
> A wide, low picture: the top edge of an archive drawer with a brass rail receding into darkness.
> The brass rail makes one clean line at the very bottom; everything above fades upward into black.
> Wide format.

---

# Using Vertex AI — Imagen (Google's image generator)

**How it works:** Imagen does **not** remember anything between prompts. Every prompt must carry the
whole style description — the prompts below already include it, so paste them exactly as written.

**Settings to use on every image:**

- **People:** set to "don't allow" — we never want faces, and this setting enforces it.
- **Number of images:** 4 — pick the best of each batch.
- **Shape:** noted with each prompt (wide, tall, or square).
- **"Things to avoid" box** (if your version has one): `text, letters, watermark, human faces, hard
  edges, borders, bright modern colors` — for Midnight add `daylight`.
- Imagen **cannot make see-through backgrounds.** That's fine: the prompts ask the art to fade into
  the page's own background color instead. Frames and strips get their backgrounds removed
  afterward in any photo editor.

**Two Imagen features worth using:**

- **Extend an image** (in the editing tools, sometimes called outpainting): grows a finished picture
  instead of making a new one. Use it for the castle mural — the pieces match perfectly because it
  is literally the same picture continued.
- **Style copy** (style reference): upload a finished image you like along with a new prompt, and
  the new image will match its look. Once your first image of a theme is accepted, attach it to
  every later prompt for that theme.

## Illuminated Keep — in Imagen

**Image 1 — the tall mural, top part** · Shape: tall
> A tall vertical mural of the top of a hilltop castle among oak branches at dawn, faint banners in
> a parchment sky, the artwork held in a narrow central column with the left and right sides fading
> into plain parchment #e9dcbe, the bottom stopping mid-stonework and unfinished — painted like an
> illuminated medieval manuscript with gold leaf on old parchment, soft candlelight from the upper
> left, colors limited to parchment #e9dcbe, deep red #7c2418, gold #a3771c, dark brown ink #2a1e12,
> castle and oak-leaf imagery, no border

**Image 2 — the mural, bottom part** — don't prompt from scratch: open Image 1 in **Extend an
image**, grow the canvas downward, and ask:
> continue the same stonework downward into a castle gate, climbing vines, and then roots and
> foundation stones, ending unfinished mid-roots

**Image 3 — the mural, middle piece** — also made with **Extend an image**, between the accepted
pieces: plain stone wall and vine only, no landmarks, stopping mid-pattern top and bottom.

**Image 4 — the crest at the top of the page** · Shape: wide
> A wide composition with a carved stone shield wreathed in oak leaves and two furled banners,
> centered and small with generous empty parchment around it, everything fading into plain parchment
> #e9dcbe except the top edge — painted like an illuminated medieval manuscript with gold leaf on
> old parchment, soft candlelight from the upper left, colors limited to parchment #e9dcbe, deep red
> #7c2418, gold #a3771c, dark brown ink #2a1e12, no border

**Image 5 — the stone base at the bottom** · Shape: wide
> A wide closing piece of roots and foundation stones settling into one carved stone rail with a
> gold edge at the very bottom, the top stopping mid-stone and unfinished, the sides fading into
> plain parchment #e9dcbe — painted like an illuminated medieval manuscript with gold leaf on old
> parchment, soft candlelight from the upper left, colors limited to parchment #e9dcbe, deep red
> #7c2418, gold #a3771c, dark brown ink #2a1e12, no border

**Image 6 — the frame for family cards** · Shape: square · generated on parchment, cut out after
> A rectangular ornate gold frame with small red corner decorations on a plain parchment #e9dcbe
> background, inner and outer edges perfectly straight, all four sides symmetric, the middle
> completely empty parchment — gold leaf manuscript style, soft candlelight from the upper left,
> colors limited to parchment #e9dcbe, deep red #7c2418, gold #a3771c

**Image 7 — the oval frame for portraits** · Shape: tall · on parchment, cut out after
> A gold arched-oval frame with a thin red inner line on a plain parchment #e9dcbe background, empty
> middle — gold leaf manuscript style, soft candlelight from the upper left, colors limited to
> parchment #e9dcbe, deep red #7c2418, gold #a3771c

## Midnight Archive — in Imagen

**Image 1 — the big picture at the top** · Shape: wide *(make this first; use it as the style copy
for all the rest)*
> A very wide dim archive hall fading into darkness, one warm lamp catching the corners of gilded
> picture frames and brass drawer handles, everything else nearly black, the bottom third and both
> sides fading into solid near-black #0f0d0a — oil painting on a very dark background with a soft
> sheen, museum at night, single warm light from the upper left, colors limited to near-black
> #0f0d0a, dark brown #1c1610, gold #e5aa45, pale gold #f3c877, bone #cec1a8, no border

**Image 2 — the thin gold divider line** · Shape: wide · crop the band out after
> A very wide thin horizontal band of delicate gold scrollwork with a few candle-glints floating on
> a solid near-black #0f0d0a background, the left and right ends designed to flow into each other so
> the band can repeat seamlessly — oil painting style, museum at night, warm light from the upper
> left, colors limited to near-black #0f0d0a, gold #e5aa45, pale gold #f3c877
> *(Check: put three copies side by side — no visible join.)*

**Image 3 — the frame for family cards** · Shape: square · on black, cut out after
> A thin elegant rectangular gold frame on a solid near-black #0f0d0a background, perfectly straight
> inner and outer edges, all four sides symmetric, a subtle glint on the top-left corner only, the
> middle completely empty black — oil painting style, museum at night, warm light from the upper left

**Image 4 — the oval frame for portraits** · Shape: tall · on black, cut out after
> An arched-oval gold frame on a solid near-black #0f0d0a background, empty middle — same gold metal
> as before, oil painting style, museum at night, warm light from the upper left

**Image 5 — the corner decoration** · Shape: square · on black, cut out after
> A small ornamental brass corner piece catching warm lamp light, tucked into the top-left corner,
> fading to solid near-black #0f0d0a toward the middle — oil painting style, museum at night, light
> from the upper left, colors limited to near-black #0f0d0a, gold #e5aa45, brass tones

**Image 6 — the curtain wisp** · Shape: tall
> A tall narrow wisp of patterned drapery barely catching a warm light, very subtle, more atmosphere
> than object, all edges fading into solid near-black #0f0d0a — oil painting style, museum at night,
> light from the upper left, colors limited to near-black #0f0d0a, dark brown #1c1610, gold #e5aa45

**Image 7 — the closing picture at the bottom** · Shape: wide
> A wide low picture of the top edge of an archive drawer with a brass rail receding into darkness,
> the brass rail forming one clean line at the very bottom, everything above fading upward into
> solid near-black #0f0d0a — oil painting style, museum at night, warm light from the upper left,
> colors limited to near-black #0f0d0a, dark brown #1c1610, gold #e5aa45, bone #cec1a8

---

# Using Vertex AI — Gemini chat

Only useful if the chat model you picked can **create images**. Quick test: ask *"make a small test
image of a gold square on a black background."* If you get words back instead of a picture, switch
to an image-capable Gemini model or use the Imagen section above.

If it does make images, it behaves like ChatGPT: go to the **Using ChatGPT** section, paste that
section's first message for your theme (keep the line breaks when pasting), and request the images
one at a time exactly as listed there. Attach your accepted first image to later requests so the
style stays locked.

---

# Checking every image — 30-second checklist

1. The light comes from the **top-left**.
2. Edges that should fade actually fade **all the way** out — no visible picture border.
3. Repeating strips: put **three copies side by side** — no visible line where they meet.
4. Colors stay inside the theme's palette; nothing bright or modern snuck in.
5. No words, no faces, no watermark.

When an image passes, bring it back to the project — it goes into the theme's asset folder and gets
wired into the page from there.

---

# If you'd rather have the AI write the prompt for you

Paste this into ChatGPT or Gemini, filling in the two blanks:

> Act as an art director. Here is the style everything must follow: [PASTE THE THEME'S FIRST
> MESSAGE FROM THIS PACK]. I need this specific image: [DESCRIBE WHAT AND WHERE — e.g. "a wide
> divider band that repeats side to side, for a dark museum-style web page"]. Write the strongest
> image prompt for it. After I show you the result, tell me either "ACCEPT" or the one small fix
> that matters most.
