import type { NodeProps } from "@xyflow/react";

import { Badge } from "@/components/foundation/badge";

export function PersonNode({ data }: NodeProps) {
  const payload = data as {
    label: string;
    subtitle?: string;
    isLiving?: boolean;
  };

  return (
    <div className="w-56 rounded-[var(--radius-lg)] border border-[var(--canvas-node-border)] bg-[var(--canvas-node-bg)] p-3 text-[var(--canvas-node-text)] shadow-[var(--shadow-md)]">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold">{payload.label}</p>
          {payload.isLiving ? <Badge tone="warning">Living</Badge> : null}
        </div>
        {payload.subtitle ? <p className="text-xs opacity-80">{payload.subtitle}</p> : null}
      </div>
    </div>
  );
}

export const nodeTypes = {
  person: PersonNode,
};
