'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Package, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLowStockInventory, useUpdatePart } from '@/hooks/useInventory';
import { formatCurrency } from '@/lib/utils';

export default function LowStockPage() {
    const [threshold, setThreshold] = useState(10);
    const [restockingId, setRestockingId] = useState<number | null>(null);
    const [restockAmount, setRestockAmount] = useState('');

    const { data: lowStock, isLoading } = useLowStockInventory(threshold);
    const updatePart = useUpdatePart();

    const handleRestock = async (partId: number, currentStock: number) => {
        const amount = parseInt(restockAmount);
        if (!amount || amount < 1) {
            toast.error('Please enter a valid restock amount.');
            return;
        }
        try {
            await updatePart.mutateAsync({
                id: partId,
                data: { quantity_in_stock: currentStock + amount },
            });
            toast.success('Part restocked successfully.');
            setRestockingId(null);
            setRestockAmount('');
        } catch {
            toast.error('Failed to restock part. Please try again.');
        }
    };


    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center gap-4'>
                <Link
                    href='/mechanic-dashboard/inventory'
                    className='p-2 hover:bg-steel-100 rounded-lg transition-colors'
                >
                    <ArrowLeft className='w-5 h-5 text-steel-600' />
                </Link>
                <div>
                    <h1 className='text-2xl font-bold text-steel-900'>Low Stock Alerts</h1>
                    <p className='text-steel-600'>Parts that need to be restocked</p>
                </div>
            </div>
            {/* Threshold Selector */}
            <div className='bg-white rounded-xl border border-steel-200 p-4'>
                <div className='flex items-center gap-4'>
                    <label className='text-sm font-medium text-steel-700'>
                        Show parts with stock at or below:
                    </label>
                    <select
                        value={threshold}
                        onChange={(e) => setThreshold(parseInt(e.target.value))}
                        className='select w-24'
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={500}>500</option>
                    </select>
                    {lowStock && (
                        <span className='text-sm text-steel-500'>
                            {lowStock.count} part{lowStock.count !== 1 ? 's' : ''} found
                        </span>
                    )}
                </div>
            </div>
            {/* Low Stock List */}
            <div className='bg-white rounded-xl border border-steel-200 overflow-hidden'>
                {isLoading ? (
                    <div className='p-6 space-y-4'>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className='h-16 bg-steel-100 rounded animate-pulse' />
                        ))}
                    </div>
                ) : lowStock && lowStock.parts.length > 0 ? (
                    <div className='divide-y divide-steel-100'>
                        {lowStock?.parts.map((part) => (
                            <div key={part.id} className='p-4 flex items-center gap-4'>
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                    part.quantity_in_stock === 0 ? 'bg-red-600' : 'bg-amber-600'
                                }`}>
                                    <AlertTriangle className={`w-6 h-6 ${
                                        part.quantity_in_stock === 0 ? 'text-red-600' : 'text-amber-600'
                                    }`} />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='font-medium text-steel-900'>{part.part_name}</p>
                                    <p className={`text-sm ${
                                        part.quantity_in_stock === 0 ? 'text-red-600' : 'text-amber-600'
                                    }`}>
                                        {part.quantity_in_stock === 0
                                            ? 'Out of Stock'
                                            : `Only ${part.quantity_in_stock} left in stock`}
                                    </p>
                                </div>
                                <div className='text-right'>
                                    <p className='font-medium text-steel-900'>
                                        {formatCurrency(part.price)}
                                    </p>
                                    <p className='text-sm text-steel-500'>per unit</p>
                                </div>
                                {restockingId === part.id ? (
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='number'
                                            min={1}
                                            value={restockAmount}
                                            onChange={(e) => setRestockAmount(e.target.value)}
                                            placeholder='Qty'
                                            className='input w-20'
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleRestock(part.id, part.quantity_in_stock)}
                                            disabled={updatePart.isPending}
                                            className='btn-sm btn-primary'
                                        >
                                            {updatePart.isPending ? '...' : 'Add'}
                                        </button>
                                        <button
                                            onClick={() => { setRestockingId(null); setRestockAmount(''); }}
                                            className='btn-sm btn-ghost'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setRestockingId(part.id)}
                                        className='btn-sm btn-secondary'
                                    >
                                        <Edit2 className='w-4 h-4' />
                                        Restock
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='p-12 text-center'>
                        <Package className='w-12 h-12 text-green-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-steel-900 mb-1'>All Stocked!</h3>
                        <p className='text-steel-500'>
                            No parts are below the threshold of {threshold} units.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}