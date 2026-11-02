"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  REVEAL_CHANGE_EVENT,
  hasSeenReveal,
  markRevealSeen,
} from "@/lib/showcase/reveal";

const EXIT_MS = 650;

function subscribe(onChange: () => void) {
  window.addEventListener(REVEAL_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(REVEAL_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The opening moment of a private family showcase: who prepared it, the focal
 * ancestor, the family name, and one action. Shown once per browser session
 * per showcase; returning visitors go straight to the archive.
 */
export function ShowcaseReveal({
  revealKey,
  familyName,
  eyebrow,
  tagline,
  curatorName,
  portrait,
}: {
  revealKey: string;
  familyName: string;
  eyebrow: string;
  tagline: string;
  curatorName?: string;
  portrait: { src: string; name: string; years: string };
}) {
  const seen = useSyncExternalStore(
    subscribe,
    () => hasSeenReveal(revealKey),
    () => false,
  );
  const [leaving, setLeaving] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLButtonElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const mountedRef = useRef(true);
  const open = !seen;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(
      () => {
        markRevealSeen(revealKey, true);
        // The visitor may have navigated away during the exit transition.
        if (!mountedRef.current) return;
        setLeaving(false);
        document.getElementById("showcase-content")?.focus({ preventScroll: true });
      },
      prefersReducedMotion() ? 0 : EXIT_MS,
    );
  }, [leaving, revealKey]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Everything outside the dialog becomes inert, so neither keyboard nor
    // screen-reader browsing can reach the page behind it.
    const inerted: HTMLElement[] = [];
    for (let node: HTMLElement | null = dialog; node && node !== document.body; node = node.parentElement) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;
      for (const sibling of Array.from(parent.children)) {
        if (sibling !== node && sibling instanceof HTMLElement && !sibling.inert) {
          sibling.inert = true;
          inerted.push(sibling);
        }
      }
    }

    // Focus the dialog itself: it announces the family name and tagline, and
    // the actions are one Tab away even while they are still fading in.
    dialog.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = overflow;
      for (const element of inerted) element.inert = false;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      data-showcase-reveal={revealKey}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${revealKey}-title`}
      aria-describedby={`${revealKey}-tagline`}
      className={`showcase-reveal fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[var(--brand-deep)] focus:outline-none text-[var(--brand-on-deep)] ${leaving ? "is-leaving" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          dismiss();
        }
        if (event.key === "Tab") {
          // Keep focus inside the two actions while the reveal is open.
          const first = skipRef.current;
          const last = exploreRef.current;
          if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/showcase/hub-archive-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="reveal-backdrop object-cover opacity-[0.13] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--brand-deep)_72%)]" />
      </div>

      <div className="relative flex justify-end p-4 sm:p-6">
        <button
          ref={skipRef}
          type="button"
          onClick={dismiss}
          className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent-on-deep)]"
        >
          Skip
        </button>
      </div>

      <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        {curatorName ? (
          <p className="reveal-step text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-accent-on-deep)]" style={{ animationDelay: "150ms" }}>
            Prepared by {curatorName}
          </p>
        ) : null}

        <figure className="reveal-portrait mt-8" style={{ animationDelay: "450ms" }}>
          <div className="relative h-44 w-36 overflow-hidden rounded-[50%] border border-[color-mix(in_oklab,var(--brand-accent-on-deep)_70%,transparent)] shadow-[0_0_0_6px_color-mix(in_oklab,var(--brand-on-deep)_6%,transparent),0_24px_60px_rgba(0,0,0,0.35)] sm:h-56 sm:w-44">
            <Image src={portrait.src} alt={`Portrait of ${portrait.name}`} fill priority sizes="176px" className="origin-[50%_32%] scale-[1.32] object-cover object-[50%_28%]" />
          </div>
          <figcaption className="mt-3 text-xs tracking-[0.12em] opacity-75">
            {portrait.name} · {portrait.years}
          </figcaption>
        </figure>

        <p className="reveal-step mt-10 text-[11px] font-semibold uppercase tracking-[0.3em] opacity-75" style={{ animationDelay: "850ms" }}>
          {eyebrow}
        </p>
        <p
          id={`${revealKey}-title`}
          className="reveal-title mt-3 font-serif text-5xl font-semibold leading-[1.02] sm:text-7xl"
          style={{ animationDelay: "1000ms" }}
        >
          {familyName}
        </p>
        <span
          aria-hidden="true"
          className="reveal-rule mt-6 block h-px w-24 bg-[var(--brand-accent-on-deep)]"
          style={{ animationDelay: "1500ms" }}
        />
        <p
          id={`${revealKey}-tagline`}
          className="reveal-step mt-6 max-w-md font-serif text-xl italic leading-snug opacity-90 sm:text-2xl"
          style={{ animationDelay: "1650ms" }}
        >
          {tagline}
        </p>

        <button
          ref={exploreRef}
          type="button"
          onClick={dismiss}
          className="reveal-step group mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--brand-on-deep)] px-7 py-4 text-sm font-semibold text-[var(--brand-deep)] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-accent-on-deep)]"
          style={{ animationDelay: "2050ms" }}
        >
          Explore your family
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/** Lets a genealogist replay the client's opening moment from the preview. */
export function ReplayRevealButton({ revealKey, homePath }: { revealKey: string; homePath: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        markRevealSeen(revealKey, false);
        if (window.location.pathname !== homePath) router.push(homePath);
        window.scrollTo({ top: 0 });
      }}
      className="font-semibold underline decoration-amber-700/40 underline-offset-2 hover:decoration-amber-900"
    >
      Replay welcome
    </button>
  );
}
