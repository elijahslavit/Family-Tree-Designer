"use client";

import { useState, useTransition } from "react";

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
    <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Account settings
        </p>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Identity and sign-in</h2>
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
          <span className="text-sm text-[var(--text-secondary)]">Display name</span>
          <Input
            aria-label="Display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Email</span>
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
      <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
        <p className="font-semibold text-[var(--text-primary)]">Password</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          {demoMode
            ? "Password management is intentionally unavailable while the app is running in demo mode."
            : authConfigured
              ? "Password management is handled by the configured Supabase auth flow in this runtime."
              : "Configure Supabase auth to enable password management in non-demo mode."}
        </p>
      </div>
    </Card>
  );
}
