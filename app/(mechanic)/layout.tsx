'use client';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Navbar from '@/components/layout/Navbar';
import MechanicSidebar from '@/components/layout/MechanicSidebar';

export default function MechanicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading, isAuthorized } = useAuthGuard('mechanic');

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-steel-50'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 border-4 border-brand-500 border-t transparent rounded-full animate-spin' />
                    <p className='text-steel-600'>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }


    return (
        <div className='min-h-screen bg-steel-50'>
            <Navbar transparent={false} />
            <div className='pt-16 md:pt-20 flex'>
                <MechanicSidebar />
                <main className='flex-1 p-6 lg:p-8 pb-24 lg:pb-8'>
                    {children}
                </main>
            </div>
        </div>
    );
}