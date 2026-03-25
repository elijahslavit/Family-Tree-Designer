import Link from "next/link";

import { Card } from "@/components/foundation/card";
import { hasConfiguredBackend, isDemoMode } from "@/lib/runtime";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card className="space-y-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Sign in</p>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
          Creator authentication
        </h1>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          {isDemoMode() || !hasConfiguredBackend()
            ? "Demo mode is active, so creator routes are available without a real sign-in flow. Configure Supabase env vars to enable live authentication."
            : "Supabase auth is configured. Finish wiring your preferred sign-in UI against the provided SSR helpers and callback route."}
        </p>
        <Link href="/dashboard" className="text-sm font-semibold text-[var(--accent-text)]">
          Continue to the creator dashboard
        </Link>
      </Card>
    </main>
  );
}
