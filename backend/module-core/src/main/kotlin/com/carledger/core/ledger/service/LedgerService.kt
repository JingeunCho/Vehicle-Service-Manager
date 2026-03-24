package com.carledger.core.ledger.service

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.ledger.repository.LedgerRepository
import com.carledger.core.category.repository.CategoryRepository
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
    private val categoryRepository: CategoryRepository,
    private val memberService: MemberService
) {

    @Transactional
    fun createLedger(
        email: String,
        vehicleId: Long,
        categoryName: String,
        amount: Long,
        recordDate: LocalDate,
        memo: String,
        mileage: Int?
    ): Ledger {
        val member = memberService.getMemberByEmail(email)
        val vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow { IllegalArgumentException("Vehicle not found") }

        if (vehicle.member.id != member.id) {
            throw IllegalArgumentException("No permission to access this vehicle")
        }

        val category = categoryRepository.findByNameAndIsDeletedFalse(categoryName)
            ?: throw IllegalArgumentException("Category not found: \$categoryName")

        val ledger = Ledger(
            vehicle = vehicle,
            category = category,
            recordDate = recordDate,
            amount = BigDecimal.valueOf(amount),
            mileageAtRecord = mileage ?: vehicle.currentMileage,
            memo = memo
        )

        if (mileage != null && mileage > vehicle.currentMileage) {
            vehicle.currentMileage = mileage
        }

        return ledgerRepository.save(ledger)
    }

    fun getLedgersByVehicle(vehicleId: Long, email: String): List<Ledger> {
        val member = memberService.getMemberByEmail(email)
        val vehicle = vehicleRepository.findById(vehicleId).orElseThrow()
        if (vehicle.member.id != member.id) throw IllegalArgumentException("No permission")
        
        return ledgerRepository.findByVehicleAndDateRange(vehicleId, null, null)
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
            "categoryDonut" to categoryRepository.findAll().map { cat ->
                mapOf("name" to cat.name, "value" to ledgers.filter { it.category.id == cat.id }.sumOf { it.amount.toLong() })
            }.filter { (it["value"] as Long) > 0 },
            "mileageTrend" to listOf(
                mapOf("month" to "1월", "efficiency" to 8.5)
            )
        )
    }
}
