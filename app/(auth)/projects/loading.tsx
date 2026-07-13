import { Skeleton } from "@/components/foundation/skeleton";

export default function ProjectsLoading() {
  return (
    <main className="min-h-screen bg-[#f1eee7] px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading professional projects">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-3"><Skeleton className="h-4 w-40" /><Skeleton className="h-12 w-80 max-w-full" /><Skeleton className="h-5 w-full max-w-2xl" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32" />)}</div>
        <div className="grid gap-5 lg:grid-cols-2">{Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-[430px]" />)}</div>
      </div>
    </main>
  );
}
