"use client"

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const apiMonthlyTrend = [
    {
        month: '10월',
        details: [
            { carModel: '트랙용 GT86', amount: 450000 },
            { carModel: '데일리 XM3', amount: 200000 }
        ]
    },
    {
        month: '11월',
        details: [
            { carModel: '트랙용 GT86', amount: 300000 },
            { carModel: '데일리 XM3', amount: 220000 }
        ]
    },
    {
        month: '12월',
        details: [
            { carModel: '트랙용 GT86', amount: 800000 },
            { carModel: '데일리 XM3', amount: 210000 }
        ]
    },
    {
        month: '1월',
        details: [
            { carModel: '트랙용 GT86', amount: 150000 },
            { carModel: '데일리 XM3', amount: 250000 }
        ]
    }
]

const categoryData = [
    { name: '주유', value: 400000 },
    { name: '엔진오일', value: 150000 },
    { name: '세차', value: 50000 },
    { name: '보험료', value: 800000 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const mileageData = [
    { name: '10월', efficiency: 8.5 },
    { name: '11월', efficiency: 8.2 },
    { name: '12월', efficiency: 7.1 },
    { name: '1월', efficiency: 8.8 },
]

export default function Dashboard() {
    // 백엔드 중첩 DTO 응답을 Recharts용 데이터(Flattened)로 변환
    const rechartsMonthlyData = apiMonthlyTrend.map(trend => {
        const dataPoint: any = { month: trend.month }
        trend.details.forEach(detail => {
            dataPoint[detail.carModel] = detail.amount
        })
        return dataPoint
    })

    // details 안에 있는 고유한 차량명들을 추출
    const uniqueCars = Array.from(new Set(
        apiMonthlyTrend.flatMap(trend => trend.details.map(d => d.carModel))
    ))

    return (
        <div className="space-y-6">
            {/* Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500 mb-1">당월 총 지출</p>
                    <h3 className="text-3xl font-bold text-gray-900">₩ 400,000</h3>
                    <span className="text-xs text-green-500 font-medium mt-2">▼ 15% 전월 대비</span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500 mb-1">평균 주유 단가 (고급유)</p>
                    <h3 className="text-3xl font-bold text-gray-900">₩ 1,850 <span className="text-lg text-gray-500 font-normal">/ L</span></h3>
                    <span className="text-xs text-red-500 font-medium mt-2">▲ 2% 전월 대비</span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition hover:shadow-md">
                    <p className="text-sm font-medium text-gray-500 mb-1">최근 평균 연비</p>
                    <h3 className="text-3xl font-bold text-gray-900">8.8 <span className="text-lg text-gray-500 font-normal">km/L</span></h3>
                    <span className="text-xs text-green-500 font-medium mt-2">▲ 0.4 km/L 향상</span>
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
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={4}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => `₩${value.toLocaleString()}`}
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
                            <LineChart data={mileageData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    formatter={(value: number) => `${value} km/L`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="efficiency" name="평균 연비 - GT86" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
