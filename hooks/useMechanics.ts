import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Mechanic, MechanicWithTickets } from '@/types/index';
import { useAppSelector } from '@/lib/store/hooks';
import { selectUserDbId, selectIsMechanic } from '@/lib/store/authSlice';

export const mechanicKeys = {
    all: ['mechanics'] as const,
    lists: () => [...mechanicKeys.all, 'list'] as const,
    list: (page?: number, perPage?: number) => [...mechanicKeys.lists(), { page, perPage }] as const,
    details: () => [...mechanicKeys.all, 'detail'] as const,
    detail: (id: number) => [...mechanicKeys.details(), id] as const,
    top: () => [...mechanicKeys.all, 'top'] as const,
};

export function useMechanics(page?: number, perPage?: number) {
    const isMechanic = useAppSelector(selectIsMechanic);
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (perPage) params.set('per_page', String(perPage));
    const query = params.toString();
    return useQuery({
        queryKey: mechanicKeys.list(page, perPage),
        queryFn: () => api.get<Mechanic[]>(`/mechanics?${query ? `${query}` : ''}`, isMechanic),
        enabled: isMechanic,
    });
}

export function useMechanic(id: number) {
    const isMechanic = useAppSelector(selectIsMechanic);
    return useQuery({
        queryKey: mechanicKeys.detail(id),
        queryFn: () => api.get<MechanicWithTickets>(`/mechanics/${id}`, true),
        enabled: isMechanic && !!id,
    });
}

export function useTopMechanics() {
    return useQuery({
        queryKey: mechanicKeys.top(),
        queryFn: () => api.get<Mechanic[]>('/mechanics/top'),
    });
}

interface UpdateMechanicData {
    name?: string;
    phone?: string;
    salary?: number;
}

export function useUpdateMechanic() {
    const queryClient = useQueryClient();
    const dbId = useAppSelector(selectUserDbId);
    return useMutation({
        mutationFn: (data: UpdateMechanicData) =>
            api.put<Mechanic>(`/mechanics/${dbId}`, data, true),
        onSuccess: () => {
            if (dbId) {
                queryClient.invalidateQueries({ queryKey: mechanicKeys.detail(dbId) });
            }
        },
    });
}

export function useDeleteMechanic() {
    const dbId = useAppSelector(selectUserDbId);
    return useMutation({
        mutationFn: () => api.delete(`/mechanics/${dbId}`, true),
    });
}