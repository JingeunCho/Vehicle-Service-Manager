package com.carledger.core.vehicle.domain

import jakarta.persistence.*

@Entity
@Table(name = "vehicle")
class Vehicle(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    val member: Member,

    @Column(nullable = false, length = 100)
    var name: String,

    @Column(name = "car_model", nullable = false, length = 100)
    var carModel: String,

    @Column(name = "license_plate", nullable = false, length = 50)
    var licensePlate: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false, length = 20)
    var fuelType: FuelType,

    @Column(name = "current_mileage", nullable = false)
    var currentMileage: Int = 0,

    @Column(name = "tuning_history", columnDefinition = "TEXT")
    var tuningHistory: String? = null,

    @Column(name = "insurance_date")
    var insuranceDate: java.time.LocalDate? = null,

    @Column(name = "oil_interval")
    var oilInterval: Int? = null,

    @Column(name = "last_oil_change_date")
    var lastOilChangeDate: java.time.LocalDate? = null,

    @Column(name = "is_primary", nullable = false)
    var isPrimary: Boolean = false

) : BaseEntity()

enum class FuelType {
    PREMIUM_GASOLINE, REGULAR_GASOLINE, DIESEL, LPG, EV, HYDROGEN
}
