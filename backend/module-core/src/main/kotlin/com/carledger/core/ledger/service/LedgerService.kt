package com.carledger.core.ledger.service

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.core.ledger.repository.LedgerRepository
import com.carledger.core.vehicle.domain.MaintenanceType
import com.carledger.core.vehicle.repository.VehicleRepository
import com.carledger.core.member.service.MemberService
import com.carledger.core.vehicle.domain.FuelType
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime

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
        recordDate: Instant,
        memo: String,
        mileage: Int?,
        unitPrice: Long? = null,
        volume: Double? = null,
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
            unitPrice = unitPrice?.let { BigDecimal.valueOf(it) },
            volume = volume?.let { BigDecimal.valueOf(it) },
            memo = memo,
            maintenanceType = maintenanceType
        )

        if (mileage != null) {
            if (mileage < 0) {
                throw IllegalArgumentException("주행거리는 0 이상의 값이어야 합니다.")
            }
        }

        val savedLedger = ledgerRepository.save(ledger)
        syncVehicleMileage(vehicle.id) // 지출 내역 추가 후 차량 주행거리 동기화
        return savedLedger
    }

    fun getLedgersByVehicle(vehicleIds: List<Long>?, category: LedgerCategory?, email: String, pageable: Pageable): Page<Ledger> {
        val member = memberService.getMemberByEmail(email)
        
        // 동적 쿼리를 통해 다중 차량 조회를 처리 (페이징 지원)
        return ledgerRepository.findByCriteria(
            memberId = member.id,
            vehicleIds = vehicleIds,
            category = category,
            pageable = pageable
        )
    }

    @Transactional
    fun updateLedger(
        id: Long,
        email: String,
        vehicleId: Long,
        category: LedgerCategory,
        title: String,
        amount: Long,
        recordDate: Instant,
        memo: String,
        mileage: Int?,
        unitPrice: Long? = null,
        volume: Double? = null,
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
        ledger.unitPrice = unitPrice?.let { BigDecimal.valueOf(it) }
        ledger.volume = volume?.let { BigDecimal.valueOf(it) }
        ledger.maintenanceType = maintenanceType
        if (mileage != null) {
            ledger.mileageAtRecord = mileage
        }

        val savedLedger = ledgerRepository.save(ledger)
        syncVehicleMileage(ledger.vehicle.id) // 수정 후 차량 주행거리 동기화
        return savedLedger
    }

    @Transactional
    fun deleteLedger(id: Long, email: String) {
        val member = memberService.getMemberByEmail(email)
        val ledger = ledgerRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Ledger entry not found") }

        if (ledger.vehicle.member.id != member.id) {
            throw IllegalArgumentException("No permission to delete this ledger")
        }

        val vehicleId = ledger.vehicle.id
        ledgerRepository.delete(ledger)
        syncVehicleMileage(vehicleId) // 삭제 후 차량 주행거리 동기화
    }

    private fun syncVehicleMileage(vehicleId: Long) {
        val vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow { IllegalArgumentException("Vehicle not found") }
        
        val maxMileage = ledgerRepository.findMaxMileageByVehicleId(vehicleId)
        if (maxMileage != null && maxMileage > 0) {
            vehicle.currentMileage = maxMileage
            vehicleRepository.save(vehicle)
        }
    }

    private fun getAllLedgersForAnalytics(vehicleIds: List<Long>?, email: String): List<Ledger> {
        val member = memberService.getMemberByEmail(email)
        return ledgerRepository.findByCriteria(
            memberId = member.id,
            vehicleIds = vehicleIds,
            pageable = PageRequest.of(0, 1000) // 분석용은 넉넉히 조회
        ).content
    }

    fun getDashboardSummaries(vehicleIds: List<Long>?, email: String): Map<String, Any> {
        val ledgers = getAllLedgersForAnalytics(vehicleIds, email)
        val zoneId = ZoneId.of("Asia/Seoul")
        val now = ZonedDateTime.now(zoneId)
        val firstDayOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0).toInstant()

        val totalExpense = ledgers
            .filter { it.recordDate.isAfter(firstDayOfMonth) || it.recordDate == firstDayOfMonth }
            .sumOf { it.amount.toLong() }

        val currentMonthRefuelLedgers = ledgers
            .filter { it.category == LedgerCategory.REFUEL && (it.recordDate.isAfter(firstDayOfMonth) || it.recordDate == firstDayOfMonth) }
        
        val fuelPrices = currentMonthRefuelLedgers
            .filter { it.vehicle.fuelType != FuelType.EV }
            .mapNotNull { it.unitPrice?.toInt() }
        val avgFuelPrice = if (fuelPrices.isNotEmpty()) fuelPrices.average().toInt() else 0

        val electricityPrices = currentMonthRefuelLedgers
            .filter { it.vehicle.fuelType == FuelType.EV }
            .mapNotNull { it.unitPrice?.toInt() }
        val avgElectricityPrice = if (electricityPrices.isNotEmpty()) electricityPrices.average().toInt() else 0

        val efficiencies = calculateEfficiencies(ledgers, zoneId)
        val recentAvgMileage = calculateRecentAvg(efficiencies.filter { it["fuelType"] != FuelType.EV })
        val recentAvgEvEfficiency = calculateRecentAvg(efficiencies.filter { it["fuelType"] == FuelType.EV })

        return mapOf(
            "totalExpenseThisMonth" to totalExpense,
            "avgFuelPriceCurrentMonth" to avgFuelPrice,
            "avgElectricityPriceCurrentMonth" to avgElectricityPrice,
            "recentAvgMileage" to recentAvgMileage,
            "recentAvgEvEfficiency" to recentAvgEvEfficiency
        )
    }

    fun getDashboardSpendingTrend(vehicleIds: List<Long>?, email: String): Map<String, Any> {
        val ledgers = getAllLedgersForAnalytics(vehicleIds, email)
        val zoneId = ZoneId.of("Asia/Seoul")
        val now = ZonedDateTime.now(zoneId)
        val firstDayOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0).toInstant()

        val monthlyTrend = (0..3).reversed().map { i ->
            val monthDate = now.minusMonths(i.toLong())
            val monthStr = "${monthDate.monthValue}월"
            val monthLedgers = ledgers.filter {
                val zdt = it.recordDate.atZone(zoneId)
                zdt.year == monthDate.year && zdt.month == monthDate.month
            }
            val details = monthLedgers.groupBy { it.vehicle.carModel }
                .map { (model, items) ->
                    mapOf("carModel" to model, "amount" to items.sumOf { it.amount.toLong() })
                }
            mapOf("month" to monthStr, "details" to details)
        }

        val categoryDonut = LedgerCategory.entries.map { cat ->
            val amount = ledgers
                .filter { it.category == cat && (it.recordDate.isAfter(firstDayOfMonth) || it.recordDate == firstDayOfMonth) }
                .sumOf { it.amount.toLong() }
            mapOf("name" to cat.categoryName, "value" to amount)
        }.filter { (it["value"] as Long) > 0 }

        return mapOf(
            "monthlyTrend" to monthlyTrend,
            "categoryDonut" to categoryDonut
        )
    }

    fun getDashboardRecentHistory(vehicleIds: List<Long>?, email: String): Map<String, Any> {
        val ledgers = getAllLedgersForAnalytics(vehicleIds, email)
        val recentMaintenance = ledgers
            .filter { it.category == LedgerCategory.MAINTENANCE }
            .sortedByDescending { it.recordDate }
            .take(4)

        val recentRefuel = ledgers
            .filter { it.category == LedgerCategory.REFUEL }
            .sortedByDescending { it.recordDate }
            .take(4)

        return mapOf(
            "recentMaintenance" to recentMaintenance,
            "recentRefuel" to recentRefuel
        )
    }

    fun getDashboardEfficiencyTrend(vehicleIds: List<Long>?, email: String): Map<String, Any> {
        val ledgers = getAllLedgersForAnalytics(vehicleIds, email)
        val zoneId = ZoneId.of("Asia/Seoul")
        val efficiencies = calculateEfficiencies(ledgers, zoneId)

        val iceEfficiencies = efficiencies.filter { it["fuelType"] != FuelType.EV }
        val evEfficiencies = efficiencies.filter { it["fuelType"] == FuelType.EV }

        return mapOf(
            "mileageTrend" to iceEfficiencies.takeLast(10).map { 
                mapOf("name" to it["month"], "efficiency" to it["efficiency"])
            },
            "evMileageTrend" to evEfficiencies.takeLast(10).map { 
                mapOf("name" to it["month"], "efficiency" to it["efficiency"])
            }
        )
    }

    private fun calculateEfficiencies(ledgers: List<Ledger>, zoneId: ZoneId): List<Map<String, Any>> {
        return ledgers
            .filter { it.category == LedgerCategory.REFUEL && it.volume != null && it.volume!!.toLong() > 0 }
            .groupBy { it.vehicle.id }
            .flatMap { (_, vehicleLedgers) ->
                val sortedLedgers = vehicleLedgers.sortedBy { it.recordDate }
                val results = mutableListOf<Map<String, Any>>()
                for (i in 1 until sortedLedgers.size) {
                    val curr = sortedLedgers[i]
                    val prev = sortedLedgers[i - 1]
                    val distance = curr.mileageAtRecord - prev.mileageAtRecord
                    if (distance > 0) {
                        val efficiency = distance.toDouble() / curr.volume!!.toDouble()
                        val monthStr = "${curr.recordDate.atZone(zoneId).monthValue}월"
                        results.add(mapOf(
                            "month" to monthStr, 
                            "efficiency" to Math.round(efficiency * 10) / 10.0, 
                            "time" to curr.recordDate,
                            "fuelType" to curr.vehicle.fuelType
                        ))
                    }
                }
                results
            }
            .sortedBy { it["time"] as Instant }
    }

    private fun calculateRecentAvg(effs: List<Map<String, Any>>): Double {
        return if (effs.isNotEmpty()) {
            Math.round(effs.takeLast(3).map { it["efficiency"] as Double }.average() * 10) / 10.0
        } else 0.0
    }

    fun getDashboardAnalytics(vehicleIds: List<Long>?, email: String): Map<String, Any> {
        return getDashboardSummaries(vehicleIds, email) +
               getDashboardSpendingTrend(vehicleIds, email) +
               getDashboardRecentHistory(vehicleIds, email) +
               getDashboardEfficiencyTrend(vehicleIds, email)
    }
}
