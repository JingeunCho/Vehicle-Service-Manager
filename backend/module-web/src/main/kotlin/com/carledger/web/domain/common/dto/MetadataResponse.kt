package com.carledger.web.domain.common.dto

data class EnumMetadataResponse(
    val code: String,
    val categoryName: String
)

data class LedgerMetadataResponse(
    val categories: List<EnumMetadataResponse>,
    val maintenanceTypes: List<EnumMetadataResponse>,
    val fuelTypes: List<EnumMetadataResponse>
)
