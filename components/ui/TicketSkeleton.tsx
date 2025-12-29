import { cn } from '@/lib/utils';
import { SkeletonBox, SkeletonText } from './Skeleton';

interface TicketSkeletonProps {
  className?: string;
}

// For mechanic dashboard tickets list (compact, in a card list)
export function TicketRowSkeleton({ className }: TicketSkeletonProps) {
  return (
    <div className={cn('flex gap-4 px-6 py-4', className)}>
      <SkeletonBox />
      <div className="flex-1 space-y-2">
        <SkeletonText className="w-1/3" />
        <SkeletonText className="w-1/2 h-3 bg-steel-100" />
      </div>
    </div>
  );
}

// For customer my-tickets (card-style items)
export function TicketCardSkeleton({ className }: TicketSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-steel-200 p-6',
        className
      )}
    >
      <div className="flex gap-4">
        <SkeletonBox />
        <div className="flex-1 space-y-2">
          <SkeletonText className="w-1/2 h-5" />
          <SkeletonText className="w-1/3 h-4 bg-steel-100" />
        </div>
      </div>
    </div>
  );
}

// Container for a list of ticket skeletons
export function TicketListSkeleton({
  count = 5,
  variant = 'row',
}: {
  count?: number;
  variant?: 'row' | 'card';
}) {
  const SkeletonComponent = variant === 'card' ? TicketCardSkeleton : TicketRowSkeleton;

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonComponent key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-steel-100">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}