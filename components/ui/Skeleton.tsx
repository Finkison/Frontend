
import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
}: SkeletonProps): React.ReactElement {
  const baseStyles = 'rounded-md bg-neutral-200 dark:bg-white/10';

  const variantStyles = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-xl',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] dark:from-white/10 dark:via-white/20 dark:to-white/10',
    none: '',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={{
        width: width || (variant === 'text' ? '100%' : '100%'),
        height: height || (variant === 'circle' ? width : undefined),
      }}
      aria-hidden="true"
    />
  );
}

/**
 * SkeletonText - Multiple text lines skeleton
 */
export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps): React.ReactElement {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - Card placeholder
 */
export interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps): React.ReactElement {
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-[#261E1A] ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="circle" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

/**
 * SkeletonTable - Table placeholder
 */
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = '',
}: SkeletonTableProps): React.ReactElement {
  return (
    <div className={`space-y-3 ${className}`}>

      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width="80%" height="16px" />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 border-t border-neutral-200 py-3 dark:border-white/10"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="90%" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number; className?: string }): React.ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ count = 5 }: { count?: number }): React.ReactElement {
  return <SkeletonTable rows={count} columns={4} />;
}

export default Skeleton;
