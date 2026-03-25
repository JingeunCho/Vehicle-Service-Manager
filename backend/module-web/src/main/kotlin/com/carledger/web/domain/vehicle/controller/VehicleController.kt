package com.carledger.web.domain.vehicle.controller

import com.carledger.core.ledger.repository.LedgerRepository
import com.carledger.core.vehicle.service.VehicleService
import com.carledger.web.domain.vehicle.dto.CreateVehicleRequest
import com.carledger.web.domain.vehicle.dto.UpdateVehicleRequest
import com.carledger.web.domain.vehicle.dto.VehicleResponse
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import java.net.URI

@RestController
@RequestMapping("/api/vehicles")
class VehicleController(
    private val vehicleService: VehicleService,
    private val ledgerRepository: LedgerRepository
) {

    @GetMapping
    fun getMyVehicles(authentication: Authentication?): ResponseEntity<List<VehicleResponse>> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val vehicles = vehicleService.getMyVehicles(email)
        return ResponseEntity.ok(vehicles.map { vehicle ->
            val maintenance = ledgerRepository.findMaintenanceRecordsByVehicleId(vehicle.id)
            VehicleResponse.of(vehicle, maintenance)
        })
    }

    @GetMapping("/{id}")
    fun getVehicle(@PathVariable id: Long, authentication: Authentication?): ResponseEntity<VehicleResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val vehicle = vehicleService.getVehicleById(id, email)
        val maintenance = ledgerRepository.findMaintenanceRecordsByVehicleId(vehicle.id)
        return ResponseEntity.ok(VehicleResponse.of(vehicle, maintenance))
    }

    @PostMapping
    fun createVehicle(
        @RequestBody request: CreateVehicleRequest,
        authentication: Authentication?
    ): ResponseEntity<VehicleResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val vehicle = vehicleService.createVehicle(
            email = email,
            name = request.name,
            carModel = request.carModel,
            licensePlate = request.licensePlate,
            fuelType = request.fuelType,
            currentMileage = request.currentMileage,
            tuningHistory = request.tuningHistory,
            insuranceDate = request.insuranceDate,
            driveType = request.driveType,
            frontWheelBrand = request.frontWheelBrand,
            frontWheelModel = request.frontWheelModel,
            frontWheelDiameter = request.frontWheelDiameter,
            frontWheelWidth = request.frontWheelWidth,
            frontWheelOffset = request.frontWheelOffset,
            rearWheelBrand = request.rearWheelBrand,
            rearWheelModel = request.rearWheelModel,
            rearWheelDiameter = request.rearWheelDiameter,
            rearWheelWidth = request.rearWheelWidth,
            rearWheelOffset = request.rearWheelOffset,
            frontTireBrand = request.frontTireBrand,
            frontTireModel = request.frontTireModel,
            frontTireWidth = request.frontTireWidth,
            frontTireAspectRatio = request.frontTireAspectRatio,
            frontTireDiameter = request.frontTireDiameter,
            rearTireBrand = request.rearTireBrand,
            rearTireModel = request.rearTireModel,
            rearTireWidth = request.rearTireWidth,
            rearTireAspectRatio = request.rearTireAspectRatio,
            rearTireDiameter = request.rearTireDiameter
        )
        return ResponseEntity.created(URI.create("/api/vehicles/${vehicle.id}")).body(VehicleResponse.of(vehicle))
    }

    @PutMapping("/{id}")
    fun updateVehicle(
        @PathVariable id: Long,
        @RequestBody request: UpdateVehicleRequest,
        authentication: Authentication?
    ): ResponseEntity<VehicleResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val vehicle = vehicleService.updateVehicle(
            vehicleId = id,
            email = email,
            name = request.name,
            carModel = request.carModel,
            licensePlate = request.licensePlate,
            fuelType = request.fuelType,
            currentMileage = request.currentMileage,
            tuningHistory = request.tuningHistory,
            insuranceDate = request.insuranceDate,
            driveType = request.driveType,
            frontWheelBrand = request.frontWheelBrand,
            frontWheelModel = request.frontWheelModel,
            frontWheelDiameter = request.frontWheelDiameter,
            frontWheelWidth = request.frontWheelWidth,
            frontWheelOffset = request.frontWheelOffset,
            rearWheelBrand = request.rearWheelBrand,
            rearWheelModel = request.rearWheelModel,
            rearWheelDiameter = request.rearWheelDiameter,
            rearWheelWidth = request.rearWheelWidth,
            rearWheelOffset = request.rearWheelOffset,
            frontTireBrand = request.frontTireBrand,
            frontTireModel = request.frontTireModel,
            frontTireWidth = request.frontTireWidth,
            frontTireAspectRatio = request.frontTireAspectRatio,
            frontTireDiameter = request.frontTireDiameter,
            rearTireBrand = request.rearTireBrand,
            rearTireModel = request.rearTireModel,
            rearTireWidth = request.rearTireWidth,
            rearTireAspectRatio = request.rearTireAspectRatio,
            rearTireDiameter = request.rearTireDiameter
        )
        return ResponseEntity.ok(VehicleResponse.of(vehicle))
    }

    @PutMapping("/{id}/primary")
    fun setPrimaryVehicle(
        @PathVariable id: Long,
        authentication: Authentication?
    ): ResponseEntity<VehicleResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val vehicle = vehicleService.setPrimaryVehicle(id, email)
        return ResponseEntity.ok(VehicleResponse.of(vehicle))
    }

    @DeleteMapping("/{id}")
    fun deleteVehicle(@PathVariable id: Long, authentication: Authentication?): ResponseEntity<Void> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        vehicleService.deleteVehicle(id, email)
        return ResponseEntity.noContent().build()
    }
}
