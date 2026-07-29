---
name: stuck-page-recovery
description: Diagnose and recover a browser tab or dev preview that the user reports as "stuck", "frozen", or needing a refresh. Trigger on phrases like "refresh the page", "it's stuck again", "the page froze", "nothing's updating". Covers the diffui canvas tab and the local Next.js dev server preview — the two surfaces this repo's workflows keep open.
---

# stuck-page-recovery

I cannot refresh, click, or reload a tab the user has open in their own browser — I have no
control over it. This skill is about (1) quickly figuring out *which* surface is stuck and
whether the problem is server-side (fixable by me) or client-side (needs the user to act), and
(2) giving one short, concrete instruction instead of a troubleshooting essay.

## Step 1 — Ask which surface, unless it's obvious from context

Two tabs recur in this repo's workflows and behave differently when stuck:

- **diffui canvas** (`https://diffui.ai/app/canvas/<project-id>`) — open while doing card-art-pipeline
  work. `card-art-pipeline`'s Path A already warns: keeping this tab open during MCP generation
  calls can clobber MCP-added nodes on sync. A "stuck" canvas here is usually stale client state,
  not a real hang.
- **The app's own dev preview** (`http://localhost:3000/...`) — the Next.js dev server. A "stuck"
  page here can be a genuine server hang (webpack cache corruption, stuck compile) as well as a
  client-side rendering freeze.

If the immediately preceding work was diffui generation/review, default to assuming the diffui
canvas without asking. If the immediately preceding work was app development/testing, default to
the dev preview. Only ask explicitly when neither is a safe guess (e.g. cold start of a session,
or the user's phrasing gives no clue).

## Step 2 — Check what I actually control

**Dev server health** (always cheap, always safe to run first):
```
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ --max-time 5
```
- `200`/`3xx` → the server is fine; the freeze is client-side (browser tab), not something I can
  fix by restarting anything. Skip to Step 3.
- No response / timeout / connection refused → the dev server itself is down or wedged. Check for
  a process already holding the port before starting a new one (avoid stacking duplicate dev
  servers):
  ```
  netstat -ano | findstr :3000
  ```
  If a stale process is holding the port with no healthy response, confirm with the user before
  killing it (killing a dev server can lose in-terminal output they wanted). Restart with the
  project's normal dev command. If restarting doesn't clear it, the next suspect is a corrupted
  `.next` cache — confirm with the user before deleting it, since it's a build artifact, not
  source, but deleting it is still a destructive-feeling action worth a heads-up.

**diffui canvas state** (if that's the stuck surface): `get_canvas_state` reports the
server-side truth. If the data it returns looks correct (recent generations present, nothing
missing), the canvas itself is fine and the tab's *rendering* is what's stuck — this is purely a
client problem, not something any MCP call fixes.

## Step 3 — What to tell the user

I can't act on their browser tab, so the message back is always one of these, matched to what
Step 2 found:

- **Server confirmed healthy / canvas state confirmed correct** → "The [server/canvas data] is
  fine on its end — this is your browser tab. Hard refresh (Ctrl+Shift+R on Windows) or close and
  reopen the tab: `<the exact URL>`." For the diffui canvas specifically, closing and reopening is
  preferred over a soft refresh, since a stale tab can re-sync stale state back over real MCP
  changes if left open during generation.
- **Server was down and I restarted it** → say so plainly, give the URL to reload, and note
  in-flight work (an unsaved form, an open generation) may have been lost.
- **Repeated stuck reports on the same surface within one session** (three or more) → stop
  repeating the same fix and say so: something about that surface's setup may be actually broken,
  not just occasionally slow — worth a closer look rather than another refresh.

## Stop conditions

- **User reports a Claude Code / conversation-level freeze**, not a browser tab → this skill
  doesn't apply; that's a different problem (tool call hung, session issue) and should be handled
  directly, not routed through browser-refresh instructions.
- **Restarting the dev server would kill work the user hasn't confirmed is safe to lose** → ask
  first, don't restart silently.
