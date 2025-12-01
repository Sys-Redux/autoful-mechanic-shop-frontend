import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';
import * as authService from '@/lib/services/authService';
import type {
    AuthState,
    AuthUser,
    LoginData,
    RegisterCustomerData,
    RegisterMechanicData,
    ProfileUpdateData,
} from '@/types/auth';
import type { RootState, AppDispatch } from './store';

// Reduc State Management for Authentication
// Handles:
//   - User State
//   - Loading states for async operations
//   - Error handling
//   - Auth state initialization

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    initialized: false,
};

export const registerCustomer = createAsyncThunk<AuthUser, RegisterCustomerData>(
    'auth/registerCustomer',
    async (data, { rejectWithValue }) => {
        try {
            return await authService.registerCustomer(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            return rejectWithValue(message);
        }
    }
);

export const registerMechanic = createAsyncThunk<AuthUser, RegisterMechanicData>(
    'auth/registerMechanic',
    async (data, { rejectWithValue }) => {
        try {
            return await authService.registerMechanic(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            return rejectWithValue(message);
        }
    }
);

export const loginCustomer = createAsyncThunk<AuthUser, LoginData>(
    'auth/loginCustomer',
    async (data, { rejectWithValue }) => {
        try {
            return await authService.loginCustomer(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Login failed';
            return rejectWithValue(message);
        }
    }
);

export const loginMechanic = createAsyncThunk<AuthUser, LoginData>(
    'auth/loginMechanic',
    async (data, { rejectWithValue }) => {
        try {
            return await authService.loginMechanic(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Login failed';
            return rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk<void, void>(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logoutUser();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Logout failed';
            return rejectWithValue(message);
        }
    }
);

export const updateProfile = createAsyncThunk<AuthUser, ProfileUpdateData>(
    'auth/updateProfile',
    async (data, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const currentUser = state.auth.user;

            if (!currentUser || !auth.currentUser) {
                throw new Error('No authenticated user');
            }

            const endpoint = currentUser.role === 'customer'
                ? `/customers/${currentUser.db_id}`
                : `/mechanics/${currentUser.db_id}`;

            await api.put(endpoint, data, true);

            return await authService.refreshUserData(
                auth.currentUser,
                currentUser.role,
                currentUser.db_id
            );
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Profile update failed';
            return rejectWithValue(message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthUser | null>) => {
            state.user = action.payload;
            state.initialized = true;
            state.loading = false;
            state.error = null;
        },

        setInitialized: (state) => {
            state.initialized = true;
            state.loading = false;
        },

        clearError: (state) => {
            state.error = null;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerCustomer.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.initialized = true;
            })
            .addCase(registerCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(registerMechanic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerMechanic.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.initialized = true;
            })
            .addCase(registerMechanic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(loginCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginCustomer.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(loginCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(loginMechanic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginMechanic.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(loginMechanic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setUser, setInitialized, clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.user !== null;
export const selectIsCustomer = (state: RootState) => state.auth.user?.role === 'customer';
export const selectIsMechanic = (state: RootState) => state.auth.user?.role === 'mechanic';
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthInitialized = (state: RootState) => state.auth.initialized;
export const selectUserDbId = (state: RootState) => state.auth.user?.db_id;

// Init Auth State Listener Once When App Starts
// Firebase Auth Does Not Include Role or Db_Id,
// So We Need To Persist That Separately
export const initializeAuthListener = (
    dispatch: AppDispatch,
    getStoredUser: () => AuthUser | null
): (() => void) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const storedUser = getStoredUser();

            if (storedUser && storedUser.uid === firebaseUser.uid) {
                dispatch(setUser(storedUser));
            } else {
                dispatch(setInitialized());
            }
        } else {
            dispatch(setUser(null));
        }
    });
    return unsubscribe;
}