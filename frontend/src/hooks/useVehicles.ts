import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Vehicle {
    id: number;
    name: string;
    carModel: string;
    licensePlate: string;
    fuelType: string;
    currentMileage: number;
    isPrimary: boolean;
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
            const { data } = await api.put(`/vehicles/\${vehicleId}/primary`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};
