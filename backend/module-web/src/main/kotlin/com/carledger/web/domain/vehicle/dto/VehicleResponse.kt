package com.carledger.web.domain.vehicle.dto

import com.carledger.core.vehicle.domain.FuelType
import com.carledger.core.vehicle.domain.Vehicle
import java.time.LocalDate

data class VehicleResponse(
    val id: Long,
    val name: String,
    val carModel: String,
    val licensePlate: String,
    val fuelType: FuelType,
    val currentMileage: Int,
    val tuningHistory: String?,
    val insuranceDate: LocalDate?,
    val oilInterval: Int?,
    val lastOilChangeDate: LocalDate?,
    val isPrimary: Boolean
) {
    companion object {
        fun of(vehicle: Vehicle): VehicleResponse {
            return VehicleResponse(
                id = vehicle.id,
                name = vehicle.name,
                carModel = vehicle.carModel,
                licensePlate = vehicle.licensePlate,
                fuelType = vehicle.fuelType,
                currentMileage = vehicle.currentMileage,
                tuningHistory = vehicle.tuningHistory,
                insuranceDate = vehicle.insuranceDate,
                oilInterval = vehicle.oilInterval,
                lastOilChangeDate = vehicle.lastOilChangeDate,
                isPrimary = vehicle.isPrimary
            )
        }
    }
}
