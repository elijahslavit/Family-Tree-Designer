import { Badge } from "@/components/foundation/badge";
import type { Lineage } from "@/lib/types";

export function LineageBadge({ lineage }: { lineage: Lineage }) {
  return <Badge tone="accent">{lineage.name}</Badge>;
}
