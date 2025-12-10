'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from 'react-hook-form';
import {zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateServiceTicket } from '@/hooks/useServiceTickets';
import { useCustomers } from '@/hooks/useCustomers';

const ticketSchema = z.object({
    VIN: z.string()
        .min(17, 'VIN must be exactly 17 characters')
        .max(17, 'VIN must be exactly 17 characters')
        .regex(/^[A-HJ-NPR-Z0-9]+$/i, 'Invalid VIN format'),
    service_date: z.string().min(1, 'Service date is required'),
    service_desc: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be at most 500 characters'),
    customer_id: z.string().min(1, 'Customer id required'),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export default function NewTicketPage() {
    const router = useRouter();
    const { data: customers, isLoading: customersLoading } = useCustomers();
    const createTicket = useCreateServiceTicket();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            service_date: new Date().toISOString().split('T')[0],
        },
    });

    const onSubmit = async (data: TicketFormData) => {
        try {
            await createTicket.mutateAsync({
                VIN: data.VIN.toUpperCase(),
                service_date: data.service_date,
                service_desc: data.service_desc,
                customer_id: parseInt(data.customer_id),
            });
            toast.success('Service ticket created successfully');
            router.push('/mechanic-dashboard/tickets');
        } catch {
            toast.error('Failed to create service ticket');
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
                {/* Customer Select */}
                <div>
                    <label className='label'>Customer *</label>
                    <select
                        {...register('customer_id')}
                        className={errors.customer_id ? 'select input-error' : 'select'}
                        disabled={customersLoading}
                    >
                        <option value=''>Select a customer...</option>
                        {customers?.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name} ({customer.email})
                            </option>
                        ))}
                    </select>
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