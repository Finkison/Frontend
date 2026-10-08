import React from "react";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = "h-4 w-full" }: { className?: string }): React.ReactElement {
  return (
    <div className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`} />
  );
}

export function CardSkeleton({ count = 3 }: SkeletonProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton({ count = 5 }: { count?: number }): React.ReactElement {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="w-32 h-3.5 bg-slate-200 rounded-md" />
              <div className="w-20 h-2.5 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="w-16 h-4 bg-slate-200 rounded-md" />
        </div>
      ))}
    </div>
  );
}
