import { Skeleton } from "@/components/ui/skeleton";

export function PokemonCardSkeleton() {
  return (
    <div className="rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md bg-muted">
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-3 w-12 rounded" />
      <div className="flex gap-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  );
}
