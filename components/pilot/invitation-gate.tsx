import { ArrowRight, Clock3, KeyRound, Link2Off, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { productConfig } from "@/lib/config/product";

export type InvitationGateState = "valid" | "expired" | "revoked" | "redeemed" | "invalid";

export function InvitationGate({
  state,
  recipientLabel,
  projectTitle,
  practiceName,
  purposeLabel,
  expiresLabel,
  acceptAction,
  reissueHref,
}: {
  state: InvitationGateState;
  recipientLabel?: string;
  projectTitle?: string;
  practiceName?: string;
  purposeLabel?: string;
  expiresLabel?: string;
  acceptAction?: (formData: FormData) => Promise<void>;
  reissueHref?: string;
}) {
  if (state !== "valid") {
    return (
      <GateFrame>
        <div className="mx-auto max-w-md space-y-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eee8dc] text-[#665e52]">
            {state === "expired" ? <Clock3 className="h-6 w-6" /> : <Link2Off className="h-6 w-6" />}
          </span>
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#81786a]">Private invitation</p>
            <h1 className="font-serif text-4xl font-semibold">{invitationStateCopy[state].title}</h1>
            <p className="text-sm leading-6 text-[#6f675c]">{invitationStateCopy[state].detail}</p>
          </div>
          <div className="rounded-xl border border-black/10 bg-[#f5f1e8] p-4 text-left text-xs leading-5 text-[#6e665a]">
            Invitation links are single-use and recipient-specific. A replacement does not restore a revoked recipient automatically.
          </div>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            {reissueHref ? (
              <Link href={reissueHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white">
                <RefreshCw className="h-4 w-4" /> Request a new link
              </Link>
            ) : null}
            <a href={`mailto:${productConfig.supportEmail}`} className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold">
              Contact support
            </a>
          </div>
        </div>
      </GateFrame>
    );
  }

  return (
    <GateFrame>
      <div className="mx-auto max-w-lg space-y-7">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#e4ece5] text-[#385141]">
          <KeyRound className="h-6 w-6" />
        </span>
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#81786a]">Private invitation</p>
          <h1 className="font-serif text-4xl font-semibold leading-tight">Welcome{recipientLabel ? `, ${recipientLabel}` : ""}.</h1>
          <p className="text-base leading-7 text-[#665e52]">
            {practiceName ?? "Your genealogist"} has invited you to {purposeLabel ?? "view"} <strong>{projectTitle ?? "a private family archive"}</strong>.
          </p>
        </div>

        <dl className="grid gap-3 rounded-2xl border border-black/10 bg-[#f6f2e9] p-5 sm:grid-cols-2">
          <div><dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#81786a]">Access</dt><dd className="mt-1 text-sm font-semibold">Recipient-specific</dd></div>
          <div><dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#81786a]">Unused link expires</dt><dd className="mt-1 text-sm font-semibold">{expiresLabel ?? "Within seven days"}</dd></div>
        </dl>

        <div className="space-y-3 text-sm leading-6 text-[#665e52]">
          <p className="flex items-start gap-3"><ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#486250]" />The archive is invite-only and excluded from search indexing.</p>
          <p className="flex items-start gap-3"><LockKeyhole className="mt-1 h-4 w-4 shrink-0 text-[#486250]" />Continuing exchanges this single-use link for a secure browser session. The link cannot be used again.</p>
        </div>

        {acceptAction ? (
          <form action={acceptAction}>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white">
              Continue securely <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <button type="button" disabled className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white opacity-50">
            Continue securely <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </GateFrame>
  );
}

function GateFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#e9e3d7] px-4 py-10 text-[#28241f]">
      <section className="w-full max-w-2xl rounded-[28px] border border-black/10 bg-[#fbf9f4] p-6 shadow-2xl sm:p-10">
        {children}
        <p className="mt-8 border-t border-black/10 pt-5 text-center text-[10px] uppercase tracking-[0.14em] text-[#8a8174]">
          Powered by {productConfig.name} · Never forward private invitation links
        </p>
      </section>
    </main>
  );
}

const invitationStateCopy: Record<Exclude<InvitationGateState, "valid">, { title: string; detail: string }> = {
  expired: { title: "This invitation has expired.", detail: "Unused invitation links expire after seven days. Ask the sender to issue a fresh link." },
  revoked: { title: "Access has been revoked.", detail: "This recipient no longer has access to the family archive. Contact the archive owner if you believe this is an error." },
  redeemed: { title: "This link has already been used.", detail: "Single-use invitation links cannot start a second session. Return on the original browser or request a replacement." },
  invalid: { title: "This invitation is not valid.", detail: "The link may be incomplete or may not belong to an active family archive." },
};
