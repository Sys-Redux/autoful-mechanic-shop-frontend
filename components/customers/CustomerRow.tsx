'use client';
import Link from 'next/link';
import { useCustomer } from '@/hooks/useCustomers';
import { Users, Mail, Phone, ChevronUp, ChevronDown, Ticket } from 'lucide-react';


export default function CustomerRow({
    customer,
    isExpanded,
    onToggle,
}: {
    customer: { id:number; name: string; email: string; phone: string; };
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const { data: customerDetails, isLoading } = useCustomer(isExpanded ? customer.id : 0);


    return (
        <div>
            <button
                onClick={onToggle}
                className='w-full px-6 py-4 flex items-center gap-4 hover:bg-steel-50 transition-colors text-left'
            >
                <div className='w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center'>
                    <Users className='w-6 h-6 text-brand-600' />
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='font-medium text-steel-900'>{customer.name}</p>
                    <div className='flex items-center gap-4 text-sm text-steel-500'>
                        <span className='flex items-center gap-1'>
                            <Mail className='w-4 h-4' />
                            {customer.email}
                        </span>
                        <span className='flex items-center gap-1'>
                            <Phone className='w-4 h-4' />
                            {customer.phone}
                        </span>
                    </div>
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
                        <h4 className='text-sm font-medium text-steel-700 mb-2'>Service History</h4>
                        {isLoading ? (
                            <div className='space-y-2'>
                                {[1, 2].map((i) => (
                                    <div key={i} className='h-10 bg-steel-200 rounded animate-pulse' />
                                ))}
                            </div>
                        ) : customerDetails?.service_tickets && customerDetails.service_tickets.length > 0 ? (
                            <div className='space-y-2'>
                                {customerDetails.service_tickets.map((ticket) => (
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
                            <p className='text-sm text-steel-500'>No service history yet</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}