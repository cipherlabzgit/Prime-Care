interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] ${className}`}
      aria-hidden="true"
    />
  );
}

export function DoctorCardSkeleton() {
  return (
    <CardSkeleton className="flex min-h-[320px] flex-col items-center p-6">
      <Skeleton className="mb-4 h-20 w-20 rounded-full" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-1/2 rounded-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="mt-auto h-10 w-full rounded-xl" />
    </CardSkeleton>
  );
}

function CardSkeleton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SessionCardSkeleton() {
  return (
    <CardSkeleton className="p-5">
      <div className="mb-4 flex gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3 rounded-full" />
        </div>
      </div>
      <Skeleton className="mb-3 h-16 w-full rounded-xl" />
      <div className="mb-4 flex justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-28 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </CardSkeleton>
  );
}

export function FilterPanelSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Skeleton className="h-5 w-32" />
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-11 w-full rounded-xl" />
      ))}
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}
