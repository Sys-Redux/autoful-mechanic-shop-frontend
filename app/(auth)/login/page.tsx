'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wrench, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loginCustomer, loginMechanic, selectAuthLoading, selectAuthError, clearError } from '@/lib/store/authSlice';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectAuthLoading);
    const authError = useAppSelector(selectAuthError);

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            role: 'customer',
        },
    });

    const selectedRole = useWatch({ control, name: 'role' });

    const onSubmit = async (data: LoginFormData) => {
        dispatch(clearError());

        try {
            if (data.role === 'customer') {
                await dispatch(loginCustomer({ email: data.email, password: data.password })).unwrap();
                toast.success('Welcome back!');
                router.push('/customer-dashboard');
            } else {
                await dispatch(loginMechanic({ email: data.email, password: data.password })).unwrap();
                toast.success('Welcome back!');
                router.push('/mechanic-dashboard');
            }
        } catch {
            toast.error(authError || 'Login failed. Please try again.');
        }
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
                    Welcome back
                </h2>
                <p className='text-steel-600 mt-2'>
                    Sign in to continue
                </p>
            </div>

            {/* Role Selector */}
            <div className='grid grid-cols-2 gap-4'>
                <label className='relative cursor-pointer'>
                    <input
                        type='radio'
                        value='customer'
                        {...register('role')}
                        className='peer sr-only'
                    />
                    <div className='p-4 rounded-lg border-2 border-steel-200 peer-checked:border-brand-500
                        peer-checked:bg-brand-50 transition-all'>
                        <div className='flex flex-col items-center gap-2'>
                            <User className={`w-6 h-6 ${selectedRole === 'customer'
                                ? 'text-brand-600'
                                : 'text-steel-400'
                            }`} />
                            <span className={`font-medium ${selectedRole === 'customer'
                                ? 'text-brand-600'
                                : 'text-steel-600'
                            }`}>
                                Customer
                            </span>
                        </div>
                    </div>
                </label>
                <label className='relative cursor-pointer'>
                    <input
                        type='radio'
                        value='mechanic'
                        {...register('role')}
                        className='peer sr-only'
                    />
                    <div className='p-4 rounded-lg border-2 border-steel-200 peer-checked:border-brand-500
                        peer-checked:bg-brand-50 transition-all'>
                        <div className='flex flex-col items-center gap-2'>
                            <Wrench className={`w-6 h-6 ${selectedRole === 'mechanic'
                                ? 'text-brand-600'
                                : 'text-steel-400'
                            }`} />
                            <span className={`font-medium ${selectedRole === 'mechanic'
                                ? 'text-brand-600'
                                : 'text-steel-600'
                            }`}>
                                Mechanic
                            </span>
                        </div>
                    </div>
                </label>
            </div>
            {errors.role && (
                <p className='text-red-500 text-sm'>{errors.role.message}</p>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className-='space-y-5'>
                {/* Email Field */}
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
                {/* Password Field */}
                <div className='space-y-2'>
                    <label htmlFor='password' className='block text-sm font-medium text-steel-700'>
                        Password
                    </label>
                    <div className='relative'>
                        <input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            autoComplete='current-password'
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
                {/* Auth Error */}
                {authError && (
                    <div className='p-3 rounded-lg bg-red-50 border border-red-200'>
                        <p className='text-red-600 text-sm'>{authError}</p>
                    </div>
                )}
                {/* Submit */}
                <button
                    type='submit'
                    disabled={isLoading}
                    className='btn-primary w-full flex items-center justify-center gap-2'
                >
                    {isLoading ? (
                        <>
                            <Loader2 className='w-5 h-5 animate-spin' />
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            {/* Register Link */}
            <p className='text-center text-steel-600'>
                Don&apos;t have an account?{' '}
                <Link href='/register' className='text-brand-600 hover:text-brand-700 font-medium'>
                    Create one
                </Link>
            </p>
        </div>
    );
}