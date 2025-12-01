import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface FetchOptions extends RequestInit {
    requiresAuth?: boolean;
}

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function apiClient<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { requiresAuth = false, ...fetchOptions } = options;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    }

    if (requiresAuth || auth.currentUser) {
        const token = await auth.currentUser?.getIdToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        } else if (requiresAuth) {
            throw new ApiError(401, 'Authentication required');
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.message || 'An error occured')
    }
    return response.json();
}

// Convenience Methods
export const api = {
    get: <T>(endpoint: string, requiresAuth = false) =>
        apiClient<T>(endpoint, { method: 'GET', requiresAuth }),

    post: <T>(endpoint: string, data: unknown, requiresAuth = false) =>
        apiClient<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth,
        }),

    put: <T>(endpoint: string, data: unknown, requiresAuth = false) =>
        apiClient<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            requiresAuth,
        }),

    delete: <T>(endpoint: string, requiresAuth = false) =>
        apiClient<T>(endpoint, { method: 'DELETE', requiresAuth }),
}