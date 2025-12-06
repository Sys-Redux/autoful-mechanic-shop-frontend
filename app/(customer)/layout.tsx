'use client';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Navbar from '@/components/layout/Navbar';
import CustomerSubNav from '@/components/layout/CustomerSubNav';

export default function CustomerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading, isAuthorized } = useAuthGuard('customer');

    if (isLoading) {
        return (
            <div className='min-h screen flex items-center justify-center bg-steel-50'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin' />
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
            <div className='pt-16 md:pt-20'>
                <CustomerSubNav />
            </div>
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {children}
            </main>
        </div>
    );
}