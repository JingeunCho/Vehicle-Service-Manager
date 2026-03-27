package com.carledger.web.domain.ledger.dto

import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.core.vehicle.domain.MaintenanceType
import java.time.Instant

data class CreateLedgerRequest(
    val vehicleId: Long,
    /** 카테고리 (Enum) */
    val category: LedgerCategory,
    /** 세부 지출 내용 (기존 categoryName 역할을 title로 명확화) */
    val title: String,
    val amount: Long,
    val recordDate: Instant,
    val memo: String = "",
    val mileage: Int? = null,
    /** 단가 (주유 시 선택) */
    val unitPrice: Long? = null,
    /** 주유량 (주유 시 선택) */
    val volume: Double? = null,
    /** 소모품 교환 종류 (선택) - 입력 시 차량 정비 이력 추적에 활용 */
    val maintenanceType: MaintenanceType? = null
)
