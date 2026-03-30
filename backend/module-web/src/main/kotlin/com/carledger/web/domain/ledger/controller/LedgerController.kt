package com.carledger.web.domain.ledger.controller

import com.carledger.core.ledger.service.LedgerService
import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.core.ledger.domain.Ledger
import com.carledger.web.domain.ledger.dto.CreateLedgerRequest
import com.carledger.web.domain.ledger.dto.DashboardResponse
import com.carledger.web.domain.ledger.dto.LedgerResponse
import com.carledger.web.domain.ledger.dto.MonthlyTrendDto
import com.carledger.web.domain.ledger.dto.CarExpenseDetailDto
import com.carledger.web.domain.ledger.dto.CategoryExpenseDto
import com.carledger.web.domain.ledger.dto.MonthlyMileageDto
import com.carledger.web.domain.ledger.dto.*
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import java.net.URI

@RestController
@RequestMapping("/api/ledgers")
class LedgerController(
    private val ledgerService: LedgerService
) {

    @GetMapping("/vehicles/{vehicleId}")
    fun getLedgers(
        @PathVariable vehicleId: Long,
        @RequestParam(required = false) category: LedgerCategory?,
        @org.springframework.data.web.PageableDefault(size = 10) pageable: org.springframework.data.domain.Pageable,
        authentication: Authentication?
    ): ResponseEntity<org.springframework.data.domain.Page<LedgerResponse>> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        // vehicleId가 0인 경우(전체 조회) null을 전달하여 모든 차량의 내역을 조회
        val vehicleIds = if (vehicleId == 0L) null else listOf(vehicleId)
        val ledgers = ledgerService.getLedgersByVehicle(vehicleIds, category, email, pageable)
        return ResponseEntity.ok(ledgers.map { LedgerResponse.of(it) })
    }

    @PostMapping
    fun createLedger(
        @RequestBody request: CreateLedgerRequest,
        authentication: Authentication?
    ): ResponseEntity<LedgerResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val ledger = ledgerService.createLedger(
            email = email,
            vehicleId = request.vehicleId,
            category = request.category,
            title = request.title,
            amount = request.amount,
            recordDate = request.recordDate,
            memo = request.memo,
            mileage = request.mileage,
            unitPrice = request.unitPrice,
            volume = request.volume,
            maintenanceType = request.maintenanceType
        )
        return ResponseEntity.created(URI.create("/api/ledgers/${ledger.id}")).body(LedgerResponse.of(ledger))
    }

    @PutMapping("/{id}")
    fun updateLedger(
        @PathVariable id: Long,
        @RequestBody request: CreateLedgerRequest,
        authentication: Authentication?
    ): ResponseEntity<LedgerResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val ledger = ledgerService.updateLedger(
            id = id,
            email = email,
            vehicleId = request.vehicleId,
            category = request.category,
            title = request.title,
            amount = request.amount,
            recordDate = request.recordDate,
            memo = request.memo,
            mileage = request.mileage,
            unitPrice = request.unitPrice,
            volume = request.volume,
            maintenanceType = request.maintenanceType
        )
        return ResponseEntity.ok(LedgerResponse.of(ledger))
    }

    @DeleteMapping("/{id}")
    fun deleteLedger(
        @PathVariable id: Long,
        authentication: Authentication?
    ): ResponseEntity<Void> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        ledgerService.deleteLedger(id, email)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/dashboard")
    fun getDashboard(
        @RequestParam(required = false) vehicleIds: List<Long>?, 
        authentication: Authentication?
    ): ResponseEntity<DashboardResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val analytics = ledgerService.getDashboardAnalytics(vehicleIds, email)
        
        @Suppress("UNCHECKED_CAST")
        val response = DashboardResponse(
            totalExpenseThisMonth = (analytics["totalExpenseThisMonth"] as? Number)?.toLong() ?: 0L,
            avgFuelPriceCurrentMonth = (analytics["avgFuelPriceCurrentMonth"] as? Number)?.toInt() ?: 0,
            avgElectricityPriceCurrentMonth = (analytics["avgElectricityPriceCurrentMonth"] as? Number)?.toInt() ?: 0,
            recentAvgMileage = (analytics["recentAvgMileage"] as? Number)?.toDouble() ?: 0.0,
            recentAvgEvEfficiency = (analytics["recentAvgEvEfficiency"] as? Number)?.toDouble() ?: 0.0,
            monthlyTrend = (analytics["monthlyTrend"] as List<Map<String, Any>>).map { trend ->
                MonthlyTrendDto(
                    month = trend["month"] as String,
                    details = (trend["details"] as List<Map<String, Any>>).map { detail ->
                        CarExpenseDetailDto(
                            carModel = detail["carModel"] as String,
                            amount = detail["amount"] as Long
                        )
                    }
                )
            },
            categoryDonut = (analytics["categoryDonut"] as List<Map<String, Any>>).map {
                CategoryExpenseDto(name = it["name"] as String, value = it["value"] as Long)
            },
            mileageTrend = (analytics["mileageTrend"] as List<Map<String, Any>>).map {
                MonthlyMileageDto(name = it["name"] as String, efficiency = it["efficiency"] as Double)
            },
            evMileageTrend = (analytics["evMileageTrend"] as List<Map<String, Any>>).map {
                MonthlyMileageDto(name = it["name"] as String, efficiency = it["efficiency"] as Double)
            },
            recentMaintenance = (analytics["recentMaintenance"] as List<Ledger>).map { LedgerResponse.of(it) },
            recentRefuel = (analytics["recentRefuel"] as List<Ledger>).map { LedgerResponse.of(it) }
        )
        return ResponseEntity.ok(response)
    }

    @GetMapping("/dashboard/summaries")
    fun getDashboardSummaries(
        @RequestParam vehicleIds: List<Long>?,
        authentication: Authentication
    ): ResponseEntity<DashboardSummaryResponse> {
        val analytics = ledgerService.getDashboardSummaries(vehicleIds, authentication.name)
        
        return ResponseEntity.ok(DashboardSummaryResponse(
            totalExpenseThisMonth = (analytics["totalExpenseThisMonth"] as? Number)?.toLong() ?: 0L,
            avgFuelPriceCurrentMonth = (analytics["avgFuelPriceCurrentMonth"] as? Number)?.toInt() ?: 0,
            avgElectricityPriceCurrentMonth = (analytics["avgElectricityPriceCurrentMonth"] as? Number)?.toInt() ?: 0,
            recentAvgMileage = (analytics["recentAvgMileage"] as? Number)?.toDouble() ?: 0.0,
            recentAvgEvEfficiency = (analytics["recentAvgEvEfficiency"] as? Number)?.toDouble() ?: 0.0
        ))
    }

    @GetMapping("/dashboard/spending-trend")
    fun getDashboardSpendingTrend(
        @RequestParam vehicleIds: List<Long>?,
        authentication: Authentication
    ): ResponseEntity<DashboardSpendingResponse> {
        val analytics = ledgerService.getDashboardSpendingTrend(vehicleIds, authentication.name)
        
        @Suppress("UNCHECKED_CAST")
        return ResponseEntity.ok(DashboardSpendingResponse(
            monthlyTrend = (analytics["monthlyTrend"] as List<Map<String, Any>>).map { trend ->
                MonthlyTrendDto(
                    month = trend["month"] as String,
                    details = (trend["details"] as List<Map<String, Any>>).map { detail ->
                        CarExpenseDetailDto(
                            carModel = detail["carModel"] as String,
                            amount = (detail["amount"] as? Number)?.toLong() ?: 0L
                        )
                    }
                )
            },
            categoryDonut = (analytics["categoryDonut"] as List<Map<String, Any>>).map {
                CategoryExpenseDto(name = it["name"] as String, value = (it["value"] as? Number)?.toLong() ?: 0L)
            }
        ))
    }

    @GetMapping("/dashboard/recent-history")
    fun getDashboardRecentHistory(
        @RequestParam vehicleIds: List<Long>?,
        authentication: Authentication
    ): ResponseEntity<DashboardHistoryResponse> {
        val analytics = ledgerService.getDashboardRecentHistory(vehicleIds, authentication.name)
        
        @Suppress("UNCHECKED_CAST")
        val recentRefuelMaps = analytics["recentRefuel"] as List<Map<String, Any>>
        
        return ResponseEntity.ok(DashboardHistoryResponse(
            recentMaintenance = (analytics["recentMaintenance"] as List<Ledger>).map { LedgerResponse.of(it) },
            recentRefuel = recentRefuelMaps.map { 
                LedgerResponse.of(it["ledger"] as Ledger, it["efficiency"] as? Double)
            }
        ))
    }

    @GetMapping("/dashboard/efficiency-trend")
    fun getDashboardEfficiencyTrend(
        @RequestParam vehicleIds: List<Long>?,
        authentication: Authentication
    ): ResponseEntity<DashboardEfficiencyResponse> {
        val analytics = ledgerService.getDashboardEfficiencyTrend(vehicleIds, authentication.name)
        
        @Suppress("UNCHECKED_CAST")
        return ResponseEntity.ok(DashboardEfficiencyResponse(
            mileageTrend = (analytics["mileageTrend"] as List<Map<String, Any>>).map {
                MonthlyMileageDto(name = it["name"] as String, efficiency = (it["efficiency"] as? Number)?.toDouble() ?: 0.0)
            },
            evMileageTrend = (analytics["evMileageTrend"] as List<Map<String, Any>>).map {
                MonthlyMileageDto(name = it["name"] as String, efficiency = (it["efficiency"] as? Number)?.toDouble() ?: 0.0)
            }
        ))
    }
}
