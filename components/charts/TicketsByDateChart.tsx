'use client';
import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ServiceTicketBasic } from '@/types';

interface TicketsByDateChartProps {
    tickets: ServiceTicketBasic[];
    days?: number;
}

export function TicketsByDateChart({ tickets, days = 30 }: TicketsByDateChartProps) {
    const chartData = useMemo(() => {
        // Create a map of dates to ticket counts for the last N days
        const dateMap = new Map<string, number>();
        const today = new Date();

        // Initialize all dates to 0
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dateMap.set(dateStr, 0);
        }

        // Count tickets per date
        tickets.forEach((ticket) => {
            const dateStr = ticket.service_date.split('T')[0];
            if (dateMap.has(dateStr)) {
                dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
            }
        });

        // Convert to array for recharts
        return Array.from(dateMap.entries()).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            tickets: count,
        }));
    }, [tickets, days]);

    return (
        <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id='ticketGradient' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.8} />
                        <stop offset='95%' stopColor='#3b82f6' stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className='stroke-gray-200 dark:stroke-gray-200' />
                <XAxis
                    dataKey='date'
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    interval='preserveStartEnd'
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--tooltip-bg, #fff)',
                        border: '1px solid var(--tooltip-border, #e5e7eb)',
                        borderRadius: '8px',
                    }}
                />
                <Area
                    type='monotone'
                    dataKey='tickets'
                    stroke='#3b82f6'
                    strokeWidth={2}
                    fill='url(#ticketGradient)'
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}