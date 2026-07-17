---
name: google-flow
description: Plan, prompt, and refine AI filmmaking workflows in Google Flow, including text-to-video, frames-to-video, ingredients, native dialogue and sound, camera direction, continuity, Scene Builder, and handoff to an external editor. Use when the user mentions Google Flow, Veo in Flow, Flow prompts, audio-native AI video, Flow storyboards, character-consistent Flow scenes, or wants to turn a creative brief, script, image, or shot list into production-ready Flow prompts. Treat pricing, availability, model names, limits, and commercial-use terms as time-sensitive and verify them when they affect the answer.
---

# Google Flow

Turn a creative goal into a practical Flow production packet. Keep prompts cinematic, achievable within the selected clip duration, and easy to iterate.

The supplied platform guide is a March 2026 snapshot. Read [references/google-flow-guide.md](references/google-flow-guide.md) for mode details, prompt vocabulary, workflows, limitations, comparisons, and dated pricing. Verify changing product facts against current official Google sources before relying on them for purchases, access, licensing, quotas, model availability, or commercial work.

## Build the production packet

1. Extract the intended audience, platform, aspect ratio, duration, visual style, narrative beat, subjects, required dialogue, sound, and available reference assets. Infer low-risk omissions; ask only when a missing choice would materially change the result.
2. Break the concept into short, independently generatable shots. Give each shot one clear action and one camera idea. Keep dialogue short enough for the shot.
3. Select the most controllable generation path:
   - Use text-to-video for exploration, establishing shots, and concepts without fixed visual identity.
   - Use frames-to-video when start/end composition, movement, or transition precision matters.
   - Use ingredients when recurring characters, objects, wardrobe, or locations must stay recognizable.
   - Use extensions sparingly; plan an external edit when a sequence needs many clips or reliable audio continuity.
4. Specify the asset plan before prompts. Name every character, prop, location, start frame, end frame, or ingredient that must be created or supplied. Keep reference styles compatible.
5. Write each prompt in this order: cinematography, subject, action, context, style and ambiance. Put essential dialogue, sound effects, ambience, and music early enough to be noticed. Use exact quoted dialogue and concrete camera terms.
6. Preserve continuity by repeating stable identity, wardrobe, location, lighting, palette, and lens details verbatim across related shots. Change only the variables that should change.
7. Add a negative-outcome guardrail only when useful, phrased positively where possible. Use `No subtitles. No text overlays.` when visible text is unwanted.
8. Plan two or three meaningful variants for uncertain shots. Change one major variable per variant so the result teaches the creator something.
9. Define the edit handoff: selected takes, shot order, transitions, audio repair or replacement, color normalization, captions, and final export format.

## Prompt template

```text
[Shot size and camera movement] of [specific subject and stable identity details] [performing one clear action] in [specific setting and time]. [Lighting, lens, palette, texture, and mood]. [Dialogue, if any: "..."] [SFX: ...] [Ambient sound: ...] [Music: ...]. [Aspect-ratio or composition cue]. No subtitles. No text overlays.
```

Use timestamped multi-shot prompts only when the user explicitly wants several beats inside one short generation and each beat can remain simple. Prefer separate shots when continuity and edit control matter more.

## Output format

Return the smallest useful production packet:

- Creative intent and assumptions
- Recommended Flow mode for each shot, with a brief reason
- Required assets and reference-image plan
- Copy-ready prompts, numbered in edit order
- Continuity anchors to repeat verbatim
- Variant or retry plan
- External edit and export notes when needed

If the user asks for one prompt, provide one polished prompt rather than a full packet. If they ask to operate the interface, preserve their existing project state, confirm before credit-consuming generation when cost is material or unclear, and report which settings were actually available rather than assuming the dated guide still matches the UI.

## Quality check

Before delivering, confirm that every prompt has one primary action, feasible pacing, explicit camera language, consistent identity anchors, audio that fits the shot, and no unsupported current-product claims. Flag any creative requirement better handled during editing rather than generation.
