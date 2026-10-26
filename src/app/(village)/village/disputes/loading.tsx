import { Skeleton } from "@/components/ui/skeleton";

export default function DisputesLoading() {
  return (
    <div aria-busy="true" className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton className="h-11 w-24 rounded-full" key={i} />
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <Skeleton className="h-36 rounded-xl" key={i} />
        ))}
      </div>
    </div>
  );
}
