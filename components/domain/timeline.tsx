import { Card } from "@/components/foundation/card";
import { TimelineEntry } from "@/components/domain/timeline-entry";
import type { TimelineItem } from "@/lib/types";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Timeline</h3>
      <div className="space-y-5">
        {items.length ? (
          items.map((item) => <TimelineEntry key={item.id} item={item} />)
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No events recorded yet.</p>
        )}
      </div>
    </Card>
  );
}
