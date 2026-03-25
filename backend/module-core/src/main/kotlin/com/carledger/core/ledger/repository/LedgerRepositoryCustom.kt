package com.carledger.core.ledger.repository

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.ledger.domain.LedgerCategory
import java.time.LocalDate

interface LedgerRepositoryCustom {
    fun findByVehicleAndDateRange(vehicleId: Long, startDate: LocalDate?, endDate: LocalDate?): List<Ledger>
    fun findByVehicleAndCategory(vehicleId: Long, category: LedgerCategory): List<Ledger>
}
