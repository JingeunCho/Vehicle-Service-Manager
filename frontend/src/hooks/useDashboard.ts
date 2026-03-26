import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface DashboardData {
    totalExpenseThisMonth: number;
    avgFuelPriceCurrentMonth: number;
    recentAvgMileage: number;
    monthlyTrend: {
        month: string;
        details: {
            carModel: string;
            amount: number;
        }[];
    }[];
    categoryDonut: {
        name: string;
        value: number;
    }[];
    mileageTrend: {
        name: string;
        efficiency: number;
    }[];
}

export const useDashboard = (vehicleId: number | null) => {
    return useQuery<DashboardData>({
        queryKey: ['dashboard', vehicleId],
        queryFn: async () => {
            if (vehicleId === null) throw new Error('No vehicle selected');
            const { data } = await api.get(`/ledgers/vehicles/${vehicleId}/dashboard`);
            return data;
        },
        enabled: vehicleId !== null, // 0(전체 차량)도 유효한 값으로 처리
    });
};
