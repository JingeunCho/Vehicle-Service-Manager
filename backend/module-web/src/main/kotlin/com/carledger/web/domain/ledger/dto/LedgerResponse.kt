package com.carledger.web.domain.ledger.dto

import com.carledger.core.ledger.domain.Ledger
import java.time.LocalDate

data class LedgerResponse(
    val id: Long,
    val vehicleId: Long,
    val categoryName: String,
    val categoryType: String,
    val amount: Long,
    val recordDate: LocalDate,
    val memo: String,
    val mileageAtRecord: Int
) {
    companion object {
        fun of(ledger: Ledger): LedgerResponse {
            return LedgerResponse(
                id = ledger.id,
                vehicleId = ledger.vehicle.id,
                categoryName = ledger.category.name,
                categoryType = ledger.category.categoryType.name,
                amount = ledger.amount.toLong(),
                recordDate = ledger.recordDate,
                memo = ledger.memo,
                mileageAtRecord = ledger.mileageAtRecord
            )
        }
    }
}
