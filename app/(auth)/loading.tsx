import { Card } from "@/components/foundation/card";
import { Skeleton } from "@/components/foundation/skeleton";

export default function AuthLoading() {
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-6">
        <Card className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-72 max-w-full" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </section>
      <aside className="space-y-4">
        <Card className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </aside>
    </main>
  );
}
