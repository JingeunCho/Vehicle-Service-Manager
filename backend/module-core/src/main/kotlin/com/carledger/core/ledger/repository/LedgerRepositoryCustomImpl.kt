package com.carledger.core.ledger.repository

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.core.ledger.domain.QLedger.ledger
import com.querydsl.core.types.dsl.BooleanExpression
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class LedgerRepositoryCustomImpl(
    private val queryFactory: JPAQueryFactory
) : LedgerRepositoryCustom {

    override fun findByCriteria(
        memberId: Long,
        vehicleId: Long?,
        category: LedgerCategory?,
        startDate: Instant?,
        endDate: Instant?,
        pageable: Pageable
    ): Page<Ledger> {
        // 컨텐츠 조회 쿼리
        val content = queryFactory
            .selectFrom(ledger)
            .where(
                memberEq(memberId),
                vehicleEq(vehicleId),
                categoryEq(category),
                dateBetween(startDate, endDate),
                ledger.isDeleted.eq(false)
            )
            .orderBy(ledger.recordDate.desc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        // 전체 카운트 조회 쿼리
        val total = queryFactory
            .select(ledger.count())
            .from(ledger)
            .where(
                memberEq(memberId),
                vehicleEq(vehicleId),
                categoryEq(category),
                dateBetween(startDate, endDate),
                ledger.isDeleted.eq(false)
            )
            .fetchOne() ?: 0L

        return PageImpl(content, pageable, total)
    }

    private fun memberEq(memberId: Long): BooleanExpression {
        return ledger.vehicle.member.id.eq(memberId)
    }

    private fun vehicleEq(vehicleId: Long?): BooleanExpression? {
        if (vehicleId == null || vehicleId == 0L) return null
        return ledger.vehicle.id.eq(vehicleId)
    }

    private fun categoryEq(category: LedgerCategory?): BooleanExpression? {
        return category?.let { ledger.category.eq(it) }
    }

    private fun dateBetween(startDate: Instant?, endDate: Instant?): BooleanExpression? {
        if (startDate == null && endDate == null) return null
        if (startDate != null && endDate == null) return ledger.recordDate.goe(startDate)
        if (startDate == null && endDate != null) return ledger.recordDate.loe(endDate)
        return ledger.recordDate.between(startDate, endDate)
    }
}
