package com.carledger.web.domain.vehicle.controller

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
    private val vehicleService: VehicleService
) {

    @GetMapping
    fun getMyVehicles(authentication: Authentication?): ResponseEntity<List<VehicleResponse>> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val vehicles = vehicleService.getMyVehicles(email)
        return ResponseEntity.ok(vehicles.map { VehicleResponse.of(it) })
    }

    @GetMapping("/{id}")
    fun getVehicle(@PathVariable id: Long, authentication: Authentication?): ResponseEntity<VehicleResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val vehicle = vehicleService.getVehicleById(id, email)
        return ResponseEntity.ok(VehicleResponse.of(vehicle))
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
            currentMileage = request.currentMileage
        )
        return ResponseEntity.created(URI.create("/api/vehicles/\${vehicle.id}")).body(VehicleResponse.of(vehicle))
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
            currentMileage = request.currentMileage
        )
        return ResponseEntity.ok(VehicleResponse.of(vehicle))
    }

    @DeleteMapping("/{id}")
    fun deleteVehicle(@PathVariable id: Long, authentication: Authentication?): ResponseEntity<Void> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        vehicleService.deleteVehicle(id, email)
        return ResponseEntity.noContent().build()
    }
}
