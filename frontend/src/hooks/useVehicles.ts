import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface WheelSpecResponse {
    id: number;
    brand?: string;
    model?: string;
    diameter?: number;
    width?: number;
    offset?: number;
}

export interface TireSpecResponse {
    id: number;
    brand?: string;
    model?: string;
    width?: number;
    aspectRatio?: number;
    diameter?: number;
}

export interface VehicleSpecResponse {
    driveType?: 'FF' | 'FR' | 'MR' | 'RR' | 'AWD';
    frontWheel?: WheelSpecResponse;
    rearWheel?: WheelSpecResponse;
    frontTire?: TireSpecResponse;
    rearTire?: TireSpecResponse;
}

export interface LastMaintenanceInfo {
    date: string;
    mileageAtRecord?: number;
    notes?: string;
    cost?: number;
}

/**
 * MaintenanceType 키 목록:
 * ENGINE_OIL, TRANSMISSION_OIL, DIFFERENTIAL_OIL,
 * FRONT_BRAKE_PAD, REAR_BRAKE_PAD,
 * FRONT_BRAKE_ROTOR, REAR_BRAKE_ROTOR,
 * COOLANT, OTHER
 */
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

export interface Vehicle {
    id: number;
    name: string;
    carModel: string;
    licensePlate: string;
    fuelType: string;
    currentMileage: number;
    isPrimary: boolean;
    primary?: boolean; // 하위 호환성 유지
    tuningHistory?: string;
    insuranceDate?: string;
    spec?: VehicleSpecResponse;
    /** 소모품 종류별 마지막 정비 기록 (key: MaintenanceType) */
    lastMaintenance: Record<MaintenanceType, LastMaintenanceInfo>;
}

export const useVehicles = () => {
    return useQuery<Vehicle[]>({
        queryKey: ['vehicles'],
        queryFn: async () => {
            const { data } = await api.get('/vehicles');
            return data;
        },
    });
};

export const useSetPrimaryVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (vehicleId: number) => {
            const { data } = await api.put(`/vehicles/${vehicleId}/primary`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};

export const useCreateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (vehicleData: Partial<Vehicle>) => {
            const { data } = await api.post('/vehicles', vehicleData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};

export const useUpdateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...vehicleData }: Partial<Vehicle> & { id: number }) => {
            const { data } = await api.put(`/vehicles/${id}`, vehicleData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};

export const useDeleteVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/vehicles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};
