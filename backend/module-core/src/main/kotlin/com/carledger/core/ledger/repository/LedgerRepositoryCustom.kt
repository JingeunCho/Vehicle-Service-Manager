package com.carledger.core.ledger.repository

import com.carledger.core.ledger.domain.Ledger
import java.time.LocalDate

interface LedgerRepositoryCustom {
    fun findByVehicleAndDateRange(vehicleId: Long, startDate: LocalDate?, endDate: LocalDate?): List<Ledger>
    fun findByVehicleAndCategory(vehicleId: Long, categoryId: Long): List<Ledger>
}
