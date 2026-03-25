export function publicTreeHref(slug: string, shareToken: string) {
  return `/t/${slug}?share=${shareToken}`;
}

export function publicPersonHref(slug: string, personId: string, shareToken: string) {
  return `/t/${slug}/person/${personId}?share=${shareToken}`;
}

export function publicCanvasHref(slug: string, shareToken: string, personId?: string | null) {
  const base = `/t/${slug}/canvas?share=${shareToken}`;
  return personId ? `${base}&person=${personId}` : base;
}

export function publicLineageCanvasHref({
  slug,
  shareToken,
  lineageId,
  personId,
  depth = 3,
}: {
  slug: string;
  shareToken: string;
  lineageId: string;
  personId?: string | null;
  depth?: number;
}) {
  const params = new URLSearchParams({
    share: shareToken,
    lineage: lineageId,
    depth: String(depth),
  });

  if (personId) {
    params.set("person", personId);
  }

  return `/t/${slug}/canvas?${params.toString()}`;
}

export function publicLineagesHref(slug: string, shareToken: string) {
  return `/t/${slug}/lineages?share=${shareToken}`;
}
