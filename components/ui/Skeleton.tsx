import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

// Base skeleton w/ pulse animation
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn('animate-pulse bg-steel-200 rounded', className)}
            aria-hidden="true"
        />
    );
}

// Text line skeleton
export function SkeletonText({ className, lines = 1 }: SkeletonProps & { lines?: number }) {
    return (
        <div className='space-y-2'>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        'h-4 rounded',
                        i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
                        className
                    )}
                />
            ))}
        </div>
    );
}

// Circle placeholder - for avatars/icons
export function SkeletonCircle({ className, size = 'md' }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };
    return <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />;
}

// Card placeholder
export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={cn('bg-white rounded-xl border border-steel-200 p-6', className)}>
            <div className='flex gap-4'>
                <SkeletonCircle />
                <div className='flex-1 space-y-2'>
                    <Skeleton className='h-5 w-1/3' />
                    <Skeleton className='h-4 w-1/2' />
                </div>
            </div>
        </div>
    );
}