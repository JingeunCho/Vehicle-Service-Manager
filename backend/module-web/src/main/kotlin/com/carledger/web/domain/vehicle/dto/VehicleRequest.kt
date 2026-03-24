package com.carledger.web.domain.vehicle.dto

import com.carledger.core.vehicle.domain.FuelType

data class CreateVehicleRequest(
    val name: String,
    val carModel: String,
    val licensePlate: String,
    val fuelType: FuelType,
    val currentMileage: Int = 0
)

data class UpdateVehicleRequest(
    val name: String?,
    val carModel: String?,
    val licensePlate: String?,
    val fuelType: FuelType?,
    val currentMileage: Int?
)
