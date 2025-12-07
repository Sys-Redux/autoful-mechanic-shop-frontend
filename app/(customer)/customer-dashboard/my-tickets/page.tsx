'use client';
import { useState } from 'react';
import { Car, Calendar, FileText, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useMyTickets } from '@/hooks/useCustomers';
import { formatDate } from '@/lib/utils';

export default function MyTicketsPage() {
    const { data: tickets, isLoading, error } = useMyTickets();
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTickets =
        tickets?.filter(
            (ticket) =>
                ticket.VIN.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.service_desc.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };


    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-steel-900'>My Tickets</h1>
                    <p className='text-steel-600 mt-1'>View your service history</p>
                </div>
                {/* Search */}
                <div className='relative'>
                    <Search className='absolute ledt-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400' />
                    <input
                        type='text'
                        placeholder='Search by VIN or description...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='pl-10 pr-4 py-2 w-full sm:w-80 border border-steel-300 rounded-lg text-sm
                            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
                    />
                </div>
            </div>
            {/* Tickets List */}
            {isLoading ? (
                <div className='space-y-4'>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className='bg-white rounded-xl border border-steel-200 p-6 animate-pulse'
                        >
                            <div className='flex gap-4'>
                                <div className='w-12 h-12 bg-steel-200 rounded-lg' />
                                <div className='flex-1 space-y-2'>
                                    <div className='h-5 bg-steel-200 rounded w-1/2' />
                                    <div className='h-4 bg-steel-100 rounded w-1/3' />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className='bg-red-50 border border-red-200 rounded-xl p-6 text-center'>
                    <p className='text-red-600'>Failed to load tickets. Please try again later.</p>
                </div>
            ) : filteredTickets.length === 0 ? (
                <div className='bg-white rounded-xl border border-steel-200 p-12 text-center'>
                    <div className='w-16 h-16 bg-steel-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <FileText className='w-8 h-8 text-steel-400' />
                    </div>
                    {searchQuery ? (
                        <>
                            <h3 className='text-lg font-medium text-steel-900 mb-1'>No results found</h3>
                            <p className='text-steel-500'>
                                No tickets match &quot;{searchQuery}&quot;. Please try a different term.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className='text-lg font-medium text-steel-900 mb-1'>No tickets yet</h3>
                            <p className='text-steel-500'>
                                Your service tickets will appear here once you bring your vehicle in.
                            </p>
                        </>
                    )}
                </div>
            ) : (
                <div className='space-y-4'>
                    {filteredTickets.map((ticket) => {
                        const isExpanded = expandedId === ticket.id;
                        return (
                            <div
                                key={ticket.id}
                                className='bg-white rounded-xl border border-steel-200 overflow-hidden
                                    transition-shadow hover:shadow-md'
                            >
                                <button
                                    onClick={() => toggleExpand(ticket.id)}
                                    className='w-full text-left px-6 py-4 flex items-center justify-between'
                                >
                                    <div className='w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center shrink-0'>
                                        <Car className='w-6 h-6 text-brand-600' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-medium text-steel-900 truncate'>
                                            {ticket.service_desc}
                                        </p>
                                        <div className='flex items-center gap-3 mt-1 text-sm text-steel-500'>
                                            <span className='flex items-center gap-1'>
                                                <Calendar className='w-4 h-4' />
                                                {formatDate(ticket.service_date)}
                                            </span>
                                            <span>•</span>
                                            <span>VIN: ...{ticket.VIN.slice(-6)}</span>
                                        </div>
                                    </div>
                                    <div className='text-steel-400'>
                                        {isExpanded ? (
                                            <ChevronUp className='w-5 h-5' />
                                        ) : (
                                            <ChevronDown className='w-5 h-5' />
                                        )}
                                    </div>
                                </button>
                                {isExpanded && (
                                    <div className='px-6 pb-6 border-t border-steel-100'>
                                        <div className='pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div>
                                                <p className='text-sm font-medium text-steel-500 mb-1'>
                                                    Full VIN
                                                </p>
                                                <p className='text-steel-900 font-mono'>{ticket.VIN}</p>
                                            </div>
                                            <div>
                                                <p className='text-sm font-medium text-steel-500 mb-1'>
                                                    Service Date
                                                </p>
                                                <p className='text-steel-900'>
                                                    {formatDate(ticket.service_date)}
                                                </p>
                                            </div>
                                            <div className='sm:col-span-2'>
                                                <p className='text-sm font-medium text-steel-500 mb-1'>
                                                    Service Description
                                                </p>
                                                <p className='text-steel-900'>{ticket.service_desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {!isLoading && !error && tickets && tickets.length > 0 && (
                <p className='text-sm text-steel-500 text-center'>
                    Showing {filteredTickets.length} of {tickets.length} tickets
                </p>
            )}
        </div>
    );
}