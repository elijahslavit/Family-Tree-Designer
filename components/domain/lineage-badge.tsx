import { Route } from "lucide-react";

import { Badge } from "@/components/foundation/badge";
import type { Lineage } from "@/lib/types";

export function LineageBadge({ lineage }: { lineage: Lineage }) {
  return (
    <Badge tone="accent" className="gap-1.5">
      <Route className="h-3 w-3" />
      {lineage.name}
    </Badge>
  );
}
