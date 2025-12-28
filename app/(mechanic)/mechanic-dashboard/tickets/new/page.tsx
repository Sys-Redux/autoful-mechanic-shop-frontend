'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X, Package, Search, User } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateServiceTicket, useAddInventoryToTicket } from '@/hooks/useServiceTickets';
import { useCustomers } from '@/hooks/useCustomers';
import { useInventory } from '@/hooks/useInventory';
import { formatCurrency } from '@/lib/utils';
import { InventoryPart, Customer } from '@/types';

interface QueuedPart {
    inventoryId: number;
    partName: string;
    price: number;
    quantity: number;
}

const ticketSchema = z.object({
    VIN: z.string()
        .min(17, 'VIN must be exactly 17 characters')
        .max(17, 'VIN must be exactly 17 characters')
        .regex(/^[A-HJ-NPR-Z0-9]+$/i, 'Invalid VIN format'),
    service_date: z.string().min(1, 'Service date is required'),
    service_desc: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be at most 500 characters'),
    customer_id: z.string().min(1, 'Customer is required'),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export default function NewTicketPage() {
    const router = useRouter();
    const { data: customers, isLoading: customersLoading } = useCustomers();
    const { data: inventory } = useInventory();
    const createTicket = useCreateServiceTicket();
    const addInventory = useAddInventoryToTicket();

    // Customer autocomplete state
    const [customerSearch, setCustomerSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const customerInputRef = useRef<HTMLInputElement>(null);
    const customerDropdownRef = useRef<HTMLDivElement>(null);

    // Parts queue state
    const [queuedParts, setQueuedParts] = useState<QueuedPart[]>([]);
    const [partSearch, setPartSearch] = useState('');
    const [selectedPart, setSelectedPart] = useState<InventoryPart | null>(null);
    const [partQuantity, setPartQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPartDropdown, setShowPartDropdown] = useState(false);
    const partInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const availableParts = inventory?.filter(p => p.quantity_in_stock > 0) ?? [];

    // Filter customers based on search
    const filteredCustomers = (customers ?? []).filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone.includes(customerSearch)
    );

    // Filter parts based on search
    const filteredParts = availableParts.filter(part =>
        part.part_name.toLowerCase().includes(partSearch.toLowerCase())
    );

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Parts dropdown
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                partInputRef.current &&
                !partInputRef.current.contains(event.target as Node)
            ) {
                setShowPartDropdown(false);
            }
            // Customer dropdown
            if (
                customerDropdownRef.current &&
                !customerDropdownRef.current.contains(event.target as Node) &&
                customerInputRef.current &&
                !customerInputRef.current.contains(event.target as Node)
            ) {
                setShowCustomerDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            service_date: new Date().toISOString().split('T')[0],
        },
    });

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setCustomerSearch(customer.name);
        setValue('customer_id', String(customer.id), { shouldValidate: true });
        setShowCustomerDropdown(false);
    };

    const handleAddPartToQueue = () => {
        if (!selectedPart || partQuantity < 1) return;

        // Check if part is already in queue
        const existingIndex = queuedParts.findIndex(qp => qp.inventoryId === selectedPart.id);
        if (existingIndex >= 0) {
            // Update quantity
            const updated = [...queuedParts];
            updated[existingIndex].quantity += partQuantity;
            setQueuedParts(updated);
        } else {
            setQueuedParts([...queuedParts, {
                inventoryId: selectedPart.id,
                partName: selectedPart.part_name,
                price: selectedPart.price,
                quantity: partQuantity,
            }]);
        }

        setPartSearch('');
        setSelectedPart(null);
        setPartQuantity(1);
    };

    const handleSelectPart = (part: InventoryPart) => {
        setSelectedPart(part);
        setPartSearch(part.part_name);
        setShowPartDropdown(false);
    };

    const handleRemoveFromQueue = (inventoryId: number) => {
        setQueuedParts(queuedParts.filter(qp => qp.inventoryId !== inventoryId));
    };

    const totalPartsCost = queuedParts.reduce(
        (sum, part) => sum + (part.price * part.quantity), 0
    );

    const onSubmit = async (data: TicketFormData) => {
        setIsSubmitting(true);
        try {
            // 1. Create the ticket
            const newTicket = await createTicket.mutateAsync({
                VIN: data.VIN.toUpperCase(),
                service_date: data.service_date,
                service_desc: data.service_desc,
                customer_id: parseInt(data.customer_id),
            });

            // 2. Add queued parts (if any)
            for (const part of queuedParts) {
                try {
                    await addInventory.mutateAsync({
                        ticketId: newTicket.id,
                        inventoryId: part.inventoryId,
                        quantity: part.quantity,
                    });
                } catch {
                    toast.error(`Failed to add ${part.partName} to ticket`);
                }
            }

            toast.success('Service ticket created successfully');
            // Redirect to ticket detail page so they can see/edit parts
            router.push(`/mechanic-dashboard/tickets/${newTicket.id}`);
        } catch {
            toast.error('Failed to create service ticket');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className='max-w-2xl mx-auto space-y-6'>
            {/* Header */}
            <div className='flex items-center gap-4'>
                <Link
                    href='/mechanic-dashboard/tickets'
                    className='p-2 hover:bg-steel-100 rounded-lg transition-colors'
                >
                    <ArrowLeft className='w-5 h-5 text-steel-600' />
                </Link>
                <div>
                    <h1 className='text-2xl font-bold text-steel-900'>New Service Ticket</h1>
                    <p className='text-steel-600'>Create a new service ticket</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='bg-white rounded-xl border border-steel-200 p-6 space-y-6'>
                {/* Customer Autocomplete */}
                <div>
                    <label className='label'>Customer *</label>
                    <input type='hidden' {...register('customer_id')} />
                    <div className='relative'>
                        <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400' />
                        <input
                            ref={customerInputRef}
                            type='text'
                            value={customerSearch}
                            onChange={(e) => {
                                setCustomerSearch(e.target.value);
                                setSelectedCustomer(null);
                                setValue('customer_id', '', { shouldValidate: false });
                                setShowCustomerDropdown(true);
                            }}
                            onFocus={() => setShowCustomerDropdown(true)}
                            placeholder={customersLoading ? 'Loading customers...' : 'Search for a customer...'}
                            disabled={customersLoading}
                            className={`input pl-9 w-full ${errors.customer_id ? 'input-error' : ''}`}
                        />
                        {showCustomerDropdown && !customersLoading && (
                            <div
                                ref={customerDropdownRef}
                                className='absolute z-10 w-full mt-1 bg-white border border-steel-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'
                            >
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <button
                                            key={customer.id}
                                            type='button'
                                            onClick={() => handleSelectCustomer(customer)}
                                            className={`w-full px-4 py-2 text-left hover:bg-steel-50 transition-colors ${
                                                selectedCustomer?.id === customer.id ? 'bg-brand-50 text-brand-700' : ''
                                            }`}
                                        >
                                            <div className='font-medium'>{customer.name}</div>
                                            <div className='text-sm text-steel-500'>
                                                {customer.email} • {customer.phone}
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className='px-4 py-3 text-steel-500 text-sm'>
                                        {customerSearch ? 'No customers found' : 'Start typing to search...'}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {errors.customer_id && (
                        <p className='input-error-message'>{errors.customer_id.message}</p>
                    )}
                </div>

                {/* VIN Input */}
                <div>
                    <label className='label'>Vehicle VIN *</label>
                    <input
                        type='text'
                        {...register('VIN')}
                        placeholder='1HGBH41JXMN109186'
                        className={errors.VIN ? 'input input-error uppercase' : 'input uppercase'}
                        maxLength={17}
                    />
                    {errors.VIN && (
                        <p className='input-error-message'>{errors.VIN.message}</p>
                    )}
                    <p className='input-hint'>Enter the 17-character Vehicle Identification Number (VIN)</p>
                </div>

                {/* Service Date Input */}
                <div>
                    <label className='label'>Service Date *</label>
                    <input
                        type='date'
                        {...register('service_date')}
                        className={errors.service_date ? 'input input-error' : 'input'}
                    />
                    {errors.service_date && (
                        <p className='input-error-message'>{errors.service_date.message}</p>
                    )}
                </div>

                {/* Service Description Input */}
                <div>
                    <label className='label'>Service Description *</label>
                    <textarea
                        {...register('service_desc')}
                        placeholder='Describe the service needed...'
                        rows={4}
                        className={errors.service_desc ? 'input input-error' : 'input'}
                    />
                    {errors.service_desc && (
                        <p className='input-error-message'>{errors.service_desc.message}</p>
                    )}
                </div>

                {/* Parts Section (Optional) */}
                <div className='border-t border-steel-200 pt-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <div>
                            <h3 className='font-semibold text-steel-900'>Parts & Inventory</h3>
                            <p className='text-sm text-steel-500'>Optional - you can also add parts later</p>
                        </div>
                        <Package className='w-5 h-5 text-steel-400' />
                    </div>

                    {/* Add Part Controls */}
                    <div className='flex gap-2 mb-4'>
                        <div className='relative flex-1'>
                            <div className='relative'>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400' />
                                <input
                                    ref={partInputRef}
                                    type='text'
                                    value={partSearch}
                                    onChange={(e) => {
                                        setPartSearch(e.target.value);
                                        setSelectedPart(null);
                                        setShowPartDropdown(true);
                                    }}
                                    onFocus={() => setShowPartDropdown(true)}
                                    placeholder='Search for a part...'
                                    className='input pl-9 w-full'
                                />
                            </div>
                            {showPartDropdown && (
                                <div
                                    ref={dropdownRef}
                                    className='absolute z-10 w-full mt-1 bg-white border border-steel-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'
                                >
                                    {filteredParts.length > 0 ? (
                                        filteredParts.map((part) => (
                                            <button
                                                key={part.id}
                                                type='button'
                                                onClick={() => handleSelectPart(part)}
                                                className={`w-full px-4 py-2 text-left hover:bg-steel-50 transition-colors flex justify-between items-center ${
                                                    selectedPart?.id === part.id ? 'bg-brand-50 text-brand-700' : ''
                                                }`}
                                            >
                                                <span className='font-medium'>{part.part_name}</span>
                                                <span className='text-sm text-steel-500'>
                                                    {part.quantity_in_stock} in stock • {formatCurrency(part.price)}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className='px-4 py-3 text-steel-500 text-sm'>
                                            {partSearch ? 'No parts found' : 'Start typing to search...'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <input
                            type='number'
                            min='1'
                            value={partQuantity}
                            onChange={(e) => setPartQuantity(parseInt(e.target.value) || 1)}
                            className='input w-20'
                            placeholder='Qty'
                        />
                        <button
                            type='button'
                            onClick={handleAddPartToQueue}
                            disabled={!selectedPart}
                            className='btn-secondary'
                        >
                            <Plus className='w-4 h-4' />
                        </button>
                    </div>

                    {/* Queued Parts List */}
                    {queuedParts.length > 0 ? (
                        <div className='bg-steel-50 rounded-lg p-4 space-y-2'>
                            {queuedParts.map((part) => (
                                <div key={part.inventoryId} className='flex items-center justify-between'>
                                    <div>
                                        <span className='font-medium text-steel-900'>{part.partName}</span>
                                        <span className='text-steel-500 ml-2'>x{part.quantity}</span>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <span className='text-steel-700'>
                                            {formatCurrency(part.price * part.quantity)}
                                        </span>
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveFromQueue(part.inventoryId)}
                                            className='p-1 text-steel-400 hover:text-red-500 transition-colors'
                                        >
                                            <X className='w-4 h-4' />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className='flex justify-between pt-2 border-t border-steel-200 font-semibold'>
                                <span>Total Parts Cost:</span>
                                <span className='text-brand-600'>{formatCurrency(totalPartsCost)}</span>
                            </div>
                        </div>
                    ) : (
                        <p className='text-sm text-steel-400 italic'>No parts added yet</p>
                    )}
                </div>

                {/* Actions */}
                <div className='flex justify-end gap-3 pt-4 border-t border-steel-200'>
                    <Link href='/mechanic-dashboard/tickets' className='btn-secondary'>Cancel</Link>
                    <button
                        type='submit'
                        disabled={isSubmitting || createTicket.isPending}
                        className='btn-primary'
                    >
                        <Save className='w-5 h-5' />
                        {isSubmitting || createTicket.isPending ? 'Creating...' : 'Create Ticket'}
                    </button>
                </div>
            </form>
        </div>
    );
}