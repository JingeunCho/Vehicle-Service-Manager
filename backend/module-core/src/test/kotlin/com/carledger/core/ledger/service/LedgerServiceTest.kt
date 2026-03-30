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

import com.carledger.core.vehicle.domain.FuelType
import org.junit.jupiter.api.Assertions.assertTrue

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
    fun `test getDashboardEfficiencyTrend with ICE and EV separation`() {
        // Given
        val email = "test@example.com"
        val member = Member(id = 1L, email = email, nickname = "Test")
        val iceVehicle = Vehicle(id = 1L, member = member, name = "ICE", carModel = "GT86", licensePlate = "12가1234", fuelType = FuelType.REGULAR_GASOLINE)
        val evVehicle = Vehicle(id = 2L, member = member, name = "EV", carModel = "Ioniq 5", licensePlate = "34나5678", fuelType = FuelType.EV)
        
        val now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"))
        val today = now.toInstant()
        val yesterday = now.minusDays(1).toInstant()
        val bitEarlier = now.minusDays(2).toInstant()

        val ledgers = listOf(
            // ICE Interval 1: 100km / 10L = 10.0
            Ledger(id = 1L, vehicle = iceVehicle, category = LedgerCategory.REFUEL, recordDate = yesterday, mileageAtRecord = 100, volume = BigDecimal.valueOf(10.0)),
            Ledger(id = 2L, vehicle = iceVehicle, category = LedgerCategory.REFUEL, recordDate = bitEarlier, mileageAtRecord = 0, volume = BigDecimal.valueOf(10.0)),
            
            // EV Interval 1: 50km / 10kWh = 5.0
            Ledger(id = 3L, vehicle = evVehicle, category = LedgerCategory.REFUEL, recordDate = today, mileageAtRecord = 50, volume = BigDecimal.valueOf(10.0)),
            Ledger(id = 4L, vehicle = evVehicle, category = LedgerCategory.REFUEL, recordDate = yesterday, mileageAtRecord = 0, volume = BigDecimal.valueOf(10.0))
        )

        `when`(memberService.getMemberByEmail(email)).thenReturn(member)
        `when`(ledgerRepository.findByCriteria(any(), any(), any(), any(), any(), any())).thenReturn(
            org.springframework.data.domain.PageImpl(ledgers)
        )

        // When
        val result = ledgerService.getDashboardEfficiencyTrend(null, email)

        // Then
        val mileageTrend = result["mileageTrend"] as List<Map<String, Any>>
        val evMileageTrend = result["evMileageTrend"] as List<Map<String, Any>>
        
        assertEquals(1, mileageTrend.size, "ICE should have one entry for the month")
        assertEquals(10.0, mileageTrend[0]["efficiency"], "ICE efficiency should be 100/10 = 10.0")
        
        assertEquals(1, evMileageTrend.size, "EV should have one entry for the month")
        assertEquals(5.0, evMileageTrend[0]["efficiency"], "EV efficiency should be 50/10 = 5.0")
    }
}
