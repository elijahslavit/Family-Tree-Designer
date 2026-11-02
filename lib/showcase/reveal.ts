/**
 * Shared constants for the client-showcase opening reveal. Kept free of React
 * so both the server-rendered preload script and the client component agree.
 */

/** Space-separated list of reveal keys already seen, set on <html>. */
export const REVEAL_SEEN_ATTRIBUTE = "data-reveal-seen";
export const REVEAL_CHANGE_EVENT = "showcase-reveal-change";
const STORAGE_PREFIX = "ftd:showcase-reveal:";

/** A CSS/attribute-safe token identifying one showcase (by its base path). */
export function revealKeyFor(basePath: string) {
  return basePath.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "showcase";
}

export function revealStorageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * Runs before first paint on a full page load so a returning visitor in the
 * same browser session never sees the reveal flash before hydration hides it.
 */
export function revealPreloadScript(key: string) {
  const storageKey = JSON.stringify(revealStorageKey(key));
  const token = JSON.stringify(key);
  return `try{if(sessionStorage.getItem(${storageKey})){var h=document.documentElement,c=(h.getAttribute(${JSON.stringify(REVEAL_SEEN_ATTRIBUTE)})||"").split(" ");if(c.indexOf(${token})<0){c.push(${token});h.setAttribute(${JSON.stringify(REVEAL_SEEN_ATTRIBUTE)},c.join(" ").trim())}}}catch(e){}`;
}

export function revealPreloadStyle(key: string) {
  return `html[${REVEAL_SEEN_ATTRIBUTE}~="${key}"] [data-showcase-reveal="${key}"]{display:none}`;
}

/** In-page memory so a dismissal sticks even when storage is blocked. */
const seenThisPage = new Set<string>();

export function hasSeenReveal(key: string) {
  if (seenThisPage.has(key)) return true;
  try {
    return window.sessionStorage.getItem(revealStorageKey(key)) === "1";
  } catch {
    return false;
  }
}

function setHtmlSeen(key: string, seen: boolean) {
  const html = document.documentElement;
  const current = new Set((html.getAttribute(REVEAL_SEEN_ATTRIBUTE) ?? "").split(" ").filter(Boolean));
  if (seen) current.add(key);
  else current.delete(key);
  if (current.size) html.setAttribute(REVEAL_SEEN_ATTRIBUTE, [...current].join(" "));
  else html.removeAttribute(REVEAL_SEEN_ATTRIBUTE);
}

export function markRevealSeen(key: string, seen: boolean) {
  if (seen) seenThisPage.add(key);
  else seenThisPage.delete(key);
  try {
    if (seen) window.sessionStorage.setItem(revealStorageKey(key), "1");
    else window.sessionStorage.removeItem(revealStorageKey(key));
  } catch {
    // Without storage the reveal simply shows again on the next full load.
  }
  setHtmlSeen(key, seen);
  window.dispatchEvent(new Event(REVEAL_CHANGE_EVENT));
}
