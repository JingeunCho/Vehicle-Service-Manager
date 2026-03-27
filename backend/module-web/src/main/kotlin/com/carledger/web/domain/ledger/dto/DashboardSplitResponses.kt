package com.carledger.web.domain.ledger.dto

data class DashboardSummaryResponse(
    val totalExpenseThisMonth: Long,
    val avgFuelPriceCurrentMonth: Int,
    val avgElectricityPriceCurrentMonth: Int,
    val recentAvgMileage: Double,
    val recentAvgEvEfficiency: Double
)

data class DashboardSpendingResponse(
    val monthlyTrend: List<MonthlyTrendDto>,
    val categoryDonut: List<CategoryExpenseDto>
)

data class DashboardHistoryResponse(
    val recentMaintenance: List<LedgerResponse>,
    val recentRefuel: List<LedgerResponse>
)

data class DashboardEfficiencyResponse(
    val mileageTrend: List<MonthlyMileageDto>,
    val evMileageTrend: List<MonthlyMileageDto>
)
