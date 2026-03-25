import { Handle, Position, type NodeProps } from "@xyflow/react";

import { Badge } from "@/components/foundation/badge";
import { cn } from "@/lib/utils/cn";

export function PersonNode({ data }: NodeProps) {
  const payload = data as {
    label: string;
    subtitle?: string;
    isLiving?: boolean;
    isFocus?: boolean;
    isHighlighted?: boolean;
  };

  return (
    <div
      className={cn(
        "w-56 rounded-[var(--radius-lg)] border border-[var(--canvas-node-border)] bg-[var(--canvas-node-bg)] p-3 text-[var(--canvas-node-text)] shadow-[var(--shadow-md)] transition-transform duration-[var(--transition-normal)]",
        payload.isFocus && "border-[var(--accent-primary)] shadow-[var(--shadow-lg)]",
        payload.isHighlighted && "ring-2 ring-[var(--accent-primary)]",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-[var(--accent-primary)]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-[var(--accent-primary)]"
      />
      <div className="space-y-2">
        <div className="space-y-2">
          <p className="font-semibold">{payload.label}</p>
          <div className="flex flex-wrap gap-2">
            {payload.isFocus ? <Badge tone="accent">Focus</Badge> : null}
            {payload.isHighlighted ? <Badge tone="accent">Lineage</Badge> : null}
            {payload.isLiving ? <Badge tone="warning">Living</Badge> : null}
          </div>
        </div>
        {payload.subtitle ? <p className="text-xs opacity-80">{payload.subtitle}</p> : null}
      </div>
    </div>
  );
}

export const nodeTypes = {
  person: PersonNode,
};
