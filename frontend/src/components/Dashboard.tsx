"use client"

import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useDashboard } from '@/hooks/useDashboard'
import { useVehicleContext } from '@/context/VehicleContext'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Dashboard() {
    const { selectedVehicleId } = useVehicleContext()
    const { data: dashboard, isLoading, error } = useDashboard(selectedVehicleId)

    if (isLoading) return <div className="p-8 flex items-center justify-center h-full text-gray-500 font-medium text-lg min-h-[400px]">대시보드 데이터를 실시간으로 불러오는 중입니다...</div>
    if (error || !dashboard) return (
        <div className="p-8 flex items-center justify-center h-full text-red-500 font-medium text-lg min-h-[400px]">
            {selectedVehicleId ? '데이터 연동 실패! 백엔드 서버가 켜져있는지 확인해주거나, 해당 차량의 데이터가 있는지 확인해주세요.' : '먼저 차량을 선택하거나 생성해주세요.'}
        </div>
    )

    // 백엔드 중첩 DTO 응답을 Recharts용 데이터(Flattened)로 변환
    const rechartsMonthlyData = dashboard.monthlyTrend.map(trend => {
        const dataPoint: any = { month: trend.month }
        trend.details.forEach(detail => {
            dataPoint[detail.carModel] = detail.amount
        })
        return dataPoint
    })

    const uniqueCars = Array.from(new Set(
        dashboard.monthlyTrend.flatMap(trend => trend.details.map(d => d.carModel))
    ))

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-800">내 차계부 대시보드 (Live Data)</h2>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-semibold">차량 ID: {selectedVehicleId}</div>
            </div>

            {/* Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500 mb-1">당월 실 지출액</p>
                    <h3 className="text-3xl font-bold text-gray-900">₩ {dashboard.totalExpenseThisMonth.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500 mb-1">평균 주유 단가</p>
                    <h3 className="text-3xl font-bold text-gray-900">₩ {dashboard.avgFuelPriceCurrentMonth.toLocaleString()} <span className="text-lg text-gray-500 font-normal">/ L</span></h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500 mb-1">최근 평균 연비</p>
                    <h3 className="text-3xl font-bold text-gray-900">{dashboard.recentAvgMileage} <span className="text-lg text-gray-500 font-normal">km/L</span></h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Monthly Trend */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h4 className="text-lg font-semibold text-gray-800 mb-6">월별 지출 추이</h4>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={rechartsMonthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `₩\${(val / 10000)}만`} dx={-10} />
                                <Tooltip
                                    formatter={(value: number) => `₩\${value.toLocaleString()}`}
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

                {/* Chart 2: Category Donut */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h4 className="text-lg font-semibold text-gray-800 mb-6">카테고리별 지출 비율 (당월)</h4>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dashboard.categoryDonut}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {dashboard.categoryDonut.map((entry, index) => (
                                        <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => `₩\${value.toLocaleString()}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 3: Mileage Trend */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 hover:shadow-md transition">
                    <h4 className="text-lg font-semibold text-gray-800 mb-6">연비 트렌드 (km/L)</h4>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboard.mileageTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    formatter={(value: number) => `\${value} km/L`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="efficiency" name="평균 연비" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
