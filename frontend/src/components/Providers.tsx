"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { VehicleProvider } from '@/context/VehicleContext'

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, // 창 포커스 시 자동 새로고침 방지
                retry: 1,                    // 실패 시 1회만 재시도
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <VehicleProvider>
                {children}
            </VehicleProvider>
        </QueryClientProvider>
    )
}
