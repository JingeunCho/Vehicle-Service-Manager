"use client"

import React, { useState, useEffect } from 'react'
import {
    useVehicles,
    useCreateVehicle,
    useUpdateVehicle,
    useDeleteVehicle,
    useSetPrimaryVehicle,
    Vehicle
} from '@/hooks/useVehicles'
import { formatToLocalDate, formatToInputDate, toUtcInstant } from '@/lib/dateUtils'

const getFuelTypeLabel = (fuelType: string) => {
    switch (fuelType) {
        case 'REGULAR_GASOLINE': return '가솔린'
        case 'PREMIUM_GASOLINE': return '고급 가솔린'
        case 'DIESEL': return '디젤'
        case 'LPG': return 'LPG'
        case 'EV': return '전기 (EV)'
        case 'HYDROGEN': return '수소'
        default: return fuelType
    }
}

export default function VehiclesPage() {
    const { data: vehicles, isLoading, isError } = useVehicles()
    const createVehicleMutation = useCreateVehicle()
    const updateVehicleMutation = useUpdateVehicle()
    const deleteVehicleMutation = useDeleteVehicle()
    const setPrimaryVehicleMutation = useSetPrimaryVehicle()

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    // 카드 점3개(햄버거) 메뉴 상태
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)

    const toggleDropdown = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setActiveDropdownId(prev => prev === id ? null : id);
    }

    const handleSetPrimary = async (id: number) => {
        try {
            await setPrimaryVehicleMutation.mutateAsync(id)
        } catch (error) {
            console.error('대표 차량 설정 실패:', error)
            alert('대표 차량 설정 중 오류가 발생했습니다.')
        }
    }

    const openEditModal = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle)
        setIsEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditingVehicle(null)
        setIsEditModalOpen(false)
    }

    const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const insuranceDateRaw = formData.get('insuranceDate') as string
        
        const vehicleData = {
            carModel: formData.get('carModel') as string,
            name: formData.get('name') as string,
            licensePlate: formData.get('licensePlate') as string,
            fuelType: formData.get('fuelType') as string,
            currentMileage: parseInt(formData.get('currentMileage') as string),
            tuningHistory: formData.get('tuningHistory') as string,
            insuranceDate: insuranceDateRaw ? toUtcInstant(insuranceDateRaw) : undefined
        }

        try {
            await createVehicleMutation.mutateAsync(vehicleData)
            setIsAddModalOpen(false)
        } catch (error) {
            console.error('차량 등록 실패:', error)
            alert('차량 등록 중 오류가 발생했습니다.')
        }
    }

    const handleUpdateVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!editingVehicle) return

        const formData = new FormData(e.currentTarget)
        const insuranceDateRaw = formData.get('insuranceDate') as string

        const vehicleData = {
            id: editingVehicle.id,
            carModel: formData.get('carModel') as string,
            name: formData.get('name') as string,
            licensePlate: formData.get('licensePlate') as string,
            fuelType: formData.get('fuelType') as string,
            currentMileage: parseInt(formData.get('currentMileage') as string),
            tuningHistory: formData.get('tuningHistory') as string,
            insuranceDate: insuranceDateRaw ? toUtcInstant(insuranceDateRaw) : undefined
        }

        try {
            await updateVehicleMutation.mutateAsync(vehicleData)
            closeEditModal()
        } catch (error) {
            console.error('차량 수정 실패:', error)
            alert('차량 정보 수정 중 오류가 발생했습니다.')
        }
    }

    const handleDeleteVehicle = async (id: number) => {
        if (!confirm('정말로 이 차량을 삭제하시겠습니까? 관련 데이터가 모두 삭제됩니다.')) return

        try {
            await deleteVehicleMutation.mutateAsync(id)
            setActiveDropdownId(null)
        } catch (error) {
            console.error('차량 삭제 실패:', error)
            alert('차량 삭제 중 오류가 발생했습니다.')
        }
    }

    if (isLoading) return <div className="flex items-center justify-center h-full"><p className="text-gray-500 font-medium">차량 목록 로딩 중...</p></div>
    if (isError) return <div className="flex items-center justify-center h-full"><p className="text-red-500 font-medium">데이터 로드 중 오류가 발생했습니다.</p></div>

    return (
        <div className="space-y-6 relative h-full w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">내 차량 인벤토리</h2>
                    <p className="text-sm text-gray-500 mt-1">내가 소유한 모든 자동차의 기본 정보를 관리할 수 있습니다.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* 차량 카드 리스트 */}
                {vehicles?.map(vehicle => {
                    const isPrimary = (vehicle as any).primary || (vehicle as any).isPrimary;
                    return (
                        <div key={vehicle.id} className={`bg-white p-6 rounded-2xl border transition-all duration-500 relative group min-h-[320px] flex flex-col ${isPrimary
                            ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-[1.02]'
                            : 'border-gray-100 shadow-sm hover:shadow-md'
                            }`}>
                            {/* 데코레이션 탑 바 */}
                            <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl transition-colors duration-300 ${isPrimary ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400'
                                }`}></div>

                            {/* 우측 상단 햄버거 형태 더보기 버튼 (Dropdown) */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={(e) => toggleDropdown(e, vehicle.id)}
                                    className="relative z-20 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition focus:outline-none"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                </button>

                                {/* 드롭다운 메뉴 아이템 */}
                                {activeDropdownId === vehicle.id && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={(e) => { e.stopPropagation(); setActiveDropdownId(null); }}
                                        ></div>
                                        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {!isPrimary && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleSetPrimary(vehicle.id); setActiveDropdownId(null); }}
                                                    className="w-full text-left px-4 py-2.5 text-[13px] text-indigo-600 font-bold hover:bg-indigo-50 transition border-b border-gray-50 flex items-center gap-2"
                                                >
                                                    <span className="text-base">⭐</span> 대표로 지정
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                                className="w-full text-left px-4 py-2.5 text-[13px] text-red-600 font-bold hover:bg-red-50 hover:text-red-700 transition flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                차량 삭제
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="mb-1">
                                    <h3 className={`text-xl font-bold truncate transition-colors ${isPrimary ? 'text-blue-900' : 'text-gray-900'}`}>{vehicle.name}</h3>
                                    <p className="text-sm text-gray-400 mt-0.5 font-medium">{vehicle.carModel}</p>
                                </div>

                                {/* 태그 영역 (유종 + 대표배지) */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                                        {getFuelTypeLabel(vehicle.fuelType)}
                                    </span>
                                    {isPrimary && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shrink-0 animate-in pop-in zoom-in-50 duration-300">
                                            ⭐ 대표 차량
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3 mt-auto pt-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">최신 주행거리</span>
                                        <span className={`font-semibold ${isPrimary ? 'text-blue-900' : 'text-gray-900'}`}>{vehicle.currentMileage.toLocaleString()} km</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">엔진오일</span>
                                        <span className="text-blue-600 font-bold">{formatToLocalDate(vehicle.lastMaintenance?.ENGINE_OIL?.date)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">미션오일</span>
                                        <span className="text-gray-600 font-semibold">{formatToLocalDate(vehicle.lastMaintenance?.TRANSMISSION_OIL?.date)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">전륜 브레이크 패드</span>
                                        <span className="text-gray-600 font-semibold">{formatToLocalDate(vehicle.lastMaintenance?.FRONT_BRAKE_PAD?.date)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="mt-8 pt-4 border-t border-gray-100 flex gap-2.5 relative z-0">
                                <button
                                    onClick={() => openEditModal(vehicle)}
                                    className="flex-1 py-2 bg-gray-50 text-gray-700 font-semibold text-[13px] rounded-lg hover:bg-gray-100 transition border border-gray-200"
                                >
                                    차량 정보 관리
                                </button>
                            </div>
                        </div>
                    )
                })}

                {/* 추가 유도 빈 카드 */}
                <button onClick={() => setIsAddModalOpen(true)} className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition min-h-[260px] cursor-pointer group">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:bg-blue-600 group-hover:text-white transition group-hover:shadow-md">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <span className="font-semibold text-lg">새로운 자동차 추가</span>
                    <p className="text-sm mt-1 text-center font-medium opacity-70">여러 대의 자동차 등록을 지원합니다</p>
                </button>
            </div>

            {/* 신규 차량 등록 Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-100">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">새로운 자동차 등록</h2>
                                <p className="text-sm text-gray-500 font-medium tracking-tight mt-1">차량 관리를 시작하기 위해 기본 정보를 입력해 주세요.</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form className="space-y-6" onSubmit={handleAddVehicle}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">자동차 모델명 (Model) *</label>
                                    <input name="carModel" type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" placeholder="예: Hyundai Sonata" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">차량 애칭 (Nickname) *</label>
                                    <input name="name" type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" placeholder="예: 출퇴근 붕붕이" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">차량 번호판 (License Plate) *</label>
                                    <input name="licensePlate" type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" placeholder="예: 12가 3456" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">기본 권장 유종</label>
                                    <select name="fuelType" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900 cursor-pointer">
                                        <option value="REGULAR_GASOLINE">가솔린 (휘발유)</option>
                                        <option value="PREMIUM_GASOLINE">고급 휘발유</option>
                                        <option value="DIESEL">디젤 (경유)</option>
                                        <option value="LPG">LPG</option>
                                        <option value="EV">전기차 (EV)</option>
                                        <option value="HYDROGEN">수소차</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">보험 갱신일</label>
                                    <input name="insuranceDate" type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900 cursor-pointer" />
                                </div>
                            </div>

                            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-blue-900">현재 시작 주행거리 🚙</div>
                                    <div className="text-xs font-semibold text-blue-600 mt-1 opacity-80">차계부 기록의 시작점이 될 계기판 숫자를 입력해주세요</div>
                                </div>
                                <div className="flex items-center gap-2 max-w-[140px]">
                                    <input name="currentMileage" type="number" required defaultValue={0} min={0} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition font-black text-blue-800 text-right" />
                                    <span className="text-base font-bold text-blue-800 opacity-70 shrink-0">km</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ">튜닝 내역 및 사전 정비 메모 (선택)</label>
                                <textarea name="tuningHistory" rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition font-medium text-gray-900 leading-relaxed" placeholder="정비 내역이나 튜닝 이력을 기입하세요."></textarea>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">취소</button>
                                <button type="submit" disabled={createVehicleMutation.isPending} className="px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg transition transform active:scale-95 disabled:opacity-50">
                                    {createVehicleMutation.isPending ? '등록 중...' : '신규 차량 등록 완료'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 차량 편집 Modal */}
            {isEditModalOpen && editingVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeEditModal}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-100">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">차량 정보 관리</h2>
                                <p className="text-sm text-gray-500 font-medium tracking-tight mt-1">차량 정보를 꼼꼼히 기록하세요.</p>
                            </div>
                            <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form className="space-y-6" onSubmit={handleUpdateVehicle}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">자동차 모델명 (Model)</label>
                                    <input name="carModel" type="text" defaultValue={editingVehicle.carModel} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">차량 애칭 (Nickname)</label>
                                    <input name="name" type="text" defaultValue={editingVehicle.name} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">차량 번호판 (License Plate)</label>
                                    <input name="licensePlate" type="text" defaultValue={editingVehicle.licensePlate} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">기본 권장 유종</label>
                                    <select name="fuelType" defaultValue={editingVehicle.fuelType} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900 cursor-pointer">
                                        <option value="REGULAR_GASOLINE">가솔린 (휘발유)</option>
                                        <option value="PREMIUM_GASOLINE">고급 휘발유</option>
                                        <option value="DIESEL">디젤 (경유)</option>
                                        <option value="LPG">LPG</option>
                                        <option value="EV">전기차 (EV)</option>
                                        <option value="HYDROGEN">수소차</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">보험 갱신일</label>
                                    <input name="insuranceDate" type="date" defaultValue={formatToInputDate(editingVehicle.insuranceDate)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900 cursor-pointer" />
                                </div>
                            </div>

                            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-blue-900">현재 누적 주행거리 🚙</div>
                                    <div className="text-xs font-semibold text-blue-600 mt-1 opacity-80">마지막으로 입력한 차계부 기록 기준</div>
                                </div>
                                <div className="flex items-center gap-2 max-w-[140px]">
                                    <input name="currentMileage" type="number" defaultValue={editingVehicle.currentMileage} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition font-black text-blue-800 text-right" />
                                    <span className="text-base font-bold text-blue-800 opacity-70 shrink-0">km</span>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5">튜닝 내역 및 정비 메모</label>
                                <textarea name="tuningHistory" defaultValue={editingVehicle.tuningHistory} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition font-medium text-gray-900 leading-relaxed"></textarea>
                            </div>


                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-sm font-semibold text-blue-700">🔧 소모품 교환 기록 (엔진오일, 브레이크 등)</p>
                                <p className="text-xs text-blue-500 mt-1">소모품 교환 기록은 별도 정비 기록 기능에서 날짜와 비용을 등록할 수 있습니다.</p>
                            </div>


                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={closeEditModal} className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">취소</button>
                                <button type="submit" disabled={updateVehicleMutation.isPending} className="px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg transition transform active:scale-95 disabled:opacity-50">
                                    {updateVehicleMutation.isPending ? '수정 중...' : '정보 업데이트'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
