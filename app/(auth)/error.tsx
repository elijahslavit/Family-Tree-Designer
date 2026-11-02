"use client";

import { StudioError } from "@/components/pilot/studio-error";

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <StudioError error={error} retry={reset} />;
}
