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

export type LedgerCategory = 'REFUEL' | 'MAINTENANCE' | 'WASH' | 'FIXED_COST' | 'ETC';

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

export const useLedgers = (vehicleId: number | null) => {
    return useQuery<Ledger[]>({
        queryKey: ['ledgers', vehicleId],
        queryFn: async () => {
            if (!vehicleId) return [];
            const { data } = await api.get(`/ledgers/vehicles/${vehicleId}`);
            return data;
        },
        enabled: !!vehicleId,
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
        },
    });
};
