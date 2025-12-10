'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, PlusCircle, Ticket, ChevronRight } from "lucide-react";
import { useServiceTickets } from '@/hooks/useServiceTickets';
import { formatDate } from '@/lib/utils';

export default function TicketsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data: tickets, isLoading } = useServiceTickets(page, 20);

    const filteredTickets = tickets?.filter(ticket =>
        ticket.VIN.toLowerCase().includes(search.toLowerCase()) ||
        ticket.service_desc.toLowerCase().includes(search.toLowerCase())
    ) ?? [];


    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-steel-900'>Service Tickets</h1>
                    <p className='text-steel-600'>Manage all service tickets</p>
                </div>
                <Link href='/mechanic-dashboard/tickets/new' className='btn-accent'>
                    <PlusCircle className='w-5 h-5' />
                    New Ticket
                </Link>
            </div>
            {/* Search */}
            <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400' />
                <input
                    type='text'
                    placeholder='Search by VIN or description...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input pl-10'
                />
            </div>
            {/* Tickets List */}
            <div className='bg-white rounded-xl border border-steel-200 overflow-hidden'>
                {isLoading ? (
                    <div className='p-6 space-y-4'>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className='flex gap-4 animate-pulse'>
                                <div className='w-12 h-12 bg-steel-200 rounded-lg' />
                                <div className='flex-1 space-y-2'>
                                    <div className='h-4 bg-steel-200 rounded w-1/3' />
                                    <div className='h-4 bg-steel-100 rounded w-1/2' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredTickets.length > 0 ? (
                    <div className='divide-y divide-steel-100'>
                        {filteredTickets.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={`/mechanic-dashboard/tickets/${ticket.id}`}
                                className='flex items-center gap-4 px-6 py-4 hover:bg-steel-50 transition-colors'
                            >
                                <div className='w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center'>
                                    <Ticket className='w-6 h-6 text-brand-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='font-medium text-steel-900'>
                                        {ticket.service_desc}
                                    </p>
                                    <div className='flex items-center gap-3 text-sm text-steel-500'>
                                        <span className='vin-display'>{ticket.VIN}</span>
                                        <span>•</span>
                                        <span>{formatDate(ticket.service_date)}</span>
                                    </div>
                                </div>
                                <ChevronRight className='w-5 h-5 text-steel-400' />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className='p-12 text-center'>
                        <Ticket className='w-12 h-12 text-steel-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-steel-900 mb-1'>No tickets found</h3>
                        <p className='text-steel-500 mb-4'>
                            {search ? 'Try a different search term' : 'Create your first service ticket'}
                        </p>
                        {!search && (
                            <Link href='/mechanic-dashboard/tickets/new' className='btn-primary'>
                                <PlusCircle className='w-5 h-5' />
                                Create Ticket
                            </Link>
                        )}
                    </div>
                )}
            </div>
            {/* Pagination */}
            {tickets && tickets.length >= 20 && (
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className='btn-secondary btn-sm'
                    >
                        Previous
                    </button>
                    <span className='px-4 py-2 text-sm text-steel-600'>Page {page}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className='btn-secondary btn-sm'
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}