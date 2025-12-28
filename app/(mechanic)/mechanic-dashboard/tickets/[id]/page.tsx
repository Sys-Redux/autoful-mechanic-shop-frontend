'use client';
import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    User,
    Wrench,
    Package,
    Trash2,
    Plus,
    X,
    Calendar,
    Car,
    Search,
} from "lucide-react";
import { toast } from 'sonner';
import {
    useServiceTicket,
    useDeleteServiceTicket,
    useAssignMechanic,
    useRemoveMechanic,
    useAddInventoryToTicket,
    useRemoveInventoryFromTicket,
} from '@/hooks/useServiceTickets';
import { useMechanics } from '@/hooks/useMechanics';
import { useInventory } from '@/hooks/useInventory';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Mechanic } from '@/types';

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const ticketId = Number(params.id);

    const { data: ticket, isLoading } = useServiceTicket(ticketId);
    const { data: allMechanics } = useMechanics();
    const { data: allParts } = useInventory();

    const deleteTicket = useDeleteServiceTicket();
    const assignMechanic = useAssignMechanic();
    const removeMechanic = useRemoveMechanic();
    const addInventory = useAddInventoryToTicket();
    const removeInventory = useRemoveInventoryFromTicket();

    const [showAddMechanic, setShowAddMechanic] = useState(false);
    const [showAddPart, setShowAddPart] = useState(false);
    const [selectedPartId, setSelectedPartId] = useState('');
    const [partQuantity, setPartQuantity] = useState(1);

    // Mechanic autocomplete state
    const [mechanicSearch, setMechanicSearch] = useState('');
    const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
    const [showMechanicDropdown, setShowMechanicDropdown] = useState(false);
    const mechanicInputRef = useRef<HTMLInputElement>(null);
    const mechanicDropdownRef = useRef<HTMLDivElement>(null);

    const availableMechanics = allMechanics?.filter(
        m => !ticket?.mechanics.some(tm => tm.id === m.id)
    ) ?? [];

    // Filter mechanics based on search
    const filteredMechanics = availableMechanics.filter(mechanic =>
        mechanic.name.toLowerCase().includes(mechanicSearch.toLowerCase()) ||
        mechanic.email.toLowerCase().includes(mechanicSearch.toLowerCase())
    );

    const availableParts = allParts?.filter(p => p.quantity_in_stock > 0) ?? [];

    // Close mechanic dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                mechanicDropdownRef.current &&
                !mechanicDropdownRef.current.contains(event.target as Node) &&
                mechanicInputRef.current &&
                !mechanicInputRef.current.contains(event.target as Node)
            ) {
                setShowMechanicDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;
        try {
            await deleteTicket.mutateAsync(ticketId);
            toast.success('Service ticket deleted successfully');
            router.push('/mechanic-dashboard/tickets');
        } catch {
            toast.error('Failed to delete service ticket');
        }
    };

    const handleSelectMechanic = (mechanic: Mechanic) => {
        setSelectedMechanic(mechanic);
        setMechanicSearch(mechanic.name);
        setShowMechanicDropdown(false);
    };

    const handleAssignMechanic = async () => {
        if (!selectedMechanic) return;
        try {
            await assignMechanic.mutateAsync({
                ticketId,
                mechanicId: selectedMechanic.id,
            });
            toast.success('Mechanic assigned successfully');
            setShowAddMechanic(false);
            setSelectedMechanic(null);
            setMechanicSearch('');
        } catch {
            toast.error('Failed to assign mechanic');
        }
    };

    const handleRemoveMechanic = async (mechanicId: number) => {
        try {
            await removeMechanic.mutateAsync({ ticketId, mechanicId });
            toast.success('Mechanic removed successfully');
        } catch {
            toast.error('Failed to remove mechanic');
        }
    };

    const handleAddPart = async () => {
        if (!selectedPartId || partQuantity < 1) return;
        try {
            await addInventory.mutateAsync({
                ticketId,
                inventoryId: parseInt(selectedPartId),
                quantity: partQuantity,
            });
            toast.success('Part added successfully');
            setShowAddPart(false);
            setSelectedPartId('');
            setPartQuantity(1);
        } catch {
            toast.error('Failed to add part');
        }
    };

    const handleRemovePart = async (serviceInventoryId: number) => {
        try {
            await removeInventory.mutateAsync({ ticketId, serviceInventoryId });
            toast.success('Part removed successfully');
        } catch {
            toast.error('Failed to remove part');
        }
    };

    const totalPartsCost = ticket?.service_inventories.reduce(
        (sum, si) => sum + (si.inventory.price * si.quantity_used), 0
    ) ?? 0;

    if (isLoading) {
        return (
            <div className='space-y-6'>
                <div className='h-8 w-48 bg-steel-200 rounded animate-pulse' />
                <div className='bg-white rounded-xl border border-steel-200 p-6 space-y-4'>
                    <div className='h-6 w-1/3 bg-steel-200 rounded animate-pulse' />
                    <div className='h-4 w-1/2 bg-steel-100 rounded animate-pulse' />
                    <div className='h-4 w-2/3 bg-steel-100 rounded animate-pulse' />
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className='text-center py-12'>
                <h2 className='text-xl font-semibold text-steel-900 mb-2'>Ticket not found</h2>
                <p className='text-steel-600 mb-4'>The ticket you&apos;re looking for does not exist.</p>
                <Link href='/mechanic-dashboard/tickets' className='btn-primary'>
                    Back to Tickets
                </Link>
            </div>
        );
    }


    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='flex items-center gap-4'>
                    <Link
                        href='/mechanic-dashboard/tickets'
                        className='p-2 hover:bg-steel-100 rounded-lg transition-colors'
                    >
                        <ArrowLeft className='w-5 h-5 text-steel-600' />
                    </Link>
                    <div>
                        <h1 className='text-2xl font-bold text-steel-900'>Ticket #{ticket.id}</h1>
                        <p className='text-steel-600'>{ticket.service_desc}</p>
                    </div>
                </div>
                <button onClick={handleDelete} className='btn-danger'>
                    <Trash2 className='w-5 h-5' />
                    Delete Ticket
                </button>
            </div>
            {/* Ticket Details */}
            <div className='grid md:grid-cols-2 gap-6'>
                <div className='bg-white rounded-xl border border-steel-200 p-6'>
                    <h2 className='text-lg font-semibold text-steel-900 mb-4'>Ticket Details</h2>
                    <dl className='space-y-4'>
                        <div className='flex items-start gap-3'>
                            <Car className='w-5 h-5 text-steel-400 mt-0.5' />
                            <div>
                                <dt className='text-sm text-steel-500'>VIN</dt>
                                <dd className='font-mono text-steel-900'>{ticket.VIN}</dd>
                            </div>
                        </div>
                        <div className='flex items-start gap-3'>
                            <Calendar className='w-5 h-5 text-steel-400 mt-0.5' />
                            <div>
                                <dt className='text-sm text-steel-500'>Service Date</dt>
                                <dd className='text-steel-900'>{formatDate(ticket.service_date)}</dd>
                            </div>
                        </div>
                        <div className='flex items-start gap-3'>
                            <User className='w-5 h-5 text-steel-400 mt-0.5' />
                            <div>
                                <dt className='text-sm text-steel-500'>Customer</dt>
                                <dd className='text-steel-900'>{ticket.customer.name}</dd>
                                <dd className='text-sm text-steel-500'>{ticket.customer.email}</dd>
                            </div>
                        </div>
                    </dl>
                </div>
                {/* Mechanics Card */}
                <div className='bg-white rounded-xl border border-steel-200 p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-lg font-semibold text-steel-900'>Assigned Mechanics</h2>
                        <button
                            onClick={() => setShowAddMechanic(!showAddMechanic)}
                            className='btn-sm btn-secondary'
                            disabled={availableMechanics.length === 0}
                        >
                            <Plus className='w-4 h-4' />
                            Add
                        </button>
                    </div>
                    {/* Add Mechanic Modal */}
                    {showAddMechanic && (
                        <div className='mb-4 p-4 border border-steel-200 rounded-lg bg-steel-50'>
                            <div className='flex items-center gap-2'>
                                <div className='relative flex-1'>
                                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400' />
                                    <input
                                        ref={mechanicInputRef}
                                        type='text'
                                        value={mechanicSearch}
                                        onChange={(e) => {
                                            setMechanicSearch(e.target.value);
                                            setSelectedMechanic(null);
                                            setShowMechanicDropdown(true);
                                        }}
                                        onFocus={() => setShowMechanicDropdown(true)}
                                        placeholder='Search for a mechanic...'
                                        className='input pl-9 w-full'
                                    />
                                    {showMechanicDropdown && (
                                        <div
                                            ref={mechanicDropdownRef}
                                            className='absolute z-10 w-full mt-1 bg-white border border-steel-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'
                                        >
                                            {filteredMechanics.length > 0 ? (
                                                filteredMechanics.map((mechanic) => (
                                                    <button
                                                        key={mechanic.id}
                                                        type='button'
                                                        onClick={() => handleSelectMechanic(mechanic)}
                                                        className={`w-full px-4 py-2 text-left hover:bg-steel-50 transition-colors ${
                                                            selectedMechanic?.id === mechanic.id ? 'bg-brand-50 text-brand-700' : ''
                                                        }`}
                                                    >
                                                        <div className='font-medium'>{mechanic.name}</div>
                                                        <div className='text-sm text-steel-500'>{mechanic.email}</div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className='px-4 py-3 text-steel-500 text-sm'>
                                                    {mechanicSearch ? 'No mechanics found' : 'Start typing to search...'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleAssignMechanic} disabled={!selectedMechanic} className='btn-sm btn-primary'>
                                    Assign
                                </button>
                                <button onClick={() => { setShowAddMechanic(false); setMechanicSearch(''); setSelectedMechanic(null); }} className='btn-sm btn-secondary'>
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    )}
                    {ticket.mechanics.length > 0 ? (
                        <ul className='space-y-3'>
                            {ticket.mechanics.map((mechanic) => (
                                <li key={mechanic.id} className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center'>
                                            <Wrench className='w-5 h-5 text-brand-600' />
                                        </div>
                                        <div>
                                            <p className='font-medium text-steel-900'>{mechanic.name}</p>
                                            <p className='text-sm text-steel-500'>{mechanic.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveMechanic(mechanic.id)}
                                        className='p-2 text-steel-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                                    >
                                        <X className='w-4 h-4' />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='text-steel-500 text-center py-4'>No mechanics assigned yet</p>
                    )}
                </div>
            </div>
            {/* Parts Used Card */}
            <div className='bg-white rounded-xl border border-steel-200 p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg font-semibold text-steel-900'>Parts Used</h2>
                    <button
                        onClick={() => setShowAddPart(!showAddPart)}
                        className='btn-sm btn-secondary'
                        disabled={availableParts.length === 0}
                    >
                        <Plus className='w-4 h-4' />
                        Add Part
                    </button>
                </div>
                {/* Add Part Modal */}
                {showAddPart && (
                    <div className='mb-4 p-4 border border-steel-200 rounded-lg bg-steel-50'>
                        <div className='flex items-center gap-2 flex-wrap'>
                            <select
                                value={selectedPartId}
                                onChange={(e) => setSelectedPartId(e.target.value)}
                                className='select flex-1 min-w-[200px]'
                            >
                                <option value=''>Select a part...</option>
                                {availableParts.map((part) => (
                                    <option key={part.id} value={part.id}>
                                        {part.part_name} ({part.quantity_in_stock} in stock) - {formatCurrency(part.price)}
                                    </option>
                                ))}
                            </select>
                            <input
                                type='number'
                                min={1}
                                value={partQuantity}
                                onChange={(e) => setPartQuantity(parseInt(e.target.value) || 1)}
                                className='input w-20'
                                placeholder='Qty'
                            />
                            <button onClick={handleAddPart} className='btn-sm btn-primary'>
                                Add
                            </button>
                            <button onClick={() => setShowAddPart(false)} className='btn-sm btn-primary'>
                                <X className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                )}
                {ticket.service_inventories.length > 0 ? (
                    <>
                        <div className='overflow-x-auto'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Part Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ticket.service_inventories.map((si) => (
                                        <tr key={si.id}>
                                            <td className='font-medium'>{si.inventory.part_name}</td>
                                            <td>{si.quantity_used}</td>
                                            <td>{formatCurrency(si.inventory.price)}</td>
                                            <td className='font-medium'>
                                                {formatCurrency(si.inventory.price * si.quantity_used)}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleRemovePart(si.id)}
                                                    className='p-2 text-steel-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                                                >
                                                    <Trash2 className='w-4 h-4' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='mt-4 pt-4 border-t border-steel-200 flex justify-end'>
                            <div className='text-right'>
                                <p className='text-sm text-steel-500'>Total Parts Cost</p>
                                <p className='text-xl font-bold text-steel-900'>{formatCurrency(totalPartsCost)}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='text-center py-8'>
                        <Package className='w-12 h-12 text-steel-300 mx-auto mb-2' />
                        <p className='text-steel-600'>No parts added yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}