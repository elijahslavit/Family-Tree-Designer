import Link from "next/link";

import { Card } from "@/components/foundation/card";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card className="space-y-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Not found
        </p>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          That branch is not in this archive.
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          The link may be outdated, private, or the tree may have been renamed.
        </p>
        <Link href="/" className="text-sm font-semibold text-[var(--accent-text)]">
          Return home
        </Link>
      </Card>
    </div>
  );
}
