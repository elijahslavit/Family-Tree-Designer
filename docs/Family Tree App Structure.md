# Family Tree Platform — Product Specification

> A SaaS platform where users import their family tree data, customize it with themed visual layouts, and share a polished, browsable family archive via link.

---

# Table of Contents

1. [Product Definition](#step-1--product-definition)
2. [App Finder](#step-2--app-finder)
3. [Core Objects and Data Model](#step-3--core-objects-and-data-model)
4. [Roles, Permissions, and Ownership](#step-4--roles-permissions-and-ownership)
5. [User Flows, States, and Behavior](#step-5--user-flows-states-and-behavior)
6. [Information Architecture](#step-6--information-architecture)
7. [Visual Structure and Screen Layout](#step-7--visual-structure-and-screen-layout)
8. [Theme, Design System, and Motion](#step-8--theme-design-system-and-motion)
9. [Features, Capabilities, and Integrations](#step-9--features-capabilities-and-integrations)
10. [Technical Architecture and Libraries](#step-10--technical-architecture-and-libraries)
11. [Quality, Security, and Operations](#step-11--quality-security-and-operations)
12. [Delivery, Prompting, and Roadmap](#step-12--delivery-prompting-and-roadmap)
13. [Master Decision Log](#master-decision-log)
14. [Master Checklist](#master-checklist)

---

# STEP 1 — Product Definition

## One-Sentence Definition

A SaaS platform where users import their family tree data, customize it with themed visual layouts, and share a polished, browsable family archive via link.

## Problem

Genealogy tools (Ancestry, FamilySearch, Gramps, etc.) are built for research. They are functional but visually generic. When someone wants to actually show their family to relatives — at a reunion, in a group chat, as a keepsake — there is no good way to present that data beautifully. You end up with PDFs, screenshots, or ugly printouts from research software.

## Target Users

| Tier | Who | What they want |
|---|---|---|
| **Primary** | Hobbyist genealogists | Import existing tree, make it look great, share a link with family |
| **Secondary** | Families / non-researchers | Browse a shared tree someone else set up — low friction, visual, explorable |
| **Tertiary** | Serious researchers | May use the platform for presentation layer on top of their research workflow |

The *creator* (person who imports and curates) and the *viewer* (family members who browse the shared link) are different users with different needs. The creator needs import and customization tools. The viewer needs a fast, beautiful, read-only experience.

## Core Jobs to Be Done

1. **Import my data** from GEDCOM, Ancestry API, manual entry, Markdown, or media — and have it just work.
2. **Explore my tree visually** — interactive canvas, person profiles, timelines, relationship navigation.
3. **Choose a theme** that reflects my family's identity or aesthetic preference — and have the entire presentation adapt.
4. **Share a link** so family can browse without signing up or installing anything.

## North-Star Goal

A user imports their GEDCOM, picks a theme, and shares a beautiful family archive link within 30 minutes.

## Success Metrics

| For the user | For the business |
|---|---|
| "My family loves browsing this" | Users import → customize → share (activation loop) |
| "This looks way better than Ancestry" | Shared links drive new signups (viral loop) |
| "I can finally show people my research" | Themes/premium features drive revenue |

## MVP Boundary

### MVP includes

- Account creation and tree ownership
- GEDCOM import (single file → parsed into people, families, events)
- Full in-app manual add/edit of people, families, and connections
- Default theme plus two additional themed layouts and skins
- Directory view (browse/search people)
- Profile view (biography, facts, relatives, timeline)
- Canvas view (interactive family graph)
- Public share link (read-only, no sign-up required for viewers)

### MVP explicitly excludes

- Ancestry/FamilySearch API integrations
- Collaborative editing (multi-user curating same tree)
- Media uploads (photos, documents, scans)
- Evidence-grade claims/citations UI (preserved in schema, hidden from interface)
- Multiple trees per account
- Billing/premium tiers
- Static site export
- Mobile-native app
- PDF/print export
- Relationship calculator
- Advanced pedigree chart views

## Non-Goals

- This is not a research tool at MVP. No claim resolution, no source evaluation workflow.
- This is not a collaborative wiki. One creator per tree for now.
- This is not a social network. No feeds, no comments, no likes.

## Product Tone

The app should feel intentional, archival, and warm — like opening a family heirloom book, not using enterprise software. Themes extend this into different cultural and aesthetic directions.

---

# STEP 2 — App Finder

## App Finder Result

| Field | Answer |
|---|---|
| **App category** | Content presentation platform / digital archive / portfolio-style viewer |
| **Dominant interaction pattern** | Detail-heavy + canvas/graph + list browsing |
| **Usage style** | Import → customize → browse → share (creator); Browse → explore (viewer) |
| **Main work surface** | Profile detail view (most time spent here) + Canvas explorer + Directory list |
| **Data scale** | Small to moderate per tree (typical GEDCOM: 50–5,000 people). Many trees across the platform. |
| **Platform priority** | Desktop-first responsive web. Viewers will often be on mobile — shared links must work well on phones. |
| **Collaboration model** | Single creator per tree. Viewers are anonymous via public link. Multi-editor is post-MVP. |

## Two-Mode Architecture

This is a two-mode app:

| Mode | User | Experience |
|---|---|---|
| **Creator mode** | Signed-in account owner | Import, configure theme, manage tree, edit bios |
| **Viewer mode** | Anyone with the link | Read-only browsing, no account needed, themed presentation |

The viewer experience is the product — it is what gets shared. The creator experience is the tool that produces it.

---

# STEP 3 — Core Objects and Data Model

## Primary Objects

### Account

The person who signs up and manages trees.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| email | text | Auth identity |
| display_name | text | Shown in creator UI |
| avatar_url | text | Optional |
| created_at | timestamp | |
| plan | text | `free` / `pro` (later) |

### Tree

The top-level container. Everything else belongs to a tree.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| account_id | uuid | Owner FK |
| name | text | "The Bradford Family" |
| slug | text | URL-safe identifier for public sharing |
| description | text | Optional tagline |
| theme_layout | text | `classic` / `editorial` / `explorer` |
| theme_skin | text | `dark-gold` / `parchment` / `modern` |
| is_public | boolean | Controls whether share link works |
| share_token | text | Random token for public URL |
| created_at | timestamp | |
| updated_at | timestamp | |

Theme is stored at the tree level. Layout variant and skin are independent choices.

### Person

The core entity.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Stable internal ID |
| tree_id | uuid | FK — every person belongs to exactly one tree |
| given_name | text | |
| surname | text | |
| full_name | text | Display name (computed or overridden) |
| suffix | text | Jr., III, etc. |
| gender | text | `male` / `female` / `unknown` / `other` |
| birth_date_text | text | Original text ("about 1715", "8 MAR 1715") |
| birth_date_normalized | date | ISO date for sorting/filtering |
| birth_place | text | |
| death_date_text | text | |
| death_date_normalized | date | |
| death_place | text | |
| summary | text | Short one-liner bio |
| biography_md | text | Markdown biography content |
| is_living | boolean | Privacy flag |
| created_at | timestamp | |
| updated_at | timestamp | |

Dates always preserve original text. Normalized dates are for sorting and display logic only.

### Family

A union between two people that can have children.

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| tree_id | uuid | FK |
| spouse_1_id | uuid | FK to Person |
| spouse_2_id | uuid | FK to Person (nullable for single-parent families) |
| marriage_date_text | text | |
| marriage_date_normalized | date | |
| marriage_place | text | |

### FamilyChild

Join table connecting families to their children.

| Field | Type | Notes |
|---|---|---|
| family_id | uuid | FK |
| child_id | uuid | FK to Person |
| order | integer | Birth order (optional) |
| relationship_type | text | `biological` (v1 only) |

### Event

Flexible life events beyond birth/death.

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| tree_id | uuid | FK |
| person_id | uuid | FK |
| type | text | `baptism` / `burial` / `immigration` / `occupation` / `residence` / `military` / custom |
| date_text | text | |
| date_normalized | date | |
| place | text | |
| description | text | |

### Lineage

Named family lines and descent paths.

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| tree_id | uuid | FK |
| name | text | "Bradford Mayflower Descent" |
| description | text | |

### LineageMember

| Field | Type | Notes |
|---|---|---|
| lineage_id | uuid | FK |
| person_id | uuid | FK |
| order | integer | Position in the descent line |

## Hidden-from-Viewer Objects

These stay in the schema but have no viewer-facing UI at MVP. They exist so data is not lost during import and so the power-user research layer has a foundation.

### Source

A document, book, or record that evidence comes from.

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| tree_id | uuid | FK |
| title | text | |
| author | text | |
| url | text | |
| notes | text | |
| created_at | timestamp | |

### Claim

An assertion about a person or family with a predicate, value, and confidence.

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| tree_id | uuid | FK |
| subject_type | text | `person` / `family` |
| subject_id | uuid | FK to Person or Family |
| predicate | text | `birth_date` / `death_place` / `occupation` / etc. |
| value_text | text | Original claim text |
| confidence | text | `accepted` / `probable` / `uncertain` / `disputed` |
| notes | text | |
| created_at | timestamp | |

### Citation

Links a claim to a source.

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| claim_id | uuid | FK |
| source_id | uuid | FK |
| page | text | |
| notes | text | |

### ReviewIssue

Import conflicts, duplicates, data quality flags.

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| tree_id | uuid | FK |
| type | text | `duplicate` / `conflict` / `missing_data` / `parse_error` |
| subject_type | text | `person` / `family` / `event` |
| subject_id | uuid | |
| description | text | |
| status | text | `open` / `resolved` / `dismissed` |
| resolution_note | text | |
| created_at | timestamp | |
| resolved_at | timestamp | |

### ExternalId

Maps internal IDs to external system identifiers.

| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| tree_id | uuid | FK |
| subject_type | text | `person` / `family` / `source` |
| subject_id | uuid | |
| system | text | `gedcom` / `ancestry` / `familysearch` / `legacy_json` |
| external_id | text | |

## Relationship Map

```
Account ──owns──▶ Tree
Tree ──contains──▶ Person
Tree ──contains──▶ Family
Tree ──contains──▶ Event
Tree ──contains──▶ Lineage

Family ──spouse_1──▶ Person
Family ──spouse_2──▶ Person
Family ──children via──▶ FamilyChild ──references──▶ Person

Event ──belongs to──▶ Person

Lineage ──members via──▶ LineageMember ──references──▶ Person

Person ··hidden··▶ Claim ··cites··▶ Citation ··references··▶ Source
Person ··hidden··▶ ReviewIssue
Person ··hidden··▶ ExternalId
```

## Key Data Model Decisions

1. **Everything is scoped to a Tree.** No cross-tree queries, no shared people between trees. Clean multi-tenancy and safe public sharing.
2. **Birth/death live on Person directly** for query performance. Other life events go in the Event table.
3. **Biography is Markdown stored on Person**, not in a separate file system. For a SaaS, content lives in the database.
4. **Dates always preserve original text.** Normalized dates are for sorting and display logic only.
5. **Privacy flag (`is_living`)** suppresses details in viewer mode. Creator still sees everything.
6. **v1 is biological-only** for structured family links. No adoptive or step relationships in the core model unless explicitly added later.

---

# STEP 4 — Roles, Permissions, and Ownership

## Roles

| Role | Description |
|---|---|
| **Creator** | Signed-in account owner. Full CRUD on their own tree(s). |
| **Viewer** | Anyone with the public share link. Read-only. No account required. |
| **System** | Import processes, background jobs. |

## Permissions Matrix

| Action | Creator | Viewer |
|---|---|---|
| View directory | Yes | Yes (if tree is public) |
| View profiles | Yes | Yes (with living-person suppression) |
| View canvas | Yes | Yes |
| Search/filter | Yes | Yes |
| Create/edit person | Yes | No |
| Create/edit family | Yes | No |
| Import GEDCOM | Yes | No |
| Change theme | Yes | No |
| Toggle public sharing | Yes | No |
| View claims/sources | Yes (later) | No |
| Delete tree | Yes | No |
| Account settings | Yes | No |

## Ownership Rules

- A Tree belongs to exactly one Account.
- All objects inside a tree inherit the tree's ownership. There is no per-person or per-family ownership.
- Deleting a tree deletes all contained objects (cascade).
- Deleting an account deletes all owned trees (cascade).

## Privacy Rules (Viewer Mode)

When `is_living = true` on a Person, the viewer sees:

- Name only (no dates, no places, no biography, no summary)
- Relationship connections still shown (so the tree structure is not broken)
- Creator sees everything regardless

## Sharing Model

- Each tree has an `is_public` toggle and a `share_token`.
- Public URL pattern: `app.com/t/{slug}` or `app.com/t/{share_token}`
- Creator can regenerate the share token (invalidates old links).
- No granular per-person sharing controls at MVP.

## Sensitive Actions Requiring Confirmation

- Delete tree
- Delete person (with cascade warning if they have family connections)
- Regenerate share token
- Toggle tree from public to private

---

# STEP 5 — User Flows, States, and Behavior

## Creator Flows

### Flow 1: Onboarding — Sign Up to First Tree

- **Trigger**: User lands on marketing page or shared tree
- Sign up (email/password or OAuth)
- Create first tree (name it)
- Choose: Import GEDCOM or Start from scratch
- If import: upload file → parsing screen → review summary → confirm
- If manual: land on empty directory with prominent "Add first person" CTA
- Pick a theme (or keep default)
- See their tree with data
- **Fastest path to value: ~5 minutes**

### Flow 2: Add/Edit Person

- From directory or canvas, click "Add Person"
- Form: name, dates, places, summary, biography
- Save → person appears in directory and can be linked to families
- Edit: open profile → edit mode → inline or modal editing

### Flow 3: Build Family Connections

- From a person's profile, add spouse → creates Family
- From a Family, add children → creates FamilyChild links
- From a person, set parents → link to existing Family or create one
- Canvas updates to reflect new connections

### Flow 4: Import GEDCOM

- Upload `.ged` file
- System parses: show progress indicator
- Review screen: "Found 229 people, 87 families, 12 issues"
- Issues panel: duplicates, missing data, unresolved references
- Confirm import → data loads into tree
- Issues saved as ReviewIssues for later cleanup

### Flow 5: Customize Theme

- Open theme picker (from tree settings or a persistent control)
- Choose layout variant (Classic, Editorial, Explorer)
- Choose skin within that layout (Dark Gold, Parchment, Modern)
- Live preview before confirming
- Save → entire tree presentation updates

### Flow 6: Share Tree

- Toggle tree to public
- Copy share link
- Send to family

## Viewer Flows

### Flow 7: Browse Shared Tree

- Arrive via shared link
- See themed directory or landing page
- Browse people, open profiles, explore canvas
- No sign-up prompts blocking content (CTA is subtle: "Create your own tree")
- Everything is read-only

## State Definitions

Every screen in the app must handle these states:

| State | What happens |
|---|---|
| **Loading** | Skeleton/shimmer matching the theme aesthetic |
| **Empty** | Warm, inviting empty state with clear CTA ("No people yet — add your first family member") |
| **Success** | Subtle confirmation (toast or inline). No disruptive modals for routine saves. |
| **Error** | Inline error messages on forms. Toast for system errors. Retry option where possible. |
| **Offline** | Not a priority for MVP (SaaS web app), but graceful "connection lost" message. |
| **Permission denied** | Viewer tries to access creator-only action → soft redirect or hidden UI element. |
| **Privacy-suppressed** | Living person in viewer mode → shows name only with "Details private" indicator. |

## Edge Cases to Plan For

- GEDCOM with 5,000+ people (performance, pagination, import timeout)
- Duplicate people after import (flag, do not auto-merge)
- Person with no family connections (orphan — still valid, show in directory)
- Circular family references in bad GEDCOM data (detect and flag, do not crash)
- User deletes a person who is a spouse or parent (cascade warnings)
- Very long biographies (Markdown rendering performance)
- Theme switch with custom data that does not fit a layout well (graceful fallback)

---

# STEP 6 — Information Architecture

## Creator Mode IA

```
Top-Level Navigation (sidebar or top bar depending on layout variant)
├── Dashboard (tree overview, stats, recent activity)
├── Directory (browse/search/filter all people)
│   └── Person Profile (detail view)
│       ├── Biography tab
│       ├── Facts & Timeline tab
│       ├── Relatives tab
│       └── Edit mode (inline or modal)
├── Canvas (interactive family graph)
├── Families (browse family units — optional, could be implicit)
├── Lineages (named descent lines)
├── Import (GEDCOM upload + review)
├── Theme (layout + skin picker with preview)
└── Settings
    ├── Tree settings (name, description, sharing)
    ├── Account settings (email, password)
    └── Danger zone (delete tree, delete account)
```

## Viewer Mode IA

```
Top-Level Navigation (themed, minimal)
├── Home / Landing (tree name, description, entry point)
├── Directory (browse/search/filter)
│   └── Person Profile (read-only)
│       ├── Biography
│       ├── Facts & Timeline
│       └── Relatives
├── Canvas (interactive graph, read-only)
└── About (optional — tree description, creator attribution)
```

Viewer mode has no settings, no import, no edit controls, no families management page. The navigation is simpler and the chrome is thinner — more content, less tool.

## Structural Decisions

| Element | Treatment |
|---|---|
| Person profile | Dedicated page (not a modal — needs its own URL for shareability) |
| Edit person | Modal overlay or inline toggle on the profile page |
| Add person | Modal from directory or canvas |
| GEDCOM review | Dedicated page (complex enough to need full screen) |
| Theme picker | Drawer or dedicated settings sub-page with live preview |
| Family connections | Managed from within person profile (add spouse, add child, set parents) — not a separate page |
| Search | Persistent in header/toolbar, filters in directory view |
| Canvas | Full page with collapsible sidebar |
| Delete confirmations | Modal with explicit confirmation |

## URL Structure

### Creator Routes

```
/dashboard
/directory
/person/{personId}
/person/{personId}/edit
/canvas
/import
/theme
/settings
```

### Viewer Routes (Public)

```
/t/{slug}                    → tree landing / directory
/t/{slug}/person/{personId}  → person profile
/t/{slug}/canvas             → interactive graph
```

---

# STEP 7 — Visual Structure and Screen Layout

## Layout Variants

| Layout | Navigation | Primary surface | Best for | Density |
|---|---|---|---|---|
| **Classic** | Collapsible sidebar | List + detail split | Power users, large trees, editing | High |
| **Editorial** | Top nav bar | Full-width prose + card sidebar | Sharing, reading, presentation | Low |
| **Explorer** | Minimal top bar | Full-screen canvas + drawer | Visual thinkers, discovering connections | Medium |

## Shared Screen Structure

Regardless of layout, every theme must render these viewer-facing screens:

| Screen | Purpose |
|---|---|
| **Landing / Home** | Entry point for viewers. Tree name, description, stats, entry CTA. |
| **Directory** | Browse/search/filter all people. |
| **Person Profile** | Biography, facts, timeline, relatives. |
| **Canvas** | Interactive family graph. |
| **Lineage View** | Named descent line with ordered members. |

Creator-only screens (same across all layouts, not themed as heavily):

| Screen | Purpose |
|---|---|
| **Import** | GEDCOM upload + review. |
| **Theme Picker** | Layout + skin selection with preview. |
| **Settings** | Tree config, sharing, account, danger zone. |
| **Person Editor** | Add/edit person form (modal or page). |

## Classic Layout Structure

| Zone | Behavior |
|---|---|
| Sidebar (left, 240px) | Fixed. Tree name, nav links, lineage list, search trigger. Collapsible to icon-only (60px). |
| List panel (center, flexible) | Scrollable. Person list with search/filter bar at top. |
| Detail panel (right, 40–50%) | Scrollable. Profile content. Opens when a person is selected. |
| On canvas view | Sidebar stays, list panel is replaced by full canvas. |
| Mobile | Sidebar collapses to bottom nav. List and detail become stacked pages. |

## Editorial Layout Structure

| Zone | Behavior |
|---|---|
| Top nav (full width, 56px) | Fixed. Tree name left, nav links center, theme/settings right. |
| Content area (centered, max-width 960px) | Scrollable. Full-width prose for profiles. Card grid for directory. |
| Profile sidebar (right, 320px) | Scrollable. Facts and relatives cards alongside biography. Collapses below on mobile. |
| On canvas view | Top nav stays, content area becomes full-width canvas. |
| Mobile | Top nav becomes hamburger. Content stacks vertically. |

## Explorer Layout Structure

| Zone | Behavior |
|---|---|
| Top bar (full width, 44px) | Fixed. Minimal — tree name, search, settings only. |
| Canvas (main area, fills remaining space) | Pannable, zoomable. Person nodes with expand/collapse. |
| Detail drawer (right, 360px) | Overlays canvas edge. Opens on node click. Shows person summary + "open full profile" link. |
| Full profile | Navigates away from canvas to a full profile page (Editorial-style layout). |
| Mobile | Canvas fills screen. Drawer becomes bottom sheet. |

## Visual Hierarchy Rules (All Layouts)

1. **Person name** is always the most prominent element on a profile — largest type, most contrast.
2. **Biography text** is the primary content — it gets the most space and readable typography.
3. **Facts** (birth, death, places) are secondary — structured, compact, scannable.
4. **Relatives** are tertiary — clickable links to navigate the tree.
5. **Edit controls** (creator-only) are subdued — visible but not competing with content.
6. **Stats and metadata** (counts, timestamps) are muted — smallest type, lowest contrast.

---

# STEP 8 — Theme, Design System, and Motion

## 8A — Theme Architecture

The theming system has two independent axes:

- **Layout variant** = structural arrangement (Classic, Editorial, Explorer)
- **Skin** = visual treatment (colors, fonts, textures, borders)

A user picks one layout and one skin. They combine freely — "Classic + Dark Gold" or "Editorial + Modern" or "Explorer + Parchment". This gives 3 × 3 = 9 combinations at launch.

### Technical Implementation

Layout variants are implemented as **different component compositions** — different page shells, different navigation components, different grid structures. They share the same underlying domain components (PersonCard, FactTable, RelativeChip, BiographyRenderer) but arrange them differently.

Skins are implemented as **CSS custom property sets** — swapping a `[data-skin]` attribute on the root element changes every color, font, border-radius, and texture across the entire app. No component code changes.

```css
[data-skin="dark-gold"]   → warm dark background, gold accents, serif headings
[data-skin="parchment"]   → warm cream/off-white, deep burgundy accents, traditional serif
[data-skin="modern"]      → pure white, clean sans-serif, minimal accent color
```

### Future Skins (Post-MVP)

```css
[data-skin="norse"]       → deep blue-black, silver/ice accents, runic-inspired type
[data-skin="castle"]      → stone-textured surfaces, amber/torch accents, medieval serif
[data-skin="christian"]   → cream/parchment, deep burgundy accents, traditional serif with crosses
```

All future skins follow the same token contract. Adding a new skin is a CSS-only change.

## 8B — Skin Token Contract

Every skin must define the same set of CSS custom properties. This is the contract.

### Background Tokens

| Token | Purpose |
|---|---|
| `--bg-primary` | Main page background |
| `--bg-surface` | Card and panel backgrounds |
| `--bg-elevated` | Elevated surfaces (modals, drawers, popovers) |
| `--bg-canvas` | Canvas/graph background |

### Text Tokens

| Token | Purpose |
|---|---|
| `--text-primary` | Highest contrast text (headings, names) |
| `--text-secondary` | Standard body text |
| `--text-muted` | De-emphasized text (captions, metadata) |
| `--text-inverse` | Text on accent-colored backgrounds |

### Accent Tokens

| Token | Purpose |
|---|---|
| `--accent-primary` | Primary interactive/brand color |
| `--accent-hover` | Hover state of accent |
| `--accent-muted` | Subtle accent backgrounds (badges, highlights) |
| `--accent-text` | Text rendered in accent color |

### Border Tokens

| Token | Purpose |
|---|---|
| `--border-default` | Standard card and panel borders |
| `--border-strong` | Emphasized borders (selected states, active elements) |
| `--border-muted` | Subtle dividers and separators |

### Semantic Tokens

| Token | Purpose |
|---|---|
| `--color-success` | Positive actions, confirmations |
| `--color-warning` | Caution states |
| `--color-danger` | Destructive actions, errors |
| `--color-info` | Informational highlights |

### Relationship Tokens

| Token | Purpose |
|---|---|
| `--rel-parent-border`, `--rel-parent-text`, `--rel-parent-bg` | Parent relationship styling |
| `--rel-spouse-border`, `--rel-spouse-text`, `--rel-spouse-bg` | Spouse relationship styling |
| `--rel-child-border`, `--rel-child-text`, `--rel-child-bg` | Child relationship styling |
| `--rel-sibling-border`, `--rel-sibling-text`, `--rel-sibling-bg` | Sibling relationship styling |

### Typography Tokens

| Token | Purpose |
|---|---|
| `--font-heading` | Heading/display font family |
| `--font-body` | Body text font family |
| `--font-mono` | Monospace font (code, IDs) |

### Shape Tokens

| Token | Purpose |
|---|---|
| `--radius-sm` | Small elements (badges, pills) |
| `--radius-md` | Medium elements (inputs, buttons) |
| `--radius-lg` | Large elements (cards, panels) |
| `--border-width` | Standard border thickness |

### Elevation Tokens

| Token | Purpose |
|---|---|
| `--shadow-sm` | Subtle depth (buttons, small cards) |
| `--shadow-md` | Medium depth (dropdowns, popovers) |
| `--shadow-lg` | Strong depth (modals, drawers) |

### Motion Tokens

| Token | Purpose |
|---|---|
| `--transition-fast` | Quick micro-interactions (100–150ms) |
| `--transition-normal` | Standard transitions (200–250ms) |
| `--transition-slow` | Deliberate animations (300–400ms) |

### Canvas Tokens

| Token | Purpose |
|---|---|
| `--canvas-node-bg` | Node background on graph |
| `--canvas-node-border` | Node border on graph |
| `--canvas-node-text` | Node text color |
| `--canvas-edge` | Edge/connector color |
| `--canvas-node-gradient` | Optional gradient for nodes |
| `--glow-line` | Subtle glow effect on connections |
| `--glow-line-strong` | Strong glow for highlighted connections |

## 8C — MVP Skin Definitions

### Dark Gold (Default)

- **Personality**: Warm, archival, intentional. Like a leather-bound family bible.
- **Background**: Near-black with warm undertone
- **Accent**: Gold/amber
- **Typography**: Serif headings, clean sans body
- **Borders**: Subtle gold-tinted borders on cards
- **Density**: Medium
- **Shadows**: None (flat)

### Parchment

- **Personality**: Classic, dignified, accessible. Like a genealogy book in a library.
- **Background**: Warm cream/off-white
- **Accent**: Deep burgundy or navy
- **Typography**: Traditional serif headings, readable serif body
- **Borders**: Thin, warm gray
- **Density**: Low-medium
- **Shadows**: Subtle warm shadows

### Modern

- **Personality**: Clean, contemporary, no-nonsense. Like a well-designed personal site.
- **Background**: Pure white
- **Accent**: Single chosen color (user picks from a preset palette)
- **Typography**: Clean geometric sans throughout
- **Borders**: Minimal, light gray
- **Density**: Low
- **Shadows**: Light neutral shadows

## 8D — Typography System

| Role | Dark Gold | Parchment | Modern |
|---|---|---|---|
| Display (person name) | Serif, 36–48px, 400 | Serif, 36–48px, 400 | Sans, 32–40px, 500 |
| H1 (section heading) | Serif, 24–28px, 400 | Serif, 24–28px, 400 | Sans, 22–26px, 500 |
| H2 | Sans, 18px, 500 | Serif, 18px, 400 | Sans, 18px, 500 |
| Body | Sans, 15–16px, 400 | Serif, 16px, 400 | Sans, 15px, 400 |
| Small / Caption | Sans, 13px, 400 | Sans, 13px, 400 | Sans, 13px, 400 |
| Label (uppercase tracked) | Sans, 11–12px, 500 | Sans, 11–12px, 500 | Sans, 11–12px, 500 |

The Label style (uppercase with letter-spacing) is used for section headers like "BIOGRAPHY", "ACCEPTED FACTS", "CLAIMS & CITATIONS" and carries across all skins.

## 8E — Spacing and Shape System

| Token | Value | Notes |
|---|---|---|
| Base unit | 4px | Everything is a multiple of 4 |
| Content padding | 16–24px | Cards, panels |
| Section gap | 24–32px | Between major content blocks |
| Card radius (Dark Gold) | 12px | |
| Card radius (Parchment) | 8px | |
| Card radius (Modern) | 16px | |
| Border width (Dark Gold) | 1px | |
| Border width (Parchment) | 0.5px | |
| Border width (Modern) | 1px | |

## 8F — Component System

### Foundation Components (Skin-Aware, Layout-Agnostic)

These render identically in every layout but change appearance per skin via CSS custom properties.

| Component | Purpose |
|---|---|
| Button (primary, secondary, ghost) | Actions |
| Input, Textarea, Select | Forms |
| Badge / Pill | Status, tags, categories |
| Avatar / Initials circle | Person identity |
| Card | Content container |
| Modal | Full-screen overlay for confirmations and forms |
| Drawer | Slide-in panel for detail views and settings |
| Toast | Feedback notifications |
| Skeleton | Loading state placeholders |
| Empty State | Zero-data states with CTA |
| Search Bar | Text search with filter triggers |

### Domain Components (Genealogy-Specific)

| Component | Used in |
|---|---|
| **PersonCard** | Directory grid/list — name, dates, summary, avatar |
| **PersonRow** | Compact list view — name, dates, lineage badge |
| **FactTable** | Profile — structured key-value display of accepted facts |
| **RelativeChip** | Profile — clickable link to a related person |
| **RelativeGroup** | Profile — grouped chips (Parents, Siblings, Spouses, Children) |
| **TimelineEntry** | Profile — single life event on a vertical timeline |
| **Timeline** | Profile — full ordered timeline of events |
| **BiographyRenderer** | Profile — Markdown-to-HTML with skin-aware typography |
| **PersonNode** | Canvas — graph node for a person |
| **FamilyNode** | Canvas — graph connector node for a union |
| **LineageBadge** | Directory/Profile — named descent line indicator |
| **StatCard** | Landing/Dashboard — count display (People: 229) |
| **ImportReviewItem** | Import — single issue/conflict row |
| **SkinPreview** | Theme picker — thumbnail preview of a skin |
| **LayoutPreview** | Theme picker — wireframe preview of a layout |
| **PrivacyMask** | Profile (viewer mode) — replaces suppressed content |

### Component Contract

Each component should define:

- Purpose
- Props
- Variants (if any)
- Sizes (if any)
- States (default, hover, active, disabled, loading, error)
- Accessibility behavior
- Usage rules and constraints

## 8G — Motion and Animation System

| Category | Behavior | Duration |
|---|---|---|
| Hover states | Subtle background/border shift | 150ms ease |
| Button press | Scale 0.98 | 100ms ease |
| Drawer open/close | Slide from edge | 250ms ease-out |
| Modal entry | Fade + subtle scale up | 200ms ease-out |
| Page transitions | Fade content area | 150ms ease |
| Canvas pan/zoom | Native ReactFlow smooth | Continuous |
| Node expand (canvas) | Animate new nodes appearing | 300ms spring |
| Skeleton shimmer | Subtle pulse | 1.5s loop |
| Toast | Slide in from top-right, auto-dismiss | 300ms in, 3s hold |

### Reduced Motion

All animations respect `prefers-reduced-motion`. When active, transitions become instant (0ms) and shimmer stops.

### Skin-Specific Motion

- Dark Gold and Parchment feel slower and more deliberate (multiply durations by 1.2).
- Modern feels snappier (multiply by 0.8).
- This is subtle but contributes to the personality of each skin.

---

# STEP 9 — Features, Capabilities, and Integrations

## Tier 1: Core MVP (Must Ship)

### Authentication & Accounts

- Email/password sign-up and sign-in
- OAuth (Google) for frictionless onboarding
- Session management, password reset
- Account deletion (with cascade)

### Tree Management

- Create a tree (name, description)
- Toggle public/private sharing
- Generate and regenerate share link
- Delete tree (with confirmation)

### Person CRUD

- Add person (name, dates, places, gender, summary)
- Edit person inline or via modal
- Delete person (with cascade warning for family connections)
- Biography editor — Markdown with live preview
- Living person flag (privacy toggle)

### Family Connections

- Add spouse to a person → creates Family
- Add child to a Family
- Set parents for a person (link to existing Family or create one)
- Remove connections (with confirmation)
- Display immediate relatives on profile: parents, siblings, spouses, children

### Directory

- Browse all people in a tree
- Search by name (real-time filtering)
- Filter by surname
- Filter by lineage
- Sort by name, birth date, death date
- Pagination or virtual scroll for large trees

### Person Profile

- Biography section (rendered Markdown)
- Accepted facts table (birth, death, places)
- Timeline (birth, death, plus Event records)
- Immediate relatives with clickable navigation
- Summary/tagline display
- Privacy masking in viewer mode

### Canvas

- Person-centered graph with neighborhood-expand model
- Click to expand outward
- Click node to navigate to profile
- Zoom, pan, fit-to-view controls
- Highlight lineages toggle
- Layout via ELK.js auto-hierarchy

### Theming

- Layout variant picker (Classic, Editorial, Explorer)
- Skin picker (Dark Gold, Parchment, Modern)
- Live preview before applying
- Theme stored on tree, applied globally
- Viewer sees the creator's chosen theme

### GEDCOM Import

- Upload `.ged` file
- Parse into people, families, events
- Review screen showing counts and detected issues
- Confirm to import
- Issues saved as ReviewIssues for later cleanup
- Handle common GEDCOM quirks (date formats, missing fields, encoding)

### Public Sharing (Viewer Mode)

- Public URL via slug or share token
- Full read-only access: directory, profiles, canvas
- No sign-up required for viewers
- Living person privacy suppression
- Subtle "Create your own tree" CTA (not blocking)

## Tier 2: Supporting Features (Ship With or Immediately After MVP)

### Lineages

- Create named lineage
- Add/order people in a lineage
- Lineage filter in directory
- Lineage badge on person cards and profiles
- Lineage view page (ordered list of members)

### Events

- Add custom life events beyond birth/death (baptism, immigration, occupation, military, residence)
- Display on timeline
- Edit/delete events

### Dashboard (Creator)

- Tree stats (people count, families, events, issues)
- Recent activity (last added/edited people)
- Quick actions (add person, import, share)

### Import Review

- List of ReviewIssues from GEDCOM import
- Mark as resolved with notes
- Flag duplicates for manual review
- No auto-merge — human decides

## Tier 3: Post-MVP Enhancements

| Feature | Notes |
|---|---|
| Ancestry/FamilySearch API import | OAuth connection, pull tree data |
| Media uploads | Photos, document scans, attached to people |
| Multiple trees per account | Requires tree switcher UI |
| Collaborative editing | Invite others to co-edit a tree |
| Advanced search | Full-text across biographies, date ranges, place search |
| Claims & citations UI | Surface the hidden research layer to creators |
| Custom skins | User-defined color palette within a layout |
| Additional layout variants | Norse, Castle, Christian, etc. |
| Static site export | Generate a standalone HTML site from a tree |
| PDF/print export | Formatted family book |
| Billing / premium tiers | Unlock themes, larger trees, media storage |
| Merge/deduplicate tool | Intelligent duplicate detection and merge UI |
| Relationship calculator | "How is person A related to person B?" |
| Pedigree chart view | Traditional ancestor chart (fan or vertical) |
| Descendant report | Printable descendant tree from any person |

## Integrations Checklist (MVP)

| Integration | Purpose | Solution |
|---|---|---|
| Auth | Sign-up, sign-in, sessions | Clerk, NextAuth, or Supabase Auth |
| Database | Structured data storage | PostgreSQL (Supabase or Neon) |
| File parsing | GEDCOM import | Server-side parser (custom or `gedcom.js`) |
| Hosting | Web app + API | Vercel |
| Email | Password reset, share notifications | Resend or Postmark |
| Analytics | Usage tracking | PostHog or Plausible |
| Error tracking | Crash reporting | Sentry |

## Key Integration Decision

The current repo uses SQLite, which is excellent for single-user. For a multi-tenant SaaS, PostgreSQL is the right move — row-level security, concurrent connections, hosted options (Supabase, Neon). The Drizzle ORM layer already in use makes this migration straightforward since Drizzle abstracts the dialect.

---

# STEP 10 — Technical Architecture and Libraries

## 10A — Technical Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Frontend** | Next.js (App Router) + React | Existing stack. App Router gives server components, layouts, streaming. |
| **Styling** | Tailwind CSS | Existing stack. CSS custom properties for theming layer on top. |
| **Database** | PostgreSQL via Supabase or Neon | Multi-tenant SaaS needs hosted relational DB. Drizzle ORM stays. |
| **Auth** | Clerk or Supabase Auth | Handles email/password, OAuth, session management. |
| **ORM** | Drizzle | Already in use. Switch dialect from `better-sqlite3` to `postgres-js`. |
| **Canvas** | @xyflow/react (React Flow) | Already in use. Interactive graph visualization. |
| **Graph layout** | ELK.js | Already in use. Hierarchical auto-layout for family trees. |
| **Markdown** | `react-markdown` + `remark-gfm` | Render biography Markdown safely with skin-aware styling. |
| **GEDCOM parsing** | Custom parser or `gedcom.js` | Parse GEDCOM files server-side, map to internal schema. |
| **File uploads** | Supabase Storage or S3 | For GEDCOM file upload (and future media). |
| **Email** | Resend | Transactional emails (password reset, share notifications). |
| **Hosting** | Vercel | Next.js-optimized hosting. Edge functions for public viewer routes. |
| **Error tracking** | Sentry | Crash reporting and performance monitoring. |
| **Analytics** | PostHog | Product analytics, feature usage, funnel tracking. |

## 10B — Key Library Decisions

| Category | Library | Why |
|---|---|---|
| UI primitives | Custom (no library) | Themed product needs full control over every visual detail. |
| Icons | Lucide React | Clean, consistent, tree-shakeable. |
| Forms | React Hook Form + Zod | Type-safe validation for person editor, import review, settings. |
| Data fetching | Server Components + Server Actions | Next.js native. No need for TanStack Query at MVP. |
| Date handling | `date-fns` | Lightweight, tree-shakeable. For normalizing genealogical dates. |
| Markdown rendering | `react-markdown` + `remark-gfm` | Safe, extensible, server-renderable. |
| Canvas | `@xyflow/react` | Already in use. |
| Layout engine | `elkjs` | Already in use. |
| GEDCOM | Custom parser | GEDCOM is a messy format. Custom parser gives control over error handling. |
| Animation | CSS transitions + `framer-motion` (light) | CSS for most things. Framer Motion only for canvas and drawer animations. |

## 10C — Folder Structure

```
app/
  (auth)/                    # Creator routes (requires sign-in)
    dashboard/
    directory/
    person/[personId]/
    person/[personId]/edit/
    canvas/
    import/
    theme/
    settings/
  (public)/                  # Viewer routes (no auth required)
    t/[slug]/                # Tree landing / directory
    t/[slug]/person/[personId]/
    t/[slug]/canvas/
  api/
    import/                  # GEDCOM upload endpoint
  globals.css
  layout.tsx                 # Root layout with theme provider

components/
  foundation/                # Skin-aware primitives
    button.tsx
    input.tsx
    card.tsx
    modal.tsx
    drawer.tsx
    badge.tsx
    avatar.tsx
    skeleton.tsx
    empty-state.tsx
    toast.tsx
    search-bar.tsx
  domain/                    # Genealogy-specific components
    person-card.tsx
    person-row.tsx
    fact-table.tsx
    relative-chip.tsx
    relative-group.tsx
    timeline.tsx
    timeline-entry.tsx
    biography-renderer.tsx
    lineage-badge.tsx
    stat-card.tsx
    import-review-item.tsx
    privacy-mask.tsx
    skin-preview.tsx
    layout-preview.tsx
  canvas/                    # React Flow components
    family-canvas.tsx
    canvas-sidebar.tsx
    canvas-nodes.tsx
  layouts/                   # Layout variant shells
    classic-shell.tsx
    editorial-shell.tsx
    explorer-shell.tsx
  theme-provider.tsx

db/
  schema.ts                  # Drizzle table definitions (PostgreSQL)
  migrations/

lib/
  queries.ts                 # Read model (typed queries)
  actions.ts                 # Server Actions (mutations)
  import/
    gedcom-parser.ts
    review.ts
  export/
    json-generator.ts
  utils/
    dates.ts                 # Genealogical date parsing/normalization
    privacy.ts               # Living person suppression logic
    slugs.ts                 # URL-safe slug generation

styles/
  tokens/
    dark-gold.css
    parchment.css
    modern.css
```

## 10D — Architecture Rules

1. **Foundation components never import domain components.** Dependency flows one way: domain → foundation → CSS vars.
2. **Layout shells compose domain components.** A layout shell decides where things go. Domain components decide what they show.
3. **All data access goes through `lib/queries.ts` and `lib/actions.ts`.** No raw Drizzle calls in components or routes.
4. **Server components by default.** Only add `"use client"` when interactivity is needed (canvas, forms, theme picker, search input).
5. **Theme is applied at the root layout via `data-layout` and `data-skin` attributes.** Layout shells read `data-layout` to decide which shell to render. All components read skin tokens from CSS vars.
6. **Public routes read tree data through the share slug.** Every query in public routes is scoped by `tree.slug + tree.is_public = true`. No leaking private trees.
7. **Privacy filtering happens at the query layer**, not the component layer. If a person is living and the viewer is not the creator, the query returns suppressed data. Components just render what they get.

---

# STEP 11 — Quality, Security, and Operations

## 11A — Quality Requirements

### Loading States

Every data-fetching screen shows a skeleton that matches the layout structure. Use Next.js `loading.tsx` files per route segment. Skeletons adapt to the active skin (shimmer color matches theme).

### Empty States

Warm, inviting, action-oriented. Every empty state has a primary CTA. Examples:

- "No people yet — add your first family member" with an "Add person" button
- "No events recorded — add a life event" on the timeline
- Empty states are not error states — they are invitations

### Error States

- Inline validation on forms (Zod + React Hook Form)
- Toast notifications for server errors with retry option
- Never a blank screen — always a fallback message and a path forward

### Responsive Behavior

All three layouts must work on mobile:

- Classic sidebar collapses to bottom nav
- Editorial content stacks vertically
- Explorer canvas fills screen with bottom-sheet drawer
- Minimum supported width: 360px

### Accessibility

- All interactive elements keyboard-navigable
- Focus management in modals and drawers
- ARIA labels on canvas nodes
- Color contrast meets WCAG AA in all skins
- Reduced motion support
- Screen reader-friendly biography rendering

### Performance Targets

- First Contentful Paint under 1.5s
- Time to Interactive under 3s
- Directory loads with 500+ people without jank (virtual scroll or pagination)
- Canvas handles 200+ visible nodes smoothly
- GEDCOM import for 5,000 people completes within 30 seconds

## 11B — Security Requirements

| Concern | Approach |
|---|---|
| **Authentication** | Delegated to auth provider. No custom password storage. |
| **Authorization** | Every mutation checks `tree.account_id === session.userId`. Every public read checks `tree.is_public === true`. |
| **Row-level scoping** | All queries include `WHERE tree_id = ?`. No cross-tree data leakage. |
| **GEDCOM upload** | Server-side parsing only. Validate file size (max 50MB). Sanitize all parsed strings. Reject malformed files gracefully. |
| **Markdown rendering** | Sanitize biography HTML output. No raw HTML pass-through — use `react-markdown` with `rehype-sanitize`. |
| **Share tokens** | Cryptographically random (UUID v4 or `crypto.randomUUID()`). Regeneratable by creator. |
| **Rate limiting** | Limit import uploads (5/hour per account). Limit account creation (anti-abuse). |
| **Privacy** | Living person suppression enforced at query layer. Creator bypass via session check. |
| **CSRF** | Next.js Server Actions have built-in CSRF protection. |
| **Input validation** | Zod schemas on all Server Action inputs. No trusting client-side validation alone. |

## 11C — Performance Strategy

| Area | Strategy |
|---|---|
| **Directory with large trees** | Server-side pagination (50 per page). Search uses database `ILIKE` or full-text index. |
| **Canvas rendering** | React Flow handles virtualization natively. Only render visible nodes. ELK layout computed server-side or in web worker. |
| **Profile pages** | Server-rendered (RSC). Biography Markdown rendered at request time. |
| **Public viewer routes** | Aggressive caching. `Cache-Control` headers. ISR or edge caching via Vercel. |
| **GEDCOM import** | Process in a server action with streaming progress. For very large files (5,000+), consider background job with polling. |
| **Theme switching** | Instant — CSS custom property swap, no re-render of components. |
| **Images (post-MVP)** | Next.js Image optimization. Lazy loading. WebP conversion. |

## 11D — Operations

| Area | Tool | Notes |
|---|---|---|
| **Error tracking** | Sentry | Client + server errors. Source maps in production. |
| **Analytics** | PostHog | Feature usage, funnel tracking (sign-up → import → share). |
| **Logging** | Vercel Logs + structured logging | Request logs, import job logs, error context. |
| **Database monitoring** | Supabase/Neon dashboard | Query performance, connection count, storage usage. |
| **Uptime** | Vercel status + health check | `/api/health` endpoint. |
| **Backups** | Database provider handles it | Point-in-time recovery via Supabase/Neon. |
| **Rollback** | Vercel instant rollback | Revert to previous deployment in one click. |

---

# STEP 12 — Delivery, Prompting, and Roadmap

## 12A — Build Phases

### Phase 1: Foundation (Week 1–2)

| Task | Depends on | Done looks like |
|---|---|---|
| PostgreSQL schema via Drizzle (all tables from Step 3) | Nothing | `npm run db:push` creates all tables. Seed script creates a test tree with 20 people. |
| Auth integration (Clerk or Supabase Auth) | Nothing | Sign up, sign in, sign out, session available in server components. |
| CSS token system | Nothing | `globals.css` has `:root` + `[data-skin="dark-gold"]` + `[data-skin="parchment"]` + `[data-skin="modern"]` with all required tokens. |
| Theme provider | CSS tokens | `<ThemeProvider>` reads tree's theme from DB, sets `data-layout` and `data-skin` on root. localStorage persistence for creator preference. |
| Root layout + route groups | Auth | `(auth)` routes require session. `(public)` routes do not. Both wrapped in ThemeProvider. |

### Phase 2: Components (Week 2–3)

| Task | Depends on | Done looks like |
|---|---|---|
| Foundation components (Button, Input, Card, Modal, Drawer, Badge, Avatar, Skeleton, EmptyState, Toast, SearchBar) | CSS tokens | All render correctly in all 3 skins. Test page showing each component in each skin. |
| Domain components (PersonCard, PersonRow, FactTable, RelativeChip, RelativeGroup, Timeline, BiographyRenderer, LineageBadge, StatCard, PrivacyMask) | Foundation components + schema | All render with test data. Skin-aware. |
| Layout shells (ClassicShell, EditorialShell, ExplorerShell) | Domain components | Each shell renders a page with placeholder content. Navigation works. Responsive down to 360px. |

### Phase 3: Core CRUD (Week 3–4)

| Task | Depends on | Done looks like |
|---|---|---|
| `lib/queries.ts` — all read queries | Schema | Typed functions: `getTreeBySlug`, `getPeopleByTree`, `getPersonById`, `getFamiliesByTree`, `getRelatives`, etc. |
| `lib/actions.ts` — all mutations | Schema + auth | Server Actions: `createPerson`, `updatePerson`, `deletePerson`, `createFamily`, `addChild`, `setParents`, `updateTree`, etc. All check ownership. |
| Person editor (add/edit form) | Actions + foundation components | Modal or page with form. Zod validation. Name, dates, places, gender, summary, biography (Markdown textarea with preview). |
| Family connection builder | Actions + queries | From a person's profile, add spouse, add child, set parents. Creates Family and FamilyChild records. |

### Phase 4: Views (Week 4–6)

| Task | Depends on | Done looks like |
|---|---|---|
| Directory page | Queries + PersonCard/PersonRow + layout shells | Browse all people. Search by name. Filter by surname and lineage. Sort. Pagination. Works in all 3 layouts. |
| Person profile page | Queries + all domain components + layout shells | Full profile: biography, facts, timeline, relatives. Navigation between people via relative chips. Works in all 3 layouts. |
| Canvas page | Queries + React Flow + ELK | Person-centered graph. Click to expand. Click node to navigate. Zoom/pan/fit. Lineage highlighting. |
| Creator dashboard | Queries + StatCard + layout shells | Tree stats, recent activity, quick action buttons. |

### Phase 5: Import + Sharing (Week 6–8)

| Task | Depends on | Done looks like |
|---|---|---|
| GEDCOM parser | Schema | Parses `.ged` file into internal data structures. Handles common quirks. Detects issues. |
| Import flow UI | Parser + actions | Upload page → parsing progress → review screen (counts + issues) → confirm → data loaded. |
| Public viewer routes | Queries + layout shells + PrivacyMask | `/t/[slug]` serves themed, read-only tree. Living person suppression works. No auth required. |
| Share management | Actions | Toggle public/private. Generate share link. Regenerate token. Copy link button. |
| Theme picker | Theme provider + SkinPreview + LayoutPreview | Settings page or drawer. Pick layout + skin. Live preview. Save to tree. |

### Phase 6: Polish + Launch (Week 8–10)

| Task | Depends on | Done looks like |
|---|---|---|
| Empty states for all views | All views built | Every screen handles zero data gracefully with clear CTAs. |
| Error handling | All views built | Form validation errors inline. Server errors in toasts. Network failures handled. |
| Responsive QA | All layouts built | All 3 layouts work on mobile (360px+), tablet, and desktop. |
| Loading states | All views built | Skeleton screens in every route segment. Skin-aware shimmer. |
| Testing | Everything | Vitest for data layer. Playwright for critical flows (sign up → add person → share link). |
| Sentry + PostHog | Hosting | Error tracking and analytics live. |
| Landing/marketing page | Design system | Public homepage explaining the product. CTA to sign up. Example shared tree. |

### Phase 7: Post-MVP

- Ancestry/FamilySearch API integrations
- Media uploads (photos, document scans)
- Multiple trees per account
- Collaborative editing
- Claims & citations UI for creators
- Additional skins (Norse, Castle, Christian)
- Static site export
- PDF/print export
- Billing / premium tiers
- Merge/deduplicate tool
- Relationship calculator
- Pedigree chart and descendant report views

## 12B — Prompt Plan

When building, each prompt should follow this order. Each prompt should include product context, UX context, system context, and quality context.

```
 1. Database schema (PostgreSQL + Drizzle tables for all core + hidden objects)
 2. Auth integration (sign-up, sign-in, session, middleware)
 3. CSS token contract (all required tokens, 3 skin definitions)
 4. Theme provider (layout + skin state, data attributes, localStorage)
 5. Foundation components (Button through Toast — all skin-aware)
 6. Domain components: PersonCard, PersonRow, FactTable
 7. Domain components: RelativeChip, RelativeGroup, Timeline, BiographyRenderer
 8. Domain components: LineageBadge, StatCard, PrivacyMask, SkinPreview
 9. Layout shells: ClassicShell, EditorialShell, ExplorerShell
10. Data layer: lib/queries.ts (all typed read queries)
11. Data layer: lib/actions.ts (all Server Actions with auth checks)
12. Person editor form (add + edit, Zod validation, Markdown preview)
13. Family connection builder (spouse, child, parent linking)
14. Directory page (search, filter, sort, pagination, all 3 layouts)
15. Person profile page (biography, facts, timeline, relatives, all 3 layouts)
16. Canvas page (React Flow + ELK, neighborhood expand, node navigation)
17. Creator dashboard (stats, recent activity, quick actions)
18. GEDCOM parser (server-side, issue detection)
19. Import flow UI (upload, progress, review, confirm)
20. Public viewer routes (slug-based, read-only, privacy suppression)
21. Share management (toggle, link generation, token regeneration)
22. Theme picker UI (layout + skin selection, live preview)
23. Empty states, loading skeletons, error handling (all views)
24. Responsive QA pass (all layouts at 360px, 768px, 1280px)
25. Testing (Vitest unit tests, Playwright E2E for critical flows)
26. Deployment (Vercel, env vars, database connection, Sentry, PostHog)
```

## 12C — Prompt Template

Every feature prompt should define:

### Product Context

- What it is
- Why it matters
- Who uses it
- Whether it is MVP or later

### UX Context

- Where it lives
- What screens it affects
- What states it must support
- How it should feel visually

### System Context

- What data it affects
- What logic it requires
- What permissions it changes
- What integrations it touches

### Quality Context

- What could break
- How to test it
- What done looks like
- What dependencies exist

---

# Master Decision Log

| # | Decision | Rationale |
|---|---|---|
| 1 | Presentation-first, not research-first | The product's value is beautiful sharing, not evidence management |
| 2 | SaaS with public share links | Viral loop: creator shares → viewer signs up → creates their own tree |
| 3 | Creator ≠ Viewer (two distinct experiences) | Different needs, different UI density, different permissions |
| 4 | GEDCOM + full manual editing at MVP | Covers users with existing data AND users starting from scratch |
| 5 | Claims/citations preserved in schema, hidden from UI | Protects future research features without cluttering MVP |
| 6 | Tree is the isolation boundary | Clean multi-tenancy, safe public sharing, simple permission model |
| 7 | Biography stored as Markdown in database | SaaS cannot rely on filesystem; Markdown keeps it portable |
| 8 | PostgreSQL replaces SQLite | Multi-tenant SaaS needs concurrent connections, hosted DB, row-level scoping |
| 9 | Theme = layout variant × skin (independent axes) | Maximum variety with minimum combinatorial complexity |
| 10 | 3 layouts at MVP (Classic, Editorial, Explorer) | Covers the three main ways people want to experience a family tree |
| 11 | 3 skins at MVP (Dark Gold, Parchment, Modern) | Dark + light traditional + light minimal covers the key aesthetics |
| 12 | Skin = CSS custom properties only | Swap a data attribute, everything changes. No component code per skin. |
| 13 | Domain components are layout-agnostic Lego pieces | Adding a new layout is cheap because PersonCard/FactTable/etc. just work |
| 14 | Privacy filtering at query layer, not component layer | One enforcement point. Components render what they are given. |
| 15 | Custom components only (no UI library) | Themed product needs full control over every visual detail |
| 16 | Server components by default, client only when needed | Performance + SEO for public viewer routes |
| 17 | 6-phase build over ~10 weeks | Foundation → Components → CRUD → Views → Import/Sharing → Polish |

---

# Assumptions to Validate

- Users will actually share links (viral loop hypothesis)
- GEDCOM import covers enough of the audience to start (vs. people who only have Ancestry accounts)
- Theme variety is a real differentiator people care about (vs. just "make it look nice by default")
- Manual person editing is used frequently enough to justify its MVP priority
- Three layout variants at launch is the right number (not too few, not too many to polish)

---

# Master Checklist

## 1. Product

- [x] Problem defined
- [x] User defined (creator + viewer personas)
- [x] North-star goal defined
- [x] MVP defined
- [x] Out of scope defined
- [x] Product tone defined

## 2. App Finder

- [x] App category defined
- [x] Dominant interaction pattern defined
- [x] Main work surface defined
- [x] Platform priority defined
- [x] Collaboration model defined
- [x] Data scale defined

## 3. Data

- [x] Main object defined (Person)
- [x] Supporting objects defined (Family, Event, Lineage, etc.)
- [x] Relationships defined
- [x] Lifecycle defined
- [x] Ownership defined (Tree scoping)
- [x] Delete/archive rules defined

## 4. Permissions

- [x] Roles defined (Creator, Viewer, System)
- [x] Access rules defined
- [x] Sharing rules defined
- [x] Privacy rules defined
- [x] Sensitive actions defined

## 5. Flows and States

- [x] Core flows defined (7 flows)
- [x] Loading states defined
- [x] Empty states defined
- [x] Error states defined
- [x] Success states defined
- [x] Edge cases defined

## 6. Information Architecture

- [x] Top-level navigation defined (creator + viewer)
- [x] Screen hierarchy defined
- [x] Page/panel/modal logic defined
- [x] Search/filter placement defined
- [x] URL structure defined

## 7. Visual Structure

- [x] Layout patterns defined (Classic, Editorial, Explorer)
- [x] Primary work area defined per layout
- [x] Fixed vs scrolling regions defined
- [x] Visual hierarchy defined
- [x] Mobile adaptation defined

## 8. Theme and Design System

- [x] Theme architecture defined (layout × skin)
- [x] Skin token contract defined
- [x] MVP skins defined (Dark Gold, Parchment, Modern)
- [x] Typography system defined
- [x] Spacing system defined
- [x] Component system defined (foundation + domain)
- [x] Motion rules defined
- [x] Accessibility rules defined

## 9. Features and Integrations

- [x] MVP features defined (Tier 1)
- [x] Supporting features defined (Tier 2)
- [x] Post-MVP features defined (Tier 3)
- [x] Integrations defined
- [x] Database migration decision made (SQLite → PostgreSQL)

## 10. Technical Architecture

- [x] Stack defined
- [x] Library choices defined
- [x] Folder structure defined
- [x] Architecture rules defined
- [x] Component dependency direction defined

## 11. Quality and Operations

- [x] Security baseline defined
- [x] Performance targets defined
- [x] Logging defined
- [x] Monitoring defined
- [x] Rollback defined
- [x] Backup/recovery defined

## 12. Delivery

- [x] Build phases defined (6 phases, ~10 weeks)
- [x] Prompt order defined (26 prompts)
- [x] Prompt template defined
- [x] Dependency order defined
- [x] Testing requirements defined
