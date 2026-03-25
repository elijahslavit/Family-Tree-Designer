import Link from "next/link";

import { Card } from "@/components/foundation/card";
import { hasConfiguredBackend, isDemoMode } from "@/lib/runtime";

export default function SignInPage() {
  const demoAccess = isDemoMode() || !hasConfiguredBackend();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card className="space-y-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Sign in</p>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
          Creator authentication
        </h1>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          {demoAccess
            ? "Demo mode is active, so creator routes are available without a live Supabase session."
            : "Creator mode is locked behind a valid Supabase session. Access the app through your configured Supabase auth flow before returning here."}
        </p>
        {demoAccess ? (
          <Link href="/dashboard" className="text-sm font-semibold text-[var(--accent-text)]">
            Continue to the creator dashboard
          </Link>
        ) : (
          <Link href="/" className="text-sm font-semibold text-[var(--accent-text)]">
            Return to the marketing home
          </Link>
        )}
      </Card>
    </main>
  );
}
