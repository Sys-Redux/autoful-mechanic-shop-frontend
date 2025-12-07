'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Save, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { selectUser, updateProfile, logout } from '@/lib/store/authSlice';
import { useDeleteCustomer } from '@/hooks/useCustomers';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z
        .string()
        .regex(/^[\d\-\(\)\s\+]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits long'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const deleteCustomer = useDeleteCustomer();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.displayName || '',
            phone: '',
        },
    });

    const onSubmit = async (data: ProfileFormData) => {
        setIsUpdating(true);
        try {
            await dispatch(updateProfile(data)).unwrap();
            toast.success('Profile updated successfully');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteCustomer.mutateAsync();
            await dispatch(logout()).unwrap();
            toast.success('Account deleted successfully');
            router.push('/');
        } catch {
            toast.error('Failed to delete account');
        }
    };


    return (
        <div className='max-w-2xl mx-auto space-y-8'>
            {/* Header */}
            <div>
                <h1 className='text-2xl font-bold text-steel-900'>Profile Settings</h1>
                <p className='text-steel-600 mt-1'>Manage your account information</p>
            </div>
            {/* Profile Form */}
            <div className='bg-white rounded-xl border border-steel-200 p-6'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Email (Read-only) */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-steel-700'>
                            Email Address
                        </label>
                        <div className='relative'>
                            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400' />
                            <input
                                type='email'
                                value={user?.email || ''}
                                disabled
                                className='w-full pl-10 pr-4 py-3 bg-steel-100 border border-steel-200 rounded-lg
                                    text-steel-500 cursor-not-allowed'
                            />
                        </div>
                        <p className='text-xs text-steel-500'>Email cannot be changed</p>
                    </div>
                    {/* Name */}
                    <div className='space-y-2'>
                        <label htmlFor='name' className='block text-sm font-medium text-steel-700'>
                            Full Name
                        </label>
                        <div className='relative'>
                            <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400' />
                            <input
                                id='name'
                                type='text'
                                {...register('name')}
                                className='input-field pl-10'
                                placeholder='Your full name'
                            />
                        </div>
                        {errors.name && (
                            <p className='text-xs text-red-500'>{errors.name.message}</p>
                        )}
                    </div>
                    {/* Phone */}
                    <div className='space-y-2'>
                        <label htmlFor='phone' className='block text-sm font-medium text-steel-700'>
                            Phone Number
                        </label>
                        <div className='relative'>
                            <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400' />
                            <input
                                id='phone'
                                type='text'
                                {...register('phone')}
                                className='input-field pl-10'
                                placeholder='e.g., +1 (555) 123-4567'
                            />
                        </div>
                        {errors.phone && (
                            <p className='text-xs text-red-500'>{errors.phone.message}</p>
                        )}
                    </div>
                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={!isDirty || isUpdating}
                        className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-500 text-white font-medium
                            rounded-lg hover:bg-brand-600 disabled:bg-steel-300 disabled:cursor-not-allowed transition-colors'
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className='w-5 h-5 animate-spin' />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className='w-5 h-5' />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
            {/* Danger Zone */}
            <div className='bg-white rounded-xl border border-red-200 p-6'>
                <h2 className='text-lg font-semibold text-red-600 mb-2'>Danger Zone</h2>
                <p className='text-steel-600 text-sm mb-4'>
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                </p>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className='flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 font-medium
                        rounded-lg hover:bg-red-50 transition-colors'
                >
                    <Trash2 className='w-5 h-5' />
                    Delete Account
                </button>
            </div>
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'>
                    <div className='bg-white rounded-xl max-w-md w-full p-6 space-y-4'>
                        <div className='flex items-center gap-3 text-red-600'>
                            <AlertTriangle className='w-6 h-6' />
                            <h3 className='text-lg font-semibold'>Confirm Delete</h3>
                        </div>
                        <p className='text-steel-600'>
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className='flex gap-3 justify-end'>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className='px-4 py-2 rounded-lg border border-steel-300 text-steel-600
                                    hover:bg-steel-100 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteCustomer.isPending}
                                className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium
                                    rounded-lg hover:bg-red-700 disabled:bg-red-300 transition-colors'
                            >
                                {deleteCustomer.isPending ? (
                                    <>
                                        <Loader2 className='w-4 h-4 animate-spin' />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Account'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}