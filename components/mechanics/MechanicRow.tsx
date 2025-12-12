'use client';
import Link from 'next/link';
import { useMechanic } from '@/hooks/useMechanics';
import { Wrench, Trophy, Mail, Phone, ChevronUp, ChevronDown, Ticket } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function MechanicRow({
    mechanic,
    isExpanded,
    onToggle,
    isTopPerformer,
}: {
    mechanic: { id: number; name: string; email: string; phone: string; salary: number; };
    isExpanded: boolean;
    onToggle: () => void;
    isTopPerformer: boolean;
}) {
    const { data: mechanicDetail, isLoading } = useMechanic(isExpanded ? mechanic.id : 0);


    return (
        <div>
            <button
                onClick={onToggle}
                className='w-full px-6 py-4 flex items-center gap-4 hover:bg-steel-50
                    transition-colors text-left'
            >
                <div className='w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center relative'>
                    <Wrench className='w-6 h-6 text-brand-600' />
                    {isTopPerformer && (
                        <div className='absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex
                        items-center justify-center'>
                            <Trophy className='w-3 h-3 text-amber-900' />
                        </div>
                    )}
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='font-medium text-steel-900'>
                        {mechanic.name}
                        {isTopPerformer && (
                            <span className='ml-2 text-xs text-amber-600 font-normal'>Top Performer</span>
                        )}
                    </p>
                    <div className='flex items-center gap-4 text-sm text-steel-500'>
                        <span className='flex items-center gap-1'>
                            <Mail className='w-4 h-4' />
                            {mechanic.email}
                        </span>
                        <span className='flex items-center gap-1'>
                            <Phone className='w-4 h-4' />
                            {mechanic.phone}
                        </span>
                    </div>
                </div>
                <div className='text-right hidden sm:block'>
                    <p className='text-sm text-steel-500'>Salary</p>
                    <p className='font-medium text-steel-900'>{formatCurrency(mechanic.salary)}</p>
                </div>
                {isExpanded ? (
                    <ChevronUp className='w-5 h-5 text-steel-400' />
                ) : (
                    <ChevronDown className='w-5 h-5 text-steel-400' />
                )}
            </button>
            {isExpanded && (
                <div className='px-6 pb-4 bg-steel-50'>
                    <div className='ml-16 pt-2'>
                        <h4 className='text-sm font-medium text-steel-700 mb-2'>Assigned Tickets</h4>
                        {isLoading ? (
                            <div className='space-y-2'>
                                {[1, 2].map((i) => (
                                    <div key={i} className='h-10 bg-steel-200 rounded animate-pulse' />
                                ))}
                            </div>
                        ) : mechanicDetail?.service_tickets && mechanicDetail.service_tickets.length > 0 ? (
                            <div className='space-y-2'>
                                {mechanicDetail.service_tickets.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        href={`/mechanic-dashboard/tickets/${ticket.id}`}
                                        className='flex items-center gap-3 p-3 bg-white rounded-lg border
                                            border-steel-200 hover:border-brand-300 transition-colors'
                                    >
                                        <Ticket className='w-5 h-5 text-brand-600' />
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium text-steel-900 truncate'>
                                                {ticket.service_desc}
                                            </p>
                                            <p className='text-xs text-steel-500'>
                                                VIN: {ticket.VIN} • {ticket.service_date}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className='text-sm text-steel-500'>No assigned tickets</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}