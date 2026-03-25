type Bucket = {
  timestamps: number[];
};

declare global {
  var __familyTreeRateLimitBuckets: Map<string, Bucket> | undefined;
}

function getBuckets() {
  if (!globalThis.__familyTreeRateLimitBuckets) {
    globalThis.__familyTreeRateLimitBuckets = new Map();
  }

  return globalThis.__familyTreeRateLimitBuckets;
}

export function enforceRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const buckets = getBuckets();
  const existing = buckets.get(key) ?? { timestamps: [] };
  const filtered = existing.timestamps.filter((timestamp) => now - timestamp < windowMs);

  if (filtered.length >= limit) {
    return {
      ok: false,
      retryAfterMs: windowMs - (now - filtered[0]),
    };
  }

  filtered.push(now);
  buckets.set(key, { timestamps: filtered });

  return { ok: true };
}
