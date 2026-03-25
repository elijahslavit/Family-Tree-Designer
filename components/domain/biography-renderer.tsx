"use client";

import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { Card } from "@/components/foundation/card";

export function BiographyRenderer({ markdown }: { markdown?: string | null }) {
  return (
    <Card className="prose prose-invert max-w-none bg-[var(--bg-surface)] prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)]">
      <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Biography</h3>
      {markdown ? (
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
          {markdown}
        </Markdown>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">No biography recorded yet.</p>
      )}
    </Card>
  );
}
