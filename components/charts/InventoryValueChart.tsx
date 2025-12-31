'use client';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend  } from 'recharts';
import { InventoryPart } from '@/types';

interface InventoryValueChartProps {
    parts: InventoryPart[];
}

const COLORS = {
    budget: '#10b981',
    standard: '#3387d6',
    premium: '#1e5a9e',
    highEnd: '#162c48',
};

interface PriceRange {
    name: string;
    value: number;
    color: string;
    count: number;
    [key: string]: string | number;
}

export function InventoryValueChart({ parts }: InventoryValueChartProps) {
    const chartData = useMemo(() => {
        const ranges: PriceRange[] = [
            { name: 'Under $25', value: 0, color: COLORS.budget, count: 0 },
            { name: '$25 - $100', value: 0, color: COLORS.standard, count: 0 },
            { name: '$100 - $500', value: 0, color: COLORS.premium, count: 0 },
            { name: 'Over $500', value: 0, color: COLORS.highEnd, count: 0 },
        ];

        parts.forEach((part) => {
            const totalValue = part.price * part.quantity_in_stock;

            if (part.price < 25) {
                ranges[0].value += totalValue;
                ranges[0].count += 1;
            } else if (part.price>= 25 && part.price <= 100) {
                ranges[1].value += totalValue;
                ranges[1].count += 1;
            } else if (part.price > 100 && part.price <= 500) {
                ranges[2].value += totalValue;
                ranges[2].count += 1;
            } else {
                ranges[3].value += totalValue;
                ranges[3].count += 1;
            }
        });
        return ranges.filter((range) => range.value > 0);
    }, [parts]);

    const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

    if (parts.length === 0 || totalValue === 0) {
        return (
            <div className='flex items-center justify-center h-full text-steel-500'>
                No inventory data available.
            </div>
        );
    }


    return (
        <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
                <Pie
                    data={chartData}
                    cx='50%'
                    cy='50%'
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey='value'
                    label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value) => [
                        `$${Number(value).toFixed(2)}`,
                        'Value',
                    ]}
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                    }}
                />
                <Legend
                    verticalAlign='bottom'
                    height={36}
                    formatter={(value) => (
                        <span className='text-sm text-steel-700'>{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}