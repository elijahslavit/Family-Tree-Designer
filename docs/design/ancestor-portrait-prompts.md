# Ancestor portraits for the Hart demonstration archive

> **Status: done.** These five portraits were generated and are live in
> `public/demo/pilot/portraits/`. Keep this file as the recipe — regenerate from
> it if a portrait needs replacing, or adapt it when adding a demonstration
> family. The assignment notes at the end record which era each sitter was
> framed as, which is what keeps the set coherent.

The demonstration family currently uses flat vector placeholders with the word
SYNTHETIC drawn into the artwork. That watermark is right for the app — it stops
placeholder art being mistaken for a real ancestor — but it appears on the
marketing site too, and the cartoon style undercuts everything else about the
presentation.

This replaces them with five black-and-white studio portraits that look like real
mid-century photographs of people who never existed.

## Before you start

Use one image-generation chat for the whole set and generate the prompts **in
order**. Each portrait after the first refers back to the one before it, which is
what keeps the set looking like it came from one photographer. If you do not like
a result, re-run that step before moving on — a drifted style carries into every
portrait after it.

Paste the standing orders once, as the first message. Then paste prompts 1 to 5,
one at a time.

## Standing orders — paste this first

> For this whole conversation you are producing black-and-white studio portrait
> photographs for a family history archive. Every image follows these rules.
>
> The photographer: a small-town American commercial studio, working with a
> large-format camera and hot lights, in the manner of Mike Disfarmer's Heber
> Springs portraits. A plain mottled canvas or seamless paper backdrop. The sitter
> is composed and unsmiling, looking slightly off the lens, with the natural
> asymmetry of a real face rather than a symmetrical ideal. Sharp large-format
> detail in the eyes and in the weave of the fabric.
>
> The print: silver gelatin. True neutral black-and-white — no sepia, no split
> toning, no colour cast of any kind. Fine silver grain, a gentle natural vignette,
> soft falloff into the backdrop. Deep but open shadows. Highlights that still hold
> detail in a white shirt.
>
> The framing: head and shoulders, filling the frame, vertical, taller than it is
> wide.
>
> Never include any text, lettering, watermark, signature, date stamp, or border.
> No printed frame, no torn edges, no scrapbook corners, no film sprocket holes.
> No modern studio lighting, no skin retouching, no shallow-depth background blur,
> no smiling stock-photograph expression, no HDR sharpening.
>
> Every person is fictional. Do not resemble any real or famous person.

## 1 — Walter Hart

> A portrait of a fictional man of about thirty-six, photographed around 1948. He
> is a railway engineer. Short side-parted dark hair going grey at the temples, a
> plain dark suit jacket over a soft-collared shirt, no tie pin and no ornament. A
> lined, weathered, capable face. Modest and dignified — not handsome, not styled.

## 2 — June Mercer Hart

> Using the previous image as the reference for the photographer, the lighting, and
> the print, show a different sitter. Keep the backdrop, the tonality, and the
> framing exactly the same. Only the person changes.
>
> A fictional woman of about thirty-two, photographed around 1948. She directs a
> community choir. Dark hair set in soft waves off the face in the style of the
> late forties, a plain dark dress with a modest collar, small pearl earrings and
> nothing else. An open, warm, intelligent face, not smiling.

## 3 — Eleanor Hart West

> Using the previous image as the reference for the photographer, the lighting, and
> the print, show a different sitter. Keep the backdrop, the tonality, and the
> framing exactly the same. Only the person and the period of her clothing change.
>
> A fictional woman of about thirty, photographed around 1968. She is an archivist
> who keeps church bulletins and reunion photographs. Dark hair worn shorter and
> fuller in the style of the late sixties, a plain light blouse under a simple
> cardigan, reading glasses held in one hand below the frame. A careful, observant
> face.

## 4 — Robert Hart

> Using the previous image as the reference for the photographer, the lighting, and
> the print, show a different sitter. Keep the backdrop, the tonality, and the
> framing exactly the same. Only the person and the period of his clothing change.
>
> A fictional man of about thirty, photographed around 1972. He is a machinist. A
> broad, plain, good-humoured face, hair a little longer and fuller in the style of
> the early seventies, a work shirt with the collar open and no jacket. Solid and
> unpretentious.

## 5 — Samuel West

> Using the previous image as the reference for the photographer, the lighting, and
> the print, show a different sitter. Keep the backdrop, the tonality, and the
> framing exactly the same. Only the person and the period of his clothing change.
>
> A fictional man of about thirty, photographed around 1965. He is a newspaper
> printer and a family storyteller. A narrow, alert face with dark-rimmed glasses,
> neat short hair, a plain shirt and a narrow dark tie. Quick and talkative, caught
> in a still moment.

## Where the files go

Save each image as a `.webp` (or `.jpg`, and say so) into a new folder,
`public/demo/pilot/portraits/`, using exactly these names:

| Portrait | File name |
| --- | --- |
| Walter Hart | `walter.webp` |
| June Mercer Hart | `june.webp` |
| Eleanor Hart West | `eleanor.webp` |
| Robert Hart | `robert.webp` |
| Samuel West | `samuel.webp` |

Portrait orientation, at least 900 pixels wide and 1200 tall. Larger is fine.

Then say so, and the demonstration archive will be pointed at them and the
marketing screenshots regenerated.

## What was actually generated

The four men came back as one batch of options rather than a derived chain, so
they are not one studio. Rather than force uniformity, each was assigned to the
decade its look suited — which is closer to how a real archive accumulates
photographs anyway.

| Sitter | Framed as | Source |
| --- | --- | --- |
| Walter Hart | 1948 — flattest, grainiest, plain wall | hero option B |
| June Mercer Hart | 1948 — derived from Walter's portrait | derived |
| Samuel West | 1965 — period but cleaner | hero option D |
| Eleanor Hart West | 1968 — derived from Samuel's portrait | derived |
| Robert Hart | 1972 — sharpest, most modern light | hero option A |
| Josiah Hart | 1885 — albumen cabinet card, warm tone | separate 1885 prompt |
| Martha Ellen Hart | 1885 — derived from Josiah's portrait | derived |

The 1885 pair use a different process on purpose. An albumen cabinet card is
warm brown-black, softer, and more heavily vignetted than a mid-century silver
gelatin print, so the archive shows a real tonal shift between the 1880s and the
1940s rather than one look aged artificially. Adding them required a generation
between them and Walter: their son Albert has no portrait, which is ordinary in a
real archive and puts the monogram treatment on screen beside real photographs.

The two women were each derived from the man closest to them in time, which is
what keeps the 1948 pair and the 1965–72 group reading as consistent within
themselves.

## Two notes

Margaret West Vale is recorded as living, so she is hidden from the presentation
and needs no portrait.

The images carry no watermark, which is deliberate — the honesty now lives in the
words around them. Each portrait's stored record still states that it is synthetic
demonstration artwork, the marketing pages label the archive as a sample, and no
real family media is involved anywhere.
