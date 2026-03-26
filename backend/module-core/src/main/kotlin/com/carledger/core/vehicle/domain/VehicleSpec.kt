package com.carledger.core.vehicle.domain

import com.carledger.core.common.domain.BaseEntity
import jakarta.persistence.*

/**
 * 차량 기계적 제원
 * - driveType: 구동 방식 (FF, FR, MR, RR, AWD)
 * - front/rear Wheel, Tire: 최신 WheelSpec/TireSpec의 ID를 FK로 참조
 *
 * [이력 관리 전략]
 * WheelSpec/TireSpec 교체 시 → 새 row 생성 → front/rearWheelId/TireId 포인터만 업데이트
 * 과거 WheelSpec/TireSpec row는 vehicle_id로 조회 가능 → 자연스럽게 이력 보존
 * ※ orphanRemoval을 사용하지 않으므로 FK 변경 시 이전 row가 삭제되지 않음
 */
@Entity
@Table(name = "vehicle_spec", catalog = "car_ledger")
class VehicleSpec(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false, unique = true)
    val vehicle: Vehicle,

    @Enumerated(EnumType.STRING)
    @Column(name = "drive_type", length = 10)
    var driveType: DriveType? = null,

    /**
     * 현재 장착 중인 전륜 휠 (최신 WheelSpec row 참조)
     * cascade/orphanRemoval 없음 → 교체해도 과거 row 보존
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "front_wheel_id")
    var frontWheel: WheelSpec? = null,

    /**
     * 현재 장착 중인 후륜 휠 (최신 WheelSpec row 참조)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rear_wheel_id")
    var rearWheel: WheelSpec? = null,

    /**
     * 현재 장착 중인 전륜 타이어 (최신 TireSpec row 참조)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "front_tire_id")
    var frontTire: TireSpec? = null,

    /**
     * 현재 장착 중인 후륜 타이어 (최신 TireSpec row 참조)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rear_tire_id")
    var rearTire: TireSpec? = null

) : BaseEntity()
