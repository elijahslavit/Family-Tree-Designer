import type { NextRequest } from "next/server";

import { parseGedcomText } from "@/lib/import/gedcom-parser";
import { getDemoStore } from "@/lib/data/demo-store";
import { log } from "@/lib/logger";
import { isDemoMode } from "@/lib/runtime";
import { enforceRateLimit } from "@/lib/utils/rate-limit";

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const rateLimitKey = forwardedFor?.split(",")[0]?.trim() || "local";
  const limiter = isDemoMode()
    ? { ok: true, retryAfterMs: null }
    : enforceRateLimit({
        key: `import:${rateLimitKey}`,
        limit: 5,
        windowMs: 60 * 60 * 1000,
      });

  if (!limiter.ok) {
    return Response.json(
      { error: "Import rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limiter.retryAfterMs ?? 0) / 1000)),
        },
      },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const treeId = formData.get("treeId");

  if (!(file instanceof File) || typeof treeId !== "string") {
    return Response.json({ error: "Missing file or treeId." }, { status: 400 });
  }

  if (file.size > 50 * 1024 * 1024) {
    return Response.json({ error: "GEDCOM file exceeds 50 MB." }, { status: 413 });
  }

  const text = await file.text();
  const parsed = parseGedcomText({
    treeId,
    content: text,
  });
  const store = getDemoStore();
  const jobId = crypto.randomUUID();

  store.importJobs.unshift({
    id: jobId,
    treeId,
    accountId: store.account.id,
    status: "parsed",
    fileName: file.name,
    storagePath: null,
    payloadJson: JSON.stringify(parsed),
    counts: {
      people: parsed.people.length,
      families: parsed.families.length,
      events: parsed.events.length,
      issues: parsed.issues.length,
    },
    issues: parsed.issues,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  log("info", "GEDCOM import staged", {
    jobId,
    treeId,
    fileName: file.name,
    counts: {
      people: parsed.people.length,
      families: parsed.families.length,
      events: parsed.events.length,
      issues: parsed.issues.length,
    },
  });

  return Response.json({
    jobId,
    counts: {
      people: parsed.people.length,
      families: parsed.families.length,
      events: parsed.events.length,
      issues: parsed.issues.length,
    },
    issues: parsed.issues,
  });
}
