import { ArrowRight, FileArchive, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AuthForm } from "@/components/domain/auth-form";
import { isPlaceholderSupportEmail, productConfig } from "@/lib/config/product";
import { hasConfiguredBackend, isDemoMode } from "@/lib/runtime";

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Only same-origin, path-absolute redirects are honoured after sign-in. */
function safeNextPath(value: string | string[] | undefined) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/projects";
  }

  return value;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const demoAccess = isDemoMode() || !hasConfiguredBackend();
  const backendUnavailable = params.reason === "backend-not-configured";

  return (
    <main className="grid min-h-screen bg-[var(--site-bg)] text-[var(--site-text)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="flex flex-col px-4 py-6 sm:px-8 lg:px-12">
        <Link href="/" className="flex w-fit items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#293a31] text-white">
            <FileArchive className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-semibold">{productConfig.name}</span>
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 py-12">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--site-text-muted)]">
              Professional studio
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Welcome back.
            </h1>
            <p className="leading-7 text-[var(--site-text-soft)]">
              Sign in to prepare, review, and deliver your clients&apos; private family presentations.
            </p>
          </div>

          {backendUnavailable ? (
            <p className="rounded-xl border border-[var(--site-border-strong)] bg-[var(--site-surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--site-text-soft)]">
              Accounts aren&apos;t available in this environment yet. Please try again later.
            </p>
          ) : null}

          {demoAccess ? (
            <div className="space-y-4 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-[var(--site-shadow)]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--site-accent)]" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-semibold">Demo workspace</p>
                  <p className="text-sm leading-6 text-[var(--site-text-soft)]">
                    No account needed. Every family, story, and record in the demo is fictional.
                  </p>
                </div>
              </div>
              <Link
                href={nextPath}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#293a31] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1f2d26]"
              >
                Open the demo studio <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <AuthForm nextPath={nextPath} />
          )}

          {isPlaceholderSupportEmail() ? null : (
            <p className="text-xs leading-5 text-[var(--site-text-muted)]">
              Need help? Contact{" "}
              <a className="underline underline-offset-2" href={`mailto:${productConfig.supportEmail}`}>
                {productConfig.supportEmail}
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <aside className="relative hidden overflow-hidden lg:block" aria-hidden="true">
        <Image
          src="/landing/hero-atlas.webp"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,233,216,0.55)_0%,rgba(242,233,216,0)_35%)]" />
      </aside>
    </main>
  );
}
