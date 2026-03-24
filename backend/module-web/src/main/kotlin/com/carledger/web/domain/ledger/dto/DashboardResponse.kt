package com.carledger.web.domain.ledger.dto

data class DashboardResponse(
    val totalExpenseThisMonth: Long,
    val avgFuelPriceCurrentMonth: Int,
    val recentAvgMileage: Double,
    val monthlyTrend: List<MonthlyTrendDto>,
    val categoryDonut: List<CategoryExpenseDto>,
    val mileageTrend: List<MonthlyMileageDto>
)

data class MonthlyTrendDto(
    val month: String,
    val details: List<CarExpenseDetailDto>
)

data class CarExpenseDetailDto(
    val carModel: String,
    val amount: Long
)

data class CategoryExpenseDto(
    val name: String,
    val value: Long
)

data class MonthlyMileageDto(
    val name: String,
    val efficiency: Double
)
