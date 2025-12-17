'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '@/lib/store/store';
import { initializeAuthListener, setUser, setInitialized } from '@/lib/store/authSlice';
import { setAuthTokenGetter } from '@/lib/api';
import type { AuthUser } from '@/types/auth';

const USER_STORAGE_KEY = 'autoful_user';

const getStoredUser = (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const persistUser = (user: AuthUser | null) => {
    if (typeof window === 'undefined') return;
    try {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    } catch {
        // Ignore write errors
    }
};

// Create store outside component to avoid ref issues with React 19
let store: AppStore | undefined;

function getStore() {
    if (!store) {
        store = makeStore();

        // Set up auth token getter for API calls
        setAuthTokenGetter(() => {
            const state = store?.getState();
            return state?.auth.user?.authToken ?? null;
        });
    }
    return store;
}

export default function StoreProvider({ children }: { children: ReactNode }) {
    // Get or create the store (singleton pattern)
    const storeInstance = getStore();

    // Track if we've set up listeners and hydrated
    const initialized = useRef(false);
    const hydrated = useRef(false);

    // Hydrate from localStorage AFTER first render to avoid SSR mismatch
    useEffect(() => {
        if (!hydrated.current) {
            hydrated.current = true;
            const storedUser = getStoredUser();
            if (storedUser) {
                storeInstance.dispatch(setUser(storedUser));
            } else {
                storeInstance.dispatch(setInitialized());
            }
        }
    }, [storeInstance]);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const unsubscribeAuth = initializeAuthListener(
            storeInstance.dispatch,
            getStoredUser
        );

        const unsubscribeStore = storeInstance.subscribe(() => {
            const state = storeInstance.getState();
            persistUser(state.auth.user);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeStore();
        };
    }, [storeInstance]);

    return (
        <Provider store={storeInstance}>
            {children}
        </Provider>
    );
}