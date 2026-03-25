import { Skeleton } from "@/shared/ui/shadcn/ui/skeleton";

export function StoryCardsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-1 flex-1" />
        <Skeleton className="h-1 flex-1" />
        <Skeleton className="h-1 flex-1" />
      </div>
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
