"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import {
    formatToLocalDate,
    formatToLocalDateTime,
    formatToDateTimeShort
} from '@/lib/dateUtils'
import { useLedgerMetadata } from '@/hooks/useLedgers'
import {
    useDashboardSummary,
    useDashboardSpending,
    useDashboardHistory,
    useDashboardEfficiency
} from '@/hooks/useDashboard'
import { useVehicleContext } from '@/context/VehicleContext'
import { ChevronDown, Check } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Dashboard() {
    const { selectedVehicleId, vehicles } = useVehicleContext()
    const [dashboardVehicleIds, setDashboardVehicleIds] = useState<number[]>([])
    const [isSelectorOpen, setIsSelectorOpen] = useState(false)
    const { data: ledgerMetadata } = useLedgerMetadata()

    const getFuelTypeName = (code: string) =>
        ledgerMetadata?.fuelTypes?.find((f: any) => f.code === code)?.categoryName || code

    // 초기 로딩 시 Context의 선택된 차량을 기본값으로 설정 (한 번만 수행)
    useEffect(() => {
        if (selectedVehicleId && dashboardVehicleIds.length === 0) {
            setDashboardVehicleIds([selectedVehicleId])
        }
    }, [selectedVehicleId, dashboardVehicleIds.length])

    const { data: summary, isLoading: isSummaryLoading, error: summaryError } = useDashboardSummary(dashboardVehicleIds)
    const { data: spending, isLoading: isSpendingLoading, error: spendingError } = useDashboardSpending(dashboardVehicleIds)
    const { data: history, isLoading: isHistoryLoading, error: historyError } = useDashboardHistory(dashboardVehicleIds)
    const { data: efficiency, isLoading: isEfficiencyLoading, error: efficiencyError } = useDashboardEfficiency(dashboardVehicleIds)

    const toggleVehicle = (id: number) => {
        setDashboardVehicleIds((prev: number[]) =>
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
        )
    }

    const selectedVehicleNames = (!vehicles || dashboardVehicleIds.length === 0)
        ? '전체 차량'
        : vehicles
            .filter(v => dashboardVehicleIds.includes(v.id))
            .map(v => v.name || v.carModel)
            .join(', ')

    const isLoading = isSummaryLoading || isSpendingLoading || isHistoryLoading || isEfficiencyLoading
    const isError = summaryError || spendingError || historyError || efficiencyError

    if (isLoading) return <div className="p-8 flex items-center justify-center h-full text-gray-500 font-medium text-lg min-h-[400px]">대시보드 데이터를 영역별로 분석 중입니다...</div>
    if (isError || !summary || !spending || !history || !efficiency) return (
        <div className="p-8 flex items-center justify-center h-full text-red-500 font-medium text-lg min-h-[400px]">
            데이터 연동 실패! 백엔드 서버가 켜져있는지 확인해주거나, 해당 차량의 데이터가 있는지 확인해주세요.
        </div>
    )

    // 백엔드 중첩 DTO 응답을 Recharts용 데이터(Flattened)로 변환
    const rechartsMonthlyData = spending.monthlyTrend.map(trend => {
        const dataPoint: any = { month: trend.month }
        trend.details.forEach(detail => {
            dataPoint[detail.carModel] = detail.amount
        })
        return dataPoint
    })

    const uniqueCars = Array.from(new Set(
        spending.monthlyTrend.flatMap(trend => trend.details.map(d => d.carModel))
    ))

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">내 차계부 대시보드 (Live Data)</h2>

                <div className="relative">
                    <button
                        onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                        className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:border-blue-400 transition-all text-sm font-semibold text-gray-700"
                    >
                        <span className="text-blue-600">차량 선택:</span>
                        <span className="truncate max-w-[200px]">{selectedVehicleNames}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isSelectorOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in duration-200">
                            <div className="p-2 border-b border-gray-50 mb-1 flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider px-3">
                                <span>차량 목록</span>
                                <button onClick={() => setDashboardVehicleIds([])} className="hover:text-blue-600">모두 해제</button>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {vehicles?.map(vehicle => (
                                    <button
                                        key={vehicle.id}
                                        onClick={() => toggleVehicle(vehicle.id)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 rounded-lg transition-colors group"
                                    >
                                        <div className="flex flex-col items-start px-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-bold text-gray-800">{vehicle.name || vehicle.carModel}</span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter ${vehicle.fuelType === 'EV'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : vehicle.fuelType === 'HYBRID'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {getFuelTypeName(vehicle.fuelType)}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-400">{vehicle.licensePlate}</span>
                                        </div>
                                        {dashboardVehicleIds.includes(vehicle.id) && (
                                            <Check className="w-4 h-4 text-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="p-2 mt-1 border-t border-gray-50">
                                <button
                                    onClick={() => setIsSelectorOpen(false)}
                                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500 mb-1">당월 실 지출액</p>
                    <h3 className="text-3xl font-bold text-gray-900">₩ {summary.totalExpenseThisMonth.toLocaleString()}</h3>
                </div>

                {vehicles?.some(v => dashboardVehicleIds.includes(v.id) && v.fuelType !== 'EV') && (
                    <>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                            <p className="text-sm font-medium text-gray-500 mb-1">평균 주유 단가</p>
                            <h3 className="text-3xl font-bold text-gray-900">₩ {summary.avgFuelPriceCurrentMonth.toLocaleString()} <span className="text-lg text-gray-500 font-normal">/ L</span></h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                            <p className="text-sm font-medium text-gray-500 mb-1">최근 평균 연비</p>
                            <h3 className="text-3xl font-bold text-gray-900">{summary.recentAvgMileage} <span className="text-lg text-gray-500 font-normal">km/L</span></h3>
                        </div>
                    </>
                )}

                {vehicles?.some(v => dashboardVehicleIds.includes(v.id) && v.fuelType === 'EV') && (
                    <>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                            <p className="text-sm font-medium text-gray-500 mb-1">평균 충전 단가</p>
                            <h3 className="text-3xl font-bold text-gray-900">₩ {summary.avgElectricityPriceCurrentMonth.toLocaleString()} <span className="text-lg text-gray-500 font-normal">/ kWh</span></h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                            <p className="text-sm font-medium text-gray-500 mb-1">최근 평균 전비</p>
                            <h3 className="text-3xl font-bold text-gray-900">{summary.recentAvgEvEfficiency} <span className="text-lg text-gray-500 font-normal">km/kWh</span></h3>
                        </div>
                    </>
                )}
            </div>

            {/* Main Row: 3 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1st Column: Chart 1 - Monthly Trend */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h4 className="text-lg font-semibold text-gray-800 mb-6">월별 지출 추이</h4>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={rechartsMonthlyData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={true} tickLine={true} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={true}
                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                    tickFormatter={(val) => val >= 10000 ? `${(val / 10000).toLocaleString()}만원` : `${val.toLocaleString()}만원`}
                                    width={30}
                                />
                                <Tooltip
                                    formatter={(value: number) => `${value.toLocaleString()}원`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                {uniqueCars.map((carName, index) => (
                                    <Line
                                        key={carName}
                                        type="monotone"
                                        dataKey={carName}
                                        name={carName}
                                        stroke={COLORS[index % COLORS.length]}
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: COLORS[index % COLORS.length], strokeWidth: 0 }}
                                        activeDot={{ r: 6 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2nd Column: Chart 2 - Category Donut */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h4 className="text-lg font-semibold text-gray-800 mb-6">카테고리별 지출 비율 (당월)</h4>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={spending.categoryDonut}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {spending.categoryDonut.map((entry: { name: string, value: number }, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => `${value.toLocaleString()}원`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3rd Column: Integrated History Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition h-full">
                    {/* Top Section: Recent Maintenance */}
                    <div className="p-5 flex-1 border-b border-gray-50 overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-gray-800">최근 정비 내역</h4>
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">TOP 4</span>
                        </div>
                        <div className="space-y-2.5">
                            {history.recentMaintenance.length > 0 ? (
                                history.recentMaintenance.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between group">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">{item.title}</span>
                                                <span className="text-[10px] text-blue-500 font-medium whitespace-nowrap">[{item.vehicleName}]</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400">{new Date(item.recordDate).toLocaleDateString()}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition">₩ {item.amount.toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[11px] text-gray-400 py-4 text-center">정비 내역이 없습니다.</p>
                            )}
                        </div>
                    </div>

                    {/* Bottom Section: Recent Refuel */}
                    <div className="p-5 flex-1 bg-gray-50/30 overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-gray-800">최근 주유/충전 내역</h4>
                            <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold">TOP 4</span>
                        </div>
                        <div className="space-y-2.5">
                            {history.recentRefuel.length > 0 ? (
                                history.recentRefuel.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between group">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">{item.title}</span>
                                                <span className="text-[10px] text-orange-500 font-medium whitespace-nowrap">[{item.vehicleName}]</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[10px] text-gray-400">{formatToDateTimeShort(item.recordDate)}</span>
                                                {item.volume && (
                                                    <span className="text-[9px] text-orange-500 font-medium">
                                                        ({item.volume.toFixed(1)}{getFuelTypeName(item.fuelType) === '전기' ? 'kWh' : 'L'})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition">₩ {item.amount.toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[11px] text-gray-400 py-4 text-center">주유/충전 내역이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Row: Efficiency Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 3: Mileage Trend (ICE) */}
                {vehicles?.some(v => dashboardVehicleIds.includes(v.id) && v.fuelType !== 'EV') && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <h4 className="text-lg font-semibold text-gray-800 mb-6">연비 트렌드 (km/L)</h4>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={efficiency.mileageTrend} margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} width={40} />
                                    <Tooltip
                                        formatter={(value: number) => `${value} km/L`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" dataKey="efficiency" name="평균 연비" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Chart 4: EV Efficiency Trend */}
                {vehicles?.some(v => dashboardVehicleIds.includes(v.id) && v.fuelType === 'EV') && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <h4 className="text-lg font-semibold text-gray-800 mb-6">전비 트렌드 (km/kWh)</h4>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={efficiency.evMileageTrend} margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} width={40} />
                                    <Tooltip
                                        formatter={(value: number) => `${value} km/kWh`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" dataKey="efficiency" name="평균 전비" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
