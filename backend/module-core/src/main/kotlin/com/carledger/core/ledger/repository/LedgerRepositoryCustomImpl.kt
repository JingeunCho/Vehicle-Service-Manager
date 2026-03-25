package com.carledger.core.ledger.repository

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.core.ledger.domain.QLedger.ledger
import com.querydsl.core.types.dsl.BooleanExpression
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
class LedgerRepositoryCustomImpl(
    private val queryFactory: JPAQueryFactory
) : LedgerRepositoryCustom {

    override fun findByVehicleAndDateRange(vehicleId: Long, startDate: LocalDate?, endDate: LocalDate?): List<Ledger> {
        return queryFactory
            .selectFrom(ledger)
            .where(
                vehicleEq(vehicleId),
                dateBetween(startDate, endDate),
                ledger.isDeleted.eq(false)
            )
            .orderBy(ledger.recordDate.desc())
            .fetch()
    }

    override fun findByVehicleAndCategory(vehicleId: Long, category: LedgerCategory): List<Ledger> {
        return queryFactory
            .selectFrom(ledger)
            .where(
                vehicleEq(vehicleId),
                categoryEq(category),
                ledger.isDeleted.eq(false)
            )
            .orderBy(ledger.recordDate.desc())
            .fetch()
    }

    private fun vehicleEq(vehicleId: Long?): BooleanExpression? {
        return vehicleId?.let { ledger.vehicle.id.eq(it) }
    }

    private fun categoryEq(category: LedgerCategory?): BooleanExpression? {
        return category?.let { ledger.category.eq(it) }
    }

    private fun dateBetween(startDate: LocalDate?, endDate: LocalDate?): BooleanExpression? {
        if (startDate == null && endDate == null) return null
        if (startDate != null && endDate == null) return ledger.recordDate.goe(startDate)
        if (startDate == null && endDate != null) return ledger.recordDate.loe(endDate)
        return ledger.recordDate.between(startDate, endDate)
    }
}
