package com.carledger.web.domain.ledger.dto

import com.carledger.core.ledger.domain.Ledger
import java.time.LocalDate

data class LedgerResponse(
    val id: Long,
    val vehicleId: Long,
    /** 세부 지출 내용 */
    val title: String,
    /** 카테고리 (Enum) */
    val category: String,
    val amount: Long,
    val recordDate: LocalDate,
    val memo: String,
    val mileageAtRecord: Int,
    /** 소모품 종류 (null이면 일반 차계부 기록) */
    val maintenanceType: String?
) {
    companion object {
        fun of(ledger: Ledger): LedgerResponse {
            return LedgerResponse(
                id = ledger.id,
                vehicleId = ledger.vehicle.id,
                title = ledger.title,
                category = ledger.category.name,
                amount = ledger.amount.toLong(),
                recordDate = ledger.recordDate,
                memo = ledger.memo,
                mileageAtRecord = ledger.mileageAtRecord,
                maintenanceType = ledger.maintenanceType?.name
            )
        }
    }
}
