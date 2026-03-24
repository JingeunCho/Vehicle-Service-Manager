package com.carledger.web.domain.vehicle.dto

import com.carledger.core.vehicle.domain.FuelType
import com.carledger.core.vehicle.domain.Vehicle

data class VehicleResponse(
    val id: Long,
    val name: String,
    val carModel: String,
    val licensePlate: String,
    val fuelType: FuelType,
    val currentMileage: Int
) {
    companion object {
        fun of(vehicle: Vehicle): VehicleResponse {
            return VehicleResponse(
                id = vehicle.id,
                name = vehicle.name,
                carModel = vehicle.carModel,
                licensePlate = vehicle.licensePlate,
                fuelType = vehicle.fuelType,
                currentMileage = vehicle.currentMileage
            )
        }
    }
}
