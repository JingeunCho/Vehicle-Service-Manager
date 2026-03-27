import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface DashboardSummaryData {
    totalExpenseThisMonth: number;
    avgFuelPriceCurrentMonth: number;
    avgElectricityPriceCurrentMonth: number;
    recentAvgMileage: number;
    recentAvgEvEfficiency: number;
}

export interface DashboardSpendingData {
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
}

export interface DashboardHistoryData {
    recentMaintenance: {
        id: number;
        title: string;
        amount: number;
        recordDate: string;
        category: string;
        vehicleName: string;
        fuelType: string;
    }[];
    recentRefuel: {
        id: number;
        title: string;
        amount: number;
        recordDate: string;
        category: string;
        unitPrice?: number;
        volume?: number;
        vehicleName: string;
        fuelType: string;
    }[];
}

export interface DashboardEfficiencyData {
    mileageTrend: {
        name: string;
        efficiency: number;
    }[];
    evMileageTrend: {
        name: string;
        efficiency: number;
    }[];
}

const buildParams = (vehicleIds: number[]) => {
    const params = new URLSearchParams();
    vehicleIds.forEach(id => {
        if (id !== 0) params.append('vehicleIds', id.toString());
    });
    return params.toString();
};

export const useDashboardSummary = (vehicleIds: number[]) => {
    return useQuery<DashboardSummaryData>({
        queryKey: ['dashboard', 'summary', vehicleIds],
        queryFn: async () => {
            const { data } = await api.get(`/ledgers/dashboard/summaries?${buildParams(vehicleIds)}`);
            return data;
        },
    });
};

export const useDashboardSpending = (vehicleIds: number[]) => {
    return useQuery<DashboardSpendingData>({
        queryKey: ['dashboard', 'spending', vehicleIds],
        queryFn: async () => {
            const { data } = await api.get(`/ledgers/dashboard/spending-trend?${buildParams(vehicleIds)}`);
            return data;
        },
    });
};

export const useDashboardHistory = (vehicleIds: number[]) => {
    return useQuery<DashboardHistoryData>({
        queryKey: ['dashboard', 'history', vehicleIds],
        queryFn: async () => {
            const { data } = await api.get(`/ledgers/dashboard/recent-history?${buildParams(vehicleIds)}`);
            return data;
        },
    });
};

export const useDashboardEfficiency = (vehicleIds: number[]) => {
    return useQuery<DashboardEfficiencyData>({
        queryKey: ['dashboard', 'efficiency', vehicleIds],
        queryFn: async () => {
            const { data } = await api.get(`/ledgers/dashboard/efficiency-trend?${buildParams(vehicleIds)}`);
            return data;
        },
    });
};
