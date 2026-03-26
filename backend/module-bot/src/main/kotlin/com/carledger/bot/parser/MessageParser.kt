package com.carledger.bot.parser

import com.carledger.core.ledger.domain.LedgerCategory
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
class MessageParser {
    
    // User requested Regex for Telegram/Discord commands
    private val regex = Regex("^/(기록|지출)\\s+(?<date>\\d{4}-\\d{2}-\\d{2}|오늘|어제)?\\s*(?<category>고급유|일반유|경유|엔진오일|미션오일|브레이크|하체|세차|외장파츠|보험료|자동차세|기타)\\s+(?<amount>[0-9,]+)원?\\s+(?<memo>.*?)(?:\\s+(?<mileage>\\d+)km)?$")

    fun parse(message: String): ParsedMessage {
        val matchResult = regex.find(message) ?: throw IllegalArgumentException("일치하지 않습니다.")

        val commandType = matchResult.groups[1]?.value ?: ""
        val dateGroup = matchResult.groups["date"]?.value
        val categoryGroup = matchResult.groups["category"]?.value ?: ""
        val amountGroup = matchResult.groups["amount"]?.value ?: ""
        val memoGroup = matchResult.groups["memo"]?.value ?: ""
        val mileageGroup = matchResult.groups["mileage"]?.value

        val parsedDate = parseDate(dateGroup)
        val amount = amountGroup.replace(",", "").toLongOrNull() ?: 0L
        val mileage = mileageGroup?.toIntOrNull()

        val (category, title) = mapCategory(categoryGroup)

        return ParsedMessage(
            commandType = commandType,
            date = parsedDate,
            category = category,
            title = title,
            amount = amount,
            memo = memoGroup.trim(),
            mileage = mileage
        )
    }

    private fun mapCategory(categoryText: String): Pair<LedgerCategory, String> {
        return when (categoryText) {
            "고급유", "일반유", "경유" -> LedgerCategory.REFUEL to categoryText
            "엔진오일", "미션오일", "브레이크", "하체" -> LedgerCategory.MAINTENANCE to categoryText
            "세차" -> LedgerCategory.CAR_SUPPLIES to categoryText
            "보험료", "자동차세" -> LedgerCategory.FIXED_COST to categoryText
            else -> LedgerCategory.ETC to categoryText
        }
    }

    private fun parseDate(dateStr: String?): LocalDate {
        val today = LocalDate.now()
        return when (dateStr) {
            null, "오늘" -> today
            "어제" -> today.minusDays(1)
            else -> try {
                LocalDate.parse(dateStr)
            } catch (e: Exception) {
                today
            }
        }
    }
}
