"use client"

import React, { useState, useEffect } from 'react'

// 실제 백엔드가 켜졌을 때 React Query 등으로 바꿀 예정 (현재는 서버리스 테스트용 UI)
const mockVehicles = [
    {
        id: 1,
        carName: '트랙용 GT86',
        model: 'Toyota 86',
        fuelType: 'PREMIUM',
        lastMileage: 15400,
        createdAt: '2024-01-15',
        licensePlate: '12가 3456',
        tuningHistory: 'HKS 하이퍼맥스 서스펜션 교체 (24.02)\n볼크 TE37 휠 /Sur4g 타이어 장착\n모튤 300v 엔진오일 교환',
        insuranceDate: '2025-01-15',
        oilInterval: 5000,
        lastOilChangeDate: '2024-02-10',
        isPrimary: false
    },
    {
        id: 2,
        carName: '데일리 XM3',
        model: 'Renault XM3',
        fuelType: 'GASOLINE',
        lastMileage: 6200,
        createdAt: '2024-03-10',
        licensePlate: '98하 7654',
        tuningHistory: '순정 상태 유지. 블박 채널 추가',
        insuranceDate: '2025-03-10',
        oilInterval: 10000,
        lastOilChangeDate: '2024-03-10',
        isPrimary: true
    }
]

export default function VehiclesPage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState<any>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    // 카드 점3개(햄버거) 메뉴 상태
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)

    // 대표 차량 UI 상태 관리
    const [primaryVehicleId, setPrimaryVehicleId] = useState<number>(mockVehicles.find(v => v.isPrimary)?.id || mockVehicles[0].id)

    const toggleDropdown = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // 외부 이벤트 버블링 차단 (카드 외부클릭 닫힘방지)
        setActiveDropdownId(prev => prev === id ? null : id);
    }

    const handleSetPrimary = (id: number) => {
        setPrimaryVehicleId(id)
    }

    const openEditModal = (vehicle: any) => {
        setEditingVehicle(vehicle)
        setIsEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditingVehicle(null)
        setIsEditModalOpen(false)
    }

    return (
        <div className="space-y-6 relative h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">내 차량 인벤토리</h2>
                    <p className="text-sm text-gray-500 mt-1">내가 소유한 모든 자동차의 기본 정보를 관리할 수 있습니다.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 차량 카드 리스트 */}
                {mockVehicles.map(vehicle => {
                    const isPrimary = vehicle.id === primaryVehicleId;
                    return (
                        <div key={vehicle.id} className={`bg-white p-6 rounded-2xl border transition-all duration-300 relative group ${isPrimary
                            ? 'border-blue-400 ring-4 ring-blue-500/20 shadow-xl shadow-blue-500/10 scale-[1.02]'
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
                                        {/* 외부 클릭 이벤트를 강제로 인터셉트하는 투명 백그라운드 */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={(e) => { e.stopPropagation(); setActiveDropdownId(null); }}
                                        ></div>
                                        <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <button className="w-full text-center px-4 py-2.5 text-[13px] text-red-600 font-bold hover:bg-red-50 hover:text-red-700 transition">차량 삭제</button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex justify-between items-start mb-4 pr-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`text-xl font-bold truncate max-w-[150px] transition-colors ${isPrimary ? 'text-blue-900' : 'text-gray-900'}`}>{vehicle.carName}</h3>
                                        {isPrimary && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shrink-0 animate-in pop-in zoom-in-50 duration-300">
                                                ⭐ 대표 차량
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-0.5">{vehicle.model}</p>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                                    {vehicle.fuelType}
                                </span>
                            </div>

                            <div className="space-y-3 mt-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">최신 주행거리</span>
                                    <span className={`font-semibold ${isPrimary ? 'text-blue-900' : 'text-gray-900'}`}>{vehicle.lastMileage.toLocaleString()} km</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">마지막 오일 교환</span>
                                    <span className="text-blue-600 font-bold">{vehicle.lastOilChangeDate || '-'}</span>
                                </div>
                            </div>

                            {/* 한 줄로 통합된 액션 버튼 (대표 지정 + 정보 관리) */}
                            <div className="mt-8 pt-4 border-t border-gray-100 flex gap-2.5 relative z-0">
                                {!isPrimary && (
                                    <button
                                        onClick={() => handleSetPrimary(vehicle.id)}
                                        className="flex-[0.6] py-2 bg-indigo-50 text-indigo-700 font-bold text-[13px] rounded-lg hover:bg-indigo-100 transition border border-indigo-100 shadow-sm animate-in fade-in"
                                    >
                                        ⭐ 대표로 지정
                                    </button>
                                )}
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

            {/* 신규 차량 등록 Modal Overlay */}
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

                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">자동차 모델명 (Model) *</label>
                                    <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" placeholder="예: Hyundai Sonata" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">차량 애칭 (Nickname) *</label>
                                    <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" placeholder="예: 출퇴근 붕붕이" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">차량 번호판 (License Plate) *</label>
                                    <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" placeholder="예: 12가 3456" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">기본 권장 유종</label>
                                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900 cursor-pointer">
                                        <option value="GASOLINE">가솔린 (휘발유)</option>
                                        <option value="PREMIUM">고급 휘발유</option>
                                        <option value="DIESEL">디젤 (경유)</option>
                                        <option value="EV">전기차 (EV)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-blue-900">현재 시작 주행거리 🚙</div>
                                    <div className="text-xs font-semibold text-blue-600 mt-1 opacity-80">차계부 기록의 시작점이 될 계기판 숫자를 입력해주세요</div>
                                </div>
                                <div className="flex items-center gap-2 max-w-[140px]">
                                    <input type="number" required defaultValue={0} min={0} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition font-black text-blue-800 text-right" />
                                    <span className="text-base font-bold text-blue-800 opacity-70 shrink-0">km</span>
                                </div>
                            </div>

                            {/* 부가 선택 정보 */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 ">튜닝 내역 및 사전 정비 메모 (선택)</label>
                                <textarea rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition font-medium text-gray-900 leading-relaxed" placeholder="이전 차주에게 인수받은 정비 내역이나 튜닝된 이력이 있다면 자유롭게 기입하세요."></textarea>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">취소</button>
                                <button type="submit" className="px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg transition transform active:scale-95">신규 차량 등록 완료</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 차량 편집 Modal Overlay */}
            {isEditModalOpen && editingVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* 뒷배경 흐림 처리 */}
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeEditModal}></div>

                    {/* 모달 창 본체 */}
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-100">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">차량 정보 관리</h2>
                                <p className="text-sm text-gray-500 font-medium tracking-tight mt-1">차량의 제원과 수리/오일 교환 주기를 꼼꼼히 기록하세요.</p>
                            </div>
                            <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); closeEditModal(); }}>
                            {/* 섹션 1: 아이덴티티 및 식별 정보 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">자동차 모델명 (Model)</label>
                                    <input type="text" defaultValue={editingVehicle.model} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" placeholder="예: Hyundai Sonata" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">차량 애칭 (Nickname)</label>
                                    <input type="text" defaultValue={editingVehicle.carName} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" placeholder="예: 출퇴근 붕붕이" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">차량 번호판 (License Plate)</label>
                                    <input type="text" defaultValue={editingVehicle.licensePlate} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900" placeholder="예: 12가 3456" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">기본 권장 유종</label>
                                    <select defaultValue={editingVehicle.fuelType} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900 cursor-pointer">
                                        <option value="GASOLINE">가솔린 (휘발유)</option>
                                        <option value="PREMIUM">고급 휘발유</option>
                                        <option value="DIESEL">디젤 (경유)</option>
                                        <option value="EV">전기차 (EV)</option>
                                    </select>
                                </div>
                            </div>

                            {/* 섹션 2: 누적 데이터 (Read Only - Ledger 연동) */}
                            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-blue-900">현재 누적 주행거리 🚙</div>
                                    <div className="text-xs font-semibold text-blue-600 mt-1 opacity-80">마지막으로 입력한 차계부 기록 기준 (자동 동기화)</div>
                                </div>
                                <div className="text-2xl font-black text-blue-800 tracking-tight">{editingVehicle.lastMileage?.toLocaleString()} <span className="text-base font-bold opacity-70">km</span></div>
                            </div>

                            {/* 섹션 3: 튜닝 및 부가 정보 */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5">
                                    튜닝 내역 및 정비 메모 (Tuning History)
                                </label>
                                <textarea
                                    defaultValue={editingVehicle.tuningHistory}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition font-medium text-gray-900 leading-relaxed"
                                    placeholder="튜닝하신 부품명, 타이어 스펙, 혹은 특별한 정비 내역을 기입하세요."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">마지막 오일 교환일</label>
                                    <input type="date" defaultValue={editingVehicle.lastOilChangeDate} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900 cursor-pointer text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">교환 주기 (km)</label>
                                    <input type="number" defaultValue={editingVehicle.oilInterval} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900 text-sm" placeholder="예: 7000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">보험 만기일</label>
                                    <input type="date" defaultValue={editingVehicle.insuranceDate} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900 cursor-pointer text-sm" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={closeEditModal} className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">취소</button>
                                <button type="submit" className="px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg transition transform active:scale-95">정보 업데이트</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
