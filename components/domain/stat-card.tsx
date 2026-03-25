import { Card } from "@/components/foundation/card";

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{detail}</p>
    </Card>
  );
}
