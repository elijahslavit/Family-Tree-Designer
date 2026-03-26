"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { Input } from "@/components/foundation/input";
import { useToast } from "@/components/foundation/toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthForm({ nextPath = "/dashboard" }: { nextPath?: string }) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  async function submit() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      pushToast("Supabase auth is not configured in this environment.", "danger");
      return;
    }

    if (!email || !password) {
      pushToast("Email and password are required.", "danger");
      return;
    }

    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        pushToast(error.message, "danger");
        return;
      }

      pushToast("Signed in.", "success");
      router.push(nextPath);
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split("@")[0],
        },
      },
    });

    if (error) {
      pushToast(error.message, "danger");
      return;
    }

    if (data.session) {
      pushToast("Account created.", "success");
      router.push(nextPath);
      router.refresh();
      return;
    }

    pushToast("Check your email to finish sign-up.", "success");
  }

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={mode === "sign-in"}
          onClick={() => setMode("sign-in")}
          className={
            mode === "sign-in"
              ? "rounded-full bg-[var(--accent-primary)] px-3 py-2 text-sm font-semibold text-[var(--text-inverse)]"
              : "rounded-full border border-[var(--border-default)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)]"
          }
        >
          Sign in
        </button>
        <button
          type="button"
          aria-pressed={mode === "sign-up"}
          onClick={() => setMode("sign-up")}
          className={
            mode === "sign-up"
              ? "rounded-full bg-[var(--accent-primary)] px-3 py-2 text-sm font-semibold text-[var(--text-inverse)]"
              : "rounded-full border border-[var(--border-default)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)]"
          }
        >
          Create account
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          {mode === "sign-in" ? "Sign in to creator mode" : "Create your creator account"}
        </h2>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          {mode === "sign-in"
            ? "Use your account to access the creator dashboard, editing tools, import flow, and sharing controls."
            : "Create an account and the app will provision your creator profile on first session load."}
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(submit);
        }}
      >
        {mode === "sign-up" ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Display name</span>
            <Input
              aria-label="Display name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </label>
        ) : null}
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Email</span>
          <Input
            aria-label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Password</span>
          <Input
            aria-label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <div className="flex justify-end">
          <Button type="submit" loading={isPending}>
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
