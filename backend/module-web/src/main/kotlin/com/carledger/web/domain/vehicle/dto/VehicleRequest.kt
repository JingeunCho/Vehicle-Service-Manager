package com.carledger.web.domain.vehicle.dto

import com.carledger.core.vehicle.domain.DriveType
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
    // VehicleSpec
    val driveType: DriveType? = null,
    val frontWheelBrand: String? = null,
    val frontWheelModel: String? = null,
    val frontWheelDiameter: Int? = null,
    val frontWheelWidth: Float? = null,
    val frontWheelOffset: Int? = null,
    val rearWheelBrand: String? = null,
    val rearWheelModel: String? = null,
    val rearWheelDiameter: Int? = null,
    val rearWheelWidth: Float? = null,
    val rearWheelOffset: Int? = null,
    val frontTireBrand: String? = null,
    val frontTireModel: String? = null,
    val frontTireWidth: Int? = null,
    val frontTireAspectRatio: Int? = null,
    val frontTireDiameter: Int? = null,
    val rearTireBrand: String? = null,
    val rearTireModel: String? = null,
    val rearTireWidth: Int? = null,
    val rearTireAspectRatio: Int? = null,
    val rearTireDiameter: Int? = null
)

data class UpdateVehicleRequest(
    val name: String? = null,
    val carModel: String? = null,
    val licensePlate: String? = null,
    val fuelType: FuelType? = null,
    val currentMileage: Int? = null,
    val tuningHistory: String? = null,
    val insuranceDate: LocalDate? = null,
    // VehicleSpec
    val driveType: DriveType? = null,
    val frontWheelBrand: String? = null,
    val frontWheelModel: String? = null,
    val frontWheelDiameter: Int? = null,
    val frontWheelWidth: Float? = null,
    val frontWheelOffset: Int? = null,
    val rearWheelBrand: String? = null,
    val rearWheelModel: String? = null,
    val rearWheelDiameter: Int? = null,
    val rearWheelWidth: Float? = null,
    val rearWheelOffset: Int? = null,
    val frontTireBrand: String? = null,
    val frontTireModel: String? = null,
    val frontTireWidth: Int? = null,
    val frontTireAspectRatio: Int? = null,
    val frontTireDiameter: Int? = null,
    val rearTireBrand: String? = null,
    val rearTireModel: String? = null,
    val rearTireWidth: Int? = null,
    val rearTireAspectRatio: Int? = null,
    val rearTireDiameter: Int? = null
)
