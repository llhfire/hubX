import { Skeleton } from "@/app/components/ui/skeleton";
import { Card, CardContent } from "@/app/components/ui/card";

interface PageSkeletonProps {
  title?: string;
  rows?: number;
}

export function PageSkeleton({ title, rows = 5 }: PageSkeletonProps) {
  return (
    <div className="space-y-4">
      {title ? (
        <Skeleton className="h-8 w-48" />
      ) : (
        <div className="h-8 w-48" />
      )}

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[40%]" />
                  <Skeleton className="h-3 w-[25%]" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
