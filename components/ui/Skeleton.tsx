import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

// Base skeleton - just a pulsing div
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-steel-200',
        className
      )}
    />
  );
}

// Text line placeholder - for simulating text content
export function SkeletonText({ className }: SkeletonProps) {
  return (
    <Skeleton className={cn('h-4 w-full', className)} />
  );
}

// Box placeholder - for icon containers, images
export function SkeletonBox({ className }: SkeletonProps) {
  return (
    <Skeleton className={cn('h-12 w-12 rounded-lg', className)} />
  );
}