"use client"

import React, { useState } from 'react'

// 백엔드 연동 전 프론트엔드 UI용 테스트 데이터
const mockLedgers = [
    { id: 1, vehicleName: '트랙용 GT86', date: '2024-03-24', category: 'REFUEL', title: 'GS칼텍스 고급유', amount: 95000, mileage: 15600, memo: '인제 서킷 출발 전 만땅 주유 (하이옥탄 가득)' },
    { id: 2, vehicleName: '데일리 XM3', date: '2024-03-22', category: 'REFUEL', title: 'S오일 가득 주유', amount: 65000, mileage: 6500, memo: '연비 주행 시작을 위해 가득 채움.' },
    { id: 3, vehicleName: '트랙용 GT86', date: '2024-03-20', category: 'MAINTENANCE', title: '엔진오일 교환 (모튤 300v)', amount: 150000, mileage: 15400, memo: '서킷 주행 대비 오일 교환 및 하체 점검 완료.' },
    { id: 4, vehicleName: '데일리 XM3', date: '2024-03-15', category: 'WASH', title: '손세차 (워시홀릭)', amount: 20000, mileage: 6300, memo: '봄맞이 디테일링 세차, 발수 코팅 포함.' },
    { id: 5, vehicleName: '데일리 XM3', date: '2024-03-10', category: 'ETC', title: '하이패스 충전', amount: 50000, mileage: 6200, memo: '' },
    { id: 6, vehicleName: '트랙용 GT86', date: '2024-03-05', category: 'REFUEL', title: 'SK엔크린 고급유 주유', amount: 90000, mileage: 14800, memo: '' },
]

type ModalMode = "NONE" | "ADD" | "VIEW" | "EDIT"

export default function LedgersPage() {
    const [modalMode, setModalMode] = useState<ModalMode>("NONE")
    const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(null)
    const [filterCategory, setFilterCategory] = useState("ALL")
    const [filterVehicle, setFilterVehicle] = useState("ALL")

    const handleOpenAddModal = () => {
        setSelectedLedgerId(null)
        setModalMode("ADD")
    }

    const handleRowClick = (id: number) => {
        setSelectedLedgerId(id)
        setModalMode("VIEW")
    }

    const targetLedger = selectedLedgerId ? mockLedgers.find(l => l.id === selectedLedgerId) : null

    const filteredLedgers = mockLedgers.filter(L => {
        const passCategory = (filterCategory === "ALL") || (L.category === filterCategory)
        const passVehicle = (filterVehicle === "ALL") || (L.vehicleName === filterVehicle)
        return passCategory && passVehicle
    })

    const getCategoryBadge = (cat: string) => {
        switch (cat) {
            case 'REFUEL': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200">주유</span>
            case 'MAINTENANCE': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-orange-50 text-orange-700 border border-orange-200">정비</span>
            case 'WASH': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">세차</span>
            default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-gray-100 text-gray-700 border border-gray-200">기타</span>
        }
    }

    // "VIEW" 모달 내용을 렌더링하는 함수 (요약 표시 전용)
    const renderSummaryView = () => {
        if (!targetLedger) return null;

        return (
            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 shadow-inner">
                    <div className="mb-3">{getCategoryBadge(targetLedger.category)}</div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 truncate max-w-full text-center px-4">{targetLedger.title}</h3>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>{targetLedger.vehicleName}</span>
                        <span>|</span>
                        <span>{targetLedger.date}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-1">총 결제 금액</p>
                        <p className="text-2xl font-black text-blue-900 tracking-tight">{targetLedger.amount.toLocaleString()} <span className="text-sm font-bold text-blue-700 opacity-70">원</span></p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">기록 시점 주행거리</p>
                        <p className="text-2xl font-black text-gray-800 tracking-tight">{targetLedger.mileage.toLocaleString()} <span className="text-sm font-bold text-gray-500 opacity-70">km</span></p>
                    </div>
                </div>

                {targetLedger.memo && (
                    <div className="p-5 bg-yellow-50/50 rounded-2xl border border-yellow-100 relative">
                        <div className="absolute top-0 right-0 p-3 opacity-20">
                            <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24"><path d="M7 21a4 4 0 01-4-4v-1h3.5a1.5 1.5 0 001.5-1.5V11H4v-1a4 4 0 014-4h1v3.5A1.5 1.5 0 0010.5 11H14V7a4 4 0 014 4v1h-3.5a1.5 1.5 0 00-1.5 1.5V17h4v1a4 4 0 01-4 4h-6z" /></svg>
                        </div>
                        <p className="text-[11px] font-black text-yellow-700 uppercase tracking-wider mb-2">상세 노트</p>
                        <p className="text-sm font-medium text-gray-800 leading-relaxed relative z-10">{targetLedger.memo}</p>
                    </div>
                )}

                <div className="pt-6 mt-4 flex justify-between gap-3 border-t border-gray-100">
                    <button type="button" onClick={() => setModalMode("NONE")} className="px-6 py-3 text-[15px] font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition focus:outline-none">
                        닫기
                    </button>
                    <div className="flex gap-3">
                        <button type="button" className="px-5 py-3 text-[14px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition focus:outline-none">
                            삭제
                        </button>
                        <button type="button" onClick={() => setModalMode("EDIT")} className="px-6 py-3 text-[15px] font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 rounded-xl transition focus:outline-none">
                            정보 ✏️ 수정하기
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // "ADD" 또는 "EDIT" 폼 렌더링
    const renderEditForm = () => {
        const isEdit = modalMode === "EDIT"

        return (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setModalMode(isEdit ? "VIEW" : "NONE"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">지출 대상 차량 🚙 *</label>
                        <select required defaultValue={isEdit && targetLedger?.vehicleName === '데일리 XM3' ? '2' : '1'} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-gray-900 cursor-pointer shadow-sm">
                            <option value="1">트랙용 GT86 (Toyota 86)</option>
                            <option value="2">데일리 XM3 (Renault XM3)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">지출 카테고리 🏷 *</label>
                        <select required defaultValue={isEdit ? (targetLedger?.category || 'REFUEL') : 'REFUEL'} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-gray-900 cursor-pointer shadow-sm">
                            <option value="REFUEL">주유 / 충전 (REFUEL)</option>
                            <option value="MAINTENANCE">정비 / 수리 (MAINTENANCE)</option>
                            <option value="WASH">세차 (WASH)</option>
                            <option value="ETC">기타 유지비용 (ETC)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">세부 지출 내용 *</label>
                        <input type="text" required defaultValue={isEdit ? (targetLedger?.title || '') : ''} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-gray-900 shadow-sm" placeholder="예: 판교 SK주유소 고급유" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">결제일 *</label>
                        <input type="date" required defaultValue={isEdit ? (targetLedger?.date || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-gray-900 cursor-pointer shadow-sm text-sm" />
                    </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-inner">
                    <div>
                        <label className="block text-[13px] font-black text-blue-900 mb-2 ml-1">총 결제 금액 💰 *</label>
                        <div className="flex items-center gap-2">
                            <input type="number" required min={0} defaultValue={isEdit ? (targetLedger?.amount || '') : ''} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition font-black text-blue-900 text-right text-lg placeholder-blue-200" placeholder="0" />
                            <span className="text-sm font-bold text-blue-800 opacity-70 shrink-0">원</span>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-[13px] font-black text-blue-900 mb-2 ml-1">기록 시점의 주행거리 🚗 *</label>
                        <div className="flex items-center gap-2 relative z-10">
                            <input type="number" required min={0} defaultValue={isEdit ? (targetLedger?.mileage || '') : ''} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition font-black text-blue-900 text-right text-lg placeholder-blue-200" placeholder="0" />
                            <span className="text-sm font-bold text-blue-800 opacity-70 shrink-0">km</span>
                        </div>
                        <p className="absolute -bottom-5 right-6 text-[10px] font-bold text-blue-500">누락 시 연비 계산이 불가능합니다.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">메모 (선택)</label>
                    <textarea rows={2} defaultValue={isEdit ? (targetLedger?.memo || '') : ''} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition font-semibold text-gray-900 leading-relaxed shadow-sm" placeholder="수리 부품 상세 내역 혹은 기타 메모를 남겨주세요..."></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setModalMode(isEdit ? "VIEW" : "NONE")} className="px-6 py-3.5 text-[15px] font-bold text-gray-600 bg-gray-100/80 rounded-xl hover:bg-gray-200 transition">취소</button>
                    <button type="submit" className="px-6 py-3.5 text-[15px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition transform active:scale-95">
                        {isEdit ? "변경 사항 저장 완료" : "내역 업데이트"}
                    </button>
                </div>
            </form>
        )
    }

    return (
        <div className="space-y-6 relative h-full">
            {/* 상단 헤더 영역 */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">지출 내역 상세 조회</h2>
                    <p className="text-sm text-gray-500 mt-1">텔레그램 봇으로 기록한 내역과 수동으로 추가한 차계부 기록을 모두 한눈에 확인하세요.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0"
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    지출 내역 추가
                </button>
            </div>

            {/* 필터 트레이 */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-5 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-5 w-full">
                    <div className="shrink-0 md:w-48">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">보유 차량 필터</label>
                        <select
                            value={filterVehicle}
                            onChange={(e) => setFilterVehicle(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-800 text-sm font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 outline-none cursor-pointer shadow-sm"
                        >
                            <option value="ALL">전체 차량 (All Vehicles)</option>
                            <option value="트랙용 GT86">트랙용 GT86</option>
                            <option value="데일리 XM3">데일리 XM3</option>
                        </select>
                    </div>

                    <div className="w-full overflow-hidden">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">분류 별 필터 보기</label>
                        <div className="flex flex-nowrap overflow-x-auto pb-1 gap-2 no-scrollbar">
                            {['ALL', 'REFUEL', 'MAINTENANCE', 'WASH', 'ETC'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors border shrink-0 ${filterCategory === cat
                                            ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                                            : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                        }`}
                                >
                                    {cat === 'ALL' ? '전체 보기' :
                                        cat === 'REFUEL' ? '⛽ 주유 및 충전' :
                                            cat === 'MAINTENANCE' ? '🛠 정비 결제' :
                                                cat === 'WASH' ? '🚿 세차 용품' : '📦 기타 유지비'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 테이블 뷰 영역 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap table-fixed min-w-[850px]">
                    <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-black text-gray-500 tracking-widest uppercase">
                            <th className="px-6 py-4 w-[16%]">최근 결제일자</th>
                            <th className="px-6 py-4 w-[34%]">지출 내역 구분 및 내용</th>
                            <th className="px-6 py-4 w-[12%]">항목</th>
                            <th className="px-6 py-4 w-[16%] text-right">기록 계기판(주행거리)</th>
                            <th className="px-6 py-4 w-[16%] text-right">결제 금액</th>
                            <th className="px-6 py-4 w-[6%] text-center text-gray-400"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredLedgers.map(l => (
                            <tr
                                key={l.id}
                                onClick={() => handleRowClick(l.id)}
                                className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                            >
                                <td className="px-6 py-4 align-middle">
                                    <div className="text-[13px] font-bold text-gray-600">{l.date}</div>
                                </td>
                                <td className="px-6 py-4 truncate">
                                    <div className="text-sm font-bold text-gray-950 truncate">{l.title}</div>
                                    <div className="flex items-center gap-1.5 mt-1 opacity-80 truncate">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
                                        <div className="text-[11px] font-bold text-gray-500 tracking-tight shrink-0">{l.vehicleName}</div>
                                        {l.memo && (
                                            <span className="ml-1 text-[11px] font-medium text-gray-400 truncate">
                                                | {l.memo}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 align-middle">
                                    {getCategoryBadge(l.category)}
                                </td>
                                <td className="px-6 py-4 text-right align-middle">
                                    <div className="text-[13.5px] font-bold text-gray-700">{l.mileage.toLocaleString()} km</div>
                                </td>
                                <td className="px-6 py-4 text-right align-middle">
                                    <div className="text-[15px] font-black text-gray-900 tracking-tight">{l.amount.toLocaleString()} <span className="text-[11px] font-bold text-gray-400 tracking-normal ml-0.5">원</span></div>
                                </td>
                                <td className="px-6 py-4 text-center align-middle">
                                    <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition mx-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </td>
                            </tr>
                        ))}
                        {filteredLedgers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">해당 조건의 지출 기록이 존재하지 않습니다.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 거대한 통합 Modal Overlay (ADD, VIEW, EDIT) */}
            {modalMode !== "NONE" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setModalMode("NONE")}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
                        {modalMode !== "VIEW" && (
                            <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-100">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                        {modalMode === "EDIT" ? "지출 내역 수정" : "지출 내역 기록"}
                                    </h2>
                                    <p className="text-sm text-gray-500 font-medium tracking-tight mt-1">
                                        {modalMode === "EDIT"
                                            ? "기존에 기록된 차계부 내역의 정보를 수정합니다."
                                            : "텔레그램 봇을 거치지 않고 신규 내역을 기록합니다."}
                                    </p>
                                </div>
                                <button onClick={() => setModalMode("NONE")} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition focus:outline-none">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        )}

                        {modalMode === "VIEW" ? renderSummaryView() : renderEditForm()}
                    </div>
                </div>
            )}
        </div>
    )
}
