"use client"

import { useState } from 'react'

const vehicles = [
    { id: 1, name: "트랙용 GT86" },
    { id: 2, name: "데일리 XM3" }
]

export default function Sidebar({ className = "" }: { className?: string }) {
    const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0].id)

    return (
        <aside className={`${className} flex flex-col p-4`}>
            <div className="mb-8">
                <h2 className="text-xl font-black text-blue-600 tracking-tight">Car Ledger</h2>
            </div>

            <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">내 차량</h3>
                <ul className="space-y-2">
                    {vehicles.map(v => (
                        <li key={v.id}>
                            <button
                                onClick={() => setSelectedVehicle(v.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${selectedVehicle === v.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {v.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-auto">
                <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                    설정 및 텔레그램 연동
                </button>
            </div>
        </aside>
    )
}
