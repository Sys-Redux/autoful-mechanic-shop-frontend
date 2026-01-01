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
import { useTopMechanics } from '@/hooks/useMechanics';
import { formatDate, formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton';
import { TicketListSkeleton } from '@/components/ui/TicketSkeleton';
import { ChartCard } from '@/components/charts/ChartCard';
import { TicketsByDateChart } from '@/components/charts/TicketsByDateChart';
import { TicketsByWeekdayChart } from '@/components/charts/TicketsByWeekdayChart';
import { InventoryValueChart } from '@/components/charts/InventoryValueChart';
import { TopMechanicsChart } from '@/components/charts/TopMechanicsChart';

export default function MechanicDashboardPage() {
    // Fetch 5 recent tickets for the list
    const { data: recentTickets, isLoading: recentTicketsLoading } = useServiceTickets(1, 5);
    // Fetch more tickets for meaningful chart data
    const { data: allTickets, isLoading: allTicketsLoading } = useServiceTickets(1, 100);
    const { data: inventory, isLoading: inventoryLoading } = useInventory();
    const { data: lowStock, isLoading: lowStockLoading } = useLowStockInventory(10);
    const { data: customers, isLoading: customersLoading } = useCustomers();
    const { data: topMechanics, isLoading: topMechanicsLoading } = useTopMechanics();

    const totalTickets = allTickets?.length || 0;
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
                            {allTicketsLoading ? (
                                <Skeleton className='h-7 w-12 mt-1' />
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
                                <Skeleton className='h-7 w-12 mt-1' />
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
                                <Skeleton className='h-7 w-12 mt-1' />
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
                                <Skeleton className='h-7 w-12 mt-1' />
                            ) : (
                                <p className='text-2xl font-bold text-steel-900'>{totalCustomers}</p>
                            )}
                        </div>
                    </div>
                </Link>
            </div>

            {/* Charts Section */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Tickets by Date */}
                <ChartCard
                    title='Tickets by Date'
                    subtitle='Service tickets over the last 30 days'
                >
                    {allTicketsLoading ? (
                        <div className='flex items-center justify-center h-full'>
                            <Skeleton className='h-48 w-full' />
                        </div>
                    ) : (
                        <TicketsByDateChart tickets={allTickets || []} days={30} />
                    )}
                </ChartCard>

                {/* Tickets by Weekday */}
                <ChartCard
                    title='Tickets by Day of Week'
                    subtitle='Which days are busiest'
                >
                    {allTicketsLoading ? (
                        <div className='flex items-center justify-center h-full'>
                            <Skeleton className='h-48 w-full' />
                        </div>
                    ) : (
                        <TicketsByWeekdayChart tickets={allTickets || []} />
                    )}
                </ChartCard>

                {/* Top Mechanics */}
                <ChartCard
                    title='Top Mechanics'
                    subtitle='By completed tickets'
                >
                    {topMechanicsLoading ? (
                        <div className='flex items-center justify-center h-full'>
                            <Skeleton className='h-48 w-full' />
                        </div>
                    ) : (
                        <TopMechanicsChart mechanics={topMechanics || []} />
                    )}
                </ChartCard>

                {/* Inventory Value */}
                <ChartCard
                    title='Inventory Value'
                    subtitle='Distribution by price range'
                >
                    {inventoryLoading ? (
                        <div className='flex items-center justify-center h-full'>
                            <Skeleton className='h-48 w-full' />
                        </div>
                    ) : (
                        <InventoryValueChart parts={inventory || []} />
                    )}
                </ChartCard>
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
                    {recentTicketsLoading ? (
                        <TicketListSkeleton count={3} />
                    ) : recentTickets && recentTickets.length > 0 ? (
                        <div className='divide-y divide-steel-100'>
                            {recentTickets.slice(0, 5).map((ticket) => (
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
                        <TicketListSkeleton count={3} />
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