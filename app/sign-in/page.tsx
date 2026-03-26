import Link from "next/link";

import { AuthForm } from "@/components/domain/auth-form";
import { Card } from "@/components/foundation/card";
import { hasConfiguredBackend, isDemoMode } from "@/lib/runtime";

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : "/dashboard";
  const demoAccess = isDemoMode() || !hasConfiguredBackend();

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <Card className="space-y-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Sign in</p>
        <h1 className="text-4xl font-semibold text-[var(--text-primary)]">
          Creator authentication
        </h1>
        <p className="text-sm leading-7 text-[var(--text-secondary)]">
          Creator mode owns import, editing, themes, and sharing. Viewer mode stays public and
          read-only, but creator mode is where the archive is actually curated.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Demo mode</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
              {demoAccess ? "Available" : "Disabled"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {demoAccess
                ? "The seeded archive can still be explored and edited without a live auth session."
                : "The app is using the configured backend runtime instead of the in-memory demo store."}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Redirect target</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{nextPath}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Successful sign-in returns to the requested creator route instead of dropping you at a generic home screen.
            </p>
          </div>
        </div>
        {demoAccess ? (
          <Link href={nextPath} className="text-sm font-semibold text-[var(--accent-text)]">
            Continue in demo mode
          </Link>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">
            Supabase auth is configured. Use the form to sign in or create a creator account.
          </p>
        )}
      </Card>

      {demoAccess ? (
        <Card className="space-y-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Runtime note</p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Live auth is optional in demo mode</h2>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            This workspace still defaults to the seeded demo runtime for local QA. When you switch
            `DEMO_MODE=false` and provide backend env vars, creator routes will require a real
            session and persist through Postgres instead.
          </p>
        </Card>
      ) : (
        <AuthForm nextPath={nextPath} />
      )}
    </main>
  );
}
