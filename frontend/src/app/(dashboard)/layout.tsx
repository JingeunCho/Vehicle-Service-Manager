"use client"

import React from 'react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    // 토큰 확인 중일 때는 흰 화면 렌더링 (깜빡임 방지)
    if (isAuthenticated === null) return <div className="h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

    // 인증되지 않았다면 로그인으로 리디렉트가 useAuth 내에서 발생하므로 null 렌더링
    if (!isAuthenticated) return null;

    return (
        <div className="flex h-screen w-full bg-gray-50">
            <Sidebar className="w-64 flex-none border-r bg-white" />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </div>
    )
}
