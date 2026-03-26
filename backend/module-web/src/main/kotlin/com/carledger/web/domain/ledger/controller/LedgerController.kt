package com.carledger.web.domain.ledger.controller

import com.carledger.core.ledger.service.LedgerService
import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.web.domain.ledger.dto.CreateLedgerRequest
import com.carledger.web.domain.ledger.dto.DashboardResponse
import com.carledger.web.domain.ledger.dto.LedgerResponse
import com.carledger.web.domain.ledger.dto.MonthlyTrendDto
import com.carledger.web.domain.ledger.dto.CarExpenseDetailDto
import com.carledger.web.domain.ledger.dto.CategoryExpenseDto
import com.carledger.web.domain.ledger.dto.MonthlyMileageDto
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
        val ledgers = ledgerService.getLedgersByVehicle(vehicleId, category, email, pageable)
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

    @GetMapping("/vehicles/{vehicleId}/dashboard")
    fun getDashboard(@PathVariable vehicleId: Long, authentication: Authentication?): ResponseEntity<DashboardResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val analytics = ledgerService.getDashboardAnalytics(vehicleId, email)
        
        @Suppress("UNCHECKED_CAST")
        val response = DashboardResponse(
            totalExpenseThisMonth = analytics["totalExpenseThisMonth"] as Long,
            avgFuelPriceCurrentMonth = analytics["avgFuelPriceCurrentMonth"] as Int,
            recentAvgMileage = analytics["recentAvgMileage"] as Double,
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
                MonthlyMileageDto(name = it["month"] as String, efficiency = it["efficiency"] as Double)
            }
        )
        
        return ResponseEntity.ok(response)
    }
}
