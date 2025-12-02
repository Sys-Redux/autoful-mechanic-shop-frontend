import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Customer, CustomerWithTickets, ServiceTicketBasic } from '@/types/index';
import { useAppSelector } from '@/lib/store/hooks';
import { selectUserDbId, selectIsCustomer } from '@/lib/store/authSlice';

export const customerKeys = {
    all: ['customers'] as const,
    lists: () => [...customerKeys.all, 'list'] as const,
    list: (page?: number, perPage?: number) => [...customerKeys.lists(), { page, perPage }] as const,
    details: () => [...customerKeys.all, 'detail'] as const,
    detail: (id: number) => [...customerKeys.details(), id] as const,
    top: () => [...customerKeys.all, 'top'] as const,
    myTickets: () => [...customerKeys.all, 'myTickets'] as const,
};

export function useCustomers(page?: number, perPage?: number) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (perPage) params.set('per_page', String(perPage));
    const query = params.toString();
    return useQuery({
        queryKey: customerKeys.list(page, perPage),
        queryFn: () => api.get<Customer[]>(`/customers?${query ? `${query}` : ''}`),
    });
}

export function useCustomer(id: number) {
    return useQuery({
        queryKey: customerKeys.detail(id),
        queryFn: () => api.get<CustomerWithTickets>(`/customers/${id}`),
        enabled: !!id,
    });
}

export function useTopCustomers() {
    return useQuery({
        queryKey: customerKeys.top(),
        queryFn: () => api.get<Customer[]>('/customers/top'),
    });
}

export function useMyTickets() {
    const isCustomer = useAppSelector(selectIsCustomer);
    return useQuery({
        queryKey: customerKeys.myTickets(),
        queryFn: () => api.get<ServiceTicketBasic[]>('/customers/my-tickets', true),
        enabled: isCustomer,
    });
}

interface UpdateCustomerData {
    name?: string;
    phone?: string;
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient();
    const dbId = useAppSelector(selectUserDbId);
    return useMutation({
        mutationFn: (data: UpdateCustomerData) =>
            api.put<Customer>(`/customers/$dbId}`, data, true),
        onSuccess: () => {
            if (dbId) {
                queryClient.invalidateQueries({ queryKey: customerKeys.detail(dbId) });
            }
        },
    });
}

export function useDeleteCustomer() {
    const dbId = useAppSelector(selectUserDbId);
    return useMutation({
        mutationFn: () => api.delete(`/customers/${dbId}`, true),
    });
}
