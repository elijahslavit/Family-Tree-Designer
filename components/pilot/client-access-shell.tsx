import {
  AlertTriangle,
  ArrowLeft,
  Clock3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { productConfig } from "@/lib/config/product";

export function ClientAccessShell({
  children,
  eyebrow,
  title,
  description,
  practiceName,
  backHref,
  backLabel,
  synthetic = true,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  practiceName?: string;
  backHref?: string;
  backLabel?: string;
  synthetic?: boolean;
}) {
  return (
    <main className="min-h-screen bg-[#e9e3d7] px-4 py-6 text-[#28241f] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-[28px] border border-black/10 bg-[#fbf9f4] px-5 py-5 shadow-sm sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              {backHref ? (
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#625b51] hover:text-[#28241f]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {backLabel ?? "Back"}
                </Link>
              ) : null}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#81786a]">
                  {eyebrow}
                </p>
                <h1 className="mt-2 max-w-3xl font-serif text-3xl font-semibold leading-tight sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#665e52] sm:text-base sm:leading-7">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 sm:max-w-64 sm:justify-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#bfcbbf] bg-[#edf2ed] px-3 py-2 text-[11px] font-semibold text-[#405447]">
                <LockKeyhole className="h-3.5 w-3.5" /> Invite-only
              </span>
              {synthetic ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
                  <Sparkles className="h-3.5 w-3.5" /> Synthetic demo
                </span>
              ) : null}
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 border-t border-black/10 pt-4 text-xs text-[#756d61] sm:flex-row sm:items-center sm:justify-between">
            <span>{practiceName ?? productConfig.name}</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Private, noindex, access checked on every action
            </span>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}

export type ClientAccessState =
  | "missing_session"
  | "expired_session"
  | "revoked_session"
  | "wrong_role"
  | "project_mismatch"
  | "identity_required"
  | "identity_mismatch"
  | "not_ready";

const accessStateCopy: Record<
  ClientAccessState,
  { title: string; detail: string; nextStep: string }
> = {
  missing_session: {
    title: "Use your private invitation first.",
    detail:
      "This page does not accept a project link on its own. Open the recipient-specific invitation sent to you to create a secure browser session.",
    nextStep: "Ask the sender to reissue your invitation if you no longer have it.",
  },
  expired_session: {
    title: "Your private session has expired.",
    detail:
      "For family privacy, access ends after the idle window or the 30-day absolute session limit.",
    nextStep: "Ask the archive owner or genealogist for a fresh invitation.",
  },
  revoked_session: {
    title: "Your access has been revoked.",
    detail:
      "The archive owner removed this recipient's outstanding invitations and active sessions.",
    nextStep: "Contact the archive owner if you believe this was a mistake.",
  },
  wrong_role: {
    title: "This invitation has a different purpose.",
    detail:
      "Viewer, client-review, and owner-handoff sessions are intentionally separated. This session cannot open this control.",
    nextStep: "Return to the destination from your original invitation.",
  },
  project_mismatch: {
    title: "This session belongs to another archive.",
    detail:
      "Private sessions are scoped to one family project and cannot be reused across project URLs.",
    nextStep: "Open the invitation issued for this family archive.",
  },
  identity_required: {
    title: "Verify your owner identity to continue.",
    detail:
      "Passive family viewers remain accountless. Archive ownership requires an authenticated control-plane identity before access, export, or deletion powers transfer.",
    nextStep: "Sign in with the address designated for the archive owner, then return here.",
  },
  identity_mismatch: {
    title: "This is not the designated owner identity.",
    detail:
      "The signed-in identity does not match the verified identity attached to this handoff. The invitation alone cannot transfer owner authority.",
    nextStep: "Sign out and use the designated owner identity, or ask the genealogist to restart handoff.",
  },
  not_ready: {
    title: "This step is not ready yet.",
    detail:
      "The project has not reached the required approved or published state for this private workflow.",
    nextStep: "Contact the genealogist for the current delivery status.",
  },
};

export function ClientAccessNotice({
  state,
  signInHref,
}: {
  state: ClientAccessState;
  signInHref?: string;
}) {
  const copy = accessStateCopy[state];
  const Icon = state.includes("expired") ? Clock3 : AlertTriangle;

  return (
    <section className="rounded-[24px] border border-black/10 bg-[#fbf9f4] p-6 shadow-sm sm:p-9">
      <div className="mx-auto max-w-xl space-y-5 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eee8dc] text-[#665e52]">
          <Icon className="h-6 w-6" />
        </span>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">{copy.title}</h2>
          <p className="text-sm leading-6 text-[#6f675c]">{copy.detail}</p>
        </div>
        <p className="rounded-xl border border-black/10 bg-[#f5f1e8] p-4 text-left text-xs leading-5 text-[#6e665a]">
          {copy.nextStep}
        </p>
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          {signInHref && state === "identity_required" ? (
            <Link
              href={signInHref}
              className="inline-flex items-center justify-center rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white"
            >
              Sign in to verify identity
            </Link>
          ) : null}
          <a
            href={`mailto:${productConfig.supportEmail}`}
            className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold"
          >
            Contact support
          </a>
        </div>
      </div>
    </section>
  );
}

export function ClientPageSkeleton() {
  return (
    <main className="min-h-screen animate-pulse bg-[#e9e3d7] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="h-64 rounded-[28px] border border-black/5 bg-[#fbf9f4]" />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="h-56 rounded-[20px] bg-[#fbf9f4] lg:col-span-2" />
          <div className="h-56 rounded-[20px] bg-[#fbf9f4]" />
        </div>
      </div>
    </main>
  );
}
