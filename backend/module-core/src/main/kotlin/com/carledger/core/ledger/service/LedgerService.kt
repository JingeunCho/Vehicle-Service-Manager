package com.carledger.core.ledger.service

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.core.ledger.repository.LedgerRepository
import com.carledger.core.vehicle.domain.MaintenanceType
import com.carledger.core.vehicle.repository.VehicleRepository
import com.carledger.core.member.service.MemberService
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
            if (mileage < 0) {
                throw IllegalArgumentException("주행거리는 0 이상의 값이어야 합니다.")
            }
        }

        val savedLedger = ledgerRepository.save(ledger)
        syncVehicleMileage(vehicle.id) // 지출 내역 추가 후 차량 주행거리 동기화
        return savedLedger
    }

    fun getLedgersByVehicle(vehicleId: Long, email: String, pageable: Pageable): Page<Ledger> {
        val member = memberService.getMemberByEmail(email)
        
        // 동적 쿼리를 통해 단일 차량 또는 전체 차량(0L) 조회를 처리 (페이징 지원)
        return ledgerRepository.findByCriteria(
            memberId = member.id,
            vehicleId = vehicleId,
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

    private fun getAllLedgersForAnalytics(vehicleId: Long, email: String): List<Ledger> {
        val member = memberService.getMemberByEmail(email)
        return ledgerRepository.findByCriteria(
            memberId = member.id,
            vehicleId = vehicleId,
            pageable = PageRequest.of(0, 1000) // 분석용은 넉넉히 조회
        ).content
    }

    fun getDashboardAnalytics(vehicleId: Long, email: String): Map<String, Any> {
        val ledgers = getAllLedgersForAnalytics(vehicleId, email)
        
        val zoneId = ZoneId.of("Asia/Seoul") // 통계용 기준 타임존 (한국)
        val now = ZonedDateTime.now(zoneId)
        
        val totalExpense = ledgers
            .filter { 
                val ledgerDate = it.recordDate.atZone(zoneId)
                ledgerDate.year == now.year && ledgerDate.month == now.month 
            }
            .sumOf { it.amount.toLong() }
            
        return mapOf(
            "totalExpenseThisMonth" to totalExpense,
            "avgFuelPriceCurrentMonth" to 1750,
            "recentAvgMileage" to 9.2,
            "monthlyTrend" to listOf(
                mapOf(
                    "month" to "${now.monthValue - 1}월",
                    "details" to listOf(
                        mapOf("carModel" to "트랙용 GT86", "amount" to 450000L),
                        mapOf("carModel" to "데일리 XM3", "amount" to 200000L)
                    )
                ),
                mapOf(
                    "month" to "${now.monthValue}월",
                    "details" to listOf(
                        mapOf("carModel" to "트랙용 GT86", "amount" to 300000L),
                        mapOf("carModel" to "데일리 XM3", "amount" to 220000L)
                    )
                )
            ),
            "categoryDonut" to LedgerCategory.entries.map { cat ->
                mapOf("name" to cat.categoryName, "value" to ledgers.filter { it.category == cat }.sumOf { it.amount.toLong() })
            }.filter { (it["value"] as Long) > 0 },
            "mileageTrend" to listOf(
                mapOf("month" to "1월", "efficiency" to 8.5)
            )
        )
    }
}
