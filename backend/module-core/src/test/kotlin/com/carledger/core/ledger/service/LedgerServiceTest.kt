package com.carledger.core.ledger.service

import com.carledger.core.ledger.domain.Ledger
import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.core.ledger.repository.LedgerRepository
import com.carledger.core.member.domain.Member
import com.carledger.core.member.service.MemberService
import com.carledger.core.vehicle.domain.Vehicle
import com.carledger.core.vehicle.repository.VehicleRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import java.math.BigDecimal
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.*

class LedgerServiceTest {

    private lateinit var ledgerRepository: LedgerRepository
    private lateinit var vehicleRepository: VehicleRepository
    private lateinit var memberService: MemberService
    private lateinit var ledgerService: LedgerService

    @BeforeEach
    fun setUp() {
        ledgerRepository = mock(LedgerRepository::class.java)
        vehicleRepository = mock(VehicleRepository::class.java)
        memberService = mock(MemberService::class.java)
        ledgerService = LedgerService(ledgerRepository, vehicleRepository, memberService)
    }

    @Test
    fun `test getDashboardAnalytics with real data`() {
        // Given
        val email = "test@example.com"
        val member = Member(id = 1L, email = email, nickname = "Test")
        val vehicle = Vehicle(id = 1L, member = member, name = "Car", carModel = "GT86", licensePlate = "12가1234", fuelType = "Gasoline")
        
        val zoneId = ZoneId.of("Asia/Seoul")
        val now = ZonedDateTime.now(zoneId)
        val today = now.toInstant()
        val lastMonth = now.minusMonths(1).toInstant()

        val ledgers = listOf(
            // Fuel entry 1: 1000km
            Ledger(
                id = 1L, vehicle = vehicle, category = LedgerCategory.REFUEL, title = "Fuel 1",
                recordDate = lastMonth, amount = BigDecimal.valueOf(50000), mileageAtRecord = 1000, 
                unitPrice = BigDecimal.valueOf(1600), volume = BigDecimal.valueOf(31.25)
            ),
            // Fuel entry 2: 1500km (Today, adding 50L) -> Distance 500, Volume 50 -> 10km/L
            Ledger(
                id = 2L, vehicle = vehicle, category = LedgerCategory.REFUEL, title = "Fuel 2",
                recordDate = today, amount = BigDecimal.valueOf(80000), mileageAtRecord = 1500, 
                unitPrice = BigDecimal.valueOf(1600), volume = BigDecimal.valueOf(50.0)
            ),
            // Maintenance entry
            Ledger(
                id = 3L, vehicle = vehicle, category = LedgerCategory.MAINTENANCE, title = "Oil",
                recordDate = today, amount = BigDecimal.valueOf(70000), mileageAtRecord = 1500
            )
        )

        `when`(memberService.getMemberByEmail(email)).thenReturn(member)
        // Note: getAllLedgersForAnalytics uses findByCriteria with pageable. 
        // For simplicity in this mock, we'll need to handle the repository call.
        // But since LedgerService code I wrote calls getAllLedgersForAnalytics which calls findByCriteria:
        `when`(ledgerRepository.findByCriteria(anyLong(), anyLong(), any(), any(), any(), any())).thenReturn(
            org.springframework.data.domain.PageImpl(ledgers)
        )

        // When
        val result = ledgerService.getDashboardAnalytics(1L, email)

        // Then
        assertEquals(150000L, result["totalExpenseThisMonth"], "Total expense this month (Fuel2 80k + Oil 70k)")
        assertEquals(1600, result["avgFuelPriceCurrentMonth"], "Avg fuel price (80000/50 = 1600 or directly unitPrice)")
        assertEquals(10.0, result["recentAvgMileage"], "Mileage efficiency calculation: (1500-1000)/50 = 10.0")
        
        val monthlyTrend = result["monthlyTrend"] as List<Map<String, Any>>
        val currentMonthTrend = monthlyTrend.find { it["month"] == "${now.monthValue}월" }
        val details = currentMonthTrend!!["details"] as List<Map<String, Any>>
        assertEquals(150000L, details.find { it["carModel"] == "GT86" }!!["amount"])
    }
}
