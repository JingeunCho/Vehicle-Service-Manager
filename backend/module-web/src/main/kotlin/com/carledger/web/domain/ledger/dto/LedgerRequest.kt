package com.carledger.web.domain.ledger.dto

import java.time.LocalDate

data class CreateLedgerRequest(
    val vehicleId: Long,
    val categoryName: String,
    val amount: Long,
    val recordDate: LocalDate,
    val memo: String = "",
    val mileage: Int? = null
)
