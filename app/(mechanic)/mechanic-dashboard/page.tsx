'use client';
import Link from 'next/link';
import {
    Ticket,
    Package,
    Users,
    AlertTriangle,
    PlusCircle,
    ArrowRight,
} from 'lucide-react';
import { useServiceTickets } from '@/hooks/useServiceTickets';
import { useInventory, useLowStockInventory } from '@/hooks/useInventory';
import { useCustomers } from '@/hooks/useCustomers';
import { formatDate, formatCurrency } from '@/lib/utils'

export default function MechanicDashboardPage() {
    const { data: tickets, isLoading: ticketsLoading } = useServiceTickets(1, 5);
    const { data: inventory, isLoading: inventoryLoading } = useInventory();
    const { data: lowStock, isLoading: lowStockLoading } = useLowStockInventory(10);
    const { data: customers, isLoading: customersLoading } = useCustomers();

    const totalTickets = tickets?.length || 0;
    const totalParts = inventory?.length || 0;
    const lowStockCount = lowStock?.parts?.length || 0;
    const totalCustomers = customers?.length || 0;


    return (
        <div className='space-y-8'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-steel-900'>Dashboard</h1>
                    <p className='text-steel-600'>Overview of shop operations</p>
                </div>
                <Link href='/mechanic-dashboard/tickets/new' className='btn-accent'>
                    <PlusCircle className='w-5 h-5' />
                    New Ticket
                </Link>
            </div>
            {/* Stats Grid */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
                {/* Tickets */}
                <Link
                    href='/mechanic-dashboard/tickets'
                    className='bg-white rounded-xl border border-steel-200 p-6 hover:shadow-md transition-shadow'
                >
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center'>
                            <Ticket className='w-6 h-6 text-brand-600' />
                        </div>
                        <div>
                            <p className='text-sm text-steel-500'>Tickets</p>
                            {ticketsLoading ? (
                                <div className='h-7 w-12 bg-steel-200 rounded animate-pulse mt-1' />
                            ) : (
                                <p className='text-2xl font-bold text-steel-900'>{totalTickets}</p>
                            )}
                        </div>
                    </div>
                </Link>
                {/* Inventory */}
                <Link
                    href='/mechanic-dashboard/inventory'
                    className='bg-white rounded-xl border border-steel-200 p-6 hover:shadow-md transition-shadow'
                >
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center'>
                            <Package className='w-6 h-6 text-brand-600' />
                        </div>
                        <div>
                            <p className='text-sm text-steel-500'>Inventory</p>
                            {inventoryLoading ? (
                                <div className='h-7 w-12 bg-steel-200 rounded animate-pulse mt-1' />
                            ) : (
                                <p className='text-2xl font-bold text-steel-900'>{totalParts}</p>
                            )}
                        </div>
                    </div>
                </Link>
                {/* Low Stock Alert */}
                <Link
                    href='/mechanic-dashboard/inventory/low-stock'
                    className={`rounded-xl border p-6 hover:shadow-md transition-shadow ${
                        lowStockCount > 0
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-white border-steel-200'
                    }`}
                >
                    <div className='flex items-center gap-4'>
                        <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                lowStockCount > 0 ? 'bg-amber-100' : 'bg-steel-100'
                            }`}
                        >
                            <AlertTriangle
                                className={`w-6 h-6 ${lowStockCount > 0 ? 'text-amber-600' : 'text-steel-400'}`}
                            />
                        </div>
                        <div>
                            <p className='text-sm text-steel-500'>Low Stock</p>
                            {lowStockLoading ? (
                                <div className='h-7 w-12 bg-steel-200 rounded animate-pulse mt-1' />
                            ) : (
                                <p className='text-2xl font-bold text-steel-900'>{lowStockCount}</p>
                            )}
                        </div>
                    </div>
                </Link>
                {/* Customers */}
                <Link
                    href='/mechanic-dashboard/customers'
                    className='bg-white rounded-xl border border-steel-200 p-6 hover:shadow-md transition-shadow'
                >
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center'>
                            <Users className='w-6 h-6 text-brand-600' />
                        </div>
                        <div>
                            <p className='text-sm text-steel-500'>Customers</p>
                            {customersLoading ? (
                                <div className='h-7 w-12 bg-steel-200 rounded animate-pulse mt-1' />
                            ) : (
                                <p className='text-2xl font-bold text-steel-900'>{totalCustomers}</p>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
            {/* Recent Activity & Low Stock */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Recent Tickets */}
                <div className='bg-white rounded-xl border border-steel-200'>
                    <div className='px-6 py-4 border-b border-steel-200 flex items-center justify-between'>
                        <h2 className='text-lg font-semibold text-steel-900'>Recent Tickets</h2>
                        <Link
                            href='/mechanic-dashboard/tickets'
                            className='text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1'
                        >
                            View All
                            <ArrowRight className='w-4 h-4' />
                        </Link>
                    </div>
                    {ticketsLoading ? (
                        <div className='p-6 space-y-4'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className='flex gap-3 animate-pulse'>
                                    <div className='w-10 h-10 bg-steel-200 rounded-lg' />
                                    <div className='flex-1 space-y-2'>
                                        <div className='h-4 bg-steel-200 rounded w-2/3' />
                                        <div className='h-3 bg-steel-100 rounded w-1/2' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : tickets && tickets.length > 0 ? (
                        <div className='divide-y divide-steel-100'>
                            {tickets.slice(0, 5).map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    href={`/mechanic-dashboard/tickets/${ticket.id}`}
                                    className='px-6 py-4 flex items-center gap-4 hover:bg-steel-50 transition-colors'
                                >
                                    <div className='w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center'>
                                        <Ticket className='w-5 h-5 text-brand-600' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-medium text-steel-900 truncate'>
                                            {ticket.service_desc}
                                        </p>
                                        <p className='text-sm text-steel-500'>
                                            {formatDate(ticket.service_date)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className='p-6 text-center text-steel-500'>No tickets yet</div>
                    )}
                </div>
                {/* Low Stock */}
                <div className='bg-white rounded-xl border border-steel-200'>
                    <div className='px-6 py-4 border-b border-steel-200 flex items-center justify-between'>
                        <h2 className='text-lg font-semibold text-steel-900'>Low Stock Alerts</h2>
                        <Link
                            href='/mechanic-dashboard/inventory/low-stock'
                            className='text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1'
                        >
                            View All
                            <ArrowRight className='w-4 h-4' />
                        </Link>
                    </div>
                    {lowStockLoading ? (
                        <div className='p-6 space-y-4'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className='flex gap-3 animate-pulse'>
                                    <div className='w-10 h-10 bg-steel-200 rounded-lg' />
                                    <div className='flex-1 space-y-2'>
                                        <div className='h-4 bg-steel-200 rounded w-2/3' />
                                        <div className='h-3 bg-steel-100 rounded w-1/2' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : lowStock && lowStock.parts.length > 0 ? (
                        <div className='divide-y divide-steel-100'>
                            {lowStock.parts.slice(0, 5).map((part) => (
                                <div
                                    key={part.id}
                                    className='px-6 py-4 flex items-center gap-4'
                                >
                                    <div className='w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center'>
                                        <AlertTriangle className='w-5 h-5 text-amber-600' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-medium text-steel-900 truncate'>
                                            {part.part_name}
                                        </p>
                                        <p className='text-sm text-amber-600'>
                                            Only {part.quantity_in_stock} left in stock
                                        </p>
                                    </div>
                                    <p className='text-sm font-medium text-steel-600'>
                                        {formatCurrency(part.price)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='p-6 text-center text-steel-500'>All parts are in stock</div>
                    )}
                </div>
            </div>
        </div>
    );
}