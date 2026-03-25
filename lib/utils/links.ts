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
