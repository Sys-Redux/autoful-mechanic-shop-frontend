'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    PlusCircle,
    Package,
    Edit2,
    Trash2,
    X,
    Save,
    AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency } from '@/lib/utils';
import type { InventoryPart } from '@/types/index';
import {
    useInventory,
    useCreatePart,
    useUpdatePart,
    useDeletePart,
} from '@/hooks/useInventory';

const partSchema = z.object({
    part_name: z.string().min(2, 'Part name must be at least 2 characters long'),
    price: z.number().min(0, 'Price must be a positive number'),
    quantity_in_stock: z.number().min(0, 'Quantity must be a positive number'),
});

type PartFormData = z.infer<typeof partSchema>;

export default function InventoryPage() {
    const [search, setSearch] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPart, setEditingPart] = useState<InventoryPart | null>(null);

    const { data: inventory, isLoading } = useInventory();
    const createPart = useCreatePart();
    const updatePart = useUpdatePart();
    const deletePart = useDeletePart();

    const filteredParts = inventory?.filter(part =>
        part.part_name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PartFormData>({
        resolver: zodResolver(partSchema),
    });

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: editErrors },
    } = useForm<PartFormData>({
        resolver: zodResolver(partSchema),
    });

    const handleCreate = async (data: PartFormData) => {
        try {
            await createPart.mutateAsync(data);
            toast.success('Part created successfully');
            setShowCreateForm(false);
            reset();
        } catch {
            toast.error('Failed to create part');
        }
    };

    const handleUpdate = async (data: PartFormData) => {
        if (!editingPart) return;
        try {
            await updatePart.mutateAsync({ id: editingPart.id, data });
            toast.success('Part updated successfully');
            setEditingPart(null);
            resetEdit();
        } catch {
            toast.error('Failed to update part');
        }
    };

    const handleDelete = async (id: number, partName: string) => {
        if (!confirm(`Delete "${partName}"? This cannot be undone.`)) return;
        try {
            await deletePart.mutateAsync(id);
            toast.success('Part deleted successfully');
        } catch {
            toast.error('Failed to delete part. It may be in use on another ticket.');
        }
    };

    const openEditForm = (part: InventoryPart) => {
        setEditingPart(part);
        resetEdit({
            part_name: part.part_name,
            price: part.price,
            quantity_in_stock: part.quantity_in_stock,
        });
    };


    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-steel-900'>Inventory</h1>
                    <p className='text-steel-600'>Manage parts and supplies</p>
                </div>
                <div className='flex gap-2'>
                    <Link href='/mechanic-dashboard/inventory/low-stock' className='btn-secondary'>
                        <AlertTriangle className='w-5 h-5' />
                        Low Stock
                    </Link>
                    <button onClick={() => setShowCreateForm(true)} className='btn-accent'>
                        <PlusCircle className='w-5 h-5' />
                        Add Part
                    </button>
                </div>
            </div>
            {/* Create Form */}
            {showCreateForm && (
                <div className='bg-white rounded-xl border border-steel-200 p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-lg font-semibold text-steel-900'>Add New Part</h2>
                        <button onClick={() => setShowCreateForm(false)} className='btn-ghost btn-sm'>
                            <X className='w-4 h-4' />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(handleCreate)} className='grid sm:grid-cols-4 gap-4'>
                        <div className='sm:col-span-2'>
                            <input
                                {...register('part_name')}
                                placeholder='Part Name'
                                className={errors.part_name ? 'input input-error' : 'input'}
                            />
                            {errors.part_name && (
                                <p className='input-error-message'>{errors.part_name.message}</p>
                            )}
                        </div>
                        <div>
                            <input
                                {...register('price')}
                                type='number'
                                step='0.01'
                                placeholder='Price'
                                className={errors.price ? 'input input-error' : 'input'}
                            />
                            {errors.price && (
                                <p className='input-error-message'>{errors.price.message}</p>
                            )}
                        </div>
                        <div>
                            <input
                                {...register('quantity_in_stock')}
                                type='number'
                                placeholder='Quantity'
                                className={errors.quantity_in_stock ? 'input input-error' : 'input'}
                            />
                            {errors.quantity_in_stock && (
                                <p className='input-error-message'>{errors.quantity_in_stock.message}</p>
                            )}
                        </div>
                        <div className='sm:col-span-4 flex justify-end gap-2'>
                            <button type='button' onClick={() => setShowCreateForm(false)} className='btn-secondary'>
                                Cancel
                            </button>
                            <button type='submit' className='btn-primary' disabled={createPart.isPending}>
                                <Save className='w-4 h-4' />
                                {createPart.isPending ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/* Search */}
            <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400' />
                <input
                    type='text'
                    placeholder='Search parts...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input pl-10'
                />
            </div>
            {/* Inventory Table */}
            <div className='bg-white rounded-xl border border-steel-200 overflow-hidden'>
                {isLoading ? (
                    <div className='p-6 space-y-4'>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className='h-12 bg-steel-100 rounded animate-pulse' />
                        ))}
                    </div>
                ) : filteredParts.length > 0 ? (
                    <div className='overflow-x-auto'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Part Name</th>
                                    <th>Price</th>
                                    <th>In Stock</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParts.map((part) => (
                                    <tr key={part.id}>
                                        {editingPart?.id === part.id ? (
                                            <>
                                                <td>
                                                    <input
                                                        {...registerEdit('part_name')}
                                                        className={editErrors.part_name ? 'input input-error' : 'input'}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        {...registerEdit('price')}
                                                        className={editErrors.price ? 'input input-error' : 'input'}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        {...registerEdit('quantity_in_stock')}
                                                        className={editErrors.quantity_in_stock ? 'input input-error' : 'input'}
                                                    />
                                                </td>
                                                <td></td>
                                                <td>
                                                    <div className='flex gap-1'>
                                                        <button
                                                            onClick={handleSubmitEdit(handleUpdate)}
                                                            className='btn-primary btn-sm'
                                                        >
                                                            <Save className='w-4 h-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingPart(null)}
                                                            className='btn-ghost btn-sm'
                                                        >
                                                            <X className='w-4 h-4' />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='font-medium'>{part.part_name}</td>
                                                <td>{formatCurrency(part.price)}</td>
                                                <td>{part.quantity_in_stock}</td>
                                                <td>
                                                    {part.quantity_in_stock === 0 ? (
                                                        <span className='badge-danger'>Out of Stock</span>
                                                    ) : part.quantity_in_stock <= 10 ? (
                                                        <span className='badge-warning'>Low Stock</span>
                                                    ) : (
                                                        <span className='badge-success'>In Stock</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className='flex gap-1'>
                                                        <button
                                                            onClick={() => openEditForm(part)}
                                                            className='p-2 text-steel-400 hover:text-brand-600
                                                                hover:bg-brand-50 rounded-lg transition-colors'
                                                        >
                                                            <Edit2 className='w-4 h-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(part.id, part.part_name)}
                                                            className='p-2 text-steel-400 hover:text-red-500
                                                                hover:bg-red-50 rounded-lg transition-colors'
                                                        >
                                                            <Trash2 className='w-4 h-4' />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className='p-12 text-center'>
                        <Package className='w-12 h-12 text-steel-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-steel-900 mb-1'>No parts found</h3>
                        <p className='text-steel-500 mb-4'>
                            {search ? 'Try a different search term' : 'Add your first inventory part'}
                        </p>
                        {!search && (
                            <button onClick={() => setShowCreateForm(true)} className='btn-primary'>
                                <PlusCircle className='w-5 h-5' />
                                Add Part
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}