package com.carledger.core.ledger.domain

import com.carledger.core.common.domain.BaseEntity
import com.carledger.core.vehicle.domain.MaintenanceType
import com.carledger.core.vehicle.domain.Vehicle
import jakarta.persistence.*
import java.math.BigDecimal
import java.time.Instant

enum class LedgerCategory(val categoryName: String) {
    REFUEL("주유/충전"),
    MAINTENANCE("정비/수리"),
    CAR_SUPPLIES("차량 용품 구입"),
    FIXED_COST("보험료/세금"),
    ETC("기타")
}

@Entity
@Table(name = "ledger", catalog = "car_ledger")
class Ledger(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    val vehicle: Vehicle,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    var category: LedgerCategory,

    @Column(nullable = false, length = 100)
    var title: String,

    @Column(name = "record_date", nullable = false)
    var recordDate: Instant,

    @Column(nullable = false, precision = 15, scale = 2)
    var amount: BigDecimal,

    @Column(name = "mileage_at_record", nullable = false)
    var mileageAtRecord: Int,

    @Column(length = 500)
    var memo: String = "",

    // 주유 전용 컬럼 (Nullable)
    @Column(name = "unit_price", precision = 10, scale = 2)
    var unitPrice: BigDecimal? = null,

    @Column(precision = 10, scale = 2)
    var volume: BigDecimal? = null,

    @Column(name = "gas_station_name", length = 100)
    var gasStationName: String? = null,

    @Column(name = "is_opinet_auto")
    var isOpinetAuto: Boolean = false,

    /**
     * 소모품 교환 유형 (nullable)
     * - null: 일반 차계부 기록 (연료비, 보험료, 차량 용품 구입 등)
     * - not null: 소모품 교환 기록 → 차량 마지막 정비 이력 추적에 활용
     * 
     * 예) 엔진오일 교환 시 amount=70000, maintenanceType=ENGINE_OIL
     *     → 차량 조회 시 마지막 엔진오일 교환일 자동 계산 가능
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type", length = 50)
    var maintenanceType: MaintenanceType? = null

) : BaseEntity()
