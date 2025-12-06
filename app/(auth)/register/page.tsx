'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wrench, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { registerCustomer, registerMechanic, selectAuthLoading, selectAuthError, clearError } from '@/lib/store/authSlice';
import {
    registerCustomerSchema,
    registerMechanicSchema,
    type RegisterCustomerFormData,
    type RegisterMechanicFormData,
} from '@/lib/validations/auth';

type Role = 'customer' | 'mechanic';

// Separate Customer Form Component
function CustomerRegistrationForm({
    showPassword,
    setShowPassword,
    isLoading,
    authError,
}: {
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    isLoading: boolean;
    authError: string | null;
}) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterCustomerFormData>({
        resolver: zodResolver(registerCustomerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterCustomerFormData) => {
        dispatch(clearError());
        try {
            await dispatch(registerCustomer({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
            })).unwrap();
            toast.success('Registration successful! Welcome aboard.');
            router.push('/dashboard');
        } catch {
            toast.error(authError || 'Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* Name */}
            <div className='space-y-2'>
                <label htmlFor='name' className='block text-sm font-medium text-steel-700'>
                    Full Name
                </label>
                <input
                    id='name'
                    type='text'
                    autoComplete='name'
                    {...register('name')}
                    className='input-field'
                    placeholder='Your full name'
                />
                {errors.name && (
                    <p className='text-red-500 text-sm'>{errors.name.message}</p>
                )}
            </div>
            {/* Email */}
            <div className='space-y-2'>
                <label htmlFor='email' className='block text-sm font-medium text-steel-700'>
                    Email Address
                </label>
                <input
                    id='email'
                    type='email'
                    autoComplete='email'
                    {...register('email')}
                    className='input-field'
                    placeholder='you@example.com'
                />
                {errors.email && (
                    <p className='text-red-500 text-sm'>{errors.email.message}</p>
                )}
            </div>
            {/* Phone */}
            <div className='space-y-2'>
                <label htmlFor='phone' className='block text-sm font-medium text-steel-700'>
                    Phone Number
                </label>
                <input
                    id='phone'
                    type='text'
                    autoComplete='tel'
                    {...register('phone')}
                    className='input-field'
                    placeholder='(123) 456-7890'
                />
                {errors.phone && (
                    <p className='text-red-500 text-sm'>{errors.phone.message}</p>
                )}
            </div>
            {/* Password */}
            <div className='space-y-2'>
                <label htmlFor='password' className='block text-sm font-medium text-steel-700'>
                    Password
                </label>
                <div className='relative'>
                    <input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        {...register('password')}
                        className='input-field pr-10'
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
                    <p className='text-red-500 text-sm'>{errors.password.message}</p>
                )}
            </div>
            {/* Confirm Password */}
            <div className='space-y-2'>
                <label htmlFor='confirmPassword' className='block text-sm font-medium text-steel-700'>
                    Confirm Password
                </label>
                <input
                    id='confirmPassword'
                    type='password'
                    autoComplete='new-password'
                    {...register('confirmPassword')}
                    className='input-field'
                    placeholder='••••••••'
                />
                {errors.confirmPassword && (
                    <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>
                )}
            </div>
            {/* Auth Error */}
            {authError && (
                <div className='p-3 rounded-lg bg-red-50 border border-red-200'>
                    <p className='text-red-600 text-sm'>{authError}</p>
                </div>
            )}
            {/* Submit Button */}
            <button
                type='submit'
                disabled={isLoading}
                className='btn-primary w-full flex items-center justify-center gap-2'
            >
                {isLoading ? (
                    <>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        Creating account...
                    </>
                ) : (
                    'Create customer account'
                )}
            </button>
        </form>
    );
}

// Separate Mechanic Form Component
function MechanicRegistrationForm({
    showPassword,
    setShowPassword,
    isLoading,
    authError,
}: {
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    isLoading: boolean;
    authError: string | null;
}) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterMechanicFormData>({
        resolver: zodResolver(registerMechanicSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            salary: 0,
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterMechanicFormData) => {
        dispatch(clearError());
        try {
            await dispatch(registerMechanic({
                name: data.name,
                email: data.email,
                phone: data.phone,
                salary: data.salary,
                password: data.password,
            })).unwrap();
            toast.success('Registration successful! Welcome aboard.');
            router.push('/dashboard');
        } catch {
            toast.error(authError || 'Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* Name */}
            <div className='space-y-2'>
                <label htmlFor='mechanic-name' className='block text-sm font-medium text-steel-700'>
                    Full Name
                </label>
                <input
                    id='mechanic-name'
                    type='text'
                    autoComplete='name'
                    {...register('name')}
                    className='input-field'
                    placeholder='Your full name'
                />
                {errors.name && (
                    <p className='text-red-500 text-sm'>{errors.name.message}</p>
                )}
            </div>
            {/* Email */}
            <div className='space-y-2'>
                <label htmlFor='mechanic-email' className='block text-sm font-medium text-steel-700'>
                    Email Address
                </label>
                <input
                    id='mechanic-email'
                    type='email'
                    autoComplete='email'
                    {...register('email')}
                    className='input-field'
                    placeholder='you@example.com'
                />
                {errors.email && (
                    <p className='text-red-500 text-sm'>{errors.email.message}</p>
                )}
            </div>
            {/* Phone */}
            <div className='space-y-2'>
                <label htmlFor='mechanic-phone' className='block text-sm font-medium text-steel-700'>
                    Phone Number
                </label>
                <input
                    id='mechanic-phone'
                    type='text'
                    autoComplete='tel'
                    {...register('phone')}
                    className='input-field'
                    placeholder='(123) 456-7890'
                />
                {errors.phone && (
                    <p className='text-red-500 text-sm'>{errors.phone.message}</p>
                )}
            </div>
            {/* Salary */}
            <div className='space-y-2'>
                <label htmlFor='salary' className='block text-sm font-medium text-steel-700'>
                    Expected Salary
                </label>
                <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-steel-400'>$</span>
                    <input
                        id='salary'
                        type='number'
                        step='1000'
                        {...register('salary')}
                        className='input-field pl-8'
                        placeholder='55000'
                    />
                </div>
                {errors.salary && (
                    <p className='text-red-500 text-sm'>{errors.salary.message}</p>
                )}
            </div>
            {/* Password */}
            <div className='space-y-2'>
                <label htmlFor='mechanic-password' className='block text-sm font-medium text-steel-700'>
                    Password
                </label>
                <div className='relative'>
                    <input
                        id='mechanic-password'
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        {...register('password')}
                        className='input-field pr-10'
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
                    <p className='text-red-500 text-sm'>{errors.password.message}</p>
                )}
            </div>
            {/* Confirm Password */}
            <div className='space-y-2'>
                <label htmlFor='mechanic-confirmPassword' className='block text-sm font-medium text-steel-700'>
                    Confirm Password
                </label>
                <input
                    id='mechanic-confirmPassword'
                    type='password'
                    autoComplete='new-password'
                    {...register('confirmPassword')}
                    className='input-field'
                    placeholder='••••••••'
                />
                {errors.confirmPassword && (
                    <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>
                )}
            </div>
            {/* Auth Error */}
            {authError && (
                <div className='p-3 rounded-lg bg-red-50 border border-red-200'>
                    <p className='text-red-600 text-sm'>{authError}</p>
                </div>
            )}
            {/* Submit Button */}
            <button
                type='submit'
                disabled={isLoading}
                className='btn-primary w-full flex items-center justify-center gap-2'
            >
                {isLoading ? (
                    <>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        Creating account...
                    </>
                ) : (
                    'Create mechanic account'
                )}
            </button>
        </form>
    );
}

export default function RegisterPage() {
    const isLoading = useAppSelector(selectAuthLoading);
    const authError = useAppSelector(selectAuthError);
    const dispatch = useAppDispatch();

    const [role, setRole] = useState<Role>('customer');
    const [showPassword, setShowPassword] = useState(false);

    const handleRoleChange = (newRole: Role) => {
        dispatch(clearError());
        setRole(newRole);
    };

    return (
        <div className='space-y-8'>
            {/* Mobile Logo */}
            <div className='lg:hidden flex items-center justify-center gap-3 mb-8'>
                <div className='w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center'>
                    <Wrench className='w-6 h-6 text-white' />
                </div>
                <span className='text-2xl font-bold text-steel-900'>
                    Autoful
                </span>
            </div>

            {/* Header */}
            <div className='text-center lg:text-left'>
                <h2 className='text-2xl font-bold text-steel-900'>
                    Create your account
                </h2>
                <p className='text-steel-600 mt-2'>
                    Join now to streamline your auto shop management
                </p>
            </div>

            {/* Role Selection */}
            <div className='flex border-b border-steel-200'>
                <button
                    type='button'
                    onClick={() => handleRoleChange('customer')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                        role === 'customer'
                            ? 'border-brand-500 text-brand-600'
                            : 'border-transparent text-steel-500 hover:text-steel-700'
                    }`}
                >
                    <div className='flex items-center justify-center gap-2'>
                        <User className='w-4 h-4' />
                        Customer
                    </div>
                </button>
                <button
                    type='button'
                    onClick={() => handleRoleChange('mechanic')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                        role === 'mechanic'
                            ? 'border-brand-500 text-brand-600'
                            : 'border-transparent text-steel-500 hover:text-steel-700'
                    }`}
                >
                    <div className='flex items-center justify-center gap-2'>
                        <Wrench className='w-4 h-4' />
                        Mechanic
                    </div>
                </button>
            </div>

            {/* Conditional Form Rendering */}
            {role === 'customer' ? (
                <CustomerRegistrationForm
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    isLoading={isLoading}
                    authError={authError}
                />
            ) : (
                <MechanicRegistrationForm
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    isLoading={isLoading}
                    authError={authError}
                />
            )}

            {/* Login Link */}
            <p className='text-center text-steel-600'>
                Already have an account?{' '}
                <Link href='/login' className='text-brand-600 hover:text-brand-700 font-medium'>
                    Sign in
                </Link>
            </p>
        </div>
    );
}