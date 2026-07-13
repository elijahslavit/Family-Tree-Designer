"use client";

import { CheckCircle2, Fingerprint, LockKeyhole, Plus, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type ReviewDraftItem = {
  id: string;
  subjectType: "welcome" | "person" | "story" | "media" | "source" | "tree";
  subjectLabel: string;
  request: string;
};

export type ReviewDisplayItem = {
  id: string;
  subjectLabel: string;
  request: string;
  status: string;
  disposition?: string | null;
};

export function ClientReviewForm({
  round,
  versionLabel,
  fingerprint,
  status,
  existingItems,
  submitAction,
  approveAction,
}: {
  round: 1 | 2;
  versionLabel: string;
  fingerprint: string;
  status: "open" | "submitted" | "resolved" | "approved";
  existingItems: ReviewDisplayItem[];
  submitAction?: (formData: FormData) => Promise<void>;
  approveAction?: (formData: FormData) => Promise<void>;
}) {
  const [items, setItems] = useState<ReviewDraftItem[]>([
    { id: crypto.randomUUID(), subjectType: "person", subjectLabel: "", request: "" },
  ]);
  const itemsJson = useMemo(
    () => JSON.stringify(items.filter((item) => item.subjectLabel.trim() && item.request.trim())),
    [items],
  );
  const isOpen = status === "open";

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-xl border border-black/10 bg-[#f4efe5] p-4 sm:grid-cols-3">
        <ReviewDatum label="Review round" value={`${round} of 2`} />
        <ReviewDatum label="Frozen version" value={versionLabel} />
        <ReviewDatum label="Content fingerprint" value={fingerprint.slice(0, 12)} icon={<Fingerprint className="h-3.5 w-3.5" />} />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[#bfcbbf] bg-[#edf2ed] p-4 text-sm leading-6 text-[#405447]">
        <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
        <p>This review is pinned to a frozen presentation version. Your comments cannot drift onto later edits, and every requested change receives an auditable disposition.</p>
      </div>

      {existingItems.length ? (
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-semibold">Review record</h2>
          {existingItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-black/10 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b7163]">{item.subjectLabel}</p><p className="mt-2 text-sm leading-6">{item.request}</p></div>
                <span className="rounded-full bg-[#ece7dc] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]">{item.status}</span>
              </div>
              {item.disposition ? <p className="mt-3 border-t border-black/10 pt-3 text-xs leading-5 text-[#665e52]"><strong>Disposition:</strong> {item.disposition}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {isOpen ? (
        <form action={submitAction} className="space-y-5 rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <input type="hidden" name="round" value={round} />
          <input type="hidden" name="itemsJson" value={itemsJson} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7b7163]">One consolidated request</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold">What should be corrected before delivery?</h2>
            <p className="mt-2 text-sm leading-6 text-[#6c6459]">Add every requested correction, then submit the round once. You cannot edit it after submission.</p>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid gap-3 rounded-xl bg-[#f6f2e9] p-4 sm:grid-cols-[150px_1fr_auto]">
                <label className="text-xs font-semibold text-[#5f584e]">Area
                  <select value={item.subjectType} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, subjectType: event.target.value as ReviewDraftItem["subjectType"] } : entry))} className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm">
                    <option value="welcome">Welcome</option><option value="person">Person</option><option value="story">Story</option><option value="media">Media</option><option value="source">Source</option><option value="tree">Tree</option>
                  </select>
                </label>
                <div className="grid gap-3">
                  <label className="text-xs font-semibold text-[#5f584e]">Page, person, or story
                    <input value={item.subjectLabel} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, subjectLabel: event.target.value } : entry))} placeholder="Example: Eleanor Hart West profile" className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm" required />
                  </label>
                  <label className="text-xs font-semibold text-[#5f584e]">Requested correction
                    <textarea value={item.request} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, request: event.target.value } : entry))} placeholder="Describe the exact correction and, if possible, the supporting source." className="mt-1.5 min-h-24 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm leading-6" required />
                  </label>
                </div>
                <button type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} disabled={items.length === 1} className="self-start rounded-lg p-2 text-[#766d60] hover:bg-white disabled:opacity-30" aria-label={`Remove correction ${index + 1}`}><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => setItems((current) => [...current, { id: crypto.randomUUID(), subjectType: "person", subjectLabel: "", request: "" }])} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Add correction</button>
            <button type="submit" disabled={!submitAction || itemsJson === "[]"} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><Send className="h-4 w-4" /> Submit consolidated round</button>
          </div>
        </form>
      ) : null}

      {round === 2 && (status === "open" || status === "resolved") ? (
        <form action={approveAction} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="font-serif text-2xl font-semibold text-emerald-950">Ready for final approval</h2><p className="mt-1 text-sm leading-6 text-emerald-900">{status === "open" ? "If no corrections are needed, approve this exact frozen snapshot now." : "Every correction has a disposition. Approval is limited to this exact frozen snapshot."} Later edits require a new unpublished revision.</p></div>
            <button type="submit" disabled={!approveAction} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4" /> Approve delivery as shown</button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function ReviewDatum({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#81786a]">{label}</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold">{icon}{value}</p></div>;
}
