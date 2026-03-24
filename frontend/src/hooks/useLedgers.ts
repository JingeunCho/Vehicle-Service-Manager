import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Ledger {
    id: number;
    vehicleId: number;
    categoryName: string;
    categoryType: string;
    amount: number;
    recordDate: string;
    memo: string;
    mileageAtRecord: number;
}

export const useLedgers = (vehicleId: number | null) => {
    return useQuery<Ledger[]>({
        queryKey: ['ledgers', vehicleId],
        queryFn: async () => {
            const path = vehicleId ? `/ledgers/vehicles/\${vehicleId}` : '/ledgers';
            const { data } = await api.get(path);
            return data;
        },
        // vehicleId가 null이면 전체 목록을 가져올 수도 있고, 빈 배열을 반환할 수도 있습니다.
        // 현재 백엔드 API 명세에 따라 적절히 조절 필요. 
        // LedgerController에는 @GetMapping("/vehicles/{vehicleId}") 만 확인됨.
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
