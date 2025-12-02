import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ServiceTicket, ServiceTicketBasic } from '@/types/index';

// Query Keys Factory
export const ticketKeys = {
    all: ['serviceTickets'] as const,
    lists: () => [...ticketKeys.all, 'list'] as const,
    list: (page: number, perPage: number) => [...ticketKeys.lists(), { page, perPage }] as const,
    details: () => [...ticketKeys.all, 'detail'] as const,
    detail: (id: number) => [...ticketKeys.details(), id] as const,
};

// Get Paginated List of Service Tickets
export function useServiceTickets(page = 1, perPage = 10) {
    return useQuery({
        queryKey: ticketKeys.list(page, perPage),
        queryFn: () => api.get<ServiceTicketBasic[]>(
            `/service_tickets?page=${page}&per_page=${perPage}`
        ),
    });
}

// Get Single Ticket With Full Details
export function useServiceTicket(id: number) {
    return useQuery({
        queryKey: ticketKeys.detail(id),
        queryFn: () => api.get<ServiceTicket>(`/service_tickets/${id}`),
        enabled: !!id,
    });
}

interface CreateTicketData {
    VIN: string;
    service_date: string;
    service_desc: string;
    customer_id: number;
}

export function useCreateServiceTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTicketData) =>
            api.post<ServiceTicket>('/service_tickets', data, true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
        },
    });
}

export function useDeleteServiceTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            api.delete(`/service_tickets/${id}`, true),
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: ticketKeys.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
        },
    });
}

export function useAssignMechanic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, mechanicId }: { ticketId: number; mechanicId: number }) =>
            api.put(`/service_tickets/${ticketId}/assign-mechanic/${mechanicId}`, {}, true),
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
        },
    });
}

export function useRemoveMechanic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, mechanicId }: { ticketId: number; mechanicId: number }) =>
            api.put(`/service_tickets/${ticketId}/remove-mechanic/${mechanicId}`, {}, true),
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
        },
    });
}

export function useEditMechanics() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, addIds, removeIds }: {
            ticketId: number;
            addIds: number[];
            removeIds: number[];
        }) => api.put(`/service_tickets/${ticketId}/edit-mechanics`, {
            add_ids: addIds,
            remove_ids: removeIds,
        }, true),
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
        },
    });
}

export function useAddInventoryToTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, inventoryId, quantity }: {
            ticketId: number;
            inventoryId: number;
            quantity: number;
        }) => api.post(`/service_tickets/${ticketId}/add-inventory`, {
            inventory_id: inventoryId,
            quantity_used: quantity,
        }, true),
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });
}

export function useRemoveInventoryFromTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, serviceInventoryId }: {
            ticketId: number;
            serviceInventoryId: number;
        }) => api.put(
            `/service_tickets/${ticketId}/remove-inventory/${serviceInventoryId}`,
            {},
            true
        ),
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });
}