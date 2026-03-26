package com.carledger.core.vehicle.domain

enum class MaintenanceType(val categoryName: String) {
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
