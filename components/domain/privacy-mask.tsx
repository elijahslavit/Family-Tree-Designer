import { Shield } from "lucide-react";

import { Card } from "@/components/foundation/card";

export function PrivacyMask() {
  return (
    <Card className="border-dashed">
      <div className="flex items-start gap-3">
        <Shield className="mt-1 h-5 w-5 text-[var(--color-info)]" />
        <div className="space-y-1">
          <h3 className="font-semibold text-[var(--text-primary)]">Details private</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            This person is marked as living, so dates, places, and biography remain hidden in
            public view.
          </p>
        </div>
      </div>
    </Card>
  );
}
