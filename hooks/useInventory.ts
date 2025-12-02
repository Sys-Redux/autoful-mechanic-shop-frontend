import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { InventoryPart } from '@/types/index';

export const inventoryKeys = {
    all: ['inventory'] as const,
    lists: () => [...inventoryKeys.all, 'list'] as const,
    list: (page?: number, perPage?: number) => [...inventoryKeys.lists(), { page, perPage }] as const,
    details: () => [...inventoryKeys.all, 'detail'] as const,
    detail: (id: number) => [...inventoryKeys.details(), id] as const,
    search: (query: string) => [...inventoryKeys.all, 'search', query] as const,
    lowStock: (threshold: number) => [...inventoryKeys.all, 'lowStock', threshold] as const,
};

export function useInventory(page?: number, perPage?: number) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (perPage) params.set('per_page', String(perPage));
    const query = params.toString();
    return useQuery({
        queryKey: inventoryKeys.list(page, perPage),
        queryFn: () => api.get<InventoryPart[]>(`/inventory?${query ? `${query}` : ''}`),
    });
}

export function useInventoryPart(id: number) {
    return useQuery({
        queryKey: inventoryKeys.detail(id),
        queryFn: () => api.get<InventoryPart>(`/inventory/${id}`),
        enabled: !!id,
    });
}

export function useSearchInventory(partName: string) {
    return useQuery({
        queryKey: inventoryKeys.search(partName),
        queryFn: () => api.get<InventoryPart[]>(
            `/inventory/search?part_name=${encodeURIComponent(partName)}`,
            true
        ),
        enabled: partName.length >= 3,
    });
}

interface LowStockResponse {
    threshold: number;
    count: number;
    parts: InventoryPart[];
}

export function useLowStockInventory(threshold: number) {
    return useQuery({
        queryKey: inventoryKeys.lowStock(threshold),
        queryFn: () => api.get<LowStockResponse>(
            `/inventory/low-stock?threshold=${threshold}`,
            true
        ),
    });
}

interface CreatePartData {
    part_name: string;
    price: number;
    quantity_in_stock: number;
}

export function useCreatePart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePartData) =>
            api.post<InventoryPart>('/inventory', data, true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
        },
    });
}

export function useUpdatePart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreatePartData> }) =>
            api.put<InventoryPart>(`/inventory/${id}`, data, true),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
        },
    });
}

export function useDeletePart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            api.delete(`/inventory/${id}`, true),
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: inventoryKeys.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
        },
    });
}