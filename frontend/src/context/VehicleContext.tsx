"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useVehicles, Vehicle } from '@/hooks/useVehicles';

interface VehicleContextType {
    selectedVehicleId: number | null;
    setSelectedVehicleId: (id: number) => void;
    vehicles: Vehicle[] | undefined;
    isLoading: boolean;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider = ({ children }: { children: ReactNode }) => {
    const { data: vehicles, isLoading } = useVehicles();
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

    useEffect(() => {
        if (vehicles && vehicles.length > 0 && selectedVehicleId === null) {
            // 기본적으로 대표 차량(isPrimary)을 선택하거나 첫 번째 차량 선택
            const primary = vehicles.find(v => v.isPrimary) || vehicles[0];
            setSelectedVehicleId(primary.id);
        }
    }, [vehicles, selectedVehicleId]);

    return (
        <VehicleContext.Provider value={{ selectedVehicleId, setSelectedVehicleId, vehicles, isLoading }}>
            {children}
        </VehicleContext.Provider>
    );
};

export const useVehicleContext = () => {
    const context = useContext(VehicleContext);
    if (context === undefined) {
        throw new Error('useVehicleContext must be used within a VehicleProvider');
    }
    return context;
};
