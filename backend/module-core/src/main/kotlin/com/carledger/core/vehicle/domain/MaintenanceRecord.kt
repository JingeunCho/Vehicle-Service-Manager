package com.carledger.core.vehicle.domain

import com.carledger.core.common.domain.BaseEntity
import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate

/**
 * 차량 정비 기록 (소모품 교환 이력)
 * OneToMany 관계로 Vehicle에 연결되며, 각 소모품 종류별로 교환 시마다 row가 추가됨.
 * MaintenanceType Enum으로 소모품 종류를 구분하여 확장성을 최대화.
 */
@Entity
@Table(name = "maintenance_record")
class MaintenanceRecord(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    val vehicle: Vehicle,

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type", nullable = false, length = 50)
    val maintenanceType: MaintenanceType,

    @Column(name = "maintenance_date", nullable = false)
    var maintenanceDate: LocalDate,

    /** 교환 시점 주행거리 (선택) */
    @Column(name = "mileage_at_record")
    var mileageAtRecord: Int? = null,

    /** 비용 (선택) */
    @Column(name = "cost", precision = 12, scale = 2)
    var cost: BigDecimal? = null,

    /** 제품명, 브랜드, 메모 등 자유 입력 (선택) */
    @Column(name = "notes", length = 500)
    var notes: String? = null

) : BaseEntity()

enum class MaintenanceType(val displayName: String) {
    ENGINE_OIL("엔진오일"),
    TRANSMISSION_OIL("미션오일"),
    DIFFERENTIAL_OIL("디퍼런셜오일"),
    FRONT_BRAKE_PAD("전륜 브레이크 패드"),
    REAR_BRAKE_PAD("후륜 브레이크 패드"),
    FRONT_BRAKE_ROTOR("전륜 브레이크 로터"),
    REAR_BRAKE_ROTOR("후륜 브레이크 로터"),
    COOLANT("냉각수"),
    OTHER("기타")
}
