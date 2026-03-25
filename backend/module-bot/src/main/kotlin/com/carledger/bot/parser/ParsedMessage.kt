package com.carledger.bot.parser

import com.carledger.core.ledger.domain.LedgerCategory
import java.time.LocalDate

data class ParsedMessage(
    val commandType: String,
    val date: LocalDate,
    val category: LedgerCategory,
    val title: String,
    val amount: Long,
    val memo: String,
    val mileage: Int?
)
