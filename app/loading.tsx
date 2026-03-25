import { Skeleton } from "@/components/foundation/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <Skeleton className="h-12 w-72" />
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
