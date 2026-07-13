import { AlertTriangle, Check, Circle, LockKeyhole, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import { cn } from "@/lib/utils/cn";

export function PilotPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f776f]">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[#241f18] sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-[#665e53] sm:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function PilotStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card className="space-y-2 border-black/10 bg-white">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#82796d]">{label}</p>
      <p className="text-3xl font-semibold tracking-tight text-[#241f18]">{value}</p>
      <p className="text-xs leading-5 text-[#746b5e]">{detail}</p>
    </Card>
  );
}

export function PilotSection({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-5 border-black/10 bg-white", className)}>
      <div className="space-y-1.5">
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#82796d]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-semibold text-[#241f18] sm:text-2xl">{title}</h2>
        {description ? <p className="text-sm leading-6 text-[#746b5e]">{description}</p> : null}
      </div>
      {children}
    </Card>
  );
}

export function GateRow({
  label,
  detail,
  state,
}: {
  label: string;
  detail: string;
  state: "complete" | "blocked" | "pending" | "override";
}) {
  const Icon = state === "complete" ? Check : state === "blocked" ? LockKeyhole : Circle;
  const tone = state === "complete" ? "success" : state === "blocked" ? "danger" : state === "override" ? "warning" : "default";

  return (
    <div className="flex items-start gap-3 border-b border-black/[0.06] py-3 last:border-0">
      <span
        className={cn(
          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
          state === "complete" && "bg-emerald-50 text-emerald-700",
          state === "blocked" && "bg-red-50 text-red-700",
          (state === "pending" || state === "override") && "bg-stone-100 text-stone-500",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[#302a23]">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#746b5e]">{detail}</p>
      </div>
      <Badge tone={tone}>{state}</Badge>
    </div>
  );
}

export function PrivacyCallout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#bcc9bc] bg-[#edf2ed] p-4 text-sm leading-6 text-[#3f5545]">
      <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function SyntheticCallout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function WarningCallout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
