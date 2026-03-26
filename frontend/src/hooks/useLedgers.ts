import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export type MaintenanceType =
    | 'ENGINE_OIL'
    | 'TRANSMISSION_OIL'
    | 'DIFFERENTIAL_OIL'
    | 'FRONT_BRAKE_PAD'
    | 'REAR_BRAKE_PAD'
    | 'FRONT_BRAKE_ROTOR'
    | 'REAR_BRAKE_ROTOR'
    | 'COOLANT'
    | 'OTHER';

export type LedgerCategory = 'REFUEL' | 'MAINTENANCE' | 'CAR_SUPPLIES' | 'FIXED_COST' | 'ETC';

export interface Ledger {
    id: number;
    vehicleId: number;
    /** 세부 지출 내용 */
    title: string;
    /** 카테고리 (Enum) */
    category: LedgerCategory;
    amount: number;
    recordDate: string;
    memo: string;
    mileageAtRecord: number;
    maintenanceType?: MaintenanceType;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // 현재 페이지 번호 (0-based)
}

export const useLedgers = (vehicleId: number | null, page: number = 0, size: number = 10) => {
    return useQuery<PageResponse<Ledger>>({
        queryKey: ['ledgers', vehicleId, page, size],
        queryFn: async () => {
            if (vehicleId === null) return { content: [], totalPages: 0, totalElements: 0, size, number: 0 };
            const { data } = await api.get(`/ledgers/vehicles/${vehicleId}?page=${page}&size=${size}`);
            return data;
        },
        enabled: vehicleId !== null,
    });
};

export const useCreateLedger = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newLedger: any) => {
            const { data } = await api.post('/ledgers', newLedger);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ledgers'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};

export const useUpdateLedger = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updateData }: any) => {
            const { data } = await api.put(`/ledgers/${id}`, updateData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ledgers'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};

export const useDeleteLedger = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/ledgers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ledgers'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};
