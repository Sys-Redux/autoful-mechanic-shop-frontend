'use client';
import { ReactNode } from 'react';

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

export function ChartCard({ title, subtitle, children, className = '' }: ChartCardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200
            dark:border-gray-700 p-6 ${className}`}>
            <div className='mb-4'>
                <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>{title}</h3>
                {subtitle && (
                    <p className='text-sm text-gray-500 dark:text-gray-400'>{subtitle}</p>
                )}
            </div>
            <div className='h-64'>{children}</div>
        </div>
    );
}