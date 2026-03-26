package com.carledger.core.vehicle.domain

import com.carledger.core.common.domain.BaseEntity
import jakarta.persistence.*

/**
 * 타이어 규격 엔터티
 * - vehicle_id: 어느 차량의 이력인지 추적
 * - VehicleSpec에서 front_tire_id / rear_tire_id로 최신 row를 참조
 * - 교체 시 새 row 추가 → 과거 row는 삭제하지 않으므로 이력이 자동 보존
 */
@Entity
@Table(name = "tire_spec", catalog = "car_ledger")
class TireSpec(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    /** 어느 차량 소속인지 추적 (이력 조회용) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    val vehicle: Vehicle,

    /** 제조사 (예: Michelin, Bridgestone, Pirelli) */
    @Column(name = "brand", length = 100)
    var brand: String? = null,

    /** 모델명 (예: Pilot Sport 4, Potenza RE71RS) */
    @Column(name = "model", length = 100)
    var model: String? = null,

    /** 단면폭 - mm (예: 225/45/17 에서 225) */
    @Column(name = "width")
    var width: Int? = null,

    /** 편평비 - % (예: 225/45/17 에서 45) */
    @Column(name = "aspect_ratio")
    var aspectRatio: Int? = null,

    /** 인치 (예: 225/45/17 에서 17) */
    @Column(name = "diameter")
    var diameter: Int? = null

) : BaseEntity()
