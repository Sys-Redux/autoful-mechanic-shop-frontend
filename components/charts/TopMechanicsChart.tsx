'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, } from 'recharts';
import { TopMechanic } from '@/types';

interface TopMechanicsChartProps {
    mechanics: TopMechanic[];
}

const COLORS = ['#1e5a9e', '#3387d6', '#66a5e0', '#99c3eb', '#cce1f5'];

export function TopMechanicsChart({ mechanics }: TopMechanicsChartProps) {
    // Transform data for horizontal bar chart
    const chartData = mechanics.map((mechanic) => ({
        name: mechanic.name,
        tickets: mechanic.ticket_count,
        id: mechanic.id,
    }));

    if (mechanics.length === 0) {
        return (
            <div className='flex items-center justify-center h-full text-steel-500'>
                No mechanics data available.
            </div>
        );
    }


    return (
        <ResponsiveContainer width='100%' height='100%'>
            <BarChart
                data={chartData}
                layout='vertical'
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
                <XAxis type='number' hide />
                <YAxis
                    type='category'
                    dataKey='name'
                    tick={{ fontSize: 14 }}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value} tickets`, 'Completed']}
                />
                <Bar dataKey='tickets' radius={[0, 4, 4, 0]} maxBarSize={40}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}