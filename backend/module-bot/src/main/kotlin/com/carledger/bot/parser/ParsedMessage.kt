package com.carledger.bot.parser

import java.time.LocalDate

data class ParsedMessage(
    val commandType: String,
    val date: LocalDate,
    val category: String,
    val amount: Long,
    val memo: String,
    val mileage: Int?
)
