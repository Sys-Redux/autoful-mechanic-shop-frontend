'use client';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ServiceTicketBasic } from '@/types';

interface TicketsByWeekdayChartProps {
    tickets: ServiceTicketBasic[];
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TicketsByWeekdayChart({ tickets }: TicketsByWeekdayChartProps) {
    const chartData = useMemo(() => {
        const counts = new Array(7).fill(0);

        tickets.forEach((ticket) => {
            const date = new Date(ticket.service_date);
            const dayOfWeek = date.getDay();
            counts[dayOfWeek]++;
        });

        const reordered = [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => ({
            day: WEEKDAYS[dayIndex],
            fullDay: FULL_WEEKDAYS[dayIndex],
            tickets: counts[dayIndex],
        }));
        return reordered;
    }, [tickets]);

    if (tickets.length === 0) {
        return (
            <div className='flex items-center justify-center h-full text-steel-500'>
                No service ticket data available
            </div>
        );
    }


    return (
        <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-gray-200' />
                <XAxis
                    dataKey='day'
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                    }}
                    formatter={(value) => [value, 'Tickets']}
                    labelFormatter={(label, payload) =>
                        payload?.[0]?.payload?.fullDay || label
                    }
                />
                <Bar
                    dataKey='tickets'
                    fill='#1e5a9e'
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}