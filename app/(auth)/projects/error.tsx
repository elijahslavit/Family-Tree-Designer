"use client";

import { StudioError } from "@/components/pilot/studio-error";

export default function ProjectsError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return <StudioError error={error} retry={unstable_retry} title="Your projects couldn’t load" />;
}
