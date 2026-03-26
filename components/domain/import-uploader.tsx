"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ImportReviewItem } from "@/components/domain/import-review-item";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { useToast } from "@/components/foundation/toast";
import { confirmGedcomImport } from "@/lib/actions";
import type { ReviewIssue, Tree } from "@/lib/types";

type ImportResult = {
  jobId: string;
  counts: {
    people: number;
    families: number;
    events: number;
    issues: number;
  };
  issues: ReviewIssue[];
};

const importMethods = [
  { title: "GEDCOM", detail: "Available now. Parse and stage a family tree export." },
  { title: "JSON / XML", detail: "Planned as a structured import format." },
  { title: "Manual Entry", detail: "Use the editor pages when records need to be entered by hand." },
];

export function ImportUploader({ tree }: { tree: Tree }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPending, startSaving] = useTransition();
  const { pushToast } = useToast();

  async function upload() {
    if (!file) {
      pushToast("Choose a GEDCOM file first.", "danger");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("treeId", tree.id);

    const response = await fetch("/api/import", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({ error: "Import failed." }))) as {
        error?: string;
      };
      pushToast(payload.error ?? "Import failed.", "danger");
      return;
    }

    const payload = (await response.json()) as ImportResult;
    setResult(payload);
    setIsConfirmed(false);
    pushToast("GEDCOM parsed and staged.", "success");
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            Family Upload
          </p>
          <h2 className="text-3xl font-semibold text-[var(--creator-text)]">
            Information
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-[var(--creator-text-muted)]">
            Start with the cleanest file you have. Review the counts and any detected
            issues before you confirm the import into the working archive.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {importMethods.map((method) => (
            <div
              key={method.title}
              className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-4"
            >
              <p className="text-base font-semibold text-[var(--creator-text)]">
                {method.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--creator-text-muted)]">
                {method.detail}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            GEDCOM
          </p>
          <h3 className="text-2xl font-semibold text-[var(--creator-text)]">
            Upload file
          </h3>
        </div>
        <input
          type="file"
          accept=".ged,.GED,text/plain"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] px-3 py-3 text-sm text-[var(--creator-text)]"
        />
        <div className="flex flex-wrap gap-3">
          <Button loading={isPending} onClick={() => startSaving(upload)}>
            Parse file
          </Button>
          {result ? (
            <Button
              variant="secondary"
              loading={isPending}
              disabled={isConfirmed}
              onClick={() =>
                startSaving(async () => {
                  await confirmGedcomImport({ jobId: result.jobId });
                  setIsConfirmed(true);
                  pushToast("Import confirmed.", "success");
                  router.refresh();
                })
              }
            >
              {isConfirmed ? "Import confirmed" : "Confirm import"}
            </Button>
          ) : null}
        </div>
      </Card>

      {result ? (
        <Card className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
              Import review
            </p>
            <h3 className="text-2xl font-semibold text-[var(--creator-text)]">
              Staged counts
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <Metric label="People" value={result.counts.people} />
            <Metric label="Families" value={result.counts.families} />
            <Metric label="Events" value={result.counts.events} />
            <Metric label="Issues" value={result.counts.issues} />
          </div>
          <div className="space-y-3">
            {result.issues.length ? (
              result.issues.map((issue) => <ImportReviewItem key={issue.id} issue={issue} />)
            ) : (
              <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-4 text-sm text-[var(--creator-text-muted)]">
                No issues detected.
              </div>
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[var(--creator-text)]">{value}</p>
    </div>
  );
}
