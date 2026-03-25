import Link from "next/link";

import { Badge } from "@/components/foundation/badge";
import type { Person } from "@/lib/types";

export function RelativeChip({
  person,
  href,
  tone = "default",
}: {
  person: Person;
  href: string;
  tone?: "default" | "accent" | "success" | "warning";
}) {
  return (
    <Link href={href}>
      <Badge tone={tone}>{person.fullName}</Badge>
    </Link>
  );
}
