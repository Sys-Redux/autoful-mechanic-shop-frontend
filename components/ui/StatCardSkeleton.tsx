import { Skeleton } from "@/components/ui/Skeleton";

export function StatCardSkeleton() {
    return (
        <div className='bg-white rounded-xl border border-steel-200 p-6'>
            <div className='flex items-center gap-4'>
                <Skeleton className='w-12 h-12 rounded-lg' />
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-7 w-12' />
                </div>
            </div>
        </div>
    );
}

// Grid of stat cards
export function StatGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className='grid grid-cols-2 lg-grid-cols-4 gap-4 lg:gap-6'>
            {Array.from({ length: count }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    );
}