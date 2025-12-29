'use client';
import { useState } from 'react';
import { Search, Users, Plus, X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCustomers, useCreateCustomer } from '@/hooks/useCustomers';
import CustomerRow from '@/components/customers/CustomerRow';
import { registerCustomerSchema, type RegisterCustomerFormData } from '@/lib/validations/auth';
import { SkeletonBox, SkeletonText } from '@/components/ui/Skeleton';

export default function CustomersPage() {
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { data: customers, isLoading } = useCustomers();
    const createCustomer = useCreateCustomer();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegisterCustomerFormData>({
        resolver: zodResolver(registerCustomerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });

    const filteredCustomers = customers?.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
    ) ?? [];

    const onSubmit = async (data: RegisterCustomerFormData) => {
        try {
            await createCustomer.mutateAsync({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
            });
            toast.success('Customer account created successfully');
            setShowCreateModal(false);
            reset();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create customer account';
            toast.error(message);
        }
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        reset();
        setShowPassword(false);
    };


    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-steel-900'>Customers</h1>
                    <p className='text-steel-600'>View and manage customer accounts</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className='btn-primary'
                >
                    <Plus className='w-5 h-5' />
                    Create Customer
                </button>
            </div>

            {/* Create Customer Modal */}
            {showCreateModal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
                        <div className='flex items-center justify-between p-6 border-b border-steel-200'>
                            <h2 className='text-xl font-semibold text-steel-900'>Create Customer Account</h2>
                            <button
                                onClick={handleCloseModal}
                                className='p-2 hover:bg-steel-100 rounded-lg transition-colors'
                            >
                                <X className='w-5 h-5 text-steel-500' />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-4'>
                            {/* Name */}
                            <div>
                                <label className='label'>Full Name</label>
                                <input
                                    type='text'
                                    {...register('name')}
                                    className={`input ${errors.name ? 'input-error' : ''}`}
                                    placeholder='John Doe'
                                />
                                {errors.name && (
                                    <p className='input-error-message'>{errors.name.message}</p>
                                )}
                            </div>
                            {/* Email */}
                            <div>
                                <label className='label'>Email Address</label>
                                <input
                                    type='email'
                                    {...register('email')}
                                    className={`input ${errors.email ? 'input-error' : ''}`}
                                    placeholder='john@example.com'
                                />
                                {errors.email && (
                                    <p className='input-error-message'>{errors.email.message}</p>
                                )}
                            </div>
                            {/* Phone */}
                            <div>
                                <label className='label'>Phone Number</label>
                                <input
                                    type='text'
                                    {...register('phone')}
                                    className={`input ${errors.phone ? 'input-error' : ''}`}
                                    placeholder='(123) 456-7890'
                                />
                                {errors.phone && (
                                    <p className='input-error-message'>{errors.phone.message}</p>
                                )}
                            </div>
                            {/* Password */}
                            <div>
                                <label className='label'>Password</label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                                        placeholder='••••••••'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-steel-400 hover:text-steel-600'
                                    >
                                        {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className='input-error-message'>{errors.password.message}</p>
                                )}
                            </div>
                            {/* Confirm Password */}
                            <div>
                                <label className='label'>Confirm Password</label>
                                <input
                                    type='password'
                                    {...register('confirmPassword')}
                                    className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                                    placeholder='••••••••'
                                />
                                {errors.confirmPassword && (
                                    <p className='input-error-message'>{errors.confirmPassword.message}</p>
                                )}
                            </div>
                            {/* Actions */}
                            <div className='flex gap-3 pt-4'>
                                <button
                                    type='button'
                                    onClick={handleCloseModal}
                                    className='btn-secondary flex-1'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    disabled={createCustomer.isPending}
                                    className='btn-primary flex-1'
                                >
                                    {createCustomer.isPending ? (
                                        <>
                                            <Loader2 className='w-5 h-5 animate-spin' />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400' />
                <input
                    type='text'
                    placeholder='Search by name, email, or phone...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input pl-10'
                />
            </div>
            {/* Customer List */}
            <div className='bg-white rounded-xl border border-steel-200 overflow-hidden'>
                {isLoading ? (
                    <div className='p-6 space-y-4'>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className='flex gap-4'>
                                <SkeletonBox className='rounded-full' />
                                <div className='flex-1 space-y-2'>
                                    <SkeletonText className='w-1/3' />
                                    <SkeletonText className='w-1/2 bg-steel-100' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredCustomers.length > 0 ? (
                    <div className='divide-y divide-steel-100'>
                        {filteredCustomers.map((customer) => (
                            <CustomerRow
                                key={customer.id}
                                customer={customer}
                                isExpanded={expandedId === customer.id}
                                onToggle={() =>
                                    setExpandedId(expandedId === customer.id ? null : customer.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='p-12 text-center'>
                        <Users className='w-12 h-12 text-steel-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-steel-900 mb-1'>No customers found</h3>
                        <p className='text-steel-500'>
                            {search ? 'Try adjusting your search term' : 'Customers will appear here once they register.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
