"use client";

import { Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Badge } from "@/components/foundation/badge";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { Input } from "@/components/foundation/input";
import { useToast } from "@/components/foundation/toast";
import { updateAccountProfile } from "@/lib/actions";
import type { Account } from "@/lib/types";

export function AccountSettingsPanel({
  account,
  demoMode,
  authConfigured,
}: {
  account: Account;
  demoMode: boolean;
  authConfigured: boolean;
}) {
  const [displayName, setDisplayName] = useState(account.displayName);
  const [email, setEmail] = useState(account.email);
  const [isPending, startSaving] = useTransition();
  const { pushToast } = useToast();

  return (
    <section id="account-settings" className="space-y-5 scroll-mt-24">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Account settings
        </p>
        <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Identity and sign-in</h2>
        <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
          Keep the creator identity current so the archive’s management layer stays clear and
          traceable.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent-primary)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent-primary)_14%,transparent)] text-sm font-semibold tracking-[0.14em] text-[var(--text-primary)]">
              {account.displayName
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() ?? "")
                .join("")}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="default">Account profile</Badge>
                <Badge tone="default">{account.plan === "pro" ? "Pro" : "Free plan"}</Badge>
              </div>
              <p className="text-xl font-semibold text-[var(--text-primary)]">{account.displayName}</p>
              <p className="text-sm text-[var(--text-secondary)]">{account.email}</p>
            </div>
          </div>

          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              startSaving(async () => {
                const updated = await updateAccountProfile({
                  displayName,
                  email,
                });
                setDisplayName(updated.displayName);
                setEmail(updated.email);
                pushToast("Account settings updated.", "success");
              });
            }}
          >
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Display name</span>
              <Input
                aria-label="Display name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Email</span>
              <Input
                aria-label="Account email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" loading={isPending}>
                Save account
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid gap-4">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <UserCircle2 className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.16em]">Account identity</p>
            </div>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              The display name appears in creator-facing surfaces and helps keep authorship and
              ownership clear as the archive evolves.
            </p>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Mail className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.16em]">Password and sign-in</p>
            </div>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {demoMode
                ? "Password management is intentionally unavailable in demo mode."
                : authConfigured
                  ? "Password management is handled by the configured Supabase auth flow."
                  : "Configure Supabase auth to enable password management in non-demo mode."}
            </p>
            <Badge tone={demoMode || !authConfigured ? "warning" : "success"}>
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              {demoMode
                ? "Demo runtime"
                : authConfigured
                  ? "Live auth configured"
                  : "Backend auth needed"}
            </Badge>
          </Card>
        </div>
      </div>
    </section>
  );
}
