package com.carledger.web.domain.ledger.dto

import com.carledger.core.ledger.domain.Ledger
import java.time.Instant

data class LedgerResponse(
    val id: Long,
    val vehicleId: Long,
    /** 세부 지출 내용 */
    val title: String,
    /** 카테고리 (Enum) */
    val category: String,
    val amount: Long,
    val recordDate: Instant,
    val memo: String,
    val mileageAtRecord: Int,
    val unitPrice: Long?,
    val volume: Double?,
    /** 소모품 종류 (null이면 일반 차계부 기록) */
    val maintenanceType: String?,
    /** 차량명 (닉네임 또는 모델명) */
    val vehicleName: String,
    /** 유종 (ICE, EV 등) */
    val fuelType: String,
    /** 이번 주유/충전 시 계산된 구간 연비 (null 가능) */
    val calculatedEfficiency: Double? = null
) {
    companion object {
        fun of(ledger: Ledger, calculatedEfficiency: Double? = null): LedgerResponse {
            return LedgerResponse(
                id = ledger.id,
                vehicleId = ledger.vehicle.id,
                title = ledger.title,
                category = ledger.category.name,
                amount = ledger.amount.toLong(),
                recordDate = ledger.recordDate,
                memo = ledger.memo,
                mileageAtRecord = ledger.mileageAtRecord,
                unitPrice = ledger.unitPrice?.toLong(),
                volume = ledger.volume?.toDouble(),
                maintenanceType = ledger.maintenanceType?.name,
                vehicleName = ledger.vehicle.name ?: ledger.vehicle.carModel,
                fuelType = ledger.vehicle.fuelType.name,
                calculatedEfficiency = calculatedEfficiency
            )
        }
    }
}
