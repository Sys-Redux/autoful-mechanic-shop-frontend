import type { UserRole } from './index';

export interface AuthUser {
    uid: string;
    email: string;
    displayName: string | null;
    role: UserRole;
    db_id: number;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

export interface RegisterCustomerData {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface RegisterMechanicData {
    name: string;
    email: string;
    password: string;
    phone: string;
    salary: number;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ProfileUpdateData {
    name?: string;
    phone?: string;
}

export interface LoginResponse {
    status: string;
    message: string;
    auth_token: string;
    mechanic_id?: number;
}

export interface CreateUserResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
}