import { Card } from "@/components/foundation/card";
import type { ThemeLayout } from "@/lib/types";

const layoutCopy: Record<ThemeLayout, string> = {
  classic: "Sidebar plus list/detail split for dense browsing.",
  editorial: "Centered reading surface with strong profile storytelling.",
  explorer: "Canvas-first graph browsing with supporting detail drawer.",
};

export function LayoutPreview({ layout }: { layout: ThemeLayout }) {
  const blocks =
    layout === "classic"
      ? ["w-1/4", "w-1/3", "w-5/12"]
      : layout === "editorial"
        ? ["w-full", "w-2/3", "w-1/3"]
        : ["w-full", "w-1/2", "w-1/2"];

  return (
    <Card className="space-y-3">
      <p className="font-semibold capitalize text-[var(--text-primary)]">{layout}</p>
      <p className="text-sm text-[var(--text-secondary)]">{layoutCopy[layout]}</p>
      <div className="flex gap-2">
        {blocks.map((width, index) => (
          <div
            key={`${layout}-${index}`}
            className={`${width} h-20 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)]`}
          />
        ))}
      </div>
    </Card>
  );
}
