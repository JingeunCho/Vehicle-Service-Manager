package com.carledger.core.ledger.service

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.core.ledger.repository.LedgerRepository
import com.carledger.core.vehicle.domain.MaintenanceType
import com.carledger.core.vehicle.repository.VehicleRepository
import com.carledger.core.member.service.MemberService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDate

@Service
@Transactional(readOnly = true)
class LedgerService(
    private val ledgerRepository: LedgerRepository,
    private val vehicleRepository: VehicleRepository,
    private val memberService: MemberService
) {

    @Transactional
    fun createLedger(
        email: String,
        vehicleId: Long,
        category: LedgerCategory,
        title: String,
        amount: Long,
        recordDate: LocalDate,
        memo: String,
        mileage: Int?,
        maintenanceType: MaintenanceType? = null
    ): Ledger {
        val member = memberService.getMemberByEmail(email)
        val vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow { IllegalArgumentException("Vehicle not found") }

        if (vehicle.member.id != member.id) {
            throw IllegalArgumentException("No permission to access this vehicle")
        }

        val ledger = Ledger(
            vehicle = vehicle,
            category = category,
            title = title,
            recordDate = recordDate,
            amount = BigDecimal.valueOf(amount),
            mileageAtRecord = mileage ?: vehicle.currentMileage,
            memo = memo,
            maintenanceType = maintenanceType
        )

        if (mileage != null) {
            if (mileage < vehicle.currentMileage) {
                throw IllegalArgumentException(
                    "주행거리는 현재 차량 주행거리(${vehicle.currentMileage} km)와 같거나 더 크게 입력해주세요."
                )
            }
            if (mileage > vehicle.currentMileage) {
                vehicle.currentMileage = mileage
            }
        }

        return ledgerRepository.save(ledger)
    }

    fun getLedgersByVehicle(vehicleId: Long, email: String): List<Ledger> {
        val member = memberService.getMemberByEmail(email)
        val vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow { IllegalArgumentException("Vehicle not found") }
        if (vehicle.member.id != member.id) throw IllegalArgumentException("No permission")
        
        return ledgerRepository.findByVehicleAndDateRange(vehicleId, null, null)
    }

    @Transactional
    fun updateLedger(
        id: Long,
        email: String,
        vehicleId: Long,
        category: LedgerCategory,
        title: String,
        amount: Long,
        recordDate: LocalDate,
        memo: String,
        mileage: Int?,
        maintenanceType: MaintenanceType? = null
    ): Ledger {
        val member = memberService.getMemberByEmail(email)
        val ledger = ledgerRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Ledger entry not found") }

        if (ledger.vehicle.member.id != member.id) {
            throw IllegalArgumentException("No permission to update this ledger")
        }

        ledger.category = category
        ledger.title = title
        ledger.amount = BigDecimal.valueOf(amount)
        ledger.recordDate = recordDate
        ledger.memo = memo
        ledger.maintenanceType = maintenanceType
        if (mileage != null) {
            if (mileage < ledger.vehicle.currentMileage) {
                throw IllegalArgumentException(
                    "주행거리는 현재 차량 주행거리(${ledger.vehicle.currentMileage} km)와 같거나 더 크게 입력해주세요."
                )
            }
            ledger.mileageAtRecord = mileage
            if (mileage > ledger.vehicle.currentMileage) {
                ledger.vehicle.currentMileage = mileage
            }
        }

        return ledger
    }

    @Transactional
    fun deleteLedger(id: Long, email: String) {
        val member = memberService.getMemberByEmail(email)
        val ledger = ledgerRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Ledger entry not found") }

        if (ledger.vehicle.member.id != member.id) {
            throw IllegalArgumentException("No permission to delete this ledger")
        }

        ledgerRepository.delete(ledger)
    }

    fun getDashboardAnalytics(vehicleId: Long, email: String): Map<String, Any> {
        val ledgers = getLedgersByVehicle(vehicleId, email)
        
        val totalExpense = ledgers
            .filter { it.recordDate.month == LocalDate.now().month }
            .sumOf { it.amount.toLong() }
            
        return mapOf(
            "totalExpenseThisMonth" to totalExpense,
            "avgFuelPriceCurrentMonth" to 1750, // mock calculation
            "recentAvgMileage" to 9.2, // mock calculation
            "monthlyTrend" to listOf(
                mapOf(
                    "month" to "10월",
                    "details" to listOf(
                        mapOf("carModel" to "트랙용 GT86", "amount" to 450000L),
                        mapOf("carModel" to "데일리 XM3", "amount" to 200000L)
                    )
                ),
                mapOf(
                    "month" to "11월",
                    "details" to listOf(
                        mapOf("carModel" to "트랙용 GT86", "amount" to 300000L),
                        mapOf("carModel" to "데일리 XM3", "amount" to 220000L)
                    )
                )
            ),
            "categoryDonut" to LedgerCategory.entries.map { cat ->
                mapOf("name" to cat.name, "value" to ledgers.filter { it.category == cat }.sumOf { it.amount.toLong() })
            }.filter { (it["value"] as Long) > 0 },
            "mileageTrend" to listOf(
                mapOf("month" to "1월", "efficiency" to 8.5)
            )
        )
    }
}
