package com.carledger.web.domain.vehicle.dto

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.vehicle.domain.DriveType
import com.carledger.core.vehicle.domain.FuelType
import com.carledger.core.vehicle.domain.MaintenanceType
import com.carledger.core.vehicle.domain.Vehicle
import java.math.BigDecimal
import java.time.Instant

data class WheelSpecResponse(
    val id: Long,
    val brand: String?,
    val model: String?,
    val diameter: Int?,
    val width: Float?,
    val offset: Int?
)

data class TireSpecResponse(
    val id: Long,
    val brand: String?,
    val model: String?,
    val width: Int?,
    val aspectRatio: Int?,
    val diameter: Int?
)

data class VehicleSpecResponse(
    val driveType: DriveType?,
    val frontWheel: WheelSpecResponse?,
    val rearWheel: WheelSpecResponse?,
    val frontTire: TireSpecResponse?,
    val rearTire: TireSpecResponse?
)

/** 소모품 종류별 마지막 정비 요약 (ledger 기반) */
data class LastMaintenanceInfo(
    val date: Instant,
    val mileageAtRecord: Int?,
    val notes: String?,
    val cost: BigDecimal?
)

data class VehicleResponse(
    val id: Long,
    val name: String,
    val carModel: String,
    val licensePlate: String,
    val fuelType: FuelType,
    val currentMileage: Int,
    val tuningHistory: String?,
    val insuranceDate: Instant?,
    val isPrimary: Boolean,
    val spec: VehicleSpecResponse?,
    /** 소모품 종류별 마지막 정비 이력 요약 (key: MaintenanceType.name()) */
    val lastMaintenance: Map<String, LastMaintenanceInfo>
) {
    companion object {
        /**
         * @param vehicle 차량 엔터티
         * @param maintenanceLedgers 해당 차량의 소모품 교환 Ledger 목록
         *        (LedgerRepository.findMaintenanceRecordsByVehicleId 결과)
         */
        fun of(vehicle: Vehicle, maintenanceLedgers: List<Ledger> = emptyList()): VehicleResponse {
            val specResponse = vehicle.spec?.let { spec ->
                VehicleSpecResponse(
                    driveType = spec.driveType,
                    frontWheel = spec.frontWheel?.let {
                        WheelSpecResponse(it.id, it.brand, it.model, it.diameter, it.width, it.offset)
                    },
                    rearWheel = spec.rearWheel?.let {
                        WheelSpecResponse(it.id, it.brand, it.model, it.diameter, it.width, it.offset)
                    },
                    frontTire = spec.frontTire?.let {
                        TireSpecResponse(it.id, it.brand, it.model, it.width, it.aspectRatio, it.diameter)
                    },
                    rearTire = spec.rearTire?.let {
                        TireSpecResponse(it.id, it.brand, it.model, it.width, it.aspectRatio, it.diameter)
                    }
                )
            }

            // Ledger 기반으로 소모품 종류별 가장 최신 기록 추출
            val lastMaintenance = maintenanceLedgers
                .filter { it.maintenanceType != null }
                .groupBy { it.maintenanceType!! }
                .mapValues { (_, records) -> records.maxBy { it.recordDate } }
                .mapKeys { it.key.name }
                .mapValues { (_, ledger) ->
                    LastMaintenanceInfo(
                        date = ledger.recordDate,
                        mileageAtRecord = ledger.mileageAtRecord,
                        notes = ledger.memo.ifBlank { null },
                        cost = ledger.amount
                    )
                }

            return VehicleResponse(
                id = vehicle.id,
                name = vehicle.name,
                carModel = vehicle.carModel,
                licensePlate = vehicle.licensePlate,
                fuelType = vehicle.fuelType,
                currentMileage = vehicle.currentMileage,
                tuningHistory = vehicle.tuningHistory,
                insuranceDate = vehicle.insuranceDate,
                isPrimary = vehicle.isPrimary,
                spec = specResponse,
                lastMaintenance = lastMaintenance
            )
        }
    }
}
