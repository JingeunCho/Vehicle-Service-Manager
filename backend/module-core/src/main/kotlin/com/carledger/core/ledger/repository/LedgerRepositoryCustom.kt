package com.carledger.core.ledger.repository

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.ledger.domain.LedgerCategory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.time.Instant

interface LedgerRepositoryCustom {
    /**
     * 특정 사용자의 지출 내역을 페이징하여 조회합니다.
     * @param memberId 사용자 ID (필수)
     * @param vehicleId 차량 ID (0L 또는 null이면 모든 차량 조회)
     * @param pageable 페이징 정보 (page, size)
     */
    fun findByCriteria(
        memberId: Long,
        vehicleId: Long? = null,
        category: LedgerCategory? = null,
        startDate: Instant? = null,
        endDate: Instant? = null,
        pageable: Pageable
    ): Page<Ledger>
}
