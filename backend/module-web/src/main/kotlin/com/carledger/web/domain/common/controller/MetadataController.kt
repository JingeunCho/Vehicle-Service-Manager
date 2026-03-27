package com.carledger.web.domain.common.controller

import com.carledger.core.ledger.domain.LedgerCategory
import com.carledger.core.vehicle.domain.FuelType
import com.carledger.core.vehicle.domain.MaintenanceType
import com.carledger.web.domain.common.dto.EnumMetadataResponse
import com.carledger.web.domain.common.dto.LedgerMetadataResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/metadata")
class MetadataController {

    @GetMapping("/ledgers")
    fun getLedgerMetadata(): ResponseEntity<LedgerMetadataResponse> {
        val categories = LedgerCategory.entries.map { 
            EnumMetadataResponse(it.name, it.categoryName) 
        }
        val maintenanceTypes = MaintenanceType.entries.map {
            EnumMetadataResponse(it.name, it.categoryName) 
        }
        val fuelTypes = FuelType.entries.map {
            EnumMetadataResponse(it.name, it.description)
        }
        
        return ResponseEntity.ok(
            LedgerMetadataResponse(
                categories = categories,
                maintenanceTypes = maintenanceTypes,
                fuelTypes = fuelTypes
            )
        )
    }
}
