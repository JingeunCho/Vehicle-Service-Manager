"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useVehicleContext } from '@/context/VehicleContext'

export default function Sidebar({ className = "" }: { className?: string }) {
    const { userEmail, logout } = useAuth()
    const { vehicles, selectedVehicleId, setSelectedVehicleId, isLoading } = useVehicleContext()
    const pathname = usePathname()

    return (
        <aside className={`${className} flex flex-col p-4`}>
            <div className="mb-10 mt-2 px-1">
                <h2 className="text-xl font-black text-blue-600 tracking-tight flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg text-lg italic">C</span>
                    Car Ledger
                </h2>
            </div>

            <div className="mb-8">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1 opacity-70">Main Menu</h3>
                <ul className="space-y-1.5">
                    <li>
                        <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}>
                            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            대시보드
                        </Link>
                    </li>
                    <li>
                        <Link href="/vehicles" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/vehicles'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}>
                            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            차량 관리
                        </Link>
                    </li>
                    <li>
                        <Link href="/ledgers" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/ledgers'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}>
                            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            차계부 지출 조회
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700 px-1 border-b border-gray-100 pb-3 mb-2">
                    반갑습니다,<br /><span className="text-blue-600 font-bold block mt-1 truncate">{userEmail || '사용자'}</span>님!
                </div>
                <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                    설정 및 텔레그램 연동
                </button>
                <button
                    onClick={logout}
                    className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                >
                    안전하게 로그아웃
                </button>
            </div>
        </aside>
    )
}