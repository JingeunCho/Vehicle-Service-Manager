package com.carledger.web.domain.vehicle.dto

import com.carledger.core.vehicle.domain.FuelType
import java.time.LocalDate

data class CreateVehicleRequest(
    val name: String,
    val carModel: String,
    val licensePlate: String,
    val fuelType: FuelType,
    val currentMileage: Int = 0,
    val tuningHistory: String? = null,
    val insuranceDate: LocalDate? = null,
    val oilInterval: Int? = null,
    val lastOilChangeDate: LocalDate? = null
)

data class UpdateVehicleRequest(
    val name: String?,
    val carModel: String?,
    val licensePlate: String?,
    val fuelType: FuelType?,
    val currentMileage: Int?,
    val tuningHistory: String? = null,
    val insuranceDate: LocalDate? = null,
    val oilInterval: Int? = null,
    val lastOilChangeDate: LocalDate? = null
)
