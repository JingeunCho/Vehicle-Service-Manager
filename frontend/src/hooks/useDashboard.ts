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
            const { data } = await api.get(`/ledgers/vehicles/\${vehicleId}/dashboard`);
            return data;
        },
        enabled: !!vehicleId, // vehicleId가 있을 때만 쿼리 실행
    });
};
