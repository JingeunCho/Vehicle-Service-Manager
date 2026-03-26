"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useVehicles, Vehicle } from '@/hooks/useVehicles';

interface VehicleContextType {
    selectedVehicleId: number | null; // 0 is 'ALL'
    setSelectedVehicleId: (id: number) => void;
    vehicles: Vehicle[] | undefined;
    isLoading: boolean;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider = ({ children }: { children: ReactNode }) => {
    const { data: vehicles, isLoading } = useVehicles();
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

    useEffect(() => {
        // 초기 로드 시 차량이 있고 아직 선택된 차량이 없다면 대표 차량 선택
        if (vehicles && vehicles.length > 0 && selectedVehicleId === null) {
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
