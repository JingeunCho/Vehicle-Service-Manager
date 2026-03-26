"use client"

import React, { useState } from 'react'
import { useVehicleContext } from '@/context/VehicleContext'
import { useLedgers, useCreateLedger, useUpdateLedger, useDeleteLedger, useLedgerMetadata, MaintenanceType, LedgerCategory } from '@/hooks/useLedgers'
import { formatToLocalDate } from '@/lib/dateUtils'

type ModalMode = "NONE" | "ADD" | "VIEW" | "EDIT"

export default function LedgersPage() {
    const { vehicles, selectedVehicleId, setSelectedVehicleId } = useVehicleContext()
    
    // 페이징 상태
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [filterCategory, setFilterCategory] = useState<LedgerCategory | "ALL">("ALL")

    const { data: pageData, isLoading: isLedgersLoading } = useLedgers(selectedVehicleId, page, pageSize)
    const { data: metadata } = useLedgerMetadata()
    
    const createLedgerMutation = useCreateLedger()
    const updateLedgerMutation = useUpdateLedger()
    const deleteLedgerMutation = useDeleteLedger()

    const [modalMode, setModalMode] = useState<ModalMode>("NONE")
    const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<LedgerCategory>('REFUEL')
    const [selectedMaintenanceType, setSelectedMaintenanceType] = useState<MaintenanceType | ''>('')

    const maintenanceMap = React.useMemo(() => {
        const map: Record<string, string> = {}
        metadata?.maintenanceTypes.forEach(t => {
            map[t.code] = t.displayName
        })
        return map
    }, [metadata])

    const categoryMap = React.useMemo(() => {
        const map: Record<string, string> = {}
        metadata?.categories.forEach(c => {
            map[c.code] = c.displayName
        })
        return map
    }, [metadata])

    const handleOpenAddModal = () => {
        setSelectedLedgerId(null)
        setSelectedCategory('REFUEL')
        setSelectedMaintenanceType('')
        setModalMode("ADD")
    }

    const handleOpenEditModal = (ledger: any) => {
        setSelectedLedgerId(ledger.id)
        setSelectedCategory(ledger.category)
        setSelectedMaintenanceType(ledger.maintenanceType || '')
        setModalMode("EDIT")
    }

    const handleRowClick = (id: number) => {
        setSelectedLedgerId(id)
        setModalMode("VIEW")
    }

    const ledgers = pageData?.content || []
    
    const filteredLedgers = ledgers.filter(L => {
        return (filterCategory === "ALL") || (L.category === filterCategory)
    })

    const targetLedger = selectedLedgerId ? ledgers.find(l => l.id === selectedLedgerId) : null

    const getCategoryBadge = (cat: LedgerCategory) => {
        const label = categoryMap[cat] || cat
        switch (cat) {
            case 'REFUEL': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200">{label}</span>
            case 'MAINTENANCE': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-orange-50 text-orange-700 border border-orange-200">{label}</span>
            case 'CAR_SUPPLIES': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">{label}</span>
            case 'FIXED_COST': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">{label}</span>
            default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-gray-100 text-gray-700 border border-gray-200">{label}</span>
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
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>{vehicles?.find(v => v.id === targetLedger.vehicleId)?.name || '기타'}</span>
                        <span>|</span>
                        <span>{formatToLocalDate(targetLedger.recordDate)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-1">총 결제 금액</p>
                        <p className="text-2xl font-black text-blue-900 tracking-tight">{targetLedger.amount.toLocaleString()} <span className="text-sm font-bold text-blue-700 opacity-70">원</span></p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">기록 시점 주행거리</p>
                        <p className="text-2xl font-black text-gray-800 tracking-tight">{targetLedger.mileageAtRecord.toLocaleString()} <span className="text-sm font-bold text-gray-500 opacity-70">km</span></p>
                    </div>
                </div>

                {targetLedger.maintenanceType && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                        <span className="text-xl">🔧</span>
                        <div>
                            <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">소모품 교환</p>
                            <p className="text-base font-black text-orange-900">{maintenanceMap[targetLedger.maintenanceType] || targetLedger.maintenanceType}</p>
                        </div>
                    </div>
                )}

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
                        <button
                            type="button"
                            onClick={async () => {
                                if (selectedLedgerId && confirm('정말 이 내역을 삭제하시겠습니까?')) {
                                    try {
                                        await deleteLedgerMutation.mutateAsync(selectedLedgerId)
                                        setModalMode("NONE")
                                    } catch (err) {
                                        alert('삭제 중 오류가 발생했습니다.')
                                    }
                                }
                            }}
                            className="px-5 py-3 text-[14px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition focus:outline-none"
                        >
                            삭제
                        </button>
                        <button type="button" onClick={() => handleOpenEditModal(targetLedger)} className="px-6 py-3 text-[15px] font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 rounded-xl transition focus:outline-none">
                            ✏️ 정보 수정하기
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
            <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                const vehicleId = Number(fd.get('vehicleId'))
                const title = String(fd.get('title') || '')
                const recordDate = String(fd.get('recordDate') || '')
                const amount = Number(fd.get('amount') || 0)
                const mileage = Number(fd.get('mileage') || 0)
                const memo = String(fd.get('memo') || '')

                if (!vehicleId || !title || !recordDate || !amount) {
                    alert('필수 항목을 모두 입력해주세요.')
                    return
                }

                try {
                    // recordDate(YYYY-MM-DD)를 현재 로컬 시간과 합쳐서 Instant(ISO string)로 변환
                    // 정밀한 기록을 위해 UTC로 전송
                    const localDate = new Date(recordDate)
                    const utcInstant = localDate.toISOString()

                    const payload = {
                        vehicleId,
                        category: selectedCategory,
                        title,
                        recordDate: utcInstant, 
                        amount,
                        mileage: mileage || undefined,
                        memo,
                        maintenanceType: selectedMaintenanceType || undefined
                    }

                    if (isEdit && selectedLedgerId) {
                        await updateLedgerMutation.mutateAsync({
                            id: selectedLedgerId,
                            ...payload
                        })
                    } else {
                        await createLedgerMutation.mutateAsync(payload)
                    }
                    setModalMode("NONE")
                    setSelectedCategory('REFUEL')
                    setSelectedMaintenanceType('')
                } catch (err) {
                    console.error('저장 실패:', err)
                    alert('저장 중 오류가 발생했습니다.')
                }
            }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">지출 대상 차량 🚙 *</label>
                        <select name="vehicleId" required defaultValue={isEdit ? targetLedger?.vehicleId.toString() : (selectedVehicleId?.toString() || '')} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-gray-900 cursor-pointer shadow-sm">
                            {vehicles?.map(v => (
                                <option key={v.id} value={v.id.toString()}>{v.name} ({v.carModel})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">지출 카테고리 🏷 *</label>
                        <select
                            required
                            value={isEdit ? (targetLedger?.category || 'REFUEL') : selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as LedgerCategory)}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-gray-900 cursor-pointer shadow-sm">
                            {metadata?.categories.map(c => (
                                <option key={c.code} value={c.code}>{c.displayName} ({c.code})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 소모품 종류 드롭다운 */}
                {(isEdit ? targetLedger?.category : selectedCategory) === 'MAINTENANCE' && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                        <label className="block text-sm font-bold text-orange-700 mb-2">🔧 소모품 교환 종류 (선택)</label>
                        <select
                            value={isEdit ? (targetLedger?.maintenanceType || '') : selectedMaintenanceType}
                            onChange={(e) => setSelectedMaintenanceType(e.target.value as MaintenanceType | '')}
                            className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition font-semibold text-gray-900 cursor-pointer">
                            <option value="">선택 안함 (일반 정비)</option>
                            {metadata?.maintenanceTypes.map(t => (
                                <option key={t.code} value={t.code}>{t.displayName}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">세부 지출 내용 *</label>
                        <input name="title" type="text" required defaultValue={isEdit ? (targetLedger?.title || '') : ''} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-gray-900 shadow-sm" placeholder="예: 판교 SK주유소 고급유" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">결제일 *</label>
                        <input name="recordDate" type="date" required defaultValue={isEdit ? (targetLedger?.recordDate || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-semibold text-gray-900 cursor-pointer shadow-sm text-sm" />
                    </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-inner">
                    <div>
                        <label className="block text-[13px] font-black text-blue-900 mb-2 ml-1">총 결제 금액 💰 *</label>
                        <div className="flex items-center gap-2">
                            <input name="amount" type="number" required min={0} defaultValue={isEdit ? (targetLedger?.amount || '') : ''} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition font-black text-blue-900 text-right text-lg placeholder-blue-200" placeholder="0" />
                            <span className="text-sm font-bold text-blue-800 opacity-70 shrink-0">원</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[13px] font-black text-blue-900 mb-2 ml-1">기록 시점의 주행거리 🚗 *</label>
                        <div className="flex items-center gap-2">
                            <input name="mileage" type="number" required min={0} defaultValue={isEdit ? (targetLedger?.mileageAtRecord || '') : ''} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition font-black text-blue-900 text-right text-lg placeholder-blue-200" placeholder="0" />
                            <span className="text-sm font-bold text-blue-800 opacity-70 shrink-0">km</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">메모 (선택)</label>
                    <textarea name="memo" rows={2} defaultValue={isEdit ? (targetLedger?.memo || '') : ''} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition font-semibold text-gray-900 leading-relaxed shadow-sm" placeholder="상세 내역을 입력하세요..."></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setModalMode(isEdit ? "VIEW" : "NONE")} className="px-6 py-3.5 text-[15px] font-bold text-gray-600 bg-gray-100/80 rounded-xl hover:bg-gray-200 transition">취소</button>
                    <button type="submit" disabled={createLedgerMutation.isPending} className="px-6 py-3.5 text-[15px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition transform active:scale-95 disabled:opacity-50">
                        저장
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
                    <p className="text-sm text-gray-500 mt-1">기록된 차계부 내역을 페이징하여 확인하세요.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2 shrink-0"
                >
                    지출 내역 추가
                </button>
            </div>

            {/* 필터 및 페이지 크기 설정 트레이 */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-5 items-end justify-between">
                <div className="flex flex-col md:flex-row gap-5 w-full">
                    <div className="shrink-0 md:w-56">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">차량 선택 필터</label>
                        <select
                            value={selectedVehicleId?.toString() || '0'}
                            onChange={(e) => {
                                setSelectedVehicleId(Number(e.target.value))
                                setPage(0) // 차량 변경 시 첫 페이지로
                            }}
                            className="bg-gray-50 border border-gray-200 text-gray-800 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-3 outline-none cursor-pointer shadow-sm"
                        >
                            <option value="0">🚗 모든 차량 정보 보기</option>
                            {vehicles?.map(v => (
                                <option key={v.id} value={v.id.toString()}>{v.isPrimary ? '⭐ ' : ''}{v.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full overflow-hidden">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">분류 별 필터</label>
                        <div className="flex flex-nowrap overflow-x-auto pb-1 gap-2 no-scrollbar">
                            <button
                                onClick={() => {
                                    setFilterCategory("ALL")
                                    setPage(0)
                                }}
                                className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors border shrink-0 \${filterCategory === "ALL"
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                전체
                            </button>
                            {metadata?.categories.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => {
                                        setFilterCategory(c.code as LedgerCategory)
                                        setPage(0)
                                    }}
                                    className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors border shrink-0 \${filterCategory === c.code
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {c.displayName}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">페이지 당 표시</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value))
                            setPage(0)
                        }}
                        className="bg-gray-50 border border-gray-200 text-gray-800 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500 block w-24 py-3 px-3 outline-none cursor-pointer shadow-sm"
                    >
                        <option value={5}>5개</option>
                        <option value={10}>10개</option>
                        <option value={20}>20개</option>
                    </select>
                </div>
            </div>

            {/* 테이블 뷰 영역 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap table-fixed min-w-[850px]">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-black text-gray-500 tracking-widest uppercase">
                                <th className="px-6 py-4 w-[16%]">결제일자</th>
                                <th className="px-6 py-4 w-[34%]">내용</th>
                                <th className="px-6 py-4 w-[12%]">항목</th>
                                <th className="px-6 py-4 w-[16%] text-right">주행거리</th>
                                <th className="px-6 py-4 w-[16%] text-right">결제 금액</th>
                                <th className="px-6 py-4 w-[6%]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLedgers.map(l => (
                                <tr key={l.id} onClick={() => handleRowClick(l.id)} className="hover:bg-blue-50/40 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4 text-[13px] font-bold text-gray-600">
                                        {new Date(l.recordDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 truncate">
                                        <div className="text-sm font-bold text-gray-950 truncate">{l.title}</div>
                                        <div className="text-[11px] font-bold text-gray-400 mt-1">{vehicles?.find(v => v.id === l.vehicleId)?.name || '기타'}</div>
                                    </td>
                                    <td className="px-6 py-4">{getCategoryBadge(l.category)}</td>
                                    <td className="px-6 py-4 text-right text-[13.5px] font-bold text-gray-700">{l.mileageAtRecord.toLocaleString()} km</td>
                                    <td className="px-6 py-4 text-right text-[15px] font-black text-gray-900">{l.amount.toLocaleString()} 원</td>
                                    <td className="px-6 py-4 text-center">
                                        <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이징 컨트롤러 */}
                <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-500 font-medium">
                        총 <span className="font-bold text-gray-900">{pageData?.totalElements || 0}</span>개의 항목 중 
                        {pageData && pageData.totalElements > 0 ? (
                            ` ${page * pageSize + 1} - ${Math.min((page + 1) * pageSize, pageData.totalElements)}`
                        ) : ' 0'} 표시
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                        {/* 첫 페이지로 */}
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(0)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="첫 페이지"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                        </button>

                        {/* 이전 페이지로 */}
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all mr-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {(() => {
                                const totalPages = pageData?.totalPages || 0;
                                const pageNumbers = [];
                                
                                if (totalPages <= 7) {
                                    for (let i = 0; i < totalPages; i++) pageNumbers.push(i);
                                } else {
                                    if (page < 4) {
                                        // 초반부: 1 2 3 4 5 ... Last
                                        pageNumbers.push(0, 1, 2, 3, 4, 'ellipsis-end', totalPages - 1);
                                    } else if (page > totalPages - 5) {
                                        // 후반부: 1 ... L-4 L-3 L-2 L-1 Last
                                        pageNumbers.push(0, 'ellipsis-start', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
                                    } else {
                                        // 중간부: 1 ... p-1 p p+1 ... Last
                                        pageNumbers.push(0, 'ellipsis-start', page - 1, page, page + 1, 'ellipsis-end', totalPages - 1);
                                    }
                                }

                                return pageNumbers.map((n, idx) => {
                                    if (typeof n === 'string') {
                                        return <span key={`ellipsis-\${idx}`} className="w-9 h-9 flex items-end justify-center text-gray-400 font-bold pb-2">...</span>;
                                    }
                                    return (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className={`w-9 h-9 rounded-lg text-[13px] font-black transition-all ${page === n 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                                : 'text-gray-900 bg-gray-50 hover:bg-white hover:text-blue-600 border border-gray-200'}`}
                                        >
                                            {n + 1}
                                        </button>
                                    );
                                });
                            })()}
                        </div>

                        {/* 다음 페이지로 */}
                        <button
                            disabled={page >= (pageData?.totalPages || 1) - 1}
                            onClick={() => setPage(p => Math.min((pageData?.totalPages || 1) - 1, p + 1))}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all ml-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        {/* 마지막 페이지로 */}
                        <button
                            disabled={page >= (pageData?.totalPages || 1) - 1}
                            onClick={() => setPage((pageData?.totalPages || 1) - 1)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="마지막 페이지"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Overlay 생략 (기존과 동일) */}
            {modalMode !== "NONE" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setModalMode("NONE")}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
                        {modalMode === "VIEW" ? renderSummaryView() : renderEditForm()}
                    </div>
                </div>
            )}
        </div>
    )
}
