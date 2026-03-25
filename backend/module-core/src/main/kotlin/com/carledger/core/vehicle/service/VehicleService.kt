package com.carledger.core.vehicle.service

import com.carledger.core.member.service.MemberService
import com.carledger.core.vehicle.domain.*
import com.carledger.core.vehicle.repository.VehicleRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

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
        if (vehicle.member.email != email) throw IllegalArgumentException("No permission")
        return vehicle
    }

    @Transactional
    fun createVehicle(
        email: String,
        name: String,
        carModel: String,
        licensePlate: String,
        fuelType: FuelType,
        currentMileage: Int,
        tuningHistory: String? = null,
        insuranceDate: LocalDate? = null,
        // VehicleSpec
        driveType: DriveType? = null,
        // Front Wheel
        frontWheelBrand: String? = null,
        frontWheelModel: String? = null,
        frontWheelDiameter: Int? = null,
        frontWheelWidth: Float? = null,
        frontWheelOffset: Int? = null,
        // Rear Wheel
        rearWheelBrand: String? = null,
        rearWheelModel: String? = null,
        rearWheelDiameter: Int? = null,
        rearWheelWidth: Float? = null,
        rearWheelOffset: Int? = null,
        // Front Tire
        frontTireBrand: String? = null,
        frontTireModel: String? = null,
        frontTireWidth: Int? = null,
        frontTireAspectRatio: Int? = null,
        frontTireDiameter: Int? = null,
        // Rear Tire
        rearTireBrand: String? = null,
        rearTireModel: String? = null,
        rearTireWidth: Int? = null,
        rearTireAspectRatio: Int? = null,
        rearTireDiameter: Int? = null
    ): Vehicle {
        val member = memberService.getMemberByEmail(email)
        val isFirstVehicle = !vehicleRepository.existsByMemberIdAndIsDeletedFalse(member.id)

        val vehicle = Vehicle(
            member = member,
            name = name,
            carModel = carModel,
            licensePlate = licensePlate,
            fuelType = fuelType,
            currentMileage = currentMileage,
            tuningHistory = tuningHistory,
            insuranceDate = insuranceDate,
            isPrimary = isFirstVehicle
        )

        // VehicleSpec 생성 (제원 데이터가 있을 경우)
        val hasSpec = driveType != null || frontWheelBrand != null || rearWheelBrand != null ||
                frontTireBrand != null || rearTireBrand != null
        if (hasSpec) {
            val spec = VehicleSpec(vehicle = vehicle, driveType = driveType)

            // 전륜 휠
            if (frontWheelBrand != null || frontWheelDiameter != null) {
                spec.frontWheel = WheelSpec(
                    vehicle = vehicle, brand = frontWheelBrand, model = frontWheelModel,
                    diameter = frontWheelDiameter, width = frontWheelWidth, offset = frontWheelOffset
                )
            }
            // 후륜 휠
            if (rearWheelBrand != null || rearWheelDiameter != null) {
                spec.rearWheel = WheelSpec(
                    vehicle = vehicle, brand = rearWheelBrand, model = rearWheelModel,
                    diameter = rearWheelDiameter, width = rearWheelWidth, offset = rearWheelOffset
                )
            }
            // 전륜 타이어
            if (frontTireBrand != null || frontTireWidth != null) {
                spec.frontTire = TireSpec(
                    vehicle = vehicle, brand = frontTireBrand, model = frontTireModel,
                    width = frontTireWidth, aspectRatio = frontTireAspectRatio, diameter = frontTireDiameter
                )
            }
            // 후륜 타이어
            if (rearTireBrand != null || rearTireWidth != null) {
                spec.rearTire = TireSpec(
                    vehicle = vehicle, brand = rearTireBrand, model = rearTireModel,
                    width = rearTireWidth, aspectRatio = rearTireAspectRatio, diameter = rearTireDiameter
                )
            }

            vehicle.spec = spec
        }

        return vehicleRepository.save(vehicle)
    }

    @Transactional
    fun updateVehicle(
        vehicleId: Long,
        email: String,
        name: String? = null,
        carModel: String? = null,
        licensePlate: String? = null,
        fuelType: FuelType? = null,
        currentMileage: Int? = null,
        tuningHistory: String? = null,
        insuranceDate: LocalDate? = null,
        driveType: DriveType? = null,
        // Front Wheel
        frontWheelBrand: String? = null,
        frontWheelModel: String? = null,
        frontWheelDiameter: Int? = null,
        frontWheelWidth: Float? = null,
        frontWheelOffset: Int? = null,
        // Rear Wheel
        rearWheelBrand: String? = null,
        rearWheelModel: String? = null,
        rearWheelDiameter: Int? = null,
        rearWheelWidth: Float? = null,
        rearWheelOffset: Int? = null,
        // Front Tire
        frontTireBrand: String? = null,
        frontTireModel: String? = null,
        frontTireWidth: Int? = null,
        frontTireAspectRatio: Int? = null,
        frontTireDiameter: Int? = null,
        // Rear Tire
        rearTireBrand: String? = null,
        rearTireModel: String? = null,
        rearTireWidth: Int? = null,
        rearTireAspectRatio: Int? = null,
        rearTireDiameter: Int? = null
    ): Vehicle {
        val vehicle = getVehicleById(vehicleId, email)

        name?.let { vehicle.name = it }
        carModel?.let { vehicle.carModel = it }
        licensePlate?.let { vehicle.licensePlate = it }
        fuelType?.let { vehicle.fuelType = it }
        currentMileage?.let { vehicle.currentMileage = it }
        tuningHistory?.let { vehicle.tuningHistory = it }
        insuranceDate?.let { vehicle.insuranceDate = it }

        val spec = vehicle.spec ?: VehicleSpec(vehicle = vehicle).also { vehicle.spec = it }
        driveType?.let { spec.driveType = it }

        // 전륜 휠 변경 시 → 새 WheelSpec row 생성 (이전 row는 vehicle_id로 조회 가능 = 이력)
        if (frontWheelBrand != null || frontWheelDiameter != null) {
            spec.frontWheel = WheelSpec(
                vehicle = vehicle, brand = frontWheelBrand, model = frontWheelModel,
                diameter = frontWheelDiameter, width = frontWheelWidth, offset = frontWheelOffset
            )
        }
        if (rearWheelBrand != null || rearWheelDiameter != null) {
            spec.rearWheel = WheelSpec(
                vehicle = vehicle, brand = rearWheelBrand, model = rearWheelModel,
                diameter = rearWheelDiameter, width = rearWheelWidth, offset = rearWheelOffset
            )
        }
        if (frontTireBrand != null || frontTireWidth != null) {
            spec.frontTire = TireSpec(
                vehicle = vehicle, brand = frontTireBrand, model = frontTireModel,
                width = frontTireWidth, aspectRatio = frontTireAspectRatio, diameter = frontTireDiameter
            )
        }
        if (rearTireBrand != null || rearTireWidth != null) {
            spec.rearTire = TireSpec(
                vehicle = vehicle, brand = rearTireBrand, model = rearTireModel,
                width = rearTireWidth, aspectRatio = rearTireAspectRatio, diameter = rearTireDiameter
            )
        }

        return vehicle
    }

    @Transactional
    fun setPrimaryVehicle(vehicleId: Long, email: String): Vehicle {
        val member = memberService.getMemberByEmail(email)
        vehicleRepository.updateAllIsPrimaryFalse(member.id)
        val vehicle = getVehicleById(vehicleId, email)
        vehicle.isPrimary = true
        return vehicle
    }

    @Transactional
    fun deleteVehicle(vehicleId: Long, email: String) {
        val vehicle = getVehicleById(vehicleId, email)
        vehicle.isDeleted = true
    }
}
