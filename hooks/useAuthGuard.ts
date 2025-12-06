'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
    selectUser,
    selectIsCustomer,
    selectIsMechanic,
    selectAuthInitialized,
    selectAuthLoading,
    logout,
} from '@/lib/store/authSlice';
import type { UserRole } from '@/types';

interface AuthGuardResult {
    isLoading: boolean;
    isAuthorized: boolean;
    user: ReturnType<typeof selectUser>;
}

export function useAuthGuard(requiredRole: UserRole): AuthGuardResult {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const isCustomer = useAppSelector(selectIsCustomer);
    const isMechanic = useAppSelector(selectIsMechanic);
    const initialized = useAppSelector(selectAuthInitialized);
    const loading = useAppSelector(selectAuthLoading);

    const isLoading = !initialized || loading;

    const hasRequiredRole =
        (requiredRole === 'customer' && isCustomer) ||
        (requiredRole === 'mechanic' && isMechanic);

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            // Not logged in
            router.push('/login');
            return;
        }

        if (hasRequiredRole) {
            // User has correct role - do nothing
            return;
        }

        // User is logged in but has wrong role
        if (isCustomer) {
            toast.info('Redirecting to your customer dashboard');
            router.push('/customer-dashboard');
        } else if (isMechanic) {
            toast.info('Redirecting to your mechanic dashboard');
            router.push('/mechanic-dashboard');
        } else {
            // Invalid/unknown role - logout for safety
            console.error('Invalid user role detected:', user.role);
            dispatch(logout());
            toast.error('Session invalid. Please log in again.');
            router.push('/login');
        }
    }, [isLoading, user, hasRequiredRole, isCustomer, isMechanic, router, dispatch]);

    return {
        isLoading,
        isAuthorized: !isLoading && !!user && hasRequiredRole,
        user,
    };
}