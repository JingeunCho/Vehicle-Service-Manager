package com.carledger.core.vehicle.service

import com.carledger.core.vehicle.domain.FuelType
import com.carledger.core.vehicle.domain.Vehicle
import com.carledger.core.vehicle.repository.VehicleRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class VehicleService(
    private val vehicleRepository: VehicleRepository,
    private val memberService: MemberService
) {

    fun getMyVehicles(email: String): List<Vehicle> {
        val member = memberService.getMemberByEmail(email)
        return vehicleRepository.findAllByMemberIdAndIsDeletedFalse(member.id)
    }

    fun getVehicleById(vehicleId: Long, email: String): Vehicle {
        val vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow { IllegalArgumentException("Vehicle not found") }
            
        if (vehicle.isDeleted) throw IllegalArgumentException("Vehicle has been deleted")
        if (vehicle.member.email != email) throw IllegalArgumentException("No permission to access this vehicle")
        
        return vehicle
    }

    @Transactional
    fun createVehicle(
        email: String,
        name: String,
        carModel: String,
        licensePlate: String,
        fuelType: FuelType,
        currentMileage: Int
    ): Vehicle {
        val member = memberService.getMemberByEmail(email)
        
        val vehicle = Vehicle(
            member = member,
            name = name,
            carModel = carModel,
            licensePlate = licensePlate,
            fuelType = fuelType,
            currentMileage = currentMileage
        )
        
        return vehicleRepository.save(vehicle)
    }

    @Transactional
    fun updateVehicle(
        vehicleId: Long,
        email: String,
        name: String?,
        carModel: String?,
        licensePlate: String?,
        fuelType: FuelType?,
        currentMileage: Int?
    ): Vehicle {
        val vehicle = getVehicleById(vehicleId, email)
        
        name?.let { vehicle.name = it }
        carModel?.let { vehicle.carModel = it }
        licensePlate?.let { vehicle.licensePlate = it }
        fuelType?.let { vehicle.fuelType = it }
        currentMileage?.let { vehicle.currentMileage = it }
        
        return vehicle
    }

    @Transactional
    fun deleteVehicle(vehicleId: Long, email: String) {
        val vehicle = getVehicleById(vehicleId, email)
        vehicle.isDeleted = true
        // Soft delete mechanism triggers upon dirty checking within transaction
    }
}
