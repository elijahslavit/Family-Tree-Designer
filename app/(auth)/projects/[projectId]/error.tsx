"use client";

import { StudioError } from "@/components/pilot/studio-error";

export default function ProjectError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return <StudioError error={error} retry={unstable_retry} title="This project couldn’t load" />;
}
