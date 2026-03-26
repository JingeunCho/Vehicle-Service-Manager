package com.carledger.core.vehicle.domain

import com.carledger.core.common.domain.BaseEntity
import jakarta.persistence.*

/**
 * 휠 규격 엔터티
 * - vehicle_id: 어느 차량의 이력인지 추적
 * - VehicleSpec에서 front_wheel_id / rear_wheel_id로 최신 row를 참조
 * - 교체 시 새 row 추가 → 과거 row는 삭제하지 않으므로 이력이 자동 보존
 */
@Entity
@Table(name = "wheel_spec", catalog = "car_ledger")
class WheelSpec(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    /** 어느 차량 소속인지 추적 (이력 조회용) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    val vehicle: Vehicle,

    /** 제조사 (예: Work, Enkei, BBS) */
    @Column(name = "brand", length = 100)
    var brand: String? = null,

    /** 모델명 (예: Emotion CR, NT03, RS-G) */
    @Column(name = "model", length = 100)
    var model: String? = null,

    /** 직경 - inch (예: 17, 18) */
    @Column(name = "diameter")
    var diameter: Int? = null,

    /** 림폭 - J 단위 (예: 8.5 → 8.5J) */
    @Column(name = "width")
    var width: Float? = null,

    /** 옵셋 (예: +35, -5) */
    @Column(name = "wheel_offset")
    var offset: Int? = null

) : BaseEntity()
