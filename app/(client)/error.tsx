"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { productConfig } from "@/lib/config/product";

export default function ClientAccessError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#e9e3d7] px-4 py-10 text-[#28241f]">
      <section className="w-full max-w-xl rounded-[28px] border border-black/10 bg-[#fbf9f4] p-6 text-center shadow-2xl sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-800">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#81786a]">
          Private access error
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold">This private page could not load.</h1>
        <p className="mt-3 text-sm leading-6 text-[#6f675c]">
          No access was granted or changed by this error. Retry once, then contact support if it continues.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <a
            href={`mailto:${productConfig.supportEmail}`}
            className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold"
          >
            Contact support
          </a>
        </div>
      </section>
    </main>
  );
}
