'use client';
import { Car, Ticket, Calendar, ArrowRight, FileText } from "lucide-react";
import Link from 'next/link';
import { useMyTickets } from '@/hooks/useCustomers';
import { useAppSelector } from '@/lib/store/hooks';
import { selectUser } from '@/lib/store/authSlice';
import { formatDate } from '@/lib/utils';

export default function CustomerDashboardPage() {
    const user = useAppSelector(selectUser);
    const { data: tickets, isLoading, error } = useMyTickets();

    const totalTickets = tickets?.length || 0;
    const recentTickets = tickets?.slice(0, 5) || [];
    const lastServiceDate = tickets?.[0]?.service_date;
    const uniqueVehicles = new Set(tickets?.map((t) => t.VIN) || []).size;


    return (
        <div className='space-y-8'>
            {/* Welcome Header */}
            <div>
                <h1 className='text-2xl font-bold text-steel-900'>
                    Welcome back, {user?.displayName?.split(' ')[0] || 'there'}!
                </h1>
                <p className='text-steel-600 mt-1'>
                    Here&apos;s an overview of your service history
                </p>
            </div>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {/* Total Tickets */}
                <div className='bg-white rounded-xl border border-steel-200 p-6'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center'>
                            <Ticket className='w-6 h-6 text-brand-600' />
                        </div>
                        <div>
                            <p className='text-sm text-steel-500'>Total Tickets</p>
                            {isLoading ? (
                                <div className='h-8 w-16 bg-steel-200 rounded animate-pulse mt-1' />
                            ) : (
                                <p className='text-2xl font-bold text-steel-900'>{totalTickets}</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Last Service Date */}
                <div className='bg-white rounded-xl border border-steel-200 p-6'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center'>
                            <Calendar className='w-6 h-6 text-brand-600' />
                        </div>
                        <div>
                            <p className='text-sm text-steel-500'>Last Service Date</p>
                            {isLoading ? (
                                <div className='h-8 w-24 bg-steel-200 rounded animate-pulse mt-1' />
                            ) : (
                                <p className='text-2xl font-bold text-steel-900'>
                                    {lastServiceDate ? formatDate(lastServiceDate) : 'N/A'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Vehicles Serviced */}
                <div className='bg-white rounded-xl border border-steel-200 p-6'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center'>
                            <Car className='w-6 h-6 text-brand-600' />
                        </div>
                        <div>
                            <p className='text-sm text-steel-500'>Vehicles Serviced</p>
                            {isLoading ? (
                                <div className='h-8 w-12 bg-steel-200 rounded animate-pulse mt-1' />
                            ) : (
                                <p className='text-2xl font-bold text-steel-900'>{uniqueVehicles}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Recent Tickets */}
            <div className='bg-white rounded-lg border border-steel-200'>
                <div className='px-6 py-4 border-b border-steel-200 flex items-center justify-between'>
                    <h2 className='text-lg font-semibold text-steel-900'>Recent Service Tickets</h2>
                    <Link
                        href='/customer-dashboard/my-tickets'
                        className='text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1'
                    >
                        View All
                        <ArrowRight className='w-4 h-4' />
                    </Link>
                </div>
                {isLoading ? (
                    <div className='p-6 space-y-4'>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className='flex gap-4 animate-pulse'>
                                <div className='w-10 h-10 bg-steel-200 rounded-lg' />
                                <div className='flex-1 space-y-2'>
                                    <div className='h-4 bg-steel-200 rounded w-1/3' />
                                    <div className='h-3 bg-steel-100 rounded w-2/3' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className='p-6 text-center'>
                        <p className='text-red-500'>Failed to load tickets</p>
                    </div>
                ) : recentTickets.length === 0 ? (
                    <div className='p-12 text-center'>
                        <div className='w-16 h-16 bg-steel-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <FileText className='w-8 h-8 text-steel-400' />
                        </div>
                        <h3 className='text-lg font-medium text-steel-900 mb-1'>No tickets yet</h3>
                        <p className='text-steel-500'>
                            Your service tickets will appear here once you bring your vehicle in.
                        </p>
                    </div>
                ) : (
                    <div className='divide-y divide-steel-100'>
                        {recentTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className='px-6 py-4 flex items-center gap-4 hover:bg-steel-50 transition-colors'
                            >
                                <div className='w-10 h-10 bg-steel-100 rounded-lg flex items-center justify-center'>
                                    <Car className='w-5 h-5 text-steel-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='font-medium text-steel-900 truncate'>
                                        {ticket.service_desc}
                                    </p>
                                    <p className='text-sm text-steel-500'>
                                        Vehicle VIN: ...{ticket.VIN.slice(-6)} • {formatDate(ticket.service_date)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}