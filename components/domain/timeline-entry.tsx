import type { TimelineItem } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils/dates";

export function TimelineEntry({ item }: { item: TimelineItem }) {
  return (
    <div className="relative pl-6 before:absolute before:left-0 before:top-1 before:h-3 before:w-3 before:rounded-full before:bg-[var(--accent-primary)]">
      <div className="space-y-1 border-l border-[var(--border-muted)] pl-4">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {item.label}
        </p>
        <p className="text-sm text-[var(--text-primary)]">
          {formatDisplayDate(item.dateText, item.dateNormalized)}
        </p>
        {item.place ? (
          <p className="text-sm text-[var(--text-secondary)]">{item.place}</p>
        ) : null}
        {item.description ? (
          <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
        ) : null}
      </div>
    </div>
  );
}
